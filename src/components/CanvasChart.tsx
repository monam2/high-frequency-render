/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import { useRef, useEffect } from "react";
import { MarketData } from "../types/market";

interface CanvasChartProps {
  dataRef: React.MutableRefObject<MarketData[]>;
  width?: number;
  height?: number;
}

const canvasStyle = css`
  border: 1px solid #ccc;
  background-color: #111;
  border-radius: 4px;
`;

export default function CanvasChart({
  dataRef,
  width = 800,
  height = 600,
}: CanvasChartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameId = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { alpha: false }); // Optimize: alpha false if generic opaque background
    if (!ctx) return;

    // High DPI scaling
    const dpr = window.devicePixelRatio || 1;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;

    const render = () => {
      // 1. Clear Data
      ctx.fillStyle = "#111111";
      ctx.fillRect(0, 0, width, height);

      // 2. Draw Visualization (Heatmap Style Grid)
      // Visualizing 10,000 items as small rects
      // Grid: 100 x 100
      const data = dataRef.current;
      const cols = 100;
      const cellWidth = width / cols;
      const cellHeight = 6; // Fixed height per cell

      // Drawing 10k rects per frame is a good stress test for Canvas
      for (let i = 0; i < data.length; i++) {
        const item = data[i];
        const x = (i % cols) * cellWidth;
        const y = Math.floor(i / cols) * cellHeight;

        // Color based on price change
        // Red for drop, Green for rise
        const intensity = Math.min(1, Math.abs(item.change) * 2);
        // Simple color mapping
        if (item.change > 0) {
          ctx.fillStyle = `rgba(16, 185, 129, ${0.4 + intensity * 0.6})`; // Green
        } else if (item.change < 0) {
          ctx.fillStyle = `rgba(239, 68, 68, ${0.4 + intensity * 0.6})`; // Red
        } else {
          ctx.fillStyle = "#333"; // Grey
        }

        ctx.fillRect(x, y, cellWidth - 1, cellHeight - 1);
      }

      // 3. Draw FPS or Info Overlay
      ctx.fillStyle = "#fff";
      ctx.font = "12px monospace";
      ctx.fillText(`Total: ${data.length} items`, 10, 20);

      animationFrameId.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId.current);
    };
  }, [width, height, dataRef]); // Dependencies

  return <canvas ref={canvasRef} css={canvasStyle} />;
}
