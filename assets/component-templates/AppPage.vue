<script setup lang="ts">
type PageState = 'content' | 'loading' | 'empty' | 'error'

withDefaults(defineProps<{
  state?: PageState
  safeTop?: boolean
  safeBottom?: boolean
}>(), {
  state: 'content',
  safeTop: false,
  safeBottom: true,
})

const emit = defineEmits<{
  retry: []
}>()

function handleRetry() {
  emit('retry')
}
</script>

<template>
  <view
    class="app-page"
    :class="{
      'app-page--safe-top': safeTop,
      'app-page--safe-bottom': safeBottom,
    }"
  >
    <slot name="navbar" />

    <view v-if="state === 'loading'" class="app-page__state">
      <slot name="loading" />
    </view>
    <view v-else-if="state === 'empty'" class="app-page__state">
      <slot name="empty" />
    </view>
    <view v-else-if="state === 'error'" class="app-page__state">
      <slot name="error" :retry="handleRetry" />
    </view>
    <slot v-else />
  </view>
</template>

<style scoped>
.app-page {
  box-sizing: border-box;
  min-height: 100vh;
  background: var(--app-page-background, #f7f8fa);
}

.app-page--safe-top {
  padding-top: env(safe-area-inset-top);
}

.app-page--safe-bottom {
  padding-bottom: env(safe-area-inset-bottom);
}

.app-page__state {
  display: flex;
  min-height: 60vh;
  align-items: center;
  justify-content: center;
}
</style>
