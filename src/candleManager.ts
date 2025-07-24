import fs from "fs";
import path from "path";
import { CSV_FILE } from "./config";

const fullPath = path.resolve(CSV_FILE);
export const candles: any[] = [];

if (!fs.existsSync(fullPath)) {
  fs.writeFileSync(fullPath, "timestamp,open,high,low,close,volume\n");
}

export function saveCandle(timestamp: string, open: number, high: number, low: number, close: number, volume = 1) {
  const row = `${timestamp},${open},${high},${low},${close},${volume}\n`;
  fs.appendFileSync(fullPath, row);
  candles.push({ time: timestamp, open, high, low, close, volume });
}
