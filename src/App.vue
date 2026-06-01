<template>
  <div id="app">
    <header class="header">
      <nav class="nav">
        <router-link to="/" class="nav-logo">홈</router-link>
        <div class="nav-links">
          <router-link to="/projects">Projects</router-link>
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
    --color-text #37352f
    --color-text-secondary #5d5b54
    --color-text-muted #787671
    --color-text-placeholder #bbb8b1
    --color-bg #ffffff
    --color-bg-subtle #f6f5f4
    --color-bg-soft #fafaf9
    --color-border #e5e3df
    --color-accent #5645d4
    --color-accent-light rgba(86, 69, 212, 0.08)
    --shadow-card rgba(15, 15, 15, 0.08) 0px 4px 12px 0px
    --shadow-elevated rgba(15, 15, 15, 0.20) 0px 8px 24px -4px
    --radius-card 12px
    --radius-btn 8px
    --radius-tag 4px

*
    box-sizing border-box
    margin 0
    padding 0

body
    font-family "Inter", -apple-system, BlinkMacSystemFont, sans-serif
    font-size 16px
    color var(--color-text)
    background var(--color-bg)
    line-height 1.55
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
            background var(--color-bg-subtle)
            color var(--color-text)

        &.router-link-exact-active
            background var(--color-bg-subtle)
            color var(--color-text)
            font-weight 500

.main
    max-width 760px
    margin 0 auto
    padding 56px 24px 96px
</style>
