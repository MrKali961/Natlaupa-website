/**
 * Paginated collection fetching for the public discovery surfaces
 * (`/sitemap.xml` and `/llms.txt`).
 *
 * Why this exists
 * ---------------
 * The API paginates with a DEFAULT limit of 10 and returns inactive records first.
 * Both the sitemap and llms.txt previously issued a single unpaginated request and
 * read page 1, so they advertised exactly 10 hotels — all of them `isActive: false` —
 * while none of the 58 bookable hotels appeared anywhere. Verified 2026-07-27:
 * `/hotels` returns `{ items, total: 77, page: 1, limit: 10, totalPages: 8, hasMore }`
 * and page 1 is 100% inactive.
 *
 * Both callers share this module so the two surfaces cannot drift apart again.
 */

/**
 * Page size. MUST NOT exceed 100.
 *
 * The `/public` collection endpoints (`/blogs/public`, `/offers/public`,
 * `/hotel-destinations/public`, `/hotel-styles/public`) validate this field and
 * reject anything over 100 with `VALIDATION_ERROR: Number must be less than or
 * equal to 100`. A rejected request yields an empty collection *silently*, which
 * is the same class of failure this module exists to prevent — so keep it at 100.
 * (`/hotels` itself accepts larger values, but there is no reason to diverge.)
 */
const PAGE_SIZE = 100;

/** Hard stop so a malformed `hasMore` can never spin forever. */
const MAX_PAGES = 50;

/** Envelope keys the API has been observed to use for its array payload. */
const ITEM_KEYS = [
  'items',
  'hotels',
  'blogs',
  'offers',
  'destinations',
  'styles',
  'countries',
] as const;

function extractItems(data: Record<string, unknown>): unknown[] | null {
  for (const key of ITEM_KEYS) {
    const value = data[key];
    if (Array.isArray(value)) return value;
  }
  return null;
}

/**
 * Fetch every page of a collection.
 *
 * Handles both plain-array responses and the
 * `{ items, total, page, limit, totalPages, hasMore }` envelope. On error it returns
 * whatever was collected so far rather than throwing, so one failing collection
 * cannot empty an entire sitemap.
 */
export async function fetchAll<T>(apiUrl: string, endpoint: string): Promise<T[]> {
  const collected: T[] = [];

  try {
    for (let page = 1; page <= MAX_PAGES; page++) {
      const separator = endpoint.includes('?') ? '&' : '?';
      const response = await fetch(
        `${apiUrl}${endpoint}${separator}page=${page}&limit=${PAGE_SIZE}`,
        { cache: 'no-store' }
      );
      if (!response.ok) {
        // Loud on purpose. A silently-empty collection is how the original bug hid.
        console.error(
          `[fetchAll] ${endpoint} page ${page} returned HTTP ${response.status}; ` +
            `collected ${collected.length} so far`
        );
        break;
      }

      const json = await response.json();

      if (json?.success === false) {
        console.error(
          `[fetchAll] ${endpoint} page ${page} returned success:false — ` +
            `${JSON.stringify(json.error ?? json).slice(0, 300)}`
        );
        break;
      }

      const data = json.data;

      // Unpaginated endpoint — everything arrived at once.
      if (Array.isArray(data)) {
        collected.push(...(data as T[]));
        break;
      }
      if (!data || typeof data !== 'object') break;

      const items = extractItems(data as Record<string, unknown>);
      if (!items) break;
      collected.push(...(items as T[]));

      // Paging signals live at the top of the envelope for most collections, but
      // /offers/public nests them under `pagination`. Check both, then fall back
      // to a full-page heuristic.
      const envelope = data as {
        hasMore?: boolean;
        totalPages?: number;
        pagination?: { hasMore?: boolean; totalPages?: number };
      };
      const paging = {
        hasMore: envelope.hasMore ?? envelope.pagination?.hasMore,
        totalPages: envelope.totalPages ?? envelope.pagination?.totalPages,
      };
      const hasMore =
        typeof paging.hasMore === 'boolean'
          ? paging.hasMore
          : typeof paging.totalPages === 'number'
            ? page < paging.totalPages
            : items.length === PAGE_SIZE;

      if (!hasMore) break;
    }
  } catch (error) {
    console.error(`Error fetching ${endpoint}:`, error);
  }

  return collected;
}

export interface PubliclyListable {
  isActive?: boolean;
  deletedAt?: string | null;
}

/**
 * Should this record be advertised on a public discovery surface?
 *
 * Uses `!== false` rather than `=== true` deliberately: if the API ever stops
 * returning `isActive`, we degrade to listing everything instead of silently
 * emptying the collection — which is the failure mode this module exists to fix.
 */
export function isPubliclyListable(record: PubliclyListable): boolean {
  return record.isActive !== false && !record.deletedAt;
}
