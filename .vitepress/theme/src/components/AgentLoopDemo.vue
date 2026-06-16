<script lang="ts" setup>
import URI from 'urijs'
import { computed, ref, watchEffect } from 'vue'
import { initLang, isDarkTheme, parseCommonQuery } from './utils'
import { inBrowser, useData } from 'vitepress'

const props = defineProps(['agentspace', 'region'])
const region = props.region ?? 'cn-hongkong'
const agentspace = props.agentspace ?? 'al-playground-cn-hongkong'
const demoService = 'https://agentloop-demo-ytovjpywyc.cn-shanghai.fcapp.run'
const serviceConsoleOrigin = 'https://agentloop4service.console.aliyun.com'
const productionUrl = 'https://agentloop.console.aliyun.com'

function normalizeAgentLoopDest(dest: string) {
  if (!/^https?:\/\//.test(dest)) {
    return dest
  }

  try {
    const url = new URL(dest)
    return `${url.pathname}${url.search}${url.hash}`
  } catch (e) {
    return dest
  }
}

function replaceDestinationOrigin(loginUrl: string) {
  try {
    const url = new URL(loginUrl)
    const destination = url.searchParams.get('Destination')
    if (destination == null) {
      return loginUrl
    }

    const destinationUrl = new URL(destination)
    const targetOrigin = new URL(serviceConsoleOrigin)
    destinationUrl.protocol = targetOrigin.protocol
    destinationUrl.host = targetOrigin.host
    url.searchParams.set('Destination', destinationUrl.toString())
    return url.toString()
  } catch (e) {
    return loginUrl
  }
}

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
    const defaultDest = `${serviceConsoleOrigin}/agentloop/region/${region}/agentspace/${agentspace}/app/agent-insight?hiddenSwitch=true&hiddenBackHome=true`

    return {
      dest: normalizeAgentLoopDest(defaultDest),
      theme: 'default',
      maxWidth: false,
    }
  }

  return {
    dest: normalizeAgentLoopDest(queries.dest),
    theme: isDarkTheme() ? 'dark' : 'default',
    maxWidth: queries.maxWidth === true,
  }
})

const { isShare } = parseCommonQuery()

const tip = ref(
  isShare
    ? ''
    : lang.value === 'en'
    ? 'This is a demo environment. For production, please visit: '
    : '当前为演示环境，AgentLoop 生产地址为：'
)

let dest = ref('')

watchEffect(async () => {
  if (inBrowser) {
    console.log(params.value.dest)
    const target = params.value.dest.includes('?')
      ? encodeURIComponent(params.value.dest)
      : params.value.dest

    const response = await fetch(`${demoService}?dest=${target}`)
    const json = await response.json()
    if (json.success) {
      dest.value = replaceDestinationOrigin(json.data.url)
    }
  }
})
</script>

<template>
  <div class="container">
    <iframe
      v-if="dest !== ''"
      :src="dest"
      :class="{ frame: true, 'max-width': params.maxWidth }"
      allow="clipboard-read *; clipboard-write *"
    >
    </iframe>
    <div class="tip" v-if="tip">
      {{ tip }}<a :href="productionUrl" target="_blank">{{ productionUrl }}</a>
    </div>
  </div>
</template>

<style scoped>
.container {
  height: calc(100vh - (var(--sls-topnav-height)));
  width: 100vw;
  position: relative;
}

.tip {
  position: absolute;
  top: 6px;
  color: red;
  width: 100%;
  text-align: center;
  padding: 10px 16px;
  font-size: 18px;
  pointer-events: none;
}

.tip a {
  color: #1890ff;
  text-decoration: underline;
  pointer-events: auto;
}

.tip a:hover {
  color: #40a9ff;
}

.frame {
  height: calc(100vh - (var(--sls-topnav-height)));
  width: 100vw;
  border: none;
  outline: none;
  margin: auto;
}

.max-width {
  max-width: var(--sls-page-max-width);
}

.dark .frame {
  background-color: var(--vt-c-bg);
}
</style>
