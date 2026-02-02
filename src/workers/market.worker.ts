/// <reference lib="webworker" />

import { MarketData } from "../types/market";

self.onmessage = (e: MessageEvent) => {
  const { type } = e.data;

  if (type === "CONNECT") {
    connectWebSocket();
  }
};

let ws: WebSocket | null = null;
let marketData: MarketData[] = [];

function connectWebSocket() {
  ws = new WebSocket("ws://localhost:8080");

  /** ws open */
  ws.onopen = () => {
    postMessage({ type: "STATUS", payload: "CONNECTED" });
  };

  /** ws close */
  ws.onclose = () => {
    postMessage({ type: "STATUS", payload: "DISCONNECTED" });
  };

  /** ws message event */
  ws.onmessage = (event) => {
    // 1. 무거운 파싱 작업 (JSON.parse는 여기서 수행되므로 메인 스레드에 영향 없음)
    const message = JSON.parse(event.data);

    if (message.type === "SNAPSHOT") {
      marketData = message.data;
    } else if (message.type === "UPDATE") {
      const updates = message.data as MarketData[];
      const updateMap = new Map(updates.map((u) => [u.id, u]));

      // 2. 무거운 병합 작업 (Heavy Merging)
      // 10,000개의 아이템을 순회하며 업데이트 반영 (O(N))
      // 메인 스레드에서 수행하면 렌더링 블로킹의 주원인이 됨
      for (let i = 0; i < marketData.length; i++) {
        const item = marketData[i];
        if (updateMap.has(item.id)) {
          marketData[i] = updateMap.get(item.id)!;
        }
      }
    }

    // 3. 무거운 정렬 작업 (Heavy Sorting)
    // 변동률(change) 내림차순 정렬 ("Top Movers")
    // 10,000개의 아이템을 초당 100번 정렬하는 것은 매우 무거운 작업
    // 메인 스레드에서 수행 시 UI 프리징이 발생하지만, 워커에서는 문제없음
    const sortedData = [...marketData].sort(
      (a, b) => Math.abs(b.change) - Math.abs(a.change),
    );

    // 4. 결과 전송 (Main Thread로 데이터 전달)
    // Structured Clone 알고리즘을 통해 객체가 복사되어 전달
    // (SharedArrayBuffer를 쓰면 복사 비용도 줄일 수 있지만, 여기서는 Worker의 분리 효과만으로도 충분함)
    postMessage({ type: "DATA", payload: sortedData });
  };
}
