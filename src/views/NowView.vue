<template>
  <div class="now-view">
    <div class="container">
      <section class="page-header">
        <div class="page-header-top">
          <h1 class="page-title">Now</h1>
          <span class="updated-badge">2026년 6월</span>
        </div>
        <p class="page-desc">지금 이 순간 저는 어떤 사람인가 — 스냅샷입니다.</p>
      </section>

      <div class="layout">
        <nav class="tab-nav">
          <button
            v-for="tab in tabs"
            :key="tab.id"
            :class="['tab-btn', { active: activeTab === tab.id }]"
            @click="selectTab(tab.id)"
          >
            <span class="tab-label">{{ tab.label }}</span>
            <span class="tab-count">{{ getItems(tab.id).length }}</span>
          </button>
        </nav>

        <div class="content-area">
          <transition name="tab-fade" mode="out-in">
            <div :key="activeTab" class="item-list">
              <div
                v-for="item in currentItems"
                :key="item.title"
                :class="[
                  'item-card',
                  { expanded: expandedItem === item.title },
                ]"
                @click="toggleItem(item.title)"
              >
                <div class="item-header">
                  <div class="item-header-left">
                    <h3 class="item-title">{{ item.title }}</h3>
                    <span
                      v-if="item.statusLabel"
                      :class="['status-badge', `status-${item.status}`]"
                      >{{ item.statusLabel }}</span
                    >
                    <span v-if="item.type" class="type-badge">{{
                      item.type
                    }}</span>
                  </div>
                  <span class="expand-toggle">{{
                    expandedItem === item.title ? "−" : "+"
                  }}</span>
                </div>
                <p class="item-desc">{{ item.desc }}</p>
                <div v-if="item.tags && item.tags.length" class="item-tags">
                  <span v-for="tag in item.tags" :key="tag" class="chip">{{
                    tag
                  }}</span>
                </div>

                <transition name="expand">
                  <div
                    v-if="
                      expandedItem === item.title &&
                      (item.detail || (item.images && item.images.length))
                    "
                    class="item-detail"
                    @click.stop
                  >
                    <div v-if="item.journeySteps" class="journey-steps">
                      <div
                        v-for="(step, i) in item.journeySteps"
                        :key="step.name"
                        :class="[
                          'journey-step',
                          { active: i === item.journeySteps.length - 1 },
                        ]"
                      >
                        <span class="step-name">{{ step.name }}</span>
                        <span class="step-sub">{{ step.sub }}</span>
                      </div>
                    </div>
                    <template v-if="item.detail">
                      <p
                        v-for="(para, i) in item.detail.trim().split('\n\n')"
                        :key="i"
                        class="detail-para"
                      >
                        {{ para }}
                      </p>
                    </template>
                    <div
                      v-if="item.images && item.images.length"
                      class="detail-images"
                    >
                      <div
                        v-for="img in item.images"
                        :key="img.src"
                        class="detail-img-wrap"
                        @click="openImage(img)"
                      >
                        <img :src="img.src" :alt="img.alt" class="detail-img" />
                        <span v-if="img.caption" class="detail-img-caption">{{
                          img.caption
                        }}</span>
                      </div>
                    </div>
                  </div>
                </transition>
              </div>
            </div>
          </transition>
        </div>
      </div>
    </div>

    <transition name="fade">
      <div v-if="lightbox" class="lightbox" @click="lightbox = null">
        <img :src="lightbox.src" :alt="lightbox.alt" class="lightbox-img" />
        <span v-if="lightbox.caption" class="lightbox-caption">{{
          lightbox.caption
        }}</span>
      </div>
    </transition>
  </div>
</template>

<script>
import nowData from "@/data/now.js";

export default {
  name: "NowView",
  data() {
    return {
      activeTab: "work",
      expandedItem: null,
      lightbox: null,
      tabs: nowData.tabs,
      work: nowData.work,
      interests: nowData.interests,
      next: nowData.next,
    };
  },
  computed: {
    currentItems() {
      return this.getItems(this.activeTab);
    },
  },
  methods: {
    getItems(tabId) {
      return this[tabId] || [];
    },
    selectTab(tabId) {
      this.activeTab = tabId;
      this.expandedItem = null;
    },
    toggleItem(title) {
      this.expandedItem = this.expandedItem === title ? null : title;
    },
    openImage(img) {
      this.lightbox = img;
    },
  },
};
</script>

<style lang="stylus" scoped>
.now-view
  padding 48px 24px 80px

.container
  max-width 760px
  margin 0 auto

// ── Header ───────────────────────────────────────────
.page-header
  margin-bottom 36px

.page-header-top
  display flex
  align-items baseline
  gap 12px
  margin-bottom 8px

.page-title
  font-size 32px
  font-weight 700
  letter-spacing -0.03em
  color var(--color-text)

.updated-badge
  font-size 12px
  color var(--color-text-muted)
  background var(--color-bg-subtle)
  border 1px solid var(--color-border)
  border-radius 20px
  padding 2px 10px

.page-desc
  font-size 16px
  color var(--color-text-secondary)
  line-height 1.6

// ── Layout ───────────────────────────────────────────
.layout
  display flex
  gap 28px
  align-items flex-start

// ── Tab Nav ──────────────────────────────────────────
.tab-nav
  flex-shrink 0
  width 148px
  position sticky
  top 68px
  display flex
  flex-direction column
  gap 2px

.tab-btn
  width 100%
  display flex
  align-items center
  justify-content space-between
  padding 8px 12px
  border none
  border-radius 10px
  background transparent
  cursor pointer
  text-align left
  transition background 0.12s, color 0.12s
  color var(--color-text-secondary)
  font-size 13px
  font-family inherit

  &:hover
    background var(--color-bg-subtle)
    color var(--color-text)

  &.active
    background var(--color-accent-light)
    color var(--color-accent)
    font-weight 600

    .tab-count
      background var(--color-accent)
      color #fff

.tab-label
  flex 1

.tab-count
  font-size 11px
  font-weight 600
  background var(--color-bg-subtle)
  border-radius 20px
  padding 1px 6px
  color var(--color-text-muted)
  transition background 0.12s, color 0.12s

// ── Content Area ─────────────────────────────────────
.content-area
  flex 1
  min-width 0

.item-list
  display flex
  flex-direction column
  gap 8px

// ── Item Card ────────────────────────────────────────
.item-card
  border 1px solid var(--color-border)
  border-radius var(--radius-card)
  padding 18px 20px
  cursor pointer
  transition border-color 0.15s, box-shadow 0.15s

  &:hover
    border-color var(--color-accent-border)
    box-shadow var(--shadow-card)

  &.expanded
    border-color var(--color-accent-border)
    box-shadow var(--shadow-card)

.item-header
  display flex
  align-items flex-start
  justify-content space-between
  gap 12px
  margin-bottom 8px

.item-header-left
  display flex
  align-items center
  flex-wrap wrap
  gap 8px
  flex 1

.item-title
  font-size 14px
  font-weight 600
  color var(--color-text)

.expand-toggle
  font-size 16px
  color var(--color-text-muted)
  flex-shrink 0
  line-height 1
  margin-top 1px
  transition color 0.12s

  .expanded &
    color var(--color-accent)

.item-desc
  font-size 13px
  color var(--color-text-secondary)
  line-height 1.6
  margin-bottom 10px

.item-tags
  display flex
  flex-wrap wrap
  gap 6px

.chip
  font-size 11px
  color var(--color-text-muted)
  background var(--color-bg-subtle)
  border 1px solid var(--color-border)
  border-radius var(--radius-tag)
  padding 2px 8px

// ── Status / Type Badges ─────────────────────────────
.status-badge
  font-size 11px
  font-weight 500
  border-radius 20px
  padding 2px 8px

  &.status-done
    background rgba(34, 197, 94, 0.1)
    color #16a34a

  &.status-ongoing
    background var(--color-accent-light)
    color var(--color-accent)

.type-badge
  font-size 11px
  color var(--color-text-muted)
  background var(--color-bg-subtle)
  border 1px solid var(--color-border)
  border-radius 20px
  padding 2px 8px

// ── Expanded Detail ───────────────────────────────────
.item-detail
  margin-top 14px
  padding-top 14px
  border-top 1px solid var(--color-border)

.detail-para
  font-size 13px
  color var(--color-text-secondary)
  line-height 1.7
  margin-bottom 10px

  &:last-child
    margin-bottom 0

// ── Journey Steps (inside detail) ────────────────────
.journey-steps
  display flex
  flex-direction column
  gap 0
  margin-bottom 14px

.journey-step
  display flex
  flex-direction column
  gap 4px
  padding 10px 14px
  border-radius 8px
  background var(--color-bg-subtle)
  border 1px solid var(--color-border)
  position relative
  margin-bottom 20px

  &::after
    content "↓"
    position absolute
    left 50%
    bottom -18px
    transform translateX(-50%)
    font-size 13px
    color var(--color-text-muted)
    line-height 1

  &:last-child
    margin-bottom 0

    &::after
      display none

  &.active
    background var(--color-accent-light)
    border-color var(--color-accent-border)

    .step-name
      color var(--color-accent)

    &::before
      content ""
      position absolute
      left 14px
      top 50%
      transform translateY(-50%)
      width 4px
      height 4px
      border-radius 50%
      background var(--color-accent)

.step-name
  font-size 12px
  font-weight 600
  color var(--color-text-secondary)

.step-sub
  font-size 11px
  color var(--color-text-muted)

// ── Detail Images ─────────────────────────────────────
.detail-images
  display grid
  grid-template-columns repeat(auto-fill, minmax(160px, 1fr))
  gap 10px
  margin-top 14px

.detail-img-wrap
  cursor pointer
  border-radius 8px
  overflow hidden
  border 1px solid var(--color-border)
  transition box-shadow 0.15s

  &:hover
    box-shadow var(--shadow-card)

.detail-img
  width 100%
  display block
  aspect-ratio 16 / 10
  object-fit cover

.detail-img-caption
  display block
  font-size 11px
  color var(--color-text-muted)
  padding 6px 8px
  background var(--color-bg-subtle)

// ── Lightbox ──────────────────────────────────────────
.lightbox
  position fixed
  inset 0
  background rgba(0, 0, 0, 0.82)
  z-index 200
  display flex
  flex-direction column
  align-items center
  justify-content center
  padding 24px
  cursor pointer

.lightbox-img
  max-width 100%
  max-height 80vh
  border-radius 8px
  object-fit contain

.lightbox-caption
  margin-top 12px
  font-size 13px
  color rgba(255, 255, 255, 0.7)

// ── Transitions ───────────────────────────────────────
.tab-fade-enter-active,
.tab-fade-leave-active
  transition opacity 0.15s ease

.tab-fade-enter,
.tab-fade-leave-to
  opacity 0

.expand-enter-active
  transition opacity 0.2s ease, transform 0.2s ease

.expand-leave-active
  transition opacity 0.15s ease

.expand-enter
  opacity 0
  transform translateY(-6px)

.expand-leave-to
  opacity 0

.fade-enter-active,
.fade-leave-active
  transition opacity 0.2s ease

.fade-enter,
.fade-leave-to
  opacity 0

// ── Responsive ───────────────────────────────────────
@media (max-width 640px)
  .now-view
    padding 32px 16px 64px

  .page-title
    font-size 26px

  .layout
    flex-direction column
    gap 0

  .tab-nav
    width 100%
    position static
    flex-direction row
    overflow-x auto
    padding-bottom 12px
    margin-bottom 16px
    gap 6px
    -webkit-overflow-scrolling touch
    scrollbar-width none

    &::-webkit-scrollbar
      display none

  .tab-btn
    flex-shrink 0
    width auto
    white-space nowrap
</style>
