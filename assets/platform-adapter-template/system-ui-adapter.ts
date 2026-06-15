export interface Rect {
  top: number
  right: number
  bottom: number
  left: number
  width: number
  height: number
}

export interface SystemUiMetrics {
  statusBarHeight: number
  safeAreaInsets: {
    top: number
    right: number
    bottom: number
    left: number
  }
  menuButton: Rect | null
}

export interface SystemUiPort {
  getMetrics: () => SystemUiMetrics
}

function createH5SystemUiAdapter(): SystemUiPort {
  return {
    getMetrics: () => ({
      statusBarHeight: 0,
      safeAreaInsets: { top: 0, right: 0, bottom: 0, left: 0 },
      menuButton: null,
    }),
  }
}

let systemUiAdapter: SystemUiPort = createH5SystemUiAdapter()

// #ifdef MP-WEIXIN
systemUiAdapter = {
  getMetrics() {
    const windowInfo = uni.getWindowInfo()
    const safeArea = windowInfo.safeArea
    const menuButton = uni.getMenuButtonBoundingClientRect()

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
      menuButton,
    }
  },
}
// #endif

/*
 * Keep capability selection here. Components consume SystemUiPort and never
 * inspect the active platform.
 */
export { systemUiAdapter }
