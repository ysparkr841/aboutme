<template>
  <div class="diagram">
    <ol class="flow">
      <template v-for="(node, idx) in nodes">
        <li
          :key="node.label"
          class="node"
          :class="{ 'node--accent': node.accent }"
        >
          <span class="node-label">{{ node.label }}</span>
          <span class="node-desc">{{ node.desc }}</span>
          <span v-if="node.sub && node.sub.length" class="node-sub">
            <span v-for="s in node.sub" :key="s" class="node-sub-chip">{{
              s
            }}</span>
          </span>
        </li>
        <li
          v-if="idx < nodes.length - 1"
          :key="`arrow-${idx}`"
          class="arrow"
          aria-hidden="true"
        >
          <span class="arrow-line"></span>
          <span class="arrow-head">▾</span>
        </li>
      </template>
    </ol>
  </div>
</template>

<script>
export default {
  name: "ArchitectureDiagram",
  props: {
    nodes: {
      type: Array,
      default: () => [
        {
          label: "사용자 질문",
          desc: "사내 시스템(JSP)에서 WebSocket으로 질문 전송",
        },
        {
          label: "LangGraph 워크플로우",
          desc: "RAG 파이프라인의 단계별 흐름을 그래프로 오케스트레이션",
        },
        {
          label: "Hybrid Search",
          desc: "Qdrant에서 의미 기반·키워드 기반 검색을 동시에 수행",
          sub: ["Dense (임베딩)", "Sparse (BM25)"],
          accent: true,
        },
        {
          label: "Reranker",
          desc: "검색 결과를 관련성 기준으로 재정렬해 상위 문서 품질 향상",
          accent: true,
        },
        {
          label: "Ollama (Gemma)",
          desc: "로컬 LLM으로 답변 생성 — 사내 데이터 외부 미전송",
        },
        {
          label: "스트리밍 응답",
          desc: "WebSocket으로 한 글자씩 타이핑되며 체감 속도 개선",
        },
      ],
    },
  },
};
</script>

<style lang="stylus" scoped>
.diagram
    background var(--color-bg-soft)
    border 1px solid var(--color-border)
    border-radius var(--radius-card)
    padding 28px 24px

.flow
    list-style none
    display flex
    flex-direction column
    align-items stretch
    max-width 440px
    margin 0 auto

.node
    display flex
    flex-direction column
    gap 6px
    background var(--color-bg)
    border 1px solid var(--color-border)
    border-radius var(--radius-card)
    box-shadow var(--shadow-card)
    padding 16px 18px

    &--accent
        border-color var(--color-accent-border)
        background var(--color-accent-light)

.node-label
    font-size 15px
    font-weight 600
    color var(--color-text)
    letter-spacing -0.01em

.node-desc
    font-size 13px
    color var(--color-text-secondary)
    line-height 1.55

.node-sub
    display flex
    flex-wrap wrap
    gap 6px
    margin-top 4px

.node-sub-chip
    font-size 11px
    font-weight 500
    color var(--color-accent)
    background var(--color-bg)
    border 1px solid var(--color-accent-border)
    padding 2px 9px
    border-radius var(--radius-tag)

.arrow
    display flex
    flex-direction column
    align-items center
    justify-content center
    height 28px
    color var(--color-accent)

.arrow-line
    width 2px
    height 14px
    background var(--color-accent-border)

.arrow-head
    font-size 13px
    line-height 1
    margin-top -2px

@media (max-width 640px)
    .diagram
        padding 20px 14px

    .node
        padding 14px 14px
</style>
