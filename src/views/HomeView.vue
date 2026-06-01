<template>
  <div class="home">
    <section class="intro">
      <div class="intro-badge">Frontend-Focused Full Stack</div>
      <h1 class="intro-name">박의수</h1>
      <p class="intro-desc">
        프론트엔드를 중심으로 Java 백엔드까지 아우르는 4년차 개발자입니다.<br />
        데이터 시각화·지도 서비스 구현부터 운영·장애 대응·업무 효율화까지 서비스
        전체 흐름을 경험했습니다.
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
            "JavaScript",
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
            "데이터 강남 플랫폼 구축·운영 주담당 (강남구청, 2022~현재) — 웰컴보드 에디터 고도화, 공공시설 대시보드, 자료조회 개선 등 신규 기능 개발 총괄",
            "인천 e한눈에 · 인천디지털시정 구축 참여 및 운영 주담당 (인천광역시, 2022~2025) — 서버 이관, OS 보안취약점 조치, 침수 데이터 표출 신규 개발",
            "빅데이터 종합상황시스템 구축 (동대문구, 2024~현재) — 실시간 도시현황·음성명령·ChatGPT 연동, 신속집행·계약현황 신규 개발",
            "스마트강서 통합플랫폼 운영 주담당 (강서구, 2024~현재) — AutoCAD 도면 GeoJSON 변환, 고도제한 지도 이원화, 재개발재건축 기능 개발",
            "강남구 도시관리공단 · 강화군 · 도봉구 등 다수 공공기관 플랫폼 유지보수 및 기능 고도화",
            "Chart.js 커스텀 플러그인 설계·개발 — 반원·화살표·게이지·어노테이션 등 사내 공통 차트 기능 구현",
            "GeoJSON 편집 도구 설계·개발 · MapLibre 사내 공통 지도 라이브러리 개발 (네이버지도 tile 연동)",
            "Talend ETL · Jenkins 배포 관리 · 서버 보안취약점 조치 · 장애 대응",
            "사내 헬프데스크 RAG 챗봇 PoC — LangChain · LangGraph, Qdrant Hybrid Search(Dense+Sparse) + Reranker, Ollama(Gemma), JSP WebSocket 스트리밍 응답 구현",
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
    font-size 36px
    font-weight 700
    letter-spacing -0.02em
    color var(--color-text)
    margin-bottom 12px
    line-height 1.15

.intro-desc
    font-size 15px
    color var(--color-text-secondary)
    line-height 1.75
    margin-bottom 28px
    max-width 520px

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
    transition opacity 0.12s

    &:hover
        opacity 0.88

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
</style>
