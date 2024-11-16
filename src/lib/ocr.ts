import { createWorker } from "tesseract.js";
import sharp from "sharp";
import assert from "assert";
import fs from "fs";

export async function performOCR(imagePath: string) {
  // update the image to be 2x whatever the original size is
  const metadata = await sharp(imagePath).metadata();
  assert(metadata.width && metadata.height, "Image must have width and height");

  const outputImagePath = imagePath.replace(".png", "-2x.png");
  // save the image at 2x size
  await sharp(imagePath)
    .resize(metadata.width * 2, metadata.height * 2)
    .toFile(outputImagePath);

  // Create worker
  const worker = await createWorker("eng");

  try {
    // Perform OCR
    const {
      data: { text },
    } = await worker.recognize(outputImagePath);

    console.log("Extracted Text:", text);

    // Clean up
    await worker.terminate();

    await fs.promises.unlink(outputImagePath);

    return text;
  } catch (error) {
    console.error("Error:", error);
    await worker.terminate();
    throw error;
  }
}
