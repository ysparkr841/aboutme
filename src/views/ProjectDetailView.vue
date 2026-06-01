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

      <section
        class="detail-section"
        v-if="project.features && project.features.length"
      >
        <h2 class="detail-section-title">구현 기능</h2>
        <ul class="feature-list">
          <li v-for="f in project.features" :key="f">{{ f }}</li>
        </ul>
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
      "고객사 및 내부 개발자가 직접 활용하며 반복 수정 업무가 감소했습니다.",
    takeaway: "",
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
    problem: "",
    solution: "",
    features: [
      "지도 기반 시각화 기능 개발",
      "Chart.js 커스텀 플러그인 구현",
      "공통 컴포넌트 개선",
      "ETL 지원 (Talend)",
      "Jenkins 배포 관리",
      "운영 및 장애 대응",
    ],
    result: "",
    takeaway: "",
  },
  "ddm-situation": {
    name: "동대문구 빅데이터 상황시스템",
    tags: ["구축"],
    summary: "동대문구 도시현황 빅데이터 기반 종합상황시스템 구축 프로젝트.",
    stack: ["Vue.js", "Chart.js", "Webpack"],
    problem: "",
    solution: "",
    features: [
      "도시현황 지도 화면 구축",
      "커스텀 클러스터링 구현",
      "공통 컴포넌트 설계",
      "Webpack 캐시 전략 적용",
    ],
    result: "",
    takeaway: "",
  },
  "helpdesk-chatbot": {
    name: "사내 헬프데스크 챗봇 PoC",
    tags: ["PoC"],
    summary:
      "사내 헬프데스크 문의를 자동 응대하는 RAG 챗봇 PoC. LangGraph 워크플로우, Qdrant Hybrid Search, 스트리밍 응답까지 직접 설계·구현.",
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
      "반복적인 사내 문의(시스템 사용법, 장애 대응 등)를 담당자가 직접 답변하는 비효율을 줄이고, 사내 문서 기반으로 정확히 응답하는 챗봇이 필요했다.",
    solution:
      "LangGraph로 RAG 파이프라인 워크플로우를 구성하고, 벡터 DB로 Qdrant를 Docker에 설치해 사용. Dense Search(의미 기반)와 Sparse Search(키워드 기반)를 동시에 수행하는 Hybrid Search로 검색 정확도를 높였으며, Reranker를 추가해 실제 관련성 높은 문서가 상위에 오도록 재정렬. LLM은 Ollama(Gemma)를 로컬 서버에 구동해 데이터 외부 유출 없이 운영. 프론트엔드는 기존 사내 시스템(Java JSP)에 WebSocket을 연결해 스트리밍 응답을 구현, 한 글자씩 타이핑되는 방식으로 체감 응답 속도를 개선.",
    features: [
      "LangGraph 기반 RAG 워크플로우 설계",
      "Qdrant Hybrid Search — Dense(임베딩) + Sparse(BM25) 동시 검색",
      "Reranker 적용으로 검색 결과 재정렬 및 정확도 향상",
      "Ollama(Gemma) 로컬 LLM — 사내 데이터 외부 미전송",
      "JSP + WebSocket 스트리밍 응답 — 타이핑 효과로 응답 체감 속도 개선",
    ],
    result:
      "담당자 없이 사내 문서 기반으로 질문에 응답하는 챗봇을 사내 보고. Hybrid Search + Reranker 조합이 단순 벡터 검색 대비 응답 관련성이 높아짐을 확인.",
    takeaway:
      "RAG 파이프라인 전 구간(청킹·임베딩·검색·재정렬·생성)을 직접 구현하며 각 단계가 품질에 미치는 영향을 체감. 스트리밍 응답이 UX에 미치는 효과도 확인.",
  },
};

export default {
  name: "ProjectDetailView",
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
    color #999
    margin-bottom 40px
    transition color 0.15s

    &:hover
        color #1a1a1a

.detail-header
    padding-bottom 40px
    border-bottom 1px solid #f0f0f0
    margin-bottom 48px

.detail-tags
    display flex
    gap 8px
    margin-bottom 12px

.project-tag
    font-size 11px
    color #888
    border 1px solid #e0e0e0
    padding 1px 7px
    border-radius 10px

.detail-title
    font-size 28px
    font-weight 700
    margin-bottom 12px

.detail-summary
    font-size 15px
    color #555
    line-height 1.8
    margin-bottom 16px

.detail-stack
    font-size 13px
    color #999
    margin-bottom 16px

.detail-links
    display flex
    gap 8px
    flex-wrap wrap

.detail-link
    display inline-flex
    align-items center
    padding 7px 14px
    font-size 13px
    font-weight 500
    border-radius 6px
    background var(--color-accent-light)
    color var(--color-accent)
    border 1px solid rgba(86, 69, 212, 0.2)
    transition background 0.12s

    &:hover
        background rgba(86, 69, 212, 0.15)

    &--external
        background var(--color-bg-subtle)
        color var(--color-text-secondary)
        border-color var(--color-border)

        &:hover
            background var(--color-bg-subtle)
            color var(--color-text)

.detail-section
    margin-bottom 48px

    p
        font-size 15px
        color #444
        line-height 1.8

.detail-section-title
    font-size 13px
    font-weight 600
    text-transform uppercase
    letter-spacing 0.08em
    color #999
    margin-bottom 16px

.feature-list
    list-style none
    display flex
    flex-direction column
    gap 8px

    li
        font-size 14px
        color #444
        padding-left 16px
        position relative

        &::before
            content "—"
            position absolute
            left 0
            color #ccc

.not-found
    color #999
    font-size 14px
</style>
