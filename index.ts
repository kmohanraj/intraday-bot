import { chromium } from "playwright";
import { fetchPrice } from "./src/priceFetcher";
import { saveCandle, candles } from "./src/candleManager";
import { evaluateTrade } from "./src/tradeManager";
import { INTERVAL_MS } from "./src/config";
import { logError } from "./src/logger";

let prices: number[] = [];
let currentMinute: number | null = null;

(async () => {
  let browser;
  try {
    browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();
    await page.goto("https://www.bseindia.com/sensex/code/16/", { waitUntil: "domcontentloaded" });

    setInterval(async () => {
      try {
        const now = new Date();
        const minute = now.getMinutes();
        const timestamp = now.toISOString();
        const price = await fetchPrice(page);

        if (isNaN(price)) return;

        if (currentMinute === null) currentMinute = minute;
        prices.push(price);

        if (minute !== currentMinute) {
          const open = prices[0];
          const high = Math.max(...prices);
          const low = Math.min(...prices);
          const close = prices[prices.length - 1];

          saveCandle(timestamp, open, high, low, close);
          evaluateTrade(candles);

          prices = [price];
          currentMinute = minute;
        }
      } catch (error) {
        logError("Error in main loop", error);
      }
    }, INTERVAL_MS);
  } catch (error) {
    logError("Failed to launch browser or navigate", error);
    if (browser) await browser.close();
  }
})();
