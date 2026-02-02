import { useEffect, useRef, useState } from "react";
import { MarketData } from "@/types/market";

/*  
웹소켓으로 1초에 수십개씩 들어오는 데이터를 리액트 렌더링 파이프라인에 맡기지 않고 ref에 저장

1. 렌더링 병목 제거
- useState 사용 시: 데이터가 1초에 100번 들어오면 리렌더링 유발(V-DOM 비교, 함수 재실행 반복)
- useRef 사용 시: 데이터가 1초에 100번 들어와도 리렌더링 유발 X

2. 데이터 수신 횟수와 리렌더링 횟수를 분리
- 데이터가 들어오면 메모리에 쌓아둠
- 다음 Animation Frame에서 화면 갱신(60fps, 약16ms)
- 초고빈도 데이터가 들어와도 프레임 유지
*/

export type RenderMode = "ref" | "state";

export function useWsCanvasData({
  url,
  mode = "ref",
}: {
  url: string;
  mode?: RenderMode;
}) {
  const dataRef = useRef<MarketData[]>([]);
  const [isConnected, setIsConnected] = useState(false);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [dataState, setDataState] = useState<MarketData[]>([]);

  useEffect(() => {
    const ws = new WebSocket(url);

    dataRef.current = [];

    ws.onopen = () => setIsConnected(true);
    ws.onclose = () => setIsConnected(false);

    ws.onmessage = (event) => {
      /*
      1. WebSocket 메시지 파싱 (Main Thread 부하)
      JSON.parse는 동기적으로 실행되므로 데이터 양이 많으면 메인 스레드를 블락
      이를 피하려면 WebWorker로 파싱 로직 격리하는 작업이 필요 -> worker-thread 필요성
      */
      const message = JSON.parse(event.data);

      if (message.type === "SNAPSHOT") {
        dataRef.current = message.data;

        if (mode === "state") {
          // State Mode: 전체 데이터를 State에 저장 (배열 복사 + 리렌더링)
          setDataState([...message.data]);
        }
      } else if (message.type === "UPDATE") {
        const updates = message.data as MarketData[];

        /*
        2. 부분 데이터 업데이트 (Delta Update)
        useState 사용 시 매 업데이트마다 리렌더링 유발
        따라서 ref에 저장된 원본 배열을 직접 수정하여 렌더링 비용 최소화
        */

        const currentData = dataRef.current;

        /*
        3. 업데이트 속도 최적화 (O(N) -> O(1))
        배열을 매번 find()로 탐색하면 느려지므로, Map을 생성하여 ID로 즉시 접근
        기존 데이터 배열을 순회하며 업데이트 대상이 있는지 확인 후 해당 인덱스의 객체를 교체
        배열 자체를 새로 만들지 않으므로 메모리 할당(GC) 최소화
        */
        const updateMap = new Map(updates.map((u) => [u.id, u]));

        // 기존 데이터 배열을 순회하며 업데이트 대상이 있는지 확인
        for (let i = 0; i < currentData.length; i++) {
          if (updateMap.has(currentData[i].id)) {
            currentData[i] = updateMap.get(currentData[i].id)!;
          }
        }

        // State Mode: 데이터 업데이트를 React State로 관리
        // 1. 불변성을 지키기 위해 전체 배열 복사 (O(N) 비용 발생)
        // 2. setState 호출로 리렌더링 유발
        // 3. 잦은 GC 유발
        if (mode === "state") {
          setDataState([...currentData]);
        }
      }
    };

    return () => ws.close();
  }, [mode]);

  return {
    dataRef,
    isConnected,
  };
}
