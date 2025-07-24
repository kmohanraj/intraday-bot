import { EMA, VWAP, RSI } from "technicalindicators";

export function calculateIndicators(candles: any[]) {
  const closes = candles.map(c => c.close);
  const highs = candles.map(c => c.high);
  const lows = candles.map(c => c.low);
  const volumes = candles.map(c => c.volume);

  return {
    ema20: EMA.calculate({ period: 20, values: closes }),
    ema50: EMA.calculate({ period: 50, values: closes }),
    vwap: VWAP.calculate({ close: closes, high: highs, low: lows, volume: volumes }),
    rsi: RSI.calculate({ period: 14, values: closes }),
  };
}
