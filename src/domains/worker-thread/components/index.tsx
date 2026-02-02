"use client";

/** @jsxImportSource @emotion/react */

import { css } from "@emotion/react";
import VirtualRow from "@/components/VirtualRow";
import { useVirtualScroll } from "@/hooks/useVirtualScroll";
import { useWorkerMarketData } from "../hooks/useWorkerMarketData";
import CanvasChart from "@/components/CanvasChart";
import { useRef, useEffect } from "react";
import { MarketData } from "@/types/market";
import { useFpsCounter } from "@/hooks/useFpsCounter";

const ROW_HEIGHT = 40;
const CONTAINER_HEIGHT = 600;

export function WorkerThread() {
  const { data, workerStatus } = useWorkerMarketData();
  const { fps } = useFpsCounter();

  // CanvasChart는 ref를 통해 데이터를 읽으므로, state 데이터를 ref로 동기화
  const dataRef = useRef<MarketData[]>([]);
  useEffect(() => {
    dataRef.current = data;
  }, [data]);

  // 가상화(Virtualization)
  // Worker가 데이터를 처리하더라도, 10,000개의 DOM 요소를 메인 스레드에 렌더링하는 비용은 그대로이기 때문
  const { virtualItems, totalHeight, onScroll } = useVirtualScroll({
    count: data.length,
    itemHeight: ROW_HEIGHT,
    containerHeight: CONTAINER_HEIGHT,
    overscan: 10,
  });

  return (
    <div
      css={css`
        padding: 20px;
        font-family:
          -apple-system, BlinkMacMacSystemFont, "Segoe UI", Roboto, Helvetica,
          Arial, sans-serif;
      `}
    >
      <header
        css={css`
          margin-bottom: 20px;
          display: flex;
          gap: 20px;
          align-items: center;
        `}
      >
        <h1 style={{ margin: 0, fontSize: "20px" }}>
          Phase 3: Web Worker + Virtualization
        </h1>
        <span css={statsStyle}>Worker 상태: {workerStatus}</span>
        <span css={statsStyle}>
          FPS:{" "}
          <span style={{ color: "#10b981", fontWeight: "bold" }}>{fps}</span>
        </span>
        <span css={statsStyle}>
          아이템 수: {data.length.toLocaleString()} (변동폭 순 정렬됨)
        </span>
      </header>

      <div style={{ marginBottom: "20px", color: "#666" }}>
        <p>
          이 페이지는 <b>WebSocket 파싱</b>, <b>데이터 병합</b>, 그리고{" "}
          <b>정렬 (1만 건)</b> 작업을 Web Worker로 위임했습니다.
        </p>
        <p>
          메인 스레드는 오직 가상 리스트 및 Canvas 렌더링만 담당하므로,
          <b>무거운 데이터 연산 중에도 60FPS를 안정적으로 유지</b>합니다.
        </p>
      </div>

      <div style={{ marginBottom: "20px" }}>
        <CanvasChart dataRef={dataRef} width={800} height={300} />
      </div>

      <div css={scrollContainerStyle} onScroll={onScroll}>
        <div css={innerContainerStyle} style={{ height: `${totalHeight}px` }}>
          {virtualItems.map((v) => (
            <VirtualRow
              key={data[v.index].id}
              data={data[v.index]}
              height={ROW_HEIGHT}
              offsetTop={v.offsetTop}
              isVirtual={true}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

const scrollContainerStyle = css`
  height: 600px;
  overflow-y: auto;
  border: 1px solid #ccc;
  position: relative;
  background: white;
`;

const innerContainerStyle = css`
  width: 100%;
  position: relative;
`;

const statsStyle = css`
  font-family: monospace;
  background: #f3f4f6;
  padding: 4px 8px;
  border-radius: 4px;
`;
