<template>
  <div class="gallery" v-if="images && images.length">
    <div class="gallery-grid">
      <button
        v-for="(img, idx) in images"
        :key="img.src"
        type="button"
        class="thumb"
        @click="open(idx)"
      >
        <img
          v-if="!errored[idx]"
          :src="img.src"
          :alt="img.alt || ''"
          class="thumb-img"
          loading="lazy"
          @error="onError(idx)"
        />
        <div v-else class="thumb-placeholder">
          <span class="placeholder-icon">🖼</span>
          <span class="placeholder-text">{{
            img.alt || "이미지 준비 중"
          }}</span>
        </div>
        <span v-if="img.caption" class="thumb-caption">{{ img.caption }}</span>
      </button>
    </div>

    <div v-if="activeIndex !== null" class="lightbox" @click="close">
      <button
        type="button"
        class="lightbox-close"
        @click.stop="close"
        aria-label="닫기"
      >
        ×
      </button>
      <div class="lightbox-inner" @click.stop>
        <img
          v-if="!errored[activeIndex]"
          :src="images[activeIndex].src"
          :alt="images[activeIndex].alt || ''"
          class="lightbox-img"
          @error="onError(activeIndex)"
        />
        <div v-else class="lightbox-placeholder">
          <span class="placeholder-icon">🖼</span>
          <span class="placeholder-text">{{
            images[activeIndex].alt || "이미지 준비 중"
          }}</span>
        </div>
        <p v-if="images[activeIndex].caption" class="lightbox-caption">
          {{ images[activeIndex].caption }}
        </p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "ScreenshotGallery",
  props: {
    images: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      activeIndex: null,
      errored: {},
    };
  },
  methods: {
    open(idx) {
      this.activeIndex = idx;
      document.addEventListener("keydown", this.onKeydown);
    },
    close() {
      this.activeIndex = null;
      document.removeEventListener("keydown", this.onKeydown);
    },
    onKeydown(e) {
      if (e.key === "Escape") {
        this.close();
      }
    },
    onError(idx) {
      this.$set(this.errored, idx, true);
    },
  },
  beforeDestroy() {
    document.removeEventListener("keydown", this.onKeydown);
  },
};
</script>

<style lang="stylus" scoped>
.gallery-grid
    display grid
    grid-template-columns repeat(auto-fill, minmax(180px, 1fr))
    gap 16px

.thumb
    display flex
    flex-direction column
    padding 0
    background var(--color-bg)
    border 1px solid var(--color-border)
    border-radius var(--radius-card)
    box-shadow var(--shadow-card)
    overflow hidden
    cursor pointer
    text-align left
    transition box-shadow 0.15s, transform 0.15s
    font inherit

    &:hover
        box-shadow var(--shadow-elevated)
        transform translateY(-2px)

.thumb-img
    width 100%
    aspect-ratio 16 / 10
    object-fit cover
    display block
    background var(--color-bg-subtle)

.thumb-placeholder
    width 100%
    aspect-ratio 16 / 10
    display flex
    flex-direction column
    align-items center
    justify-content center
    gap 6px
    background var(--color-bg-subtle)
    color var(--color-text-muted)

.placeholder-icon
    font-size 28px
    opacity 0.6

.placeholder-text
    font-size 12px
    color var(--color-text-muted)
    padding 0 12px
    text-align center
    line-height 1.4

.thumb-caption
    font-size 12px
    color var(--color-text-secondary)
    padding 10px 14px
    line-height 1.5

.lightbox
    position fixed
    inset 0
    z-index 1000
    display flex
    align-items center
    justify-content center
    padding 32px
    background rgba(33, 33, 36, 0.82)
    backdrop-filter blur(4px)

.lightbox-close
    position absolute
    top 20px
    right 24px
    width 40px
    height 40px
    border none
    border-radius 50%
    background rgba(255, 255, 255, 0.12)
    color #fff
    font-size 26px
    line-height 1
    cursor pointer
    transition background 0.12s

    &:hover
        background rgba(255, 255, 255, 0.24)

.lightbox-inner
    max-width 880px
    max-height 100%
    display flex
    flex-direction column
    align-items center
    gap 16px

.lightbox-img
    max-width 100%
    max-height 78vh
    object-fit contain
    border-radius var(--radius-card)
    box-shadow var(--shadow-elevated)
    background var(--color-bg)

.lightbox-placeholder
    width 480px
    max-width 100%
    aspect-ratio 16 / 10
    display flex
    flex-direction column
    align-items center
    justify-content center
    gap 8px
    background var(--color-bg)
    border-radius var(--radius-card)
    color var(--color-text-muted)

.lightbox-caption
    font-size 14px
    color #fff
    text-align center
    line-height 1.6
    max-width 640px

@media (max-width 640px)
    .gallery-grid
        grid-template-columns repeat(auto-fill, minmax(140px, 1fr))
        gap 12px

    .lightbox
        padding 16px
</style>
