/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";

/**
 * 단순한 CPU 부하를 발생시키는 컴포넌트
 * 복잡한 UI 트리가 리렌더링될 때의 비용을 시뮬레이션합니다.
 */
export default function HeavyComponent() {
  const wasteCpu = () => {
    // 약 5ms~10ms 정도의 지연을 유발 (500,000번 루프 * 복잡한 연산)
    // 60fps 유지하려면 프레임당 여유시간이 16ms인데,
    // 렌더링 할 때마다 5~10ms를 까먹으면 FPS가 확실히 떨어짐
    let result = 0;
    for (let i = 0; i < 500_000; i++) {
      result += Math.sqrt(i) * Math.sin(i);
    }
    return result;
  };

  const dummyValue = wasteCpu();

  return (
    <div
      css={css`
        margin-top: 20px;
        padding: 10px;
        background: #fef2f2;
        border: 1px solid #fca5a5;
        border-radius: 4px;
        color: #b91c1c;
        font-size: 12px;
        display: flex;
        align-items: center;
        gap: 10px;
      `}
    >
      <span>🔥 Heavy Component Rendered (Cpu Wasted)</span>
      <span style={{ opacity: 0 }}>{dummyValue}</span>
    </div>
  );
}
