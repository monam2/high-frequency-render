# High Frequency Optimization

초고빈도 데이터(100+ updates/sec)가 발생하는 환경에서 **안정적인 60FPS**를 유지하기 위한 다양한 프론트엔드 성능 최적화 기법을 시연하는 Next.js 데모 애플리케이션입니다. 금융 트레이딩 플랫폼이나 실시간 모니터링 대시보드와 같이 짧은 시간에 대량의 데이터가 쏟아지는 상황을 가정하고, 이를 어떻게 효율적으로 처리하고 렌더링할 수 있는지 3가지 단계(Phase)로 나누어 설명합니다.

## 주요 기능 및 최적화 기법

프로젝트는 크게 3가지 최적화 단계로 구성되어 있습니다. 각 단계는 이전 단계의 한계를 극복하며 더 나은 렌더링 성능을 달성합니다.

### Phase 1: List Virtualization (리스트 가상화)

수만 개의 데이터를 스크롤 가능한 리스트 형태로 보여줄 때, **화면에 보이는 영역(Viewport)의 항목만 렌더링**하는 기법입니다.

- **주요 페이지:** `src/app/performance/virtual-list/page.tsx`
- **주요 컴포넌트:** `<VirtualList />`, `<VirtualRow />`
- **특징:** DOM 노드 수를 획기적으로 줄여 브라우저의 레이아웃(Layout) 계산 비용과 메모리 사용량을 최소화합니다.

### Phase 2: Canvas Rendering (캔버스 렌더링)

React의 가상 DOM(Virtual DOM)을 거치지 않고, 브라우저의 2D Canvas API를 사용해 데이터를 직접 픽셀로 그리는 기법입니다.

- **주요 페이지:** `src/app/performance/canvas/page.tsx`
- **주요 컴포넌트:** `<Canvas />`, `<CanvasChart />`, `<HeavyComponent />`
- **특징:** React 상태 업데이트에 따른 렌더링 파이프라인(Reconciliation 및 Commit)을 우회합니다. `Data Refs` 패턴과 함께 사용하여 리렌더링 오버헤드 없이 고속으로 차트를 업데이트합니다. (데모 페이지에서 `State Mode(Slow)`와 `Ref Mode(Optimized)`를 전환하여 성능 차이를 비교할 수 있습니다.)

### Phase 3: Web Worker Offloading (웹 워커 오프로딩)

무거운 데이터 처리 연산(WebSocket 메시지 파싱, 병합, 정렬 등)을 **메인 스레드에서 분리하여 백그라운드 스레드(Web Worker)에서 실행**하는 기법입니다.

- **주요 페이지:** `src/app/performance/worker/page.tsx`
- **주요 컴포넌트:** `<WorkerThread />`
- **특징:** 메인 스레드는 오로지 UI 렌더링에만 집중할 수 있게 되어 화면의 버벅임(Jank)을 방지합니다. Phase 1과 Phase 2의 기법(Virtualization + Canvas)이 통합되어 최고 수준의 성능을 보여줍니다.

## 프로젝트 구조

```text
src/
├── app/
│   ├── page.tsx                             # 메인 홈 페이지 (개요 및 목적 설명)
│   └── performance/                         # 각 최적화 단계별 페이지
│       ├── canvas/page.tsx                  # Phase 2 데모 페이지
│       ├── virtual-list/page.tsx            # Phase 1 데모 페이지
│       └── worker/page.tsx                  # Phase 3 데모 페이지
├── components/                              # 공통 UI 컴포넌트
│   ├── CanvasChart.tsx                      # Canvas API를 직접 다루는 차트 컴포넌트
│   ├── HeavyComponent.tsx                   # 강제 리렌더링 부하 시뮬레이터
│   └── VirtualRow.tsx                       # 가상 리스트의 단일 행 컴포넌트
├── domains/                                 # 도메인 로직 및 도메인 종속 컴포넌트 묶음
│   ├── canvas/components/index.tsx          # Canvas 페이지 메인 컴포넌트
│   ├── virtual-list/components/index.tsx    # List Virtualization 페이지 메인 컴포넌트
│   ├── virtual-list/hooks/useVirtualScroll.tsx # 가상 스크롤 로직 처리 훅
│   └── worker-thread/components/index.tsx   # Worker Thread 페이지 메인 컴포넌트
└── hooks/                                   # 전역적으로 사용되는 커스텀 훅 (예: FPS 측정 등)
```

## 시작하기

```bash
npm install
npm run dev
```

브라우저에서 `http://localhost:3000`에 접속

> **팁**: Chrome DevTools의 **Performance 탭**을 열고 기록을 진행하면서, 각 단계별로 `Scripting` 시간과 `Rendering` 시간이 어떻게 개선되는지 직접 눈으로 확인해보는 것을 강력히 추천합니다.
