/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import { MarketData } from "../types/market";
import React from "react";

interface VirtualRowProps {
  data: MarketData;
  offsetTop: number;
  height: number;
  isVirtual: boolean;
}

const VirtualRow = React.memo(
  ({ data, offsetTop, height, isVirtual }: VirtualRowProps) => {
    const priceColor =
      data.change > 0 ? priceUp : data.change < 0 ? priceDown : undefined;

    return (
      <div
        css={rowStyle}
        style={{
          height: `${height}px`,
          top: isVirtual ? `${offsetTop}px` : undefined,
          transform: isVirtual ? undefined : `translateY(${offsetTop}px)`, // Either absolute top or transform is fine. absolute top is easier for strict layout.
        }}
      >
        <div css={cellStyle}>{data.symbol}</div>
        <div css={css([cellStyle, priceColor])}>{data.price.toFixed(2)}</div>
        <div css={cellStyle}>{data.volume.toLocaleString()}</div>
        <div css={cellStyle}>{data.category}</div>
        <div css={cellStyle}>
          {new Date(data.timestamp).toLocaleTimeString()}
        </div>
      </div>
    );
  },
  (prev, next) => {
    return (
      prev.data === next.data &&
      prev.offsetTop === next.offsetTop &&
      prev.height === next.height
    );
  },
);

VirtualRow.displayName = "VirtualRow";

export default VirtualRow;

const rowStyle = css`
  position: absolute;
  left: 0;
  width: 100%;
  border-bottom: 1px solid #eee;
  display: flex;
  align-items: center;
  padding: 0 16px;
  box-sizing: border-box;
  transition: background-color 0.2s;

  &:hover {
    background-color: #f5f5f5;
  }
`;

const cellStyle = css`
  flex: 1;
  font-family: monospace;
  font-size: 14px;
`;

const priceUp = css`
  color: #ef4444; /* tailwind red-500 equivalent */
`;

const priceDown = css`
  color: #3b82f6; /* tailwind blue-500 equivalent */
`;
