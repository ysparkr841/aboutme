<template>
  <div class="projects">
    <div class="page-header">
      <h1 class="page-title">Projects</h1>
      <div class="stats-row">
        <div class="stat-item">
          <span class="stat-num">19</span>
          <span class="stat-label">총 프로젝트</span>
        </div>
        <div class="stat-divider" />
        <div class="stat-item">
          <span class="stat-num">10</span>
          <span class="stat-label">구축</span>
        </div>
        <div class="stat-divider" />
        <div class="stat-item">
          <span class="stat-num">9</span>
          <span class="stat-label">운영·유지관리</span>
        </div>
      </div>
    </div>

    <section class="section">
      <h2 class="section-label">Featured</h2>
      <div class="project-grid">
        <router-link
          v-for="project in featured"
          :key="project.id"
          :to="`/projects/${project.id}`"
          class="project-card"
        >
          <div class="card-top">
            <div class="card-icon" :style="{ background: project.color }">
              {{ project.icon }}
            </div>
            <div class="card-tags">
              <span
                class="tag"
                v-for="tag in project.tags"
                :key="tag.label"
                :class="`tag--${tag.type}`"
                >{{ tag.label }}</span
              >
            </div>
          </div>
          <h2 class="card-name">{{ project.name }}</h2>
          <p class="card-desc">{{ project.desc }}</p>
          <div class="card-footer">
            <div class="card-stack">
              <span v-for="s in project.stack" :key="s" class="stack-dot">{{
                s
              }}</span>
            </div>
            <span class="card-arrow">→</span>
          </div>
        </router-link>
      </div>
    </section>

    <section class="section">
      <h2 class="section-label">Additional</h2>
      <div class="additional-list">
        <div
          v-for="(group, idx) in additional"
          :key="idx"
          class="additional-group"
        >
          <div class="group-label">{{ group.label }}</div>
          <div
            v-for="item in group.items"
            :key="item.name"
            class="additional-item"
          >
            <span class="additional-name">{{ item.name }}</span>
            <span class="additional-tag" :class="`tag--${item.type}`">{{
              item.type === "build"
                ? "구축"
                : item.type === "both"
                ? "구축·운영"
                : "운영"
            }}</span>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
export default {
  name: "ProjectsView",
  data() {
    return {
      featured: [
        {
          id: "geojson-tool",
          name: "GeoJSON 편집 도구",
          icon: "🗺",
          color: "var(--color-accent-light)",
          tags: [
            { label: "문제 해결", type: "orange" },
            { label: "사내 도구", type: "gray" },
          ],
          desc: "고객사·내부 개발자의 좌표 오차 문제를 해결하기 위해 직접 개발한 네이버 지도 기반 업무 지원 웹 도구.",
          stack: ["Vue.js", "Naver Maps", "GeoJSON"],
        },
        {
          id: "helpdesk-chatbot",
          name: "사내 헬프데스크 챗봇 PoC",
          icon: "💬",
          color: "var(--color-accent-light)",
          tags: [{ label: "PoC", type: "orange" }],
          desc: "사내 문서에서 정답을 찾아내는 검색 품질을 직접 개선한 RAG 챗봇. Qdrant Hybrid Search와 Reranker로 정확도를 높이고, JSP WebSocket으로 스트리밍 응답을 구현했습니다.",
          stack: [
            "LangChain",
            "LangGraph",
            "Qdrant",
            "Ollama",
            "JSP",
            "WebSocket",
          ],
        },
        {
          id: "chartjs-plugin",
          name: "Chart.js 커스텀 플러그인",
          icon: "🧩",
          color: "var(--color-accent-light)",
          tags: [
            { label: "사내 공통", type: "orange" },
            { label: "확장 설계", type: "gray" },
          ],
          desc: "기본 차트로 표현할 수 없는 반원·화살표·게이지·어노테이션을 그릴 수 있도록 설계한 사내 공통 Chart.js 커스텀 플러그인.",
          stack: ["Vue.js", "Chart.js", "JavaScript"],
        },
        {
          id: "data-gangnam",
          name: "데이터강남 플랫폼",
          icon: "🌆",
          color: "var(--color-bg-subtle)",
          tags: [
            { label: "운영", type: "green" },
            { label: "고도화", type: "gray" },
          ],
          desc: "강남구 공공 데이터 기반 통합 플랫폼 운영 및 고도화. 지도 시각화, Chart.js 커스터마이징, ETL 지원.",
          stack: ["Vue.js", "Chart.js", "Naver Maps", "Talend"],
        },
        {
          id: "ddm-situation",
          name: "동대문구 빅데이터 상황시스템",
          icon: "🏙",
          color: "var(--color-bg-subtle)",
          tags: [{ label: "구축", type: "blue" }],
          desc: "도시현황 지도 화면 구축, 커스텀 클러스터링 구현, 공통 컴포넌트 설계.",
          stack: ["Vue.js", "Chart.js", "Webpack"],
        },
      ],
      additional: [
        {
          label: "구축",
          items: [
            { name: "고양시 디지털 정책플랫폼 구축", type: "build" },
            { name: "스마트 정책의사결정 지원시스템 구축", type: "build" },
            { name: "디지털 아리수ON 3단계 구축", type: "build" },
            { name: "도봉 e구정 디지털 현황판 구축", type: "build" },
            { name: "도봉구 대표 홈페이지 및 모바일 앱 개편", type: "build" },
            { name: "경상남도 디지털정책지원시스템 구축", type: "build" },
            {
              name: "에티오피아 아디스아바바시 데이터 기반 의사결정지원시스템 구축 지원",
              type: "build",
            },
          ],
        },
        {
          label: "운영·유지관리",
          items: [
            { name: "인천 e한눈에 유지관리", type: "both" },
            { name: "스마트강서 통합 플랫폼 운영 및 유지보수", type: "ops" },
            {
              name: "은평구 스마트행정 통합 플랫폼 유지관리",
              type: "ops",
            },
            { name: "안산시 데이터 플랫폼 유지관리", type: "ops" },
            { name: "강화군 스마트군정 유지관리", type: "ops" },
            { name: "강남구 도시관리공단 유지보수", type: "both" },
            { name: "관악구 스마트관악 데이터 통합플랫폼 운영", type: "ops" },
            { name: "한국환경공단 스마트 K-eco 운영", type: "ops" },
          ],
        },
      ],
    };
  },
};
</script>

<style lang="stylus" scoped>
.page-header
    margin-bottom 36px

.page-title
    font-size 28px
    font-weight 700
    letter-spacing -0.02em
    color var(--color-text)
    margin-bottom 16px

.stats-row
    display flex
    align-items center
    gap 20px
    background var(--color-bg-subtle)
    border 1px solid var(--color-border)
    border-radius var(--radius-btn)
    padding 12px 20px
    width fit-content

.stat-item
    display flex
    flex-direction column
    align-items center
    gap 2px

.stat-num
    font-size 18px
    font-weight 700
    color var(--color-text)
    letter-spacing -0.02em

.stat-label
    font-size 11px
    color var(--color-text-muted)

.stat-divider
    width 1px
    height 28px
    background var(--color-border)

.section
    margin-bottom 48px

.section-label
    font-size 11px
    font-weight 600
    text-transform uppercase
    letter-spacing 0.1em
    color var(--color-text-muted)
    margin-bottom 16px

.project-grid
    display grid
    grid-template-columns repeat(2, 1fr)
    gap 18px

.project-card
    display flex
    flex-direction column
    background var(--color-bg)
    border 1px solid var(--color-border)
    border-radius var(--radius-card)
    box-shadow var(--shadow-card)
    padding 24px
    transition box-shadow 0.15s, transform 0.15s
    cursor pointer

    &:hover
        box-shadow var(--shadow-elevated)
        transform translateY(-2px)

.card-top
    display flex
    align-items center
    justify-content space-between
    margin-bottom 16px

.card-icon
    width 44px
    height 44px
    border-radius var(--radius-btn)
    display flex
    align-items center
    justify-content center
    font-size 20px

.card-tags
    display flex
    gap 5px
    flex-wrap wrap
    justify-content flex-end

.tag
    font-size 11px
    font-weight 500
    padding 3px 9px
    border-radius var(--radius-tag)

    &--orange
        background var(--color-accent-light)
        color var(--color-accent)

    &--green
        background rgba(34, 153, 84, 0.1)
        color #1f8a4c

    &--blue
        background rgba(45, 110, 215, 0.1)
        color #2767c9

    &--gray
        background var(--color-bg-subtle)
        color var(--color-text-muted)

    &--build
        background rgba(45, 110, 215, 0.1)
        color #2767c9

    &--ops
        background rgba(34, 153, 84, 0.1)
        color #1f8a4c

    &--both
        background var(--color-accent-light)
        color var(--color-accent)

.card-name
    font-size 16px
    font-weight 600
    color var(--color-text)
    margin-bottom 8px
    letter-spacing -0.01em
    line-height 1.4

.card-desc
    font-size 13px
    color var(--color-text-secondary)
    line-height 1.7
    flex 1
    margin-bottom 20px

.card-footer
    display flex
    align-items center
    justify-content space-between
    margin-top auto

.card-stack
    display flex
    flex-wrap wrap
    gap 4px

.stack-dot
    font-size 11px
    color var(--color-text-placeholder)

    & + .stack-dot::before
        content "·"
        margin-right 4px

.card-arrow
    font-size 14px
    color var(--color-text-placeholder)
    transition color 0.12s, transform 0.12s
    display inline-block

.project-card:hover .card-arrow
    color var(--color-accent)
    transform translateX(3px)

.additional-list
    background var(--color-bg)
    border 1px solid var(--color-border)
    border-radius var(--radius-card)
    box-shadow var(--shadow-card)
    overflow hidden

.additional-group
    & + .additional-group
        border-top 1px solid var(--color-border)

.group-label
    font-size 11px
    font-weight 600
    text-transform uppercase
    letter-spacing 0.08em
    color var(--color-text-muted)
    padding 12px 20px 8px
    background var(--color-bg-soft)

.additional-item
    display flex
    align-items center
    justify-content space-between
    padding 11px 20px
    border-top 1px solid var(--color-border)
    transition background 0.1s

    &:hover
        background var(--color-bg-soft)

.additional-name
    font-size 14px
    color var(--color-text-secondary)

.additional-tag
    flex-shrink 0
    font-size 11px
    font-weight 600
    padding 3px 10px
    border-radius 999px
    letter-spacing 0.02em
    line-height 1.5
    white-space nowrap
    border 1px solid transparent

    &.tag--build
        background rgba(45, 110, 215, 0.08)
        color #2767c9
        border-color rgba(45, 110, 215, 0.18)

    &.tag--ops
        background rgba(34, 153, 84, 0.08)
        color #1f8a4c
        border-color rgba(34, 153, 84, 0.18)

    &.tag--both
        background var(--color-accent-light)
        color var(--color-accent)
        border-color var(--color-accent-border)

@media (max-width 640px)
    .page-title
        font-size 24px

    .project-grid
        grid-template-columns 1fr

    .stats-row
        width 100%
</style>
