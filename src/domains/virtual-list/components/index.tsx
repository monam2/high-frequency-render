"use client";
/** @jsxImportSource @emotion/react */

import { css } from "@emotion/react";
import { useState } from "react";
import { useWsMarketData } from "@/hooks/useWsMarketData";
import { useFpsCounter } from "@/hooks/useFpsCounter";
import { useVirtualScroll } from "@/domains/virtual-list/hooks/useVirtualScroll";
import VirtualRow from "@/components/VirtualRow";

const ROW_HEIGHT = 40;
const CONTAINER_HEIGHT = 600;

export function VirtualList() {
  const [isVirtual, setIsVirtual] = useState(true);

  const { data, isConnected } = useWsMarketData();
  const { fps } = useFpsCounter();

  const { virtualItems, totalHeight, onScroll } = useVirtualScroll({
    count: data.length,
    itemHeight: ROW_HEIGHT,
    containerHeight: CONTAINER_HEIGHT,
    overscan: 10,
  });

  const itemsToRender = isVirtual
    ? virtualItems.map((v) => ({ ...v, data: data[v.index] }))
    : data.map((d, i) => ({ index: i, offsetTop: i * ROW_HEIGHT, data: d }));

  return (
    <div
      css={css`
        width: 100%;
        padding: 20px;
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
          Phase 1: List Virtualization
        </h1>
        <button
          css={buttonStyle}
          onClick={() => setIsVirtual(!isVirtual)}
          data-active={isVirtual}
        >
          Virtualization: {isVirtual ? "ON" : "OFF"}
        </button>
        <span css={statsStyle}>
          Status: {isConnected ? "CONNECTED" : "DISCONNECTED"}
        </span>
        <span css={statsStyle}>
          Total Items: {data.length.toLocaleString()}
        </span>
        <span css={statsStyle}>FPS: {fps}</span>
        <span css={statsStyle}>
          DOM Nodes: {itemsToRender.length.toLocaleString()}
        </span>
      </header>

      <div
        css={css`
          height: 600px;
          overflow-y: auto;
          border: 1px solid #ccc;
          position: relative;
          background: white;
        `}
        onScroll={onScroll}
      >
        <div
          css={css`
            width: 100%;
            position: relative;
          `}
          style={{ height: `${totalHeight}px` }}
        >
          {itemsToRender.map((item) => (
            <VirtualRow
              key={item.data.id}
              data={item.data}
              height={ROW_HEIGHT}
              offsetTop={item.offsetTop}
              isVirtual={isVirtual}
            />
          ))}
        </div>
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

const buttonStyle = css`
  padding: 8px 16px;
  background-color: #3b82f6;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;

  &:hover {
    background-color: #2563eb;
  }

  &[data-active="true"] {
    background-color: #10b981;
  }

  &[data-loading="true"] {
    background-color: #9ca3af;
    cursor: wait;
  }
`;
