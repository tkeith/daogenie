import { WEB_TASK_TIME_LIMIT_MS } from "@/lib/run-execution";
import { promiseWithResolvers } from "@/lib/utils";
import { Page, chromium } from "playwright";

export async function getAutoKillingBrowserPage() {
  const { promise, resolve } = promiseWithResolvers<{
    page: Page;
    closeBrowser: () => void;
  }>();

  (async () => {
    const browser = await chromium.launch({
      headless: process.env.IN_CODAPT_CONTAINER === "true",
    });

    const closeBrowser = () => {
      browser.close().catch(() => {
        console.error("Failed to close browser");
      });
      clearTimeout(taskTimeout);
    };

    const taskTimeout = setTimeout(closeBrowser, WEB_TASK_TIME_LIMIT_MS);

    try {
      const context = await browser.newContext({
        // viewport: { width: 1000, height: 1000 },
        // userAgent:
        //   "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36",
        viewport: { width: 500, height: 844 },
        userAgent:
          "Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Mobile/15E148 Safari/604.1",
        isMobile: true,
        hasTouch: true,
        deviceScaleFactor: 1,
      });

      const page = await context.newPage();

      resolve({ page, closeBrowser });
    } catch (e) {
      console.error("Error launching browser (1)", e);
      closeBrowser();
    }
  })().catch((e) => {
    console.error("Error launching browser (2)", e);
  });

  return promise;
}
