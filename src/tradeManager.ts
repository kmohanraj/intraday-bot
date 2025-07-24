import { CAPITAL, RISK_PER_TRADE } from "./config";
import { calculateIndicators } from "./indicators";
import { logInfo, logError } from "./logger";

let trade: any = null;

export function evaluateTrade(candles: any[]) {
  if (candles.length < 50) return;

  try {
    const { ema20, ema50, vwap, rsi } = calculateIndicators(candles);
    const last = candles[candles.length - 1];
    const lastEma20 = ema20.at(-1);
    const lastVwap = vwap.at(-1);
    const lastRsi = rsi.at(-1);

    const isNoTrade = !trade;
    const isAboveVwap = lastVwap !== undefined && last.close > lastVwap;
    const isAboveEma20 = lastEma20 !== undefined && last.close > lastEma20;
    const isRsiAbove50 = lastRsi !== undefined && lastRsi > 50;

    if (isNoTrade && isAboveVwap && isAboveEma20 && isRsiAbove50) {
      const risk = CAPITAL * RISK_PER_TRADE;
      const stopLoss = last.close * 0.995;
      const target = last.close * 1.01;
      const qty = Math.floor(risk / (last.close - stopLoss));
      trade = { entry: last.close, stopLoss, target, qty };
      logInfo(`ENTRY: ₹${last.close.toFixed(2)} | Qty: ${qty} | SL: ₹${stopLoss.toFixed(2)} | Target: ₹${target.toFixed(2)} | RSI: ${(lastRsi ?? 0).toFixed(1)}`);
    }

    if (trade) {
      if (last.low <= trade.stopLoss) {
        logInfo(`STOP LOSS HIT: Sold at ₹${trade.stopLoss.toFixed(2)} | PnL: ₹${(trade.qty * (trade.stopLoss - trade.entry)).toFixed(2)}`);
        trade = null;
      } else if (last.high >= trade.target) {
        logInfo(`TARGET HIT: Sold at ₹${trade.target.toFixed(2)} | PnL: ₹${(trade.qty * (trade.target - trade.entry)).toFixed(2)}`);
        trade = null;
      }
    }
  } catch (error) {
    logError("Error in trade evaluation", error);
  }
}
