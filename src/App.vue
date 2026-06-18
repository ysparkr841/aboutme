<template>
  <div id="app">
    <header class="header">
      <nav class="nav">
        <router-link to="/" class="nav-logo">홈</router-link>
        <div class="nav-links">
          <router-link to="/projects">Projects</router-link>
          <router-link to="/now">Now</router-link>
          <router-link to="/contact">Contact</router-link>
        </div>
      </nav>
    </header>
    <main class="main">
      <router-view />
    </main>
  </div>
</template>

<script>
export default {
  name: "App",
};
</script>

<style lang="stylus">
:root
    --color-text #212124
    --color-text-secondary #4d5159
    --color-text-muted #868b94
    --color-text-placeholder #adb1ba
    --color-bg #ffffff
    --color-bg-subtle #f7f8f9
    --color-bg-soft #fafbfc
    --color-border #eaebee
    --color-accent #ff6f0f
    --color-accent-hover #e55f00
    --color-accent-light rgba(255, 111, 15, 0.08)
    --color-accent-border rgba(255, 111, 15, 0.22)
    --shadow-card rgba(0, 0, 0, 0.06) 0px 2px 8px 0px
    --shadow-elevated rgba(0, 0, 0, 0.12) 0px 8px 24px -4px
    --radius-card 16px
    --radius-btn 10px
    --radius-tag 6px

*
    box-sizing border-box
    margin 0
    padding 0

body
    font-family "Pretendard", -apple-system, BlinkMacSystemFont, "Apple SD Gothic Neo", "Segoe UI", "Malgun Gothic", sans-serif
    font-size 16px
    color var(--color-text)
    background var(--color-bg)
    line-height 1.65
    -webkit-font-smoothing antialiased

a
    color inherit
    text-decoration none

.header
    position sticky
    top 0
    z-index 100
    background rgba(255, 255, 255, 0.85)
    backdrop-filter blur(12px)
    border-bottom 1px solid var(--color-border)

.nav
    max-width 760px
    margin 0 auto
    padding 0 24px
    height 52px
    display flex
    align-items center
    justify-content space-between

.nav-logo
    font-weight 600
    font-size 14px
    letter-spacing -0.01em
    color var(--color-text)

.nav-links
    display flex
    gap 4px
    font-size 14px

    a
        padding 5px 10px
        border-radius var(--radius-btn)
        color var(--color-text-secondary)
        transition background 0.12s, color 0.12s

        &:hover
            background var(--color-accent-light)
            color var(--color-accent)

        &.router-link-exact-active
            background var(--color-accent-light)
            color var(--color-accent)
            font-weight 600

.main
    max-width 760px
    margin 0 auto
    padding 56px 24px 96px
</style>
