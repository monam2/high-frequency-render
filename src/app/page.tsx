"use client";

/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import Link from "next/link";
import Image from "next/image";

const containerStyle = css`
  min-height: 100vh;
  background-color: #f8f9fa;
  font-family:
    -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue",
    Arial, sans-serif;
  padding: 60px 20px;
`;

const innerWrapperStyle = css`
  max-width: 1200px;
  margin: 0 auto;
`;

const headerStyle = css`
  text-align: center;
  margin-bottom: 60px;
`;

const titleStyle = css`
  font-size: 3rem;
  font-weight: 800;
  color: #111;
  margin-bottom: 16px;
  letter-spacing: -0.02em;
`;

const subtitleStyle = css`
  font-size: 1.25rem;
  background-color: white;
  margin: 0 auto;
  line-height: 1.6;
`;

const gridStyle = css`
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  gap: 24px;
  margin-bottom: 80px;

  @media (min-width: 768px) {
    grid-template-columns: repeat(3, 1fr);
  }
`;

const cardStyle = css`
  background: white;
  border-radius: 16px;
  padding: 32px;
  box-shadow:
    0 4px 6px -1px rgba(0, 0, 0, 0.05),
    0 2px 4px -1px rgba(0, 0, 0, 0.03);
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;
  text-decoration: none;
  border: 1px solid #f0f0f0;
  display: flex;
  flex-direction: column;
  height: 100%;

  &:hover {
    transform: translateY(-4px);
    box-shadow:
      0 20px 25px -5px rgba(0, 0, 0, 0.1),
      0 10px 10px -5px rgba(0, 0, 0, 0.04);
    border-color: #3b82f6;
  }
`;

const cardLabelStyle = css`
  font-size: 0.875rem;
  font-weight: 600;
  color: #3b82f6;
  text-transform: uppercase;
  margin-bottom: 12px;
  letter-spacing: 0.05em;
`;

const cardTitleStyle = css`
  font-size: 1.5rem;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 12px;
`;

const cardDescStyle = css`
  font-size: 1rem;
  color: #6b7280;
  line-height: 1.6;
  flex-grow: 1;
`;

const arrowStyle = css`
  margin-top: 24px;
  font-weight: 600;
  color: #3b82f6;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const sectionStyle = css`
  background: white;
  border-radius: 20px;
  padding: 48px;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
`;

const sectionHeaderStyle = css`
  font-size: 1.75rem;
  font-weight: 700;
  color: #111;
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 2px solid #f3f4f6;
`;

const sectionContentStyle = css`
  color: #4b5563;
  line-height: 1.8;
  font-size: 1.05rem;

  h3 {
    font-size: 1.25rem;
    font-weight: 600;
    color: #1f2937;
    margin-top: 32px;
    margin-bottom: 12px;
  }

  ul {
    padding-left: 20px;
    margin-bottom: 16px;
  }

  li {
    margin-bottom: 8px;
  }

  p {
    margin-bottom: 16px;
  }
`;

export default function Home() {
  return (
    <div css={containerStyle}>
      <div css={innerWrapperStyle}>
        <header css={headerStyle}>
          <h1 css={titleStyle}>⚡️ High Frequency Optimization</h1>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",

              padding: "24px 84px",
              width: "100%",
              borderRadius: "16px",
              overflow: "hidden",
              backgroundColor: "white",
              boxShadow:
                "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
            }}
          >
            <Image
              src="/hero-v2.png"
              alt="Main Thread Lightning Visualization"
              width={200}
              height={200}
              priority
            />
            <p css={subtitleStyle}>
              초고빈도 데이터(100+ updates/sec) 환경에서 60FPS를 유지하기 위한
              <br />
              Next.js 성능 최적화 기법 데모입니다.
            </p>
          </div>
        </header>

        <section css={gridStyle}>
          <Link href="/performance/virtual-list" css={cardStyle}>
            <div css={cardLabelStyle}>Phase 1</div>
            <div css={cardTitleStyle}>List Virtualization</div>
            <div css={cardDescStyle}>
              수만 개의 데이터 중 화면에 보이는 영역만 렌더링하는 기법입니다.
              DOM 노드 수를 획기적으로 줄여 메모리와 레이아웃 비용을 절약합니다.
            </div>
            <div css={arrowStyle}>데모 확인하기 &rarr;</div>
          </Link>

          <Link href="/performance/canvas" css={cardStyle}>
            <div css={cardLabelStyle}>Phase 2</div>
            <div css={cardTitleStyle}>Canvas Rendering</div>
            <div css={cardDescStyle}>
              React의 가상 DOM을 거치지 않고 직접 브라우저의 2D Canvas API를
              사용합니다. 리렌더링 오버헤드 없이 픽셀 단위의 고속 업데이트가
              가능합니다.
            </div>
            <div css={arrowStyle}>데모 확인하기 &rarr;</div>
          </Link>

          <Link href="/performance/worker" css={cardStyle}>
            <div css={cardLabelStyle}>Phase 3</div>
            <div css={cardTitleStyle}>Web Worker Offloading</div>
            <div css={cardDescStyle}>
              데이터 파싱, 정렬, 필터링 등 무거운 연산을 메인 스레드에서
              분리합니다. UI가 멈추지 않고 부드럽게 반응하도록 돕습니다.
            </div>
            <div css={arrowStyle}>데모 확인하기 &rarr;</div>
          </Link>
        </section>

        <section css={sectionStyle}>
          <h2 css={sectionHeaderStyle}>프로젝트 개요 및 목적</h2>
          <div css={sectionContentStyle}>
            <p>
              현대의 금융 트레이딩 플랫폼이나 실시간 모니터링 시스템은{" "}
              <b>초당 수백 건 이상의 데이터 업데이트</b>를 처리해야 합니다.
              일반적인 React 렌더링 방식(Virtual DOM Reconciliation)만으로는
              이러한 데이터 홍수 속에서 <b>안정적인 60FPS</b>를 유지하기
              어렵습니다.
            </p>

            <h3>왜 60FPS가 중요한가요? (원론적 이해)</h3>
            <p>
              <b>1. 모니터와의 약속 (60Hz = 16.6ms):</b>
              <br />
              대부분의 모니터는 1초에 60번 화면을 <b>새로고침</b>합니다. 마치
              영화 필름이 돌아가는 것과 같습니다. 브라우저는 이 속도에 맞춰{" "}
              <b>16.6ms (1000ms ÷ 60)</b>마다 새로운 화면을 완성해서 모니터에
              보내줘야 합니다.
            </p>
            <p>
              <b>2. 메인 스레드(Main Thread)의 딜레마:</b>
              <br />
              문제는 브라우저에 &quot;화가&quot;가 단 한 명뿐이라는 점입니다. 이
              화가(메인 스레드)는 그림도 그려야 하고, 자바스크립트 계산(데이터
              파싱, 로직 처리)도 해야 합니다. 데이터가 너무 많이 쏟아지면 화가는
              계산하느라 바빠서, 약속된 16.6ms 안에 그림을 그리지 못합니다.
            </p>
            <p>
              <b>3. 결과: 화면 멈춤과 입력 지연 (Jank & Lag):</b>
              <br />
              마감 시간을 놓치면 모니터는 어쩔 수 없이{" "}
              <b>이전 그림을 그대로 보여줍니다.</b> 사용자는 이를 &quot;렉
              걸렸다&quot;고 느끼게 됩니다. 더 심각한 건, 화가가 바쁠 때는
              사용자가 버튼을 눌러도 반응하지 못한다는 점입니다. 현대
              어플리케이션에서 이러한 동작은 사용자의 이탈을 초래하고, 사용자
              경험을 저하시킵니다.
            </p>

            <h3>이 프로젝트의 해결책</h3>
            <ul>
              <li>
                <b>Virtualization:</b> 그릴 대상(DOM)을 줄여서 화가의 부담을
                덜어줍니다.
              </li>
              <li>
                <b>Canvas:</b> 복잡한 유화(DOM) 대신, 빠르게 그릴 수 있는
                스케치(Canvas Bitblt)를 사용합니다.
              </li>
              <li>
                <b>Web Worker:</b> 계산만 전담하는 조수(Worker Thread)를 고용해
                화가가 그림에만 집중하게 합니다.
              </li>
            </ul>

            <p>
              Chrome DevTools의 <b>Performance 탭</b>을 통해 각 최적화 기법이
              Scripting 시간과 Rendering 시간을 어떻게 줄여주는지 직접 눈으로
              확인해보세요.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
