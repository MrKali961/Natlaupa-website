import { PrismaClient } from '@prisma/client';
import { slugify } from '../src/lib/slugify';

const prisma = new PrismaClient();

async function backfillSlugs() {
  console.log('🔄 Backfilling slugs for hotels...\n');

  // Get all hotels without slugs
  const hotels = await prisma.hotel.findMany({
    where: {
      OR: [
        { slug: null },
        { slug: '' }
      ]
    }
  });

  console.log(`Found ${hotels.length} hotels without slugs\n`);

  for (const hotel of hotels) {
    let slug = slugify(hotel.name);
    let counter = 2;

    // Ensure uniqueness
    while (await prisma.hotel.findUnique({ where: { slug } })) {
      slug = `${slugify(hotel.name)}-${counter}`;
      counter++;
    }

    await prisma.hotel.update({
      where: { id: hotel.id },
      data: { slug }
    });

    console.log(`  ✅ ${hotel.name} → ${slug}`);
  }

  console.log('\n🔄 Backfilling slugs for offers...\n');

  // Get all offers without slugs
  const offers = await prisma.offer.findMany({
    where: {
      OR: [
        { slug: null },
        { slug: '' }
      ]
    }
  });

  console.log(`Found ${offers.length} offers without slugs\n`);

  for (const offer of offers) {
    let slug = slugify(offer.title);
    let counter = 2;

    // Ensure uniqueness
    while (await prisma.offer.findUnique({ where: { slug } })) {
      slug = `${slugify(offer.title)}-${counter}`;
      counter++;
    }

    await prisma.offer.update({
      where: { id: offer.id },
      data: { slug }
    });

    console.log(`  ✅ ${offer.title} → ${slug}`);
  }

  console.log('\n✅ Slug backfill complete!');
}

backfillSlugs()
  .catch((error) => {
    console.error('❌ Error backfilling slugs:', error);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
