import { useState, useEffect, useRef } from "react";
import { MarketData } from "@/types/market";

export function useWorkerMarketData() {
  const [data, setData] = useState<MarketData[]>([]);
  const [workerStatus, setWorkerStatus] = useState("Init");
  const workerRef = useRef<Worker | null>(null);

  useEffect(() => {
    workerRef.current = new Worker(
      new URL("../../../workers/market.worker.ts", import.meta.url),
    );

    workerRef.current.onmessage = (event) => {
      const { type, payload } = event.data;

      if (type === "STATUS") {
        setWorkerStatus(payload);
      } else if (type === "DATA") {
        // 워커에서 이미 정렬된 데이터를 수신 (메인 스레드 연산 없음)
        setData(payload);
      }
    };

    workerRef.current.postMessage({ type: "CONNECT" });

    return () => {
      workerRef.current?.terminate();
    };
  }, []);

  return { data, workerStatus };
}
