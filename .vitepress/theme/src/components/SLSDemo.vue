<script lang="ts" setup>
import URI from 'urijs'
import { computed, ref, watchEffect } from 'vue'
import { initLang, isDarkTheme, parseCommonQuery } from './utils'
import { inBrowser, useData } from 'vitepress'

const assistantId = 'starops-demo'
const withAssistantParams = (dest: string) =>
  URI(dest)
    .setSearch({
      fixedAssistantId: assistantId,
      assistantId,
      staropsClusterRegion: 'cn-beijing',
    })
    .toString()

const { lang } = useData()
watchEffect(() => {
  if (inBrowser) {
    initLang(lang.value)
  }
})

const params = computed(() => {
  const search = inBrowser ? window.location.search : ''
  const queries = URI(search).query(true)

  if (queries == null || queries.dest == null) {
    return {
      dest: withAssistantParams('/lognext/profile'),
      theme: 'default',
      maxWidth: false,
    }
  }

  return {
    dest: withAssistantParams(queries.dest),
    theme: isDarkTheme() ? 'dark' : 'default',
    maxWidth: queries.maxWidth === true,
  }
})

const { isShare } = parseCommonQuery()

const productionUrl = 'https://sls.console.aliyun.com/lognext/profile'

const tip = computed(() => {
  if (isShare) {
    return null
  }

  return lang.value === 'en'
    ? {
        prefix: 'The current data is for demonstration purposes only. ',
        linkText: 'SLS console',
        suffix: '',
      }
    : {
        prefix: '当前为演示数据，请勿用于生产，',
        linkText: 'SLS 控制台地址',
        suffix: '',
      }
})

let dest = ref('')

watchEffect(async () => {
  if (inBrowser) {
    if (!params.value.dest.startsWith('/lognext')) {
      console.error('dest is not start with /lognext')
      return
    }

    const response = await fetch(`https://new-share-sls-demo-mptiifapvo.cn-shanghai.fcapp.run`)
    const json = await response.json()
    if (json.success) {
      const hasQm = params.value.dest.indexOf('?') > -1
      const destUrl = `https://sls.console.aliyun.com${params.value.dest}${
        hasQm ? '&' : '?'
      }sls_ticket=${json.data.ticket}&theme=${params.value.theme}`
      dest.value = destUrl
    }
  }
})
</script>

<template>
  <div class="container">
    <div class="tip" v-if="tip">
      <span>{{ tip.prefix }}</span>
      <a :href="productionUrl" target="_blank" rel="noopener noreferrer">
        {{ tip.linkText }}
      </a>
      <span>{{ tip.suffix }}</span>
    </div>
    <iframe
      v-if="dest !== ''"
      :src="dest"
      :class="{ frame: true, 'max-width': params.maxWidth }"
      allow="clipboard-read *; clipboard-write *"
    >
    </iframe>
  </div>
</template>

<style scoped>
.container {
  height: calc(100vh - (var(--sls-topnav-height)));
  width: 100vw;
  position: relative;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.tip {
  flex: 0 0 auto;
  box-sizing: border-box;
  color: #d4380d;
  background: rgba(255, 247, 230, 0.96);
  border-bottom: 1px solid rgba(250, 173, 20, 0.35);
  width: 100%;
  text-align: center;
  padding: 6px 16px;
  font-size: 14px;
  line-height: 20px;
  z-index: 1;
}

.tip a {
  color: #1677ff;
  font-weight: 500;
  text-decoration: none;
  text-underline-offset: 3px;
}

.tip a:hover,
.tip a:focus-visible {
  color: #40a9ff;
  text-decoration: underline;
}

.frame {
  flex: 1 1 auto;
  min-height: 0;
  height: 100%;
  width: 100%;
  border: none;
  outline: none;
  display: block;
  margin: 0 auto;
}

.max-width {
  max-width: var(--sls-page-max-width);
}

.dark .frame {
  background-color: var(--vt-c-bg);
}
</style>
