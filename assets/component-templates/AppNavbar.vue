<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(defineProps<{
  title?: string
  height?: number
  statusBarHeight?: number
  fixed?: boolean
  placeholder?: boolean
  showBack?: boolean
}>(), {
  title: '',
  height: 44,
  statusBarHeight: 0,
  fixed: true,
  placeholder: true,
  showBack: true,
})

const emit = defineEmits<{
  back: []
}>()

const totalHeight = computed(() => props.height + props.statusBarHeight)

function handleBack() {
  emit('back')
}
</script>

<template>
  <view
    v-if="fixed && placeholder"
    aria-hidden="true"
    :style="{ height: `${totalHeight}px` }"
  />
  <view
    class="app-navbar"
    :class="{ 'app-navbar--fixed': fixed }"
    :style="{
      height: `${height}px`,
      paddingTop: `${statusBarHeight}px`,
    }"
  >
    <view class="app-navbar__left">
      <slot name="left">
        <button v-if="showBack" class="app-navbar__back" @click="handleBack">
          <text aria-hidden="true">
            ‹
          </text>
        </button>
      </slot>
    </view>
    <view class="app-navbar__title">
      <slot name="title">
        <text class="app-navbar__title-text">
          {{ title }}
        </text>
      </slot>
    </view>
    <view class="app-navbar__right">
      <slot name="right" />
    </view>
  </view>
</template>

<style scoped>
.app-navbar {
  box-sizing: content-box;
  display: grid;
  grid-template-columns: minmax(88rpx, 1fr) minmax(0, 2fr) minmax(88rpx, 1fr);
  align-items: center;
  color: var(--app-navbar-color, #1f2329);
  background: var(--app-navbar-background, #fff);
}

.app-navbar--fixed {
  position: fixed;
  z-index: 100;
  top: 0;
  right: 0;
  left: 0;
}

.app-navbar__left,
.app-navbar__right {
  display: flex;
  align-items: center;
}

.app-navbar__right {
  justify-content: flex-end;
}

.app-navbar__back {
  display: flex;
  min-width: 88rpx;
  height: 100%;
  margin: 0;
  padding: 0 24rpx;
  align-items: center;
  border: 0;
  line-height: 1;
  background: transparent;
}

.app-navbar__back::after {
  border: 0;
}

.app-navbar__title {
  overflow: hidden;
  text-align: center;
}

.app-navbar__title-text {
  display: block;
  overflow: hidden;
  font-weight: 600;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
