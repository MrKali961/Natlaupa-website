'use client';

import { useEffect, useState } from 'react';

/**
 * Returns `value`, updated `delayMs` after the last change stops. The shared
 * debounce primitive for server-driven search boxes (/offers, /blog, hotel search).
 */
export function useDebouncedValue<T>(value: T, delayMs: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delayMs);
    return () => clearTimeout(timer);
  }, [value, delayMs]);

  return debouncedValue;
}
