export interface MarketData {
  id: string; // 고유 ID (예: "asset-1")
  symbol: string; // 종목명 (예: "AAPL")
  category: string; // 종목 카테고리
  price: number; // 현재가
  volume: number; // 거래량
  change: number; // 변동폭 (-1.5 ~ +1.5)
  timestamp: number; // 시간(타임스탬프)
}
