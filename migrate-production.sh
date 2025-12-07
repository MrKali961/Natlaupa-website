#!/bin/bash

# Production Database Migration Script
# This script updates the production database schema and seeds offer data

echo "🚀 Starting Production Database Migration..."
echo ""

# Step 1: Apply database schema changes
echo "📝 Step 1: Applying schema changes (adding Offer, Activity, OfferReview tables)..."
npx prisma db push

if [ $? -ne 0 ]; then
    echo "❌ Schema migration failed!"
    exit 1
fi

echo "✅ Schema migration completed successfully!"
echo ""

# Step 2: Generate Prisma Client
echo "📝 Step 2: Generating Prisma Client..."
npx prisma generate

if [ $? -ne 0 ]; then
    echo "❌ Prisma client generation failed!"
    exit 1
fi

echo "✅ Prisma client generated successfully!"
echo ""

# Step 3: Seed offer data
echo "📝 Step 3: Seeding offer data (276 offers with 974 activities)..."
npx tsx prisma/seed-offers.ts

if [ $? -ne 0 ]; then
    echo "❌ Offer data seeding failed!"
    exit 1
fi

echo "✅ Offer data seeded successfully!"
echo ""

echo "🎉 Production database migration completed successfully!"
echo ""
echo "Summary:"
echo "  - Database schema updated with Offer, Activity, OfferReview tables"
echo "  - Prisma client regenerated"
echo "  - 276 offers created with 974 activities"
echo ""
echo "Next: Deploy your application to Vercel"
