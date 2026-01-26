import { useState, useEffect, useMemo, useRef } from "react";

interface UseVirtualScrollOptions {
  count: number;
  itemHeight: number;
  containerHeight: number;
  overscan?: number;
}

export function useVirtualScroll({
  count,
  itemHeight,
  containerHeight,
  overscan = 5,
}: UseVirtualScrollOptions) {
  const [scrollTop, setScrollTop] = useState(0);

  // Calculate visible range
  const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan);

  const visibleItemCount =
    Math.ceil(containerHeight / itemHeight) + 2 * overscan;
  const endIndex = Math.min(count - 1, startIndex + visibleItemCount);

  // Generate virtual items
  const virtualItems = useMemo(() => {
    const items = [];
    for (let i = startIndex; i <= endIndex; i++) {
      items.push({
        index: i,
        offsetTop: i * itemHeight,
      });
    }
    return items;
  }, [startIndex, endIndex, itemHeight]);

  const totalHeight = count * itemHeight;

  // Optimized Scroll Handler
  // We use functional state update to potential batching,
  // but for virtualization, we need immediate feedback usually.
  // Using generic onScroll handler that the user attaches to the container.
  const onScroll = (e: React.UIEvent<HTMLDivElement>) => {
    // In a real high-perf scenario, we might use requestAnimationFrame throttle here
    // But for < 1000 items visible, direct state update is often fine in React 18+ Concurrent mode.
    // However, for strict 60fps with heavy updates, we might throttle.
    // Let's keep it simple first as requested: "manual implementation".
    setScrollTop(e.currentTarget.scrollTop);
  };

  return {
    virtualItems,
    totalHeight,
    onScroll,
    scrollTop, // exposed if needed
  };
}
