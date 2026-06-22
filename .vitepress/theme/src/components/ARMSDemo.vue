<script lang="ts" setup>
import { computed, ref, watchEffect } from 'vue'
import { inBrowser, useData } from 'vitepress'
import URI from 'urijs'
import { initLang } from './utils';

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
      dest: '',
      maxWidth: false,
    }
  }

  return {
    dest: queries.dest,
    maxWidth: queries.maxWidth === true,
  }
})

const tip = ref(
  lang.value === 'en'
    ? 'The current data is for demonstration purposes only, please do not use it for production.'
    : '当前为演示数据，请勿用于生产'
)

let dest = ref('')
if (inBrowser) {
  const destination = params.value.dest === '' ? '' : `destination=${params.value.dest}`
  dest.value = `https://arms-unify-demo-arms-unify-demo-awqlqbyvcc.cn-hangzhou.fcapp.run?${destination}`
}

console.log(dest.value)

watchEffect(async () => {
  // if (inBrowser) {
  //   const response = await fetch(`https://new-share-sls-demo-mptiifapvo.cn-shanghai.fcapp.run`)
  //   const json = await response.json()
  //   if (json.success) {
  //     const hasQm = params.value.dest.indexOf('?') > -1
  //     const destUrl = `https://sls.console.aliyun.com${params.value.dest}${
  //       hasQm ? '&' : '?'
  //     }sls_ticket=${json.data.ticket}&theme=${params.value.theme}`
  //     dest.value = destUrl
  //   }
  // }
})
</script>

<template>
  <div class="container">
    <div class="tip" v-if="tip">{{ tip }}</div>
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
