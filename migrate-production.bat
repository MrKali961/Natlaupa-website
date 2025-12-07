@echo off
echo.
echo ========================================
echo Production Database Migration Script
echo ========================================
echo.

echo Step 1: Applying schema changes...
echo Adding Offer, Activity, OfferReview tables to production database
echo.
call npx prisma db push
if %errorlevel% neq 0 (
    echo.
    echo [ERROR] Schema migration failed!
    exit /b 1
)
echo [SUCCESS] Schema migration completed!
echo.

echo Step 2: Generating Prisma Client...
call npx prisma generate
if %errorlevel% neq 0 (
    echo.
    echo [ERROR] Prisma client generation failed!
    exit /b 1
)
echo [SUCCESS] Prisma client generated!
echo.

echo Step 3: Seeding offer data...
echo Creating 276 offers with 974 activities...
echo.
call npx tsx prisma/seed-offers.ts
if %errorlevel% neq 0 (
    echo.
    echo [ERROR] Offer data seeding failed!
    exit /b 1
)
echo [SUCCESS] Offer data seeded!
echo.

echo ========================================
echo Migration Completed Successfully!
echo ========================================
echo.
echo Summary:
echo   - Database schema updated
echo   - 276 offers created
echo   - 974 activities added
echo.
echo Next step: Your Vercel deployment should now work correctly!
echo.
pause
