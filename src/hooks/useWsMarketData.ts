import { useEffect, useState } from "react";
import { MarketData } from "@/types/market";

type WsMessageType = "SNAPSHOT" | "UPDATE";

interface WsMessage {
  type: WsMessageType;
  data: MarketData[];
}

export function useWsMarketData(url: string = "ws://localhost:8080") {
  const [data, setData] = useState<MarketData[]>([]);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const ws = new WebSocket(url);

    ws.onopen = () => setIsConnected(true);
    ws.onclose = () => setIsConnected(false);

    ws.onmessage = (event) => {
      const message = JSON.parse(event.data) as WsMessage;

      if (message.type === "SNAPSHOT") {
        // 초기 데이터 로드
        setData(message.data);
      } else if (message.type === "UPDATE") {
        // 업데이트된 데이터
        const updates = message.data;

        // 1. O(N*M) ex. 70개 업데이트를 위해 10,000개(data)를 매번 순회
        // updates.forEach((update) => {
        //   const index = data.findIndex((item) => item.id === update.id);
        //   if (index !== -1) {
        //     setData((prev) => {
        //       const newData = [...prev];
        //       newData[index] = update;
        //       return newData;
        //     });
        //   }
        // });

        // 2. O(N) ex. HashTable. 70개를 먼저 Map변환. map.get()으로 10,000개(data)를 순회하며 확인
        setData((prev) => {
          const updateMap = new Map(updates.map((u: MarketData) => [u.id, u]));
          return prev.map((item) => updateMap.get(item.id) || item);
        });
      }
    };

    return () => {
      ws.close();
    };
  }, [url]);

  return { data, isConnected };
}
