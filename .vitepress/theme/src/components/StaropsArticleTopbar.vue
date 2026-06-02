<script setup lang="ts">
import { computed } from 'vue'
import { useData } from 'vitepress'

const { frontmatter } = useData()

const pageClass = computed(() => frontmatter.value.pageClass || '')
const isStaropsHome = computed(() => pageClass.value === 'sls-starops-home')
const isStaropsArticle = computed(() => pageClass.value === 'sls-starops-article')
</script>

<template>
  <header v-if="isStaropsHome" class="sls-starops-topbar sls-starops-topbar--home">
    <div class="sls-starops-topbar__inner">
      <span class="sls-starops-topbar__brand">
        <a class="sls-starops-topbar__brand-main" href="/doc/starops/index.html">
          <span class="sls-starops-topbar__mark"></span>
          <span>STAROps</span>
        </a>
        <span class="sls-starops-topbar__brand-sep">·</span>
        <a class="sls-starops-topbar__subbrand" href="/doc/index.html">阿里云可观测</a>
      </span>
      <nav class="sls-starops-topbar__links" aria-label="STAROps Navigation">
        <a class="is-active" href="/doc/starops/index.html">最佳实践</a>
        <a href="https://starops.console.aliyun.com" target="_blank" rel="noreferrer">控制台</a>
        <a class="sls-starops-topbar__cta sls-starops-topbar__cta--ghost" href="/doc/index.html">↗ 现有案例中心</a>
      </nav>
      <a class="sls-starops-topbar__cta sls-starops-topbar__cta--primary" href="https://starops.console.aliyun.com" target="_blank" rel="noreferrer">进入控制台</a>
    </div>
  </header>

  <header v-else-if="isStaropsArticle" class="sls-starops-topbar sls-starops-topbar--article">
    <div class="sls-starops-topbar__inner">
      <a class="sls-starops-topbar__brand" href="/doc/starops/index.html">
        <span class="sls-starops-topbar__mark"></span>
        <span>STAROps 实践</span>
      </a>
      <div class="sls-starops-topbar__crumb">
        <a href="/doc/index.html">案例中心</a>
        <span class="sep">/</span>
        <a href="/doc/starops/index.html">STAROps</a>
        <span class="sep">/</span>
        <span>场景实践</span>
      </div>
      <a class="sls-starops-topbar__cta" href="/doc/starops/index.html">← 返回 STAROps 子站点</a>
    </div>
  </header>
</template>
