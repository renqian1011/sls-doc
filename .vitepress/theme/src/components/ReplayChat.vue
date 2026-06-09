<script setup lang="ts">
import { inBrowser, withBase } from 'vitepress'
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'

const COPILOT_APP_ID = 'obviz-app-copilot'
const DEFAULT_APP_REPO_NAME = 'observability/obviz-app-copilot'
const DEFAULT_APP_VERSION = '0.0.112'
const DEFAULT_TOKEN_URL = 'https://cms-demo-ticket-duulhxdgtb.cn-shanghai.fcapp.run/token'

type ReplayChatResult = {
  success: boolean
  message?: unknown
  data?: unknown
  code?: string
  requestId?: string
  rawResponseError?: unknown
}

const props = withDefaults(
  defineProps<{
    src?: string
    data?: ReplayChatResult | { getThreadDataResult?: ReplayChatResult }
    manifest?: string
    appRepoName?: string
    appVersion?: string
    entry?: string
    exportName?: string
    tokenUrl?: string
    workspace?: string
    region?: string
    defaultRegion?: string
    project?: string
    employee?: string
    curDigitalEmployee?: string
    height?: string
    padding?: string
  }>(),
  {
    tokenUrl: DEFAULT_TOKEN_URL,
    entry: 'copilot',
    exportName: 'ReplayChat',
    region: 'cn-hongkong',
    defaultRegion: 'cn-hongkong',
    height: 'calc(100vh - var(--vp-nav-height, var(--sls-topnav-height)))',
    padding: '8px',
  }
)

const mountRef = ref<HTMLElement | null>(null)
const loading = ref(true)
const error = ref('')

let mounted = false
let ReactModule: any
let ReactDOMModule: any
let renderVersion = 0
let tokenPromise: Promise<string | undefined> | null = null
let cachedToken = ''
let cachedTokenUrl = ''

const containerStyle = computed(() => ({
  height: props.height,
  padding: props.padding,
}))

function getErrorMessage(errorValue: unknown): string {
  if (errorValue instanceof Error) return errorValue.message
  if (typeof errorValue === 'string') return errorValue
  return 'ReplayChat 加载失败'
}

function normalizeResult(payload: any): ReplayChatResult {
  const result = payload?.getThreadDataResult ?? payload
  if (!result || typeof result !== 'object') {
    throw new Error('ReplayChat 需要 src 或 data 提供 getThreadDataResult 数据')
  }
  return result
}

async function fetchReplayData(): Promise<ReplayChatResult> {
  if (props.data) return normalizeResult(props.data)
  if (!props.src) {
    throw new Error('ReplayChat 需要配置 src')
  }

  const response = await fetch(resolveReplayDataUrl(props.src))
  if (!response.ok) {
    throw new Error(`ReplayChat 数据加载失败：${response.status} ${response.statusText}`)
  }
  return normalizeResult(await response.json())
}

function resolveReplayDataUrl(src: string): string {
  if (/^(https?:)?\/\//.test(src)) return src
  return withBase(src.startsWith('/') ? src : `/${src}`)
}

function resolveManifest(): string | undefined {
  if (props.manifest) return props.manifest
  if (!import.meta.env.DEV) return undefined
  return `https://g.alicdn.com/${props.appRepoName || DEFAULT_APP_REPO_NAME}/${
    props.appVersion || DEFAULT_APP_VERSION
  }/assets.json`
}

function ensureLocalConsoleConfig() {
  if (!inBrowser || !import.meta.env.DEV) return

  const win = window as any
  win.ALIYUN_CONSOLE_CONFIG = {
    ...win.ALIYUN_CONSOLE_CONFIG,
    ENV: 'pre',
    LOCAL: true,
  }
}

function resolveTokenValue(payload: any): string | undefined {
  const data = payload?.data ?? payload
  const token = data?.ticket ?? data?.token ?? data?.accessToken ?? data?.slsAccessToken
  return typeof token === 'string' && token ? token : undefined
}

async function getSlsAccessToken(): Promise<string | undefined> {
  const tokenUrl = props.tokenUrl || DEFAULT_TOKEN_URL
  if (cachedToken && cachedTokenUrl === tokenUrl) return cachedToken
  if (!tokenPromise) {
    tokenPromise = fetch(tokenUrl)
      .then(async (response) => {
        if (!response.ok) return undefined
        const token = resolveTokenValue(await response.json())
        if (token) {
          cachedToken = token
          cachedTokenUrl = tokenUrl
        }
        return token
      })
      .catch(() => undefined)
      .finally(() => {
        tokenPromise = null
      })
  }
  return tokenPromise
}

async function ensureReactRuntime() {
  if (ReactModule && ReactDOMModule) return

  const [react, reactDom] = await Promise.all([import('react'), import('react-dom')])
  ReactModule = (react as any).default ?? react
  ReactDOMModule = (reactDom as any).default ?? reactDom
}

async function renderReplayChat() {
  if (!inBrowser || !mountRef.value) return

  const currentVersion = ++renderVersion
  loading.value = true
  error.value = ''
  ensureLocalConsoleConfig()

  try {
    const [result, loaderProxy] = await Promise.all([
      fetchReplayData(),
      import('@aliyun-obv/app-loader-proxy'),
      ensureReactRuntime(),
    ]).then(([result, loaderProxy]) => [result, loaderProxy] as const)

    if (!mounted || currentVersion !== renderVersion || !mountRef.value) return

    loaderProxy.setSlsAccessTokenGetter(getSlsAccessToken)
    const manifest = resolveManifest()
    const loaderOptions: {
      id: string
      entry?: string
      manifest?: string
      slsEnv?: boolean
      deps: Record<string, never>
    } = {
      id: COPILOT_APP_ID,
      entry: props.entry,
      slsEnv: true,
      deps: {},
    }
    if (manifest) {
      loaderOptions.manifest = manifest
    }
    const loader = loaderProxy.createAppLoader(loaderOptions)
    const ReplayChat = loader.loadComponent(props.exportName)

    ReactDOMModule.render(
      ReactModule.createElement(ReplayChat, {
        getThreadDataResult: result,
        contextProps: {
          project: props.project,
          workspace: props.workspace,
          region: props.region,
          defaultRegion: props.defaultRegion || props.region,
        },
        curDigitalEmployee: props.curDigitalEmployee || props.employee,
        style: {
          height: '100%',
          minHeight: 0,
          background: '#fff',
        },
      }),
      mountRef.value
    )
    loading.value = false
  } catch (err) {
    if (!mounted || currentVersion !== renderVersion) return
    error.value = getErrorMessage(err)
    loading.value = false
    if (mountRef.value && ReactDOMModule?.unmountComponentAtNode) {
      ReactDOMModule.unmountComponentAtNode(mountRef.value)
    }
  }
}

onMounted(() => {
  mounted = true
  nextTick(renderReplayChat)
})

onBeforeUnmount(() => {
  mounted = false
  renderVersion += 1
  if (mountRef.value && ReactDOMModule?.unmountComponentAtNode) {
    ReactDOMModule.unmountComponentAtNode(mountRef.value)
  }
})

watch(
  () => ({
    src: props.src,
    data: props.data,
    manifest: props.manifest,
    appRepoName: props.appRepoName,
    appVersion: props.appVersion,
    tokenUrl: props.tokenUrl,
    entry: props.entry,
    exportName: props.exportName,
    workspace: props.workspace,
    region: props.region,
    defaultRegion: props.defaultRegion,
    project: props.project,
    employee: props.employee,
    curDigitalEmployee: props.curDigitalEmployee,
  }),
  () => {
    if (mounted) renderReplayChat()
  },
  { deep: true }
)

watch(
  mountRef,
  (el) => {
    if (mounted && el) renderReplayChat()
  },
  { flush: 'post' }
)
</script>

<template>
  <ClientOnly>
    <div class="sls-replay-chat" :style="containerStyle">
      <div ref="mountRef" class="sls-replay-chat__mount"></div>
      <div v-if="loading" class="sls-replay-chat__state">Loading ReplayChat...</div>
      <div v-if="error" class="sls-replay-chat__state sls-replay-chat__state--error">
        {{ error }}
      </div>
    </div>
  </ClientOnly>
</template>

<style scoped>
.sls-replay-chat {
  position: relative;
  width: 100%;
  min-height: 360px;
  box-sizing: border-box;
  overflow: hidden;
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  background: #fff;
}

.sls-replay-chat__mount {
  width: 100%;
  height: 100%;
  min-height: 0;
  overflow: hidden;
  border-radius: 6px;
}

.sls-replay-chat__mount :deep(> div) {
  height: 100%;
  min-height: 0;
}

.sls-replay-chat__state {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  color: var(--vp-c-text-2);
  background: rgba(255, 255, 255, 0.92);
  font-size: 14px;
}

.sls-replay-chat__state--error {
  color: var(--vp-c-danger-1);
}
</style>
