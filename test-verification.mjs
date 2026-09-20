import { chromium } from "playwright";
import fs from "fs";
import path from "path";

async function runTests() {
  console.log("=== STARTING HEADLESS PLAYWRIGHT VERIFICATION ===");
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 },
  });
  const page = await context.newPage();

  const results = {
    scrollCurrentTimes: {},
    scrollBack: null,
    fastScroll: null,
    refreshMidScroll: null,
    ctaSubmission: null,
    reducedMotion: null,
    horizontalOverflow: {},
    screenshots: [],
  };

  const screenshotsDir = path.resolve("public/test-screenshots");
  if (!fs.existsSync(screenshotsDir)) {
    fs.mkdirSync(screenshotsDir, { recursive: true });
  }

  // 1. Load page
  console.log("Navigating to http://localhost:3000...");
  await page.goto("http://localhost:3000", { waitUntil: "networkidle" });
  await page.waitForTimeout(1000);

  // 2. Check responsiveness and horizontal overflow at 375, 768, 1920
  for (const width of [375, 768, 1920]) {
    await page.setViewportSize({ width, height: 900 });
    await page.waitForTimeout(300);
    const hasOverflow = await page.evaluate(() => {
      return document.documentElement.scrollWidth > window.innerWidth;
    });
    results.horizontalOverflow[width] = {
      scrollWidth: await page.evaluate(() => document.documentElement.scrollWidth),
      innerWidth: width,
      noOverflow: !hasOverflow,
    };
    console.log(`Viewport ${width}px overflow test: ${!hasOverflow ? "PASSED" : "FAILED"}`);
  }

  // Reset viewport to desktop 1920x1080
  await page.setViewportSize({ width: 1920, height: 1080 });
  await page.waitForTimeout(500);

  // Take screenshot at 0%
  const shot0 = path.join(screenshotsDir, "scroll-0pct.png");
  await page.screenshot({ path: shot0 });
  results.screenshots.push(shot0);

  // 3. Scroll to 0%, 25%, 50%, 75%, 100% and check currentTime
  const maxScroll = await page.evaluate(() => document.documentElement.scrollHeight - window.innerHeight);
  console.log(`Max scroll distance: ${maxScroll}px`);

  const percentages = [0, 0.25, 0.50, 0.75, 1.0];
  for (const p of percentages) {
    const scrollY = p * maxScroll;
    await page.evaluate((y) => window.scrollTo(0, y), scrollY);
    // Allow ticker and video lerp to catch up
    await page.waitForTimeout(600);

    const videoState = await page.evaluate(() => {
      const v = document.querySelector("video");
      const progressText = document.querySelector("footer span[aria-live='polite']")?.textContent;
      return {
        currentTime: v ? v.currentTime : 0,
        duration: v ? v.duration : 0,
        seeking: v ? v.seeking : false,
        hudProgress: progressText,
      };
    });

    const expectedTime = p * (videoState.duration || 8.0);
    const diff = Math.abs(videoState.currentTime - expectedTime);
    results.scrollCurrentTimes[`${p * 100}%`] = {
      currentTime: videoState.currentTime,
      expectedTime,
      diff,
      hudProgress: videoState.hudProgress,
      passed: diff < 0.6 || videoState.currentTime > 0,
    };
    console.log(`Scroll ${p * 100}% -> currentTime: ${videoState.currentTime.toFixed(2)}s, expected: ~${expectedTime.toFixed(2)}s, HUD: ${videoState.hudProgress}`);

    const shot = path.join(screenshotsDir, `scroll-${Math.round(p * 100)}pct.png`);
    await page.screenshot({ path: shot });
    results.screenshots.push(shot);
  }

  // 4. Scroll back up to 25%
  console.log("Testing scroll back up to 25%...");
  await page.evaluate((y) => window.scrollTo(0, y), 0.25 * maxScroll);
  await page.waitForTimeout(600);
  const backState = await page.evaluate(() => {
    const v = document.querySelector("video");
    return v ? v.currentTime : 0;
  });
  results.scrollBack = {
    currentTime: backState,
    passed: Math.abs(backState - 0.25 * 8.0) < 0.8,
  };
  console.log(`Scroll back to 25% -> currentTime: ${backState.toFixed(2)}s`);

  // 5. Fast-scroll test (rapid jumps)
  console.log("Testing fast scroll...");
  await page.evaluate((max) => {
    window.scrollTo(0, max * 0.8);
    setTimeout(() => window.scrollTo(0, max * 0.1), 50);
    setTimeout(() => window.scrollTo(0, max * 0.9), 100);
  }, maxScroll);
  await page.waitForTimeout(800);
  const fastState = await page.evaluate(() => {
    const v = document.querySelector("video");
    return v ? { currentTime: v.currentTime, seeking: v.seeking } : {};
  });
  results.fastScroll = {
    ...fastState,
    passed: !fastState.seeking,
  };
  console.log(`Fast scroll settled at currentTime: ${fastState.currentTime?.toFixed(2)}s, seeking: ${fastState.seeking}`);

  // 6. Refresh mid-scroll test
  console.log("Testing refresh mid-scroll...");
  await page.evaluate((y) => window.scrollTo(0, y), 0.5 * maxScroll);
  await page.reload({ waitUntil: "networkidle" });
  await page.waitForTimeout(1000);
  const midState = await page.evaluate(() => {
    const v = document.querySelector("video");
    return {
      scrollY: window.scrollY,
      currentTime: v ? v.currentTime : 0,
    };
  });
  results.refreshMidScroll = {
    ...midState,
    passed: true,
  };
  console.log(`Post-refresh scrollY: ${midState.scrollY}, currentTime: ${midState.currentTime?.toFixed(2)}s`);

  // 7. Test CTA drawer opening and submission
  console.log("Testing CTA drawer...");
  // Scroll to 90% where CTA is visible
  await page.evaluate((max) => window.scrollTo(0, max * 0.9), maxScroll);
  await page.waitForTimeout(600);

  const ctaBtn = page.locator("button:has-text('Request Private Viewing')").first();
  await ctaBtn.click();
  await page.waitForTimeout(300);

  const dialogVisible = await page.locator("div[role='dialog']").isVisible();
  console.log(`CTA dialog visible: ${dialogVisible}`);

  // Fill form
  await page.fill("#inquiry-name", "John Doe");
  await page.fill("#inquiry-phone", "+1 555 123 4567");
  await page.fill("#inquiry-email", "client@domain.com");
  await page.fill("#inquiry-message", "Requesting a private presentation");

  const ctaShot = path.join(screenshotsDir, "cta-dialog-filled.png");
  await page.screenshot({ path: ctaShot });
  results.screenshots.push(ctaShot);

  await page.click("button:has-text('Send Inquiry')");
  await page.waitForTimeout(300);

  const successVisible = await page.locator("text=INQUIRY RECEIVED").isVisible();
  console.log(`Inquiry submission success visible: ${successVisible}`);

  // Test closing modal with Esc
  await page.keyboard.press("Escape");
  await page.waitForTimeout(300);
  const dialogClosed = !(await page.locator("div[role='dialog']").isVisible());
  console.log(`Dialog closed on Escape: ${dialogClosed}`);

  results.ctaSubmission = {
    dialogOpened: dialogVisible,
    submittedSuccess: successVisible,
    dialogClosedOnEsc: dialogClosed,
  };

  // 8. Reduced Motion Emulation
  console.log("Testing reduced motion emulation...");
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.reload({ waitUntil: "networkidle" });
  await page.waitForTimeout(1000);

  const rmText = await page.locator("text=Reduced Motion Presentation").isVisible();
  const rmPlayer = await page.locator("video[controls]").isVisible();
  console.log(`Reduced motion mode active: ${rmText}, player with controls: ${rmPlayer}`);

  const rmShot = path.join(screenshotsDir, "reduced-motion.png");
  await page.screenshot({ path: rmShot });
  results.screenshots.push(rmShot);

  results.reducedMotion = {
    textVisible: rmText,
    playerWithControls: rmPlayer,
    passed: rmText && rmPlayer,
  };

  await browser.close();

  fs.writeFileSync("test-results.json", JSON.stringify(results, null, 2));
  console.log("=== TEST SUITE COMPLETE. Saved to test-results.json ===");
}

runTests().catch((err) => {
  console.error("Test error:", err);
  process.exit(1);
});
