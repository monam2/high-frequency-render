"use client";
/** @jsxImportSource @emotion/react */

import { css } from "@emotion/react";
import CanvasChart from "@/components/CanvasChart";
import { useFpsCounter } from "@/hooks/useFpsCounter";
import HeavyComponent from "@/components/HeavyComponent";
import {
  RenderMode,
  useWsCanvasData,
} from "@/domains/canvas/hooks/useWsCanvasData";
import { useModeParams } from "@/domains/canvas/hooks/useModeParams";

export function Canvas() {
  const { mode, toggleMode } = useModeParams();

  const { fps } = useFpsCounter();

  const { dataRef, isConnected } = useWsCanvasData({
    url: "ws://localhost:8080",
    mode,
  });

  return (
    <div
      css={css`
        padding: 20px;
        font-family:
          -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica,
          Arial, sans-serif;
      `}
    >
      <header
        css={css`
          margin-bottom: 20px;
          display: flex;
          gap: 20px;
          align-items: center;
          justify-content: space-between;
        `}
      >
        <div
          css={css`
            display: flex;
            align-items: center;
            gap: 20px;
          `}
        >
          <h1 style={{ margin: 0, fontSize: "20px" }}>
            Phase 2: Canvas Rendering
          </h1>
          <span css={statsStyle}>
            Status: {isConnected ? "🟢 Connected" : "🔴 Disconnected"}
          </span>
          <span css={statsStyle}>
            FPS:{" "}
            <span
              style={{
                color: fps < 30 ? "#ef4444" : "#10b981",
                fontWeight: "bold",
              }}
            >
              {fps}
            </span>
          </span>
          <span css={statsStyle}>
            Current Mode:{" "}
            {mode === "ref" ? "⚡️ Ref (Optimized)" : "🐢 State (Slow)"}
          </span>
        </div>

        <button onClick={toggleMode} css={buttonStyle(mode)}>
          Switch to {mode === "ref" ? "State Mode" : "Ref Mode"}
        </button>
      </header>

      {/* State Mode일 때 리렌더링 부하를 시뮬레이션하기 위한 컴포넌트 */}
      {mode === "state" && <HeavyComponent />}

      <CanvasChart dataRef={dataRef} width={1000} height={600} />

      <div style={{ marginTop: "20px", color: "#666" }}>
        <p>
          이 페이지는 Canvas 2D와 Data Refs를 사용합니다. Main Thread가 여전히
          JSON을 파싱하지만, React는 트리를 리렌더링하지 않습니다.
        </p>
        <p>
          [Performance] 탭을 확인하면 [Rendering] 시간이 거의 0에 가까워진 것을
          볼 수 있습니다. (단, [Scripting] 비용은 여전히 높을 수 있습니다.)
        </p>
        {mode === "state" && (
          <p style={{ color: "#ef4444", fontWeight: "bold" }}>
            ⚠️ 주의: 현재 State 모드입니다. 데이터가 업데이트될 때마다 React가
            강제로 리렌더링을 시도하여 브라우저가 심각하게 느려질 수 있습니다.
          </p>
        )}
      </div>
    </div>
  );
}

const statsStyle = css`
  font-family: monospace;
  background: #f3f4f6;
  padding: 4px 8px;
  border-radius: 4px;
`;

const buttonStyle = (mode: RenderMode) => css`
  padding: 8px 16px;
  background-color: ${mode === "ref" ? "#ef4444" : "#10b981"};
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
  &:hover {
    opacity: 0.9;
  }
`;
