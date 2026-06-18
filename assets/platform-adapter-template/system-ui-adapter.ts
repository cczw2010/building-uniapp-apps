// ponytail: keep one function; add a port only after a second implementation needs it.
export function getSystemUiMetrics() {
  // #ifdef MP-WEIXIN
  const windowInfo = uni.getWindowInfo()
  const safeArea = windowInfo.safeArea

  return {
    statusBarHeight: windowInfo.statusBarHeight || 0,
    safeAreaInsets: safeArea
      ? {
          top: safeArea.top,
          right: windowInfo.windowWidth - safeArea.right,
          bottom: windowInfo.windowHeight - safeArea.bottom,
          left: safeArea.left,
        }
      : { top: 0, right: 0, bottom: 0, left: 0 },
    menuButton: uni.getMenuButtonBoundingClientRect(),
  }
  // #endif

  // #ifndef MP-WEIXIN
  return {
    statusBarHeight: 0,
    safeAreaInsets: { top: 0, right: 0, bottom: 0, left: 0 },
    menuButton: null,
  }
  // #endif
}
