import { logError } from "./logger";

export async function fetchPrice(page: any): Promise<number> {
  try {
    const price = await page.evaluate(() => {
      const el = document.querySelector(".viewsensexvalue");
      if (!el) throw new Error("Price element not found");
      return parseFloat((el as HTMLElement)?.innerText.replace(/,/g, ""));
    });
    return price;
  } catch (error) {
    logError("Error fetching price", error);
    return NaN;
  }
}
