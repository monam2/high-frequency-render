import { WebSocketServer } from "ws";
import { MarketData } from "../src/types/market";

const PORT = 8080;
const wss = new WebSocketServer({ port: PORT });

console.log(`Mock Server running on ws://localhost:${PORT}`);

// 미 주식 상위 100개 종목
const SECTOR_MAP: Record<string, string> = {
  AAPL: "Technology",
  MSFT: "Technology",
  GOOGL: "Technology",
  AMZN: "Consumer Cyclical",
  NVDA: "Technology",
  META: "Technology",
  TSLA: "Consumer Cyclical",
  "BRK.B": "Financial",
  LLY: "Healthcare",
  V: "Financial",
  TSM: "Technology",
  UNH: "Healthcare",
  JPM: "Financial",
  XOM: "Energy",
  WMT: "Consumer Defensive",
  JNJ: "Healthcare",
  MA: "Financial",
  PG: "Consumer Defensive",
  HD: "Consumer Cyclical",
  COST: "Consumer Defensive",
  AVGO: "Technology",
  ORCL: "Technology",
  MRK: "Healthcare",
  ABBV: "Healthcare",
  CVX: "Energy",
  CRM: "Technology",
  BAC: "Financial",
  PEP: "Consumer Defensive",
  KO: "Consumer Defensive",
  NFLX: "Communication",
  AMD: "Technology",
  ACN: "Technology",
  LIN: "Basic Materials",
  TMO: "Healthcare",
  MCD: "Consumer Cyclical",
  ADBE: "Technology",
  CSCO: "Technology",
  ABT: "Healthcare",
  DHR: "Healthcare",
  TM: "Consumer Cyclical",
  NKE: "Consumer Cyclical",
  DIS: "Communication",
  WFC: "Financial",
  TXN: "Technology",
  PM: "Consumer Defensive",
  INTC: "Technology",
  VZ: "Communication",
  MS: "Financial",
  UPS: "Industrials",
  CMCSA: "Communication",
  CAT: "Industrials",
  NEE: "Utilities",
  QCOM: "Technology",
  UNP: "Industrials",
  IBM: "Technology",
  AMGN: "Healthcare",
  BA: "Industrials",
  HON: "Industrials",
  COP: "Energy",
  GE: "Industrials",
  RTX: "Industrials",
  LOW: "Consumer Cyclical",
  SPGI: "Financial",
  AXP: "Financial",
  PFE: "Healthcare",
  INTU: "Technology",
  GS: "Financial",
  DE: "Industrials",
  ELV: "Healthcare",
  SYK: "Healthcare",
  LMT: "Industrials",
  BLK: "Financial",
  MDT: "Healthcare",
  ISRG: "Healthcare",
  BKNG: "Consumer Cyclical",
  GILD: "Healthcare",
  T: "Communication",
  ADI: "Technology",
  BMY: "Healthcare",
  TJX: "Consumer Cyclical",
  MDLZ: "Consumer Defensive",
  PLD: "Real Estate",
  MMC: "Financial",
  VRTX: "Healthcare",
  REGN: "Healthcare",
  LRCX: "Technology",
  AMT: "Real Estate",
  CI: "Healthcare",
  BSX: "Healthcare",
  SCHW: "Financial",
  ZTS: "Healthcare",
  ETN: "Industrials",
  SLB: "Energy",
  EOG: "Energy",
  C: "Financial",
  MO: "Consumer Defensive",
  SO: "Utilities",
  BDX: "Healthcare",
  FI: "Financial",
};

const SYMBOLS = Object.keys(SECTOR_MAP);

const getCategory = (symbol: string) => SECTOR_MAP[symbol] || "Others";

/** 초기 1만개 데이터 전송 -> 이후 update된 데이터만 전송 */
const generateInitialData = (count: number): MarketData[] => {
  return Array.from({ length: count }, (_, i) => {
    const symbol = SYMBOLS[i % SYMBOLS.length];

    return {
      id: `asset-${i}`,
      symbol: symbol,
      price: 100 + Math.random() * 1000,
      volume: Math.floor(Math.random() * 10000),
      change: 0,
      timestamp: Date.now(),
      category: getCategory(symbol),
    };
  });
};

const marketData = generateInitialData(10_000);

wss.on("connection", (ws) => {
  console.log("wss client connected");

  ws.send(JSON.stringify({ type: "SNAPSHOT", data: marketData }));

  // 50-100 updates/s (10ms interval)
  function updateMarketData() {
    const updateCount = 50 + Math.floor(Math.random() * 50);
    const updates: MarketData[] = [];

    for (let i = 0; i < updateCount; i++) {
      // 변경할 데이터 선택
      const index = Math.floor(Math.random() * marketData.length);
      const item = marketData[index];

      // 가격 변동
      const priceChange = (Math.random() - 0.5) * 2;

      item.price = Math.max(0.01, item.price + priceChange);
      item.volume += Math.floor(Math.random() * 100);
      item.change = priceChange;
      item.timestamp = Date.now();

      updates.push({ ...item }); // 데이터 참조로 인한 변경 방지
    }

    if (ws.readyState === ws.OPEN) {
      ws.send(JSON.stringify({ type: "UPDATE", data: updates }));
    }
  }

  // 1초에 100번 전송(업데이트) -> FE 부하
  const interval = setInterval(updateMarketData, 10);

  ws.on("close", () => {
    console.log("wss client disconnected");
    clearInterval(interval);
  });
});
