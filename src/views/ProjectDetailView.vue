<template>
  <div class="project-detail" v-if="project">
    <router-link to="/projects" class="back-link">← Projects</router-link>

    <div class="detail-header">
      <div class="detail-tags">
        <span class="project-tag" v-for="tag in project.tags" :key="tag">{{
          tag
        }}</span>
      </div>
      <h1 class="detail-title">{{ project.name }}</h1>
      <p class="detail-summary">{{ project.summary }}</p>
      <div class="detail-stack">{{ project.stack.join(" · ") }}</div>
      <div class="detail-links" v-if="project.links && project.links.length">
        <template v-for="link in project.links">
          <router-link
            v-if="link.internal"
            :key="`i-${link.label}`"
            :to="link.href"
            class="detail-link"
            >{{ link.label }}</router-link
          >
          <a
            v-else
            :key="`e-${link.label}`"
            :href="link.href"
            target="_blank"
            class="detail-link detail-link--external"
            >{{ link.label }} ↗</a
          >
        </template>
      </div>
    </div>

    <div class="detail-body">
      <section class="detail-section" v-if="project.problem">
        <h2 class="detail-section-title">문제 상황</h2>
        <p>{{ project.problem }}</p>
      </section>

      <section class="detail-section" v-if="project.solution">
        <h2 class="detail-section-title">해결 방법</h2>
        <p>{{ project.solution }}</p>
      </section>

      <section class="detail-section" v-if="project.diagram">
        <h2 class="detail-section-title">아키텍처</h2>
        <architecture-diagram />
      </section>

      <section
        class="detail-section"
        v-if="project.features && project.features.length"
      >
        <h2 class="detail-section-title">구현 기능</h2>
        <ul class="feature-list">
          <li v-for="f in project.features" :key="f">{{ f }}</li>
        </ul>
      </section>

      <section
        class="detail-section"
        v-if="project.images && project.images.length"
      >
        <h2 class="detail-section-title">화면</h2>
        <screenshot-gallery :images="project.images" />
      </section>

      <section class="detail-section" v-if="project.result">
        <h2 class="detail-section-title">성과</h2>
        <p>{{ project.result }}</p>
      </section>

      <section class="detail-section" v-if="project.takeaway">
        <h2 class="detail-section-title">배운 점</h2>
        <p>{{ project.takeaway }}</p>
      </section>
    </div>
  </div>
  <div v-else class="not-found">프로젝트를 찾을 수 없습니다.</div>
</template>

<script>
import ScreenshotGallery from "@/components/ScreenshotGallery.vue";
import ArchitectureDiagram from "@/components/ArchitectureDiagram.vue";

const PROJECTS = {
  "geojson-tool": {
    name: "GeoJSON 편집 도구",
    tags: ["문제 해결", "사내 도구"],
    summary:
      "고객사·내부 개발자의 좌표 오차 문제를 해결하기 위해 직접 개발한 네이버 지도 기반 업무 지원 웹 도구.",
    stack: ["Vue.js", "Naver Maps API", "GeoJSON"],
    links: [
      {
        label: "🗺 Live Demo",
        href: "/projects/geojson-tool/demo",
        internal: true,
      },
    ],
    problem:
      "기존 방식은 고객사가 네이버 지도에 객체를 그리면, 개발자가 QGIS에서 다시 객체를 생성했습니다. 지도 환경 차이로 좌표 오차가 발생했고, 반복 수정 작업이 이어졌습니다.",
    solution:
      "네이버 지도 기반에서 직접 객체를 편집하고 GeoJSON으로 Export할 수 있는 웹 도구를 개발했습니다. 동일한 지도 환경에서 작업하므로 좌표 오차가 없어졌습니다.",
    features: [
      "Polygon · LineString 생성 및 수정/삭제",
      "GeoJSON Export",
      "Property 직접 입력",
      "거리 · 면적 측정",
      "레이어 관리",
      "LocalStorage 상태 유지",
    ],
    result:
      "기존에는 고객사가 그린 객체를 개발자가 QGIS에서 다시 그리며 좌표 오차와 재작업이 반복됐지만, 도입 후에는 같은 지도 환경에서 즉시 수정하고 GeoJSON으로 바로 내보냅니다. 좌표 오차로 인한 재작업이 사라졌고, 이제는 고객사와 내부 개발자 모두 별도 툴 없이 이 도구를 직접 씁니다.",
    takeaway:
      "현장에서 반복되던 불편을 직접 도구로 풀어본 작업이었습니다. 같은 지도 환경에서 객체와 좌표를 편집·표현하는 흐름을 설계하면서 지도 데이터를 다루는 감을 익혔고, 사용자가 지도에서 데이터를 직접 만지는 UX를 설계하는 일로 곧장 이어집니다.",
    images: [
      {
        src: "/screenshots/editor.png",
        alt: "GeoJSON 편집 도구 메인 편집 화면",
        caption: "네이버 지도 위에서 객체를 직접 편집하는 화면",
      },
      {
        src: "/screenshots/export.png",
        alt: "GeoJSON Export 화면",
        caption: "편집한 객체를 GeoJSON으로 Export",
      },
    ],
    diagram: false,
  },
  "search-playground": {
    name: "로컬 검색 탐색 플레이그라운드",
    tags: ["Search & Discovery", "개인 프로젝트"],
    summary:
      "검색·정렬·필터·최근 검색어·즐겨찾기를 직접 구현하며, '원하는 정보에 더 적은 단계로 닿는' 탐색 경험을 실험한 React + TypeScript 프로젝트.",
    stack: [
      "React 19",
      "TypeScript",
      "Vite",
      "TanStack Query",
      "TailwindCSS",
      "Vitest",
    ],
    links: [
      {
        label: "GitHub",
        href: "https://github.com/ysparkr841/search-discovery-playground",
        internal: false,
      },
    ],
    problem:
      "서비스를 쓰다 보면 원하는 결과를 찾으려고 검색을 여러 번 고쳐 하거나 필터를 계속 바꾸게 되는 경우가 많습니다. 정렬 방식, 카테고리 필터, 최근 검색어, 즐겨찾기 같은 요소는 하나하나 보면 단순하지만, 실제로는 사용자가 정보에 도달하는 단계 수를 좌우합니다. 검색 결과를 그냥 나열하는 데서 그치지 않고, 어떻게 하면 더 빨리 발견하게 만들 수 있을지를 직접 만들어 보며 확인하고 싶었습니다.",
    solution:
      "실무 밖에서 검색 경험 자체를 뜯어보려고, 장소 검색 화면을 React 19 + TypeScript로 처음부터 구성했습니다. 입력은 300ms 디바운스로 묶어 불필요한 연산을 줄이고, 검색어와 일치하는 구간은 장소명·설명·태그에서 하이라이팅했습니다. 정렬(정확도·최신·거리·평점)과 카테고리 필터는 별도 상태로 저장하지 않고 원본 데이터에서 매번 계산하는 파생 구조로 처리해 상태 동기화 문제를 피했고, 최근 검색어와 즐겨찾기는 LocalStorage에 묶어 새로고침 후에도 유지되게 했습니다. 비동기 흐름은 TanStack Query로 로딩·에러·성공 상태를 분리했습니다.",
    features: [
      "300ms 디바운스 검색 — 입력이 멈춘 뒤에만 결과 갱신",
      "검색어 하이라이팅 — 장소명·설명·태그의 일치 구간 강조",
      "정렬(정확도·최신·거리·평점) + 카테고리 필터를 파생 상태로 계산",
      "최근 검색어 — LocalStorage 기반 최대 5개, 중복 제거·재검색·삭제",
      "즐겨찾기 — 추가/해제 및 '즐겨찾기만 보기' 필터",
      "결과 없음(Empty State) 안내와 로딩·에러·성공 상태 분리",
      "useDebounce·useLocalStorage 등 제네릭 커스텀 훅으로 분리",
    ],
    result:
      "검색이 결과를 '보여주는' 기능이 아니라 사용자를 원하는 정보까지 데려다주는 흐름이라는 관점으로 화면 전체를 다시 설계해 봤습니다. 디바운스·하이라이팅·정렬·필터·최근 검색어·즐겨찾기가 한 화면에서 어떻게 맞물려 탐색 비용을 줄이는지 직접 만들어 확인했고, 타입을 먼저 잡고 훅과 컴포넌트로 쌓아 화면을 조립하는 구조와 핵심 유틸의 단위 테스트(Vitest)까지 정리했습니다.",
    takeaway:
      "검색은 단순 필터링이 아니라는 걸 직접 만들며 체감했습니다. 같은 데이터라도 정렬·하이라이팅·최근 검색어를 어떻게 엮느냐에 따라 원하는 결과까지의 단계가 달라졌고, 파생 상태는 저장하지 않고 계산한다는 원칙이 상태 관리를 한결 단순하게 만들었습니다. 지도 위에서 검색하고 원하는 장소를 찾아가는 서비스도 결국 같은 고민 위에 있습니다. 결과를 어떻게 보여줄지, 사용자가 원하는 걸 얼마나 빨리 찾게 할지를 작은 규모로 직접 만들며 들여다봤습니다.",
    images: [
      {
        src: "/screenshots/search-browse.png",
        alt: "전체 장소 둘러보기 화면",
        caption: "카테고리·정렬·즐겨찾기 필터로 전체 장소를 둘러보는 화면",
      },
      {
        src: "/screenshots/search-highlight.png",
        alt: "검색 결과 하이라이팅 화면",
        caption: "검색 시 일치 구간 하이라이팅 + 최근 검색어 + 즐겨찾기 표시",
      },
    ],
    diagram: false,
  },
  "helpdesk-chatbot": {
    name: "사내 헬프데스크 챗봇 PoC",
    tags: ["검색 품질 개선", "Discovery"],
    summary:
      "사내 문서에서 정답을 찾아내는 검색(Discovery) 품질을 직접 개선한 헬프데스크 챗봇 PoC. Hybrid Search와 Reranker로 검색 정확도를 끌어올리고, 스트리밍 응답까지 직접 설계·구현했습니다.",
    stack: [
      "LangChain",
      "LangGraph",
      "Qdrant",
      "Ollama(Gemma)",
      "JSP",
      "WebSocket",
      "Docker",
    ],
    problem:
      "사내 헬프데스크에는 시스템 사용법·장애 대응 같은 문의가 반복적으로 들어왔고, 담당자가 매번 직접 답했습니다. 핵심은 흩어진 사내 문서 더미에서 질문에 맞는 정답 문서를 정확히 찾아내는 일 — 검색(Discovery) 품질이었습니다. 처음에는 Chroma로 벡터 검색을 붙였는데, 정작 정답이 되어야 할 문서가 검색 결과 3~5위에 밀려 나오는 경우가 많았고, 그만큼 답변 정확도가 떨어졌습니다.",
    solution:
      "검색 품질, 특히 정답 문서의 순위를 끌어올리는 데 집중했습니다. 벡터 검색만으로는 순위가 불안정해, 의미 기반 검색(Dense)과 키워드 기반 검색(Sparse)을 함께 쓸 수 있는 Qdrant로 검색 엔진을 교체했습니다(기존 Chroma → Qdrant). Hybrid Search로 표현이 달라도 관련 문서를 놓치지 않게 하고, 여기에 Reranker를 더해 실제 관련성 높은 문서가 상위로 오도록 재정렬했습니다. 이 검색 결과를 LangGraph 워크플로우로 엮어 답변을 생성하고, LLM은 Ollama(Gemma)를 로컬에서 구동해 사내 데이터가 밖으로 나가지 않게 했습니다. 프론트엔드는 기존 사내 시스템(Java JSP)에 WebSocket을 연결해, 답변이 한 글자씩 출력되도록 스트리밍 응답을 구현했습니다.",
    features: [
      "LangGraph 기반 RAG 워크플로우 설계",
      "검색 엔진을 Chroma 벡터 검색에서 Qdrant Hybrid Search로 교체 — 순위 안정화",
      "Qdrant Hybrid Search — Dense(임베딩) + Sparse(BM25) 동시 검색",
      "Reranker 적용으로 검색 결과 재정렬 및 정확도 향상",
      "Ollama(Gemma) 로컬 LLM — 사내 데이터 외부 미전송",
      "JSP + WebSocket 스트리밍 응답 — 타이핑 효과로 응답 체감 속도 개선",
    ],
    result:
      "Chroma로 벡터 검색만 쓰던 초기 버전은 정작 정답 문서가 3~5위로 밀려 답변 정확도가 낮았지만, Qdrant Hybrid Search와 Reranker를 적용한 뒤에는 관련성 높은 문서가 안정적으로 상위에 올라왔습니다. 그 결과 담당자가 직접 답하지 않아도 사내 문서를 근거로 질문에 응답하는 형태를 만들어 사내에 보고할 수 있었습니다.",
    takeaway:
      "검색 품질이 결국 답의 품질을 가른다는 걸 직접 겪었습니다. 같은 데이터라도 검색 전략(Hybrid)과 재정렬(Reranker)에 따라 사용자가 받는 결과가 확 달라졌고, 그 결과를 어떻게 보여주느냐(스트리밍)도 체감을 바꿨습니다. 검색·추천 서비스의 결과 품질을 손보는 일과 바로 닿아 있습니다.",
    images: [],
    diagram: true,
  },
  "chartjs-plugin": {
    name: "Chart.js 커스텀 플러그인",
    tags: ["사내 공통", "확장 설계"],
    summary:
      "Chart.js 기본 차트로는 표현할 수 없는 반원·화살표·게이지·어노테이션 등을 그릴 수 있도록 설계한 사내 공통 커스텀 플러그인.",
    stack: ["Vue.js", "Chart.js", "JavaScript"],
    links: [],
    problem:
      "여러 공공 플랫폼의 대시보드를 만들다 보면 기획에서 요구하는 차트 형태가 Chart.js 기본 기능만으로는 표현되지 않는 경우가 잦았습니다. 반원(반도넛) 형태, 데이터 포인트의 증감을 보여주는 화살표, 게이지, 기준선·라벨 같은 어노테이션이 대표적이었고, 매 프로젝트마다 비슷한 한계를 따로 우회하는 일이 반복됐습니다.",
    solution:
      "필요할 때마다 임시로 우회하는 대신, Chart.js의 플러그인 구조를 활용해 부족한 표현을 직접 그리는 커스텀 플러그인으로 설계했습니다. 반원·화살표·게이지·어노테이션을 각각 플러그인으로 분리하고, 어느 프로젝트에서든 옵션만 넘기면 동작하도록 재사용 가능한 옵션 인터페이스를 함께 설계했습니다. 이 플러그인들은 사내 공통 자산으로 정리되고, 관리자 화면의 공통 기능으로도 추가됐습니다.",
    features: [
      "반원(반도넛) 차트 플러그인",
      "데이터 포인트 화살표·증감 표시 플러그인",
      "게이지 차트 플러그인",
      "커스텀 어노테이션(기준선·라벨) 플러그인",
      "여러 프로젝트에서 재사용 가능한 옵션 인터페이스 설계",
    ],
    result:
      "이전에는 새 차트 요구가 들어올 때마다 프로젝트별로 비슷한 코드를 다시 짰지만, 공통 플러그인으로 정리한 뒤로는 옵션 설정만으로 같은 차트를 여러 서비스에 붙였습니다. 강남·수원·양천 등 여러 지자체 플랫폼의 대시보드가 같은 차트 기능을 공유했고, 관리자 화면의 공통 기능으로도 자리잡아 기획이 요구하는 비표준 차트에 빠르게 대응합니다.",
    takeaway:
      "반복되는 요구를 매번 임시로 막지 않고, 라이브러리의 확장 지점을 파고들어 재사용 가능한 공통 구조로 묶었습니다. 옵션 인터페이스를 어떻게 짜느냐에 따라 다른 개발자가 얼마나 쉽게 가져다 쓰는지가 갈렸고, 이게 곧 확장 가능한 UI 컴포넌트 설계로 이어집니다.",
    images: [
      {
        src: "/screenshots/gauge.png",
        alt: "게이지 차트 플러그인 화면",
        caption: "커스텀 게이지 차트 플러그인 적용 예시",
      },
      {
        src: "/screenshots/semicircle.png",
        alt: "반원 차트 플러그인 화면",
        caption: "반원(반도넛) 차트 플러그인 적용 예시",
      },
    ],
    diagram: false,
  },
  "data-gangnam": {
    name: "데이터강남 플랫폼",
    tags: ["운영", "고도화"],
    summary: "강남구 공공 데이터 기반 통합 플랫폼 운영 및 고도화.",
    stack: ["Vue.js", "Chart.js", "Naver Maps", "Talend ETL", "Java", "Oracle"],
    links: [
      {
        label: "서비스 바로가기",
        href: "https://sog.gangnam.go.kr",
        internal: false,
      },
    ],
    problem:
      "데이터강남은 강남구의 여러 부서·기관에서 나오는 공공 데이터를 한 화면에서 보여줘야 하는 플랫폼이었습니다. 데이터 종류와 활용처가 제각각이라 요구사항이 계속 늘었고, 지도와 차트로 흩어진 데이터를 사용자가 직관적으로 탐색할 수 있게 만드는 것이 과제였습니다.",
    solution:
      "지도 위에서 데이터를 탐색하는 화면을 중심으로, 위치 데이터는 네이버 지도 시각화로, 지표 데이터는 Chart.js 차트로 표현했습니다. 서로 다른 요구가 들어와도 매번 새로 만들지 않도록 공통 컴포넌트와 사내 공통 차트 플러그인을 적용해 재사용 구조를 다졌고, Talend ETL로 데이터 적재를 지원하고 Jenkins로 배포를 관리하며 운영까지 직접 맡았습니다.",
    features: [
      "지도 기반 시각화 기능 개발",
      "Chart.js 커스텀 플러그인 구현",
      "공통 컴포넌트 개선",
      "ETL 지원 (Talend)",
      "Jenkins 배포 관리",
      "운영 및 장애 대응",
    ],
    result:
      "장기간 주담당으로 참여하며, 새 데이터·새 요구가 들어와도 공통 구조 위에서 빠르게 화면을 추가할 수 있는 형태로 다듬었습니다. 단발성 구축에 그치지 않고 배포·장애 대응까지 운영을 책임지며, 흩어진 공공 데이터를 지도와 차트로 한곳에서 탐색하는 서비스를 안정적으로 유지했습니다.",
    takeaway:
      "여러 조직의 서로 다른 요구를 하나의 플랫폼 구조로 받아내는 일을 했습니다. 요구가 늘수록 공통 컴포넌트와 재사용 구조가 얼마나 중요한지 절감했고, 지도 위 데이터 탐색 UX를 다루는 동시에 운영까지 책임지며 서비스를 길게 끌고 가는 감을 익혔습니다.",
    images: [
      {
        src: "/screenshots/dashboard.png",
        alt: "데이터강남 대시보드 화면",
        caption: "공공 데이터 통합 대시보드",
      },
      {
        src: "/screenshots/map.png",
        alt: "데이터강남 지도 시각화 화면",
        caption: "지도 기반 데이터 시각화",
      },
    ],
    diagram: false,
  },
  "ddm-situation": {
    name: "동대문구 빅데이터 상황시스템",
    tags: ["구축"],
    summary: "동대문구 도시현황 빅데이터 기반 종합상황시스템 구축 프로젝트.",
    stack: ["Vue.js", "Chart.js", "Webpack"],
    problem:
      "동대문구의 도시현황 데이터를 지도 위에 보여줘야 했는데, 한 지역에 위치 데이터가 많아 마커가 겹치는 상황이었습니다. 네이버 지도의 기본 클러스터링을 쓰면 간단했지만, 고객이 클러스터·마커의 모양과 정보 구성을 명확한 HTML 형태로 요구해서 기본 기능으로는 그 디자인을 맞출 수 없었습니다.",
    solution:
      "기본 클러스터링 대신, 겹치는 마커를 묶으면서 고객이 요구한 HTML 형태 그대로 렌더되는 커스텀 클러스터링을 직접 구현했습니다. 줌 레벨에 따라 밀집 지역이 정리돼 보이면서도, 클러스터·마커를 원하는 디자인의 HTML로 그릴 수 있게 했습니다. 반복되는 지도·차트 구성은 공통 컴포넌트로 분리해 여러 화면에서 재사용하도록 만들었고, Webpack 캐시 전략으로 반복 방문 시 로딩 부담을 줄였습니다.",
    features: [
      "도시현황 지도 화면 구축",
      "HTML 커스텀 클러스터링 구현 (네이버 기본 클러스터링 대체)",
      "공통 컴포넌트 설계",
      "Webpack 캐시 전략 적용",
    ],
    result:
      "네이버 기본 클러스터링으로는 맞출 수 없던 고객 요구 디자인을, 커스텀 클러스터링으로 HTML 형태 그대로 구현해 충족했습니다. 또한 지도·차트 구성을 최대한 공통 컴포넌트로 분리한 덕분에, 도시현황 메인 화면뿐 아니라 빅데이터 분석 화면에서도 같은 컴포넌트를 그대로 재사용했습니다. 화면마다 비슷한 UI를 다시 만들지 않고 빠르게 확장할 수 있었습니다.",
    takeaway:
      "지도에 많은 데이터를 얹을 때, 라이브러리 기본 기능만 믿지 않고 요구된 형태를 직접 그려야 하는 순간이 있다는 걸 배웠습니다. 기본 클러스터링의 한계는 커스텀 구현으로 넘고, 공통 컴포넌트와 로딩 최적화까지 함께 챙기며 지도 화면을 확장 가능하게 다뤘습니다.",
    images: [],
    diagram: false,
  },
};

export default {
  name: "ProjectDetailView",
  components: {
    ScreenshotGallery,
    ArchitectureDiagram,
  },
  computed: {
    project() {
      return PROJECTS[this.$route.params.id] || null;
    },
  },
};
</script>

<style lang="stylus" scoped>
.back-link
    display inline-block
    font-size 13px
    color var(--color-text-muted)
    margin-bottom 40px
    transition color 0.15s

    &:hover
        color var(--color-accent)

.detail-header
    padding-bottom 40px
    border-bottom 1px solid var(--color-border)
    margin-bottom 48px

.detail-tags
    display flex
    gap 8px
    flex-wrap wrap
    margin-bottom 14px

.project-tag
    font-size 12px
    font-weight 500
    color var(--color-accent)
    background var(--color-accent-light)
    border 1px solid var(--color-accent-border)
    padding 3px 10px
    border-radius 99px

.detail-title
    font-size 32px
    font-weight 700
    letter-spacing -0.02em
    line-height 1.2
    color var(--color-text)
    margin-bottom 14px

.detail-summary
    font-size 16px
    color var(--color-text-secondary)
    line-height 1.8
    margin-bottom 16px
    max-width 600px

.detail-stack
    font-size 13px
    color var(--color-text-muted)
    margin-bottom 20px

.detail-links
    display flex
    gap 8px
    flex-wrap wrap

.detail-link
    display inline-flex
    align-items center
    padding 9px 16px
    font-size 13px
    font-weight 500
    border-radius var(--radius-btn)
    background var(--color-accent-light)
    color var(--color-accent)
    border 1px solid var(--color-accent-border)
    transition background 0.12s

    &:hover
        background var(--color-accent-border)
        color var(--color-accent-hover)

    &--external
        background var(--color-bg-subtle)
        color var(--color-text-secondary)
        border-color var(--color-border)

        &:hover
            background var(--color-bg-soft)
            color var(--color-text)

.detail-section
    margin-bottom 56px

    p
        font-size 15px
        color var(--color-text-secondary)
        line-height 1.85

.detail-section-title
    font-size 12px
    font-weight 600
    text-transform uppercase
    letter-spacing 0.1em
    color var(--color-text-muted)
    margin-bottom 18px

.feature-list
    list-style none
    display flex
    flex-direction column
    gap 10px

    li
        font-size 15px
        color var(--color-text-secondary)
        line-height 1.6
        padding-left 18px
        position relative

        &::before
            content ""
            position absolute
            left 0
            top 9px
            width 5px
            height 5px
            border-radius 50%
            background var(--color-accent)

.not-found
    color var(--color-text-muted)
    font-size 14px

@media (max-width 640px)
    .detail-title
        font-size 26px

    .detail-section
        margin-bottom 44px
</style>
