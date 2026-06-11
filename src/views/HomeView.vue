<template>
  <div class="home">
    <section class="intro">
      <div class="intro-badge">Map · Data · Discovery Frontend</div>
      <h1 class="intro-name">박의수</h1>
      <p class="intro-desc">
        지도 위에서 데이터를 탐색하는 서비스를 만들어 온 프론트엔드
        개발자입니다.<br />
        여러 공공 조직의 플랫폼에서 지도 시각화와 검색·탐색을 다뤘고, 불편한
        지점이 보이면 도구를 직접 만들어 해결해 왔습니다.
      </p>
      <div class="intro-actions">
        <router-link to="/projects" class="btn-primary"
          >Projects 보기</router-link
        >
        <a
          href="https://github.com/ysparkr841"
          target="_blank"
          class="btn-secondary"
          >GitHub</a
        >
      </div>
    </section>

    <section class="section">
      <h2 class="section-title">Tech Stack</h2>
      <div class="stack-card">
        <div class="stack-row" v-for="item in stack" :key="item.label">
          <span class="stack-label">{{ item.label }}</span>
          <div class="stack-chips">
            <span class="chip" v-for="chip in item.chips" :key="chip">{{
              chip
            }}</span>
          </div>
        </div>
      </div>
    </section>

    <section class="section">
      <h2 class="section-title">Experience</h2>
      <div class="exp-card">
        <div class="exp-item" v-for="exp in experience" :key="exp.period">
          <div class="exp-top">
            <div>
              <div class="exp-company">{{ exp.company }}</div>
              <div class="exp-role">{{ exp.role }}</div>
            </div>
            <span class="exp-period">{{ exp.period }}</span>
          </div>
          <ul class="exp-points">
            <li v-for="point in exp.points" :key="point">{{ point }}</li>
          </ul>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
export default {
  name: "HomeView",
  data() {
    return {
      stack: [
        {
          label: "Frontend",
          chips: [
            "Vue.js",
            "React",
            "JavaScript",
            "TypeScript",
            "Chart.js",
            "D3.js",
            "Naver Maps API",
          ],
        },
        { label: "Backend", chips: ["Java", "REST API", "SQL"] },
        { label: "Infra", chips: ["Linux", "Jenkins", "Tomcat"] },
        { label: "Database", chips: ["Oracle", "MySQL", "PostgreSQL"] },
        { label: "Data", chips: ["Talend ETL"] },
        { label: "AI", chips: ["Ollama", "LangChain", "LangGraph", "Qdrant"] },
      ],
      experience: [
        {
          company: "와이디엔에스",
          role: "Frontend-Focused Full Stack Developer",
          period: "2022 — 현재",
          points: [
            "강남·인천·동대문·강서 등 여러 공공 조직의 지도 기반 플랫폼을 동시에 맡아, 서로 다른 기관의 요구를 하나의 구조로 흡수하며 구축·운영했습니다 (2022~현재)",
            "데이터강남 플랫폼 구축·운영 주담당 (강남구청) — 지도 시각화와 공공시설 대시보드, 자료조회 UX를 사용자 불편 기준으로 다듬으며 신규 기능 개발을 총괄했습니다",
            "현장에서 반복되던 좌표 작업의 불편을 발견해 네이버 지도 기반 GeoJSON 편집 도구를 직접 만들고, MapLibre 사내 공통 지도 라이브러리를 설계했습니다",
            "Chart.js 기본 차트로 표현이 어려운 지표를 만나, 반원·화살표·게이지·어노테이션을 그리는 커스텀 플러그인을 직접 설계해 여러 서비스의 공통 차트로 재사용했습니다",
            "동대문구 빅데이터 종합상황시스템 구축 — 실시간 도시현황 지도와 커스텀 클러스터링, 공통 컴포넌트를 설계했습니다",
            "사내 헬프데스크의 반복 문의를 줄이기 위해, 사내 문서에서 정답을 찾아내는 검색 품질을 직접 개선했습니다 — Qdrant Hybrid Search(Dense+Sparse)와 Reranker로 관련 문서를 상위에 올리고, 스트리밍 응답까지 구현했습니다",
            "서버 이관·보안취약점 조치·장애 대응 등 운영 전 구간을 책임지며, 만든 서비스를 끝까지 돌보는 경험을 쌓았습니다",
          ],
        },
      ],
    };
  },
};
</script>

<style lang="stylus" scoped>
.intro
    padding 48px 40px
    background var(--color-bg-soft)
    border 1px solid var(--color-border)
    border-radius var(--radius-card)
    margin-bottom 48px

.intro-badge
    display inline-block
    font-size 12px
    font-weight 500
    color var(--color-accent)
    background var(--color-accent-light)
    padding 3px 10px
    border-radius 99px
    margin-bottom 16px
    letter-spacing 0.02em

.intro-name
    font-size 40px
    font-weight 700
    letter-spacing -0.02em
    color var(--color-text)
    margin-bottom 14px
    line-height 1.15

.intro-desc
    font-size 16px
    color var(--color-text-secondary)
    line-height 1.75
    margin-bottom 28px
    max-width 540px

.intro-actions
    display flex
    gap 8px

.btn-primary
    display inline-flex
    align-items center
    padding 9px 18px
    background var(--color-accent)
    color #fff
    font-size 14px
    font-weight 500
    border-radius var(--radius-btn)
    transition background 0.12s

    &:hover
        background var(--color-accent-hover)

.btn-secondary
    display inline-flex
    align-items center
    padding 9px 18px
    background transparent
    color var(--color-text-secondary)
    font-size 14px
    font-weight 500
    border-radius var(--radius-btn)
    border 1px solid var(--color-border)
    transition background 0.12s, color 0.12s

    &:hover
        background var(--color-bg-subtle)
        color var(--color-text)

.section
    margin-bottom 48px

.section-title
    font-size 11px
    font-weight 600
    text-transform uppercase
    letter-spacing 0.1em
    color var(--color-text-muted)
    margin-bottom 16px

.stack-card
    background var(--color-bg)
    border 1px solid var(--color-border)
    border-radius var(--radius-card)
    box-shadow var(--shadow-card)
    overflow hidden

.stack-row
    display flex
    align-items flex-start
    gap 20px
    padding 14px 20px
    border-bottom 1px solid var(--color-border)

    &:last-child
        border-bottom none

.stack-label
    width 72px
    flex-shrink 0
    font-size 12px
    font-weight 500
    color var(--color-text-muted)
    padding-top 3px

.stack-chips
    display flex
    flex-wrap wrap
    gap 6px

.chip
    font-size 12px
    font-weight 500
    color var(--color-text-secondary)
    background var(--color-bg-subtle)
    border 1px solid var(--color-border)
    padding 2px 10px
    border-radius var(--radius-tag)

.exp-card
    background var(--color-bg)
    border 1px solid var(--color-border)
    border-radius var(--radius-card)
    box-shadow var(--shadow-card)
    padding 24px

.exp-item
    & + .exp-item
        margin-top 24px
        padding-top 24px
        border-top 1px solid var(--color-border)

.exp-top
    display flex
    justify-content space-between
    align-items flex-start
    margin-bottom 16px

.exp-company
    font-weight 600
    font-size 15px
    color var(--color-text)
    margin-bottom 2px

.exp-role
    font-size 13px
    color var(--color-text-muted)

.exp-period
    font-size 12px
    color var(--color-text-placeholder)
    white-space nowrap

.exp-points
    list-style none
    display flex
    flex-direction column
    gap 7px

    li
        font-size 14px
        color var(--color-text-secondary)
        padding-left 14px
        position relative
        line-height 1.6

        &::before
            content ""
            position absolute
            left 0
            top 8px
            width 4px
            height 4px
            border-radius 50%
            background var(--color-accent)

@media (max-width 640px)
    .intro
        padding 32px 24px

    .intro-name
        font-size 32px

    .intro-actions
        flex-wrap wrap
</style>
