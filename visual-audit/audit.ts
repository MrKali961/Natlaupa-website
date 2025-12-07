import { chromium, Browser, Page } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

const BASE_URL = 'http://localhost:3000';

interface AuditResult {
  page: string;
  url: string;
  timestamp: string;
  viewport: { width: number; height: number };
  screenshots: string[];
  issues: string[];
  notes: string[];
}

interface PageConfig {
  name: string;
  path: string;
  folder: string;
  sections?: string[];
}

const VIEWPORTS = {
  desktop: { width: 1920, height: 1080 },
  laptop: { width: 1366, height: 768 },
  tablet: { width: 768, height: 1024 },
  mobile: { width: 375, height: 812 },
};

const PAGES_TO_AUDIT: PageConfig[] = [
  { name: 'Home', path: '/', folder: 'home', sections: ['hero', 'trending', 'experience', 'value-props', 'footer'] },
  { name: 'About', path: '/about', folder: 'about', sections: ['hero', 'content', 'map', 'footer'] },
  { name: 'Contact', path: '/contact', folder: 'contact', sections: ['form', 'info', 'footer'] },
  { name: 'Become Angel', path: '/become-angel', folder: 'become-angel', sections: ['hero', 'benefits', 'form', 'footer'] },
  { name: 'For Hotels', path: '/for-hotels', folder: 'for-hotels', sections: ['hero', 'benefits', 'form', 'footer'] },
  { name: 'Countries List', path: '/countries', folder: 'countries', sections: ['header', 'list', 'footer'] },
  { name: 'Country Detail - Japan', path: '/countries/japan', folder: 'countries', sections: ['header', 'hotels', 'footer'] },
  { name: 'Offers List', path: '/offers', folder: 'offers', sections: ['header', 'list', 'footer'] },
  { name: 'Offer Detail - Azure Pearl', path: '/offer/h1', folder: 'offers', sections: ['hero', 'gallery', 'details', 'reviews', 'footer'] },
  { name: 'Styles List', path: '/styles', folder: 'styles', sections: ['header', 'list', 'footer'] },
  { name: 'Style Detail - Eco-Lodges', path: '/styles/eco-lodges', folder: 'styles', sections: ['header', 'hotels', 'footer'] },
];

async function waitForPageLoad(page: Page): Promise<void> {
  await page.waitForLoadState('networkidle');
  // Wait for animations to settle
  await page.waitForTimeout(2000);
}

async function scrollToBottom(page: Page): Promise<void> {
  await page.evaluate(async () => {
    await new Promise<void>((resolve) => {
      let totalHeight = 0;
      const distance = 300;
      const timer = setInterval(() => {
        const scrollHeight = document.body.scrollHeight;
        window.scrollBy(0, distance);
        totalHeight += distance;
        if (totalHeight >= scrollHeight) {
          clearInterval(timer);
          resolve();
        }
      }, 100);
    });
  });
  await page.waitForTimeout(500);
}

async function captureFullPage(
  page: Page,
  pageName: string,
  folder: string,
  viewport: string
): Promise<string> {
  const filename = `${pageName.toLowerCase().replace(/\s+/g, '-')}_${viewport}_full.png`;
  const filepath = path.join(__dirname, 'screenshots', folder, filename);

  await page.screenshot({ path: filepath, fullPage: true });
  return filename;
}

async function captureViewport(
  page: Page,
  pageName: string,
  folder: string,
  viewport: string,
  scrollPosition: string
): Promise<string> {
  const filename = `${pageName.toLowerCase().replace(/\s+/g, '-')}_${viewport}_${scrollPosition}.png`;
  const filepath = path.join(__dirname, 'screenshots', folder, filename);

  await page.screenshot({ path: filepath, fullPage: false });
  return filename;
}

async function captureScrollPositions(
  page: Page,
  pageName: string,
  folder: string,
  viewport: string
): Promise<string[]> {
  const screenshots: string[] = [];

  // Capture top
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(500);
  screenshots.push(await captureViewport(page, pageName, folder, viewport, 'top'));

  // Get page height
  const pageHeight = await page.evaluate(() => document.body.scrollHeight);
  const viewportHeight = await page.evaluate(() => window.innerHeight);

  // Capture middle sections
  const positions = ['25', '50', '75'];
  for (const pos of positions) {
    const scrollY = (pageHeight - viewportHeight) * (parseInt(pos) / 100);
    await page.evaluate((y) => window.scrollTo(0, y), scrollY);
    await page.waitForTimeout(500);
    screenshots.push(await captureViewport(page, pageName, folder, viewport, `scroll-${pos}`));
  }

  // Capture bottom
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await page.waitForTimeout(500);
  screenshots.push(await captureViewport(page, pageName, folder, viewport, 'bottom'));

  return screenshots;
}

async function analyzePageLayout(page: Page): Promise<{ issues: string[]; notes: string[] }> {
  const issues: string[] = [];
  const notes: string[] = [];

  // Check for horizontal overflow
  const hasHorizontalScroll = await page.evaluate(() => {
    return document.body.scrollWidth > window.innerWidth;
  });
  if (hasHorizontalScroll) {
    issues.push('CRITICAL: Horizontal scroll detected - content overflowing viewport');
  }

  // Check if main content is centered
  const bodyStyles = await page.evaluate(() => {
    const body = document.body;
    const computedStyle = window.getComputedStyle(body);
    return {
      marginLeft: computedStyle.marginLeft,
      marginRight: computedStyle.marginRight,
      textAlign: computedStyle.textAlign,
    };
  });
  notes.push(`Body margins: L=${bodyStyles.marginLeft}, R=${bodyStyles.marginRight}`);

  // Check for elements that might be off-center
  const offCenterElements = await page.evaluate(() => {
    const elements = document.querySelectorAll('section, main, .container, [class*="container"]');
    const results: string[] = [];

    elements.forEach((el) => {
      const rect = el.getBoundingClientRect();
      const windowWidth = window.innerWidth;
      const leftMargin = rect.left;
      const rightMargin = windowWidth - rect.right;
      const marginDiff = Math.abs(leftMargin - rightMargin);

      if (marginDiff > 50 && leftMargin >= 0 && rightMargin >= 0) {
        results.push(`Element <${el.tagName.toLowerCase()}> class="${el.className}" may be off-center (L:${Math.round(leftMargin)}px, R:${Math.round(rightMargin)}px)`);
      }
    });

    return results;
  });

  if (offCenterElements.length > 0) {
    issues.push(...offCenterElements.map(e => `WARNING: ${e}`));
  }

  // Check for broken images
  const brokenImages = await page.evaluate(() => {
    const images = document.querySelectorAll('img');
    const broken: string[] = [];
    images.forEach((img) => {
      if (!img.complete || img.naturalWidth === 0) {
        broken.push(`Broken image: ${img.src || img.getAttribute('src') || 'unknown'}`);
      }
    });
    return broken;
  });

  if (brokenImages.length > 0) {
    issues.push(...brokenImages.map(b => `ERROR: ${b}`));
  }

  // Check text contrast (basic check)
  const lowContrastElements = await page.evaluate(() => {
    const elements = document.querySelectorAll('p, h1, h2, h3, h4, h5, h6, span, a');
    const issues: string[] = [];

    elements.forEach((el) => {
      const style = window.getComputedStyle(el);
      const color = style.color;
      const bgColor = style.backgroundColor;

      // Very basic check - flag if text is very light
      if (color.includes('rgb(255, 255, 255)') || color.includes('rgba(255, 255, 255')) {
        // White text - check if it has a dark background
        const textContent = el.textContent?.trim().slice(0, 30);
        if (textContent && bgColor === 'rgba(0, 0, 0, 0)') {
          issues.push(`Potential contrast issue: "${textContent}..." has white text on transparent bg`);
        }
      }
    });

    return issues.slice(0, 5); // Limit to first 5
  });

  if (lowContrastElements.length > 0) {
    notes.push(...lowContrastElements.map(c => `REVIEW: ${c}`));
  }

  // Check footer position
  const footerCheck = await page.evaluate(() => {
    const footer = document.querySelector('footer');
    if (footer) {
      const rect = footer.getBoundingClientRect();
      const windowWidth = window.innerWidth;
      const leftMargin = rect.left;
      const rightMargin = windowWidth - rect.right;
      return {
        exists: true,
        fullWidth: rect.width >= windowWidth - 20,
        centered: Math.abs(leftMargin - rightMargin) < 20,
      };
    }
    return { exists: false, fullWidth: false, centered: false };
  });

  if (!footerCheck.exists) {
    issues.push('WARNING: No footer element found');
  } else {
    notes.push(`Footer: fullWidth=${footerCheck.fullWidth}, centered=${footerCheck.centered}`);
  }

  return { issues, notes };
}

async function auditPage(browser: Browser, pageConfig: PageConfig): Promise<AuditResult[]> {
  const results: AuditResult[] = [];

  for (const [viewportName, viewportSize] of Object.entries(VIEWPORTS)) {
    const context = await browser.newContext({
      viewport: viewportSize,
    });
    const page = await context.newPage();

    console.log(`  Auditing ${pageConfig.name} at ${viewportName} (${viewportSize.width}x${viewportSize.height})`);

    try {
      await page.goto(`${BASE_URL}${pageConfig.path}`, { waitUntil: 'networkidle', timeout: 30000 });
      await waitForPageLoad(page);

      // First scroll through the entire page to trigger lazy loading
      await scrollToBottom(page);
      await page.evaluate(() => window.scrollTo(0, 0));
      await page.waitForTimeout(1000);

      const screenshots: string[] = [];

      // Capture full page
      screenshots.push(await captureFullPage(page, pageConfig.name, pageConfig.folder, viewportName));

      // Capture at different scroll positions
      const scrollScreenshots = await captureScrollPositions(page, pageConfig.name, pageConfig.folder, viewportName);
      screenshots.push(...scrollScreenshots);

      // Analyze layout
      const { issues, notes } = await analyzePageLayout(page);

      results.push({
        page: pageConfig.name,
        url: `${BASE_URL}${pageConfig.path}`,
        timestamp: new Date().toISOString(),
        viewport: viewportSize,
        screenshots,
        issues,
        notes,
      });

    } catch (error) {
      results.push({
        page: pageConfig.name,
        url: `${BASE_URL}${pageConfig.path}`,
        timestamp: new Date().toISOString(),
        viewport: viewportSize,
        screenshots: [],
        issues: [`CRITICAL: Failed to load page - ${error}`],
        notes: [],
      });
    }

    await context.close();
  }

  return results;
}

function generateReport(results: AuditResult[], pageConfig: PageConfig): string {
  let report = `# Visual Audit Report: ${pageConfig.name}\n\n`;
  report += `**URL:** ${pageConfig.path}\n`;
  report += `**Generated:** ${new Date().toISOString()}\n\n`;
  report += `---\n\n`;

  for (const result of results) {
    report += `## Viewport: ${result.viewport.width}x${result.viewport.height}\n\n`;

    if (result.issues.length > 0) {
      report += `### Issues Found\n\n`;
      for (const issue of result.issues) {
        if (issue.startsWith('CRITICAL')) {
          report += `- :red_circle: ${issue}\n`;
        } else if (issue.startsWith('ERROR')) {
          report += `- :orange_circle: ${issue}\n`;
        } else {
          report += `- :yellow_circle: ${issue}\n`;
        }
      }
      report += `\n`;
    } else {
      report += `### Issues Found\n\n`;
      report += `:white_check_mark: No major issues detected\n\n`;
    }

    if (result.notes.length > 0) {
      report += `### Notes\n\n`;
      for (const note of result.notes) {
        report += `- ${note}\n`;
      }
      report += `\n`;
    }

    report += `### Screenshots\n\n`;
    for (const screenshot of result.screenshots) {
      report += `- \`${screenshot}\`\n`;
    }
    report += `\n---\n\n`;
  }

  return report;
}

function generateSummaryReport(allResults: Map<string, AuditResult[]>): string {
  let report = `# Visual Audit Summary Report\n\n`;
  report += `**Generated:** ${new Date().toISOString()}\n\n`;
  report += `---\n\n`;

  report += `## Overview\n\n`;
  report += `| Page | Desktop | Laptop | Tablet | Mobile |\n`;
  report += `|------|---------|--------|--------|--------|\n`;

  for (const [pageName, results] of allResults) {
    const row = [pageName];

    for (const viewport of ['desktop', 'laptop', 'tablet', 'mobile']) {
      const result = results.find(r =>
        (viewport === 'desktop' && r.viewport.width === 1920) ||
        (viewport === 'laptop' && r.viewport.width === 1366) ||
        (viewport === 'tablet' && r.viewport.width === 768) ||
        (viewport === 'mobile' && r.viewport.width === 375)
      );

      if (result) {
        const criticalCount = result.issues.filter(i => i.startsWith('CRITICAL')).length;
        const errorCount = result.issues.filter(i => i.startsWith('ERROR')).length;
        const warningCount = result.issues.filter(i => i.startsWith('WARNING')).length;

        if (criticalCount > 0) {
          row.push(`:red_circle: ${criticalCount}C/${errorCount}E/${warningCount}W`);
        } else if (errorCount > 0) {
          row.push(`:orange_circle: ${errorCount}E/${warningCount}W`);
        } else if (warningCount > 0) {
          row.push(`:yellow_circle: ${warningCount}W`);
        } else {
          row.push(`:white_check_mark: OK`);
        }
      } else {
        row.push(`:grey_question: N/A`);
      }
    }

    report += `| ${row.join(' | ')} |\n`;
  }

  report += `\n## Legend\n\n`;
  report += `- :red_circle: Critical issues (layout broken, horizontal scroll)\n`;
  report += `- :orange_circle: Errors (broken images, missing elements)\n`;
  report += `- :yellow_circle: Warnings (potential centering issues)\n`;
  report += `- :white_check_mark: No issues detected\n`;
  report += `- C = Critical, E = Error, W = Warning\n\n`;

  report += `## Detailed Reports\n\n`;
  for (const [pageName] of allResults) {
    const filename = pageName.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    report += `- [${pageName}](./reports/${filename}.md)\n`;
  }

  return report;
}

async function main() {
  console.log('Starting Visual Audit...\n');
  console.log('Make sure the dev server is running at http://localhost:3000\n');

  const browser = await chromium.launch({ headless: true });
  const allResults = new Map<string, AuditResult[]>();

  try {
    for (const pageConfig of PAGES_TO_AUDIT) {
      console.log(`\nAuditing: ${pageConfig.name}`);
      const results = await auditPage(browser, pageConfig);
      allResults.set(pageConfig.name, results);

      // Generate individual report
      const report = generateReport(results, pageConfig);
      const reportFilename = pageConfig.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') + '.md';
      fs.writeFileSync(
        path.join(__dirname, 'reports', reportFilename),
        report
      );
      console.log(`  Report saved: reports/${reportFilename}`);
    }

    // Generate summary report
    const summaryReport = generateSummaryReport(allResults);
    fs.writeFileSync(
      path.join(__dirname, 'AUDIT-SUMMARY.md'),
      summaryReport
    );
    console.log('\nSummary report saved: AUDIT-SUMMARY.md');

  } finally {
    await browser.close();
  }

  console.log('\nVisual Audit Complete!');
}

main().catch(console.error);
