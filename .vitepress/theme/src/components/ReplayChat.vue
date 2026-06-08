<script setup lang="ts">
import { inBrowser, withBase } from 'vitepress'
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'

const COPILOT_APP_ID = 'obviz-app-copilot'
const DEFAULT_APP_REPO_NAME = 'observability/obviz-app-copilot'
const DEFAULT_APP_VERSION = '0.0.112'
const PRE_STATIC_DOMAIN = 'dev.g.alicdn.com'
const DEFAULT_TOKEN_URL = 'https://cms-demo-ticket-duulhxdgtb.cn-shanghai.fcapp.run/token'

type AppLoaderConfig = {
  app_repo_name: string
  version: string
}

const DEFAULT_APP_CONFIG: Record<string, AppLoaderConfig> = {
  'observability-template-manager': {
    app_repo_name: 'sls/observability-template-manager',
    version: '0.1.121',
  },
  'obviz-core': {
    app_repo_name: 'observability/obviz-core',
    version: '0.5.32',
  },
  'obviz-profiling-explorer': {
    app_repo_name: 'observability/obviz-profiling-explorer',
    version: '0.0.4',
  },
  'obviz-engine': {
    app_repo_name: 'observability/obviz-engine',
    version: '1.12.45',
  },
  'obviz-trace-explorer': {
    app_repo_name: 'observability/obviz-trace-explorer',
    version: '0.0.117',
  },
  [COPILOT_APP_ID]: {
    app_repo_name: DEFAULT_APP_REPO_NAME,
    version: DEFAULT_APP_VERSION,
  },
  'obviz-llm-explorer': {
    app_repo_name: 'observability/obviz-llm-explorer',
    version: '0.0.15',
  },
  'obviz-explorer': {
    app_repo_name: 'observability/obviz-explorer',
    version: '0.0.176',
  },
  'obviz-app-dashboard': {
    app_repo_name: 'observability/obviz-app-dashboard',
    version: '1.1.8',
  },
  'obviz-entity-explorer': {
    app_repo_name: 'observability/obviz-entity-explorer',
    version: '0.0.175',
  },
  'obviz-charts': {
    app_repo_name: 'observability/obviz-charts',
    version: '0.0.33',
  },
  'obviz-system-management': {
    app_repo_name: 'observability/obviz-system-management',
    version: '0.0.4',
  },
  'sls-lsp': {
    app_repo_name: 'sls/sls-lsp',
    version: '0.2.65',
  },
  'alert': {
    app_repo_name: 'observability/alert',
    version: '1.0.74',
  },
  'umodel-explorer': {
    app_repo_name: 'observability/umodel-explorer',
    version: '0.1.32',
  },
  'common-model-spec': {
    app_repo_name: 'observability/common-model-spec',
    version: '0.1.360',
  },
  'obviz-apm-configs': {
    app_repo_name: 'observability/obviz-apm-configs',
    version: '0.0.4',
  },
}

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
    consoleEnv?: 'pre' | 'prod'
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
  }>(),
  {
    tokenUrl: DEFAULT_TOKEN_URL,
    consoleEnv: 'pre',
    entry: 'copilot',
    exportName: 'ReplayChat',
    region: 'cn-hangzhou',
    defaultRegion: 'cn-hangzhou',
    height: '720px',
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
  if (props.consoleEnv === 'pre') return undefined
  if (!import.meta.env.DEV) return undefined
  return `https://g.alicdn.com/${props.appRepoName || DEFAULT_APP_REPO_NAME}/${
    props.appVersion || DEFAULT_APP_VERSION
  }/assets.json`
}

function ensureConsoleConfig() {
  if (!inBrowser || props.consoleEnv !== 'pre') return

  const win = window as any
  win.ALIYUN_CONSOLE_CONFIG = {
    ...win.ALIYUN_CONSOLE_CONFIG,
    ENV: 'pre',
  }
  delete win.ALIYUN_CONSOLE_CONFIG.LOCAL

  const obsConfig = (win.ALIYUN_OBSERVABILITY_CONSOLE_CONFIG =
    win.ALIYUN_OBSERVABILITY_CONSOLE_CONFIG || {})
  obsConfig.slsStaticDomain = PRE_STATIC_DOMAIN

  if (win.ALIYUN_SLS_CONSOLE_CONFIG) {
    win.ALIYUN_SLS_CONSOLE_CONFIG.slsStaticDomain = PRE_STATIC_DOMAIN
  }
}

function ensureAppConfig() {
  if (!inBrowser || resolveManifest()) return

  const appConfig = {
    ...DEFAULT_APP_CONFIG,
    [COPILOT_APP_ID]: {
      app_repo_name: props.appRepoName || DEFAULT_APP_REPO_NAME,
      version: props.appVersion || DEFAULT_APP_VERSION,
    },
  }
  const win = window as any
  const obsConfig = (win.ALIYUN_OBSERVABILITY_CONSOLE_CONFIG =
    win.ALIYUN_OBSERVABILITY_CONSOLE_CONFIG || {})
  obsConfig.appConfig = obsConfig.appConfig || {}
  obsConfig.appConfig = {
    ...appConfig,
    ...obsConfig.appConfig,
  }

  if (win.ALIYUN_SLS_CONSOLE_CONFIG) {
    win.ALIYUN_SLS_CONSOLE_CONFIG.appConfig = win.ALIYUN_SLS_CONSOLE_CONFIG.appConfig || {}
    win.ALIYUN_SLS_CONSOLE_CONFIG.appConfig = {
      ...appConfig,
      ...win.ALIYUN_SLS_CONSOLE_CONFIG.appConfig,
    }
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
  ensureConsoleConfig()
  ensureAppConfig()

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
      deps: Record<string, never>
    } = {
      id: COPILOT_APP_ID,
      entry: props.entry,
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
    consoleEnv: props.consoleEnv,
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
  overflow: hidden;
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  background: #fff;
}

.sls-replay-chat__mount {
  width: 100%;
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
