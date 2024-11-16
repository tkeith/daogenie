import { Page } from "playwright";

export async function getAllFramesText(page: Page) {
  // Get text from main page
  const mainText = (await page.textContent("body")) || "";

  // Get all frames
  const frames = page.frames();

  // Get text from each frame
  const framesText = await Promise.all(
    frames.map((frame) => frame.textContent("body").catch(() => "")),
  );

  return [mainText, ...framesText].filter(Boolean);
}
