import { chromium } from 'playwright';

async function testScrollIndicatorCentering() {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 }
  });
  const page = await context.newPage();

  try {
    // Navigate to the home page
    console.log('Navigating to http://localhost:3000...');
    await page.goto('http://localhost:3000', { waitUntil: 'domcontentloaded', timeout: 60000 });

    // Wait for the experience selector to load
    await page.waitForSelector('text=DESTINATION', { timeout: 10000 });
    await page.waitForTimeout(2000);

    // Click on DESTINATION to trigger the local time section
    console.log('Clicking on DESTINATION...');
    const destinationButton = page.locator('text=DESTINATION').first();
    await destinationButton.click({ force: true });

    // Wait for the golden hour section to appear by looking for "Local Time" or similar text
    console.log('Waiting for golden hour section to load...');
    try {
      await page.waitForSelector('text=/local time/i, text=/currently/i', { timeout: 20000, state: 'visible' });
      console.log('Golden hour section loaded!');
    } catch (e) {
      console.log('Could not find golden hour section, taking debug screenshot...');
      await page.screenshot({ path: 'debug-no-golden-hour.png' });

      // Try to find any visible text on the page for debugging
      const bodyText = await page.evaluate(() => document.body.innerText);
      console.log('Page text content:', bodyText.substring(0, 500));
    }

    await page.waitForTimeout(2000);

    // Take a screenshot to see what's on the page
    await page.screenshot({ path: 'before-search.png', fullPage: true });
    console.log('Screenshot taken: before-search.png');

    // Try to find the "Scroll to Explore" indicator
    console.log('Looking for "Scroll to Explore" indicator...');
    const scrollIndicator = page.getByText('Scroll to Explore', { exact: false });
    await scrollIndicator.waitFor({ timeout: 10000, state: 'visible' });
    const box = await scrollIndicator.boundingBox();

    if (!box) {
      throw new Error('Could not get bounding box for scroll indicator');
    }

    // Get viewport width
    const viewport = page.viewportSize();
    if (!viewport) {
      throw new Error('Could not get viewport size');
    }

    const viewportCenterX = viewport.width / 2;
    const elementCenterX = box.x + (box.width / 2);
    const offset = elementCenterX - viewportCenterX;

    console.log('\n=== CENTERING ANALYSIS ===');
    console.log(`Viewport width: ${viewport.width}px`);
    console.log(`Viewport center X: ${viewportCenterX}px`);
    console.log(`Element X: ${box.x}px`);
    console.log(`Element width: ${box.width}px`);
    console.log(`Element center X: ${elementCenterX}px`);
    console.log(`Offset from center: ${offset.toFixed(2)}px`);

    if (Math.abs(offset) < 2) {
      console.log('✅ PERFECTLY CENTERED (within 2px tolerance)');
    } else if (Math.abs(offset) < 5) {
      console.log('⚠️  NEARLY CENTERED (within 5px tolerance)');
    } else if (offset > 0) {
      console.log(`❌ SHIFTED RIGHT by ${offset.toFixed(2)}px`);
    } else {
      console.log(`❌ SHIFTED LEFT by ${Math.abs(offset).toFixed(2)}px`);
    }

    // Take a screenshot
    const screenshotPath = 'scroll-indicator-test.png';
    await page.screenshot({ path: screenshotPath, fullPage: false });
    console.log(`\nScreenshot saved to: ${screenshotPath}`);

    // Highlight the element for visual confirmation
    await scrollIndicator.evaluate((el) => {
      el.style.outline = '2px solid red';
      el.style.outlineOffset = '2px';
    });

    // Draw a vertical line at viewport center
    await page.evaluate((centerX) => {
      const line = document.createElement('div');
      line.style.position = 'fixed';
      line.style.left = `${centerX}px`;
      line.style.top = '0';
      line.style.width = '2px';
      line.style.height = '100vh';
      line.style.backgroundColor = 'lime';
      line.style.zIndex = '9999';
      document.body.appendChild(line);
    }, viewportCenterX);

    await page.waitForTimeout(1000);
    await page.screenshot({ path: 'scroll-indicator-test-marked.png', fullPage: false });
    console.log('Screenshot with markers saved to: scroll-indicator-test-marked.png');

    return { offset, isCenter: Math.abs(offset) < 2 };

  } catch (error) {
    console.error('Error during test:', error);
    await page.screenshot({ path: 'error-screenshot.png' });
    throw error;
  } finally {
    await browser.close();
  }
}

testScrollIndicatorCentering()
  .then((result) => {
    console.log('\n=== TEST COMPLETED ===');
    process.exit(result.isCenter ? 0 : 1);
  })
  .catch((error) => {
    console.error('Test failed:', error);
    process.exit(1);
  });
