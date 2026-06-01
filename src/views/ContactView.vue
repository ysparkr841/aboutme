<template>
  <div class="contact">
    <h1 class="page-title">Contact</h1>
    <p class="page-desc">궁금하신 점이 있으시면 언제든지 연락 주세요.</p>
    <div class="contact-card">
      <a
        v-for="item in contacts"
        :key="item.label"
        :href="item.href"
        target="_blank"
        class="contact-item"
      >
        <div class="contact-icon">{{ item.icon }}</div>
        <div class="contact-info">
          <div class="contact-label">{{ item.label }}</div>
          <div class="contact-value">{{ item.value }}</div>
        </div>
        <span class="contact-arrow">→</span>
      </a>
    </div>
  </div>
</template>

<script>
export default {
  name: "ContactView",
  data() {
    return {
      contacts: [
        {
          label: "Email",
          value: "ysparkr1222@naver.com",
          href: "mailto:ysparkr1222@naver.com",
          icon: "✉️",
        },
        {
          label: "GitHub",
          value: "github.com/ysparkr841",
          href: "https://github.com/ysparkr841",
          icon: "🐙",
        },
      ],
    };
  },
};
</script>

<style lang="stylus" scoped>
.page-title
    font-size 22px
    font-weight 700
    letter-spacing -0.01em
    color var(--color-text)
    margin-bottom 8px

.page-desc
    font-size 14px
    color var(--color-text-muted)
    margin-bottom 28px

.contact-card
    background var(--color-bg)
    border 1px solid var(--color-border)
    border-radius var(--radius-card)
    box-shadow var(--shadow-card)
    overflow hidden

.contact-item
    display flex
    align-items center
    gap 16px
    padding 20px 24px
    border-bottom 1px solid var(--color-border)
    transition background 0.12s
    cursor pointer

    &:last-child
        border-bottom none

    &:hover
        background var(--color-bg-soft)

        .contact-arrow
            color var(--color-accent)
            transform translateX(3px)

.contact-icon
    font-size 20px
    width 40px
    height 40px
    background var(--color-bg-subtle)
    border-radius 10px
    display flex
    align-items center
    justify-content center

.contact-info
    flex 1

.contact-label
    font-size 11px
    font-weight 500
    text-transform uppercase
    letter-spacing 0.08em
    color var(--color-text-muted)
    margin-bottom 2px

.contact-value
    font-size 14px
    font-weight 500
    color var(--color-text)

.contact-arrow
    font-size 14px
    color var(--color-text-placeholder)
    transition color 0.12s, transform 0.12s
    display inline-block
</style>
