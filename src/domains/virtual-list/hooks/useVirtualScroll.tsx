import { useState, useMemo, useRef, useEffect } from "react";

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
  const [scrollTop, setScrollTop] = useState(0); // 현재 스크롤 위치

  /**
   * 현재 스크롤 위치 / 한 row 높이 => 현재 스크롤 위치에 따른 row의 인덱스 추출
   * - overscan: 현재 스크롤 위치에 따른 row의 인덱스를 기준으로 앞뒤로 몇 개의 row를 보여줄지 결정
   * - Math.max(0, ...): -5번째 아이템은 없으므로 0부터 시작
   */
  const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan);

  /**
   * containerHeight / itemHeight: 화면 높이 안에 아이템이 몇개 들어가는지 계산
   * + 2 * overscan: 위 아래 여유분
   */
  const visibleItemCount =
    Math.ceil(containerHeight / itemHeight) + 2 * overscan;

  /**
   * startIndex + visibleItemCount: 현재 스크롤 위치에 따른 row의 인덱스를 기준으로 앞뒤로 몇 개의 row를 보여줄지 결정
   * - Math.min(count - 1, ...): 마지막 아이템은 없으므로 count - 1
   */
  const endIndex = Math.min(count - 1, startIndex + visibleItemCount);

  /**
   * startIndex ~ endIndex 사이의 아이템을 가상화하여 렌더링
   */
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

  /**
   * 전체 스크롤바의 높이(가짜 높이)
   */
  const totalHeight = count * itemHeight;

  /*
   * Optimized Scroll Handler with requestAnimationFrame (Throttling)
   * 스크롤 이벤트는 매우 빠르게 발생하므로, rAF를 사용하여
   * 화면 주사율(약 60fps)에 맞춰서만 상태 업데이트를 수행
   */
  const rafRef = useRef<number | null>(null);
  const latestScrollTop = useRef(0);

  const onScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const currentScrollTop = e.currentTarget.scrollTop;
    latestScrollTop.current = currentScrollTop;

    if (!rafRef.current) {
      rafRef.current = requestAnimationFrame(() => {
        setScrollTop(latestScrollTop.current);
        rafRef.current = null;
      });
    }
  };

  /** 컴포넌트 언마운트 시 진행 중인 애니메이션 프레임 취소 */
  useEffect(() => {
    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, []);

  return {
    virtualItems,
    totalHeight,
    onScroll,
    scrollTop,
  };
}
