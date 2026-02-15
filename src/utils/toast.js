import { createApp } from 'vue'
import MagicToast from '../components/MagicToast.vue'

let toastInstance = null

export const showMagicToast = (options) => {
  // 如果已有toast实例，先关闭
  if (toastInstance) {
    toastInstance.unmount()
    toastInstance = null
  }

  const {
    title = '成功',
    message,
    icon = '🎉',
    duration = 3000
  } = options

  // 创建容器
  const container = document.createElement('div')
  document.body.appendChild(container)

  // 创建Vue应用实例
  toastInstance = createApp(MagicToast, {
    title,
    message,
    icon,
    duration,
    onClose: () => {
      if (toastInstance) {
        toastInstance.unmount()
        toastInstance = null
      }
      if (container && container.parentNode) {
        container.parentNode.removeChild(container)
      }
    }
  })

  toastInstance.mount(container)
}

// 预设的成功提示
export const showSuccessToast = (message, title = '配置成功') => {
  showMagicToast({
    title,
    message,
    icon: '✨',
    duration: 3000
  })
}

// 预设的错误提示
export const showErrorToast = (message, title = '出现错误') => {
  showMagicToast({
    title,
    message,
    icon: '⚠️',
    duration: 4000
  })
}

// 预设的信息提示
export const showInfoToast = (message, title = '提示') => {
  showMagicToast({
    title,
    message,
    icon: 'ℹ️',
    duration: 3000
  })
}