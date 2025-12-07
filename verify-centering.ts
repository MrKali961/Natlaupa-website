import { chromium } from 'playwright';

async function verifyCentering() {
  console.log('Starting browser...');
  const browser = await chromium.launch({ headless: false, slowMo: 500 });
  const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });

  try {
    console.log('Navigating to localhost:3000...');
    await page.goto('http://localhost:3000', { timeout: 90000 });

    console.log('Waiting for page to load...');
    await page.waitForLoadState('networkidle', { timeout: 90000 });

    console.log('Taking initial screenshot...');
    await page.screenshot({ path: 'step1-initial.png' });

    console.log('Clicking on DESTINATION...');
    await page.click('text=DESTINATION', { timeout: 10000 });

    console.log('Waiting 6 seconds for transition...');
    await page.waitForTimeout(6000);

    console.log('Taking post-transition screenshot...');
    await page.screenshot({ path: 'step2-after-click.png', fullPage: true });

    // Try to find and measure the scroll indicator
    try {
      const indicator = await page.locator('text=Scroll to Explore').first();
      if (await indicator.isVisible()) {
        const box = await indicator.boundingBox();
        const viewport = page.viewportSize();

        if (box && viewport) {
          const viewportCenter = viewport.width / 2;
          const elementCenter = box.x + (box.width / 2);
          const offset = elementCenter - viewportCenter;

          console.log('\n=== CENTERING RESULTS ===');
          console.log(`Viewport center: ${viewportCenter}px`);
          console.log(`Element center: ${elementCenter.toFixed(2)}px`);
          console.log(`Offset: ${offset.toFixed(2)}px`);

          if (Math.abs(offset) < 2) {
            console.log('✅ PERFECTLY CENTERED!');
          } else {
            console.log(`❌ OFF BY ${offset.toFixed(2)}px`);
          }
        }
      }
    } catch (e) {
      console.log('Could not measure indicator:', e);
    }

    console.log('\nKeeping browser open for manual inspection...');
    console.log('Press Ctrl+C to close when done.');

    // Keep browser open for manual inspection
    await new Promise(() => {});

  } catch (error) {
    console.error('Error:', error);
    await page.screenshot({ path: 'error.png' });
  }
}

verifyCentering().catch(console.error);
