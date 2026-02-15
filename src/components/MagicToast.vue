<template>
  <Teleport to="body">
    <Transition name="toast" appear>
      <div v-if="visible" class="magic-toast-overlay" @click="close">
        <div class="magic-toast" @click.stop>
          <div class="toast-sparkles">
            <div class="sparkle sparkle-1">✨</div>
            <div class="sparkle sparkle-2">🌟</div>
            <div class="sparkle sparkle-3">💫</div>
            <div class="sparkle sparkle-4">⭐</div>
            <div class="sparkle sparkle-5">✨</div>
            <div class="sparkle sparkle-6">🌟</div>
          </div>
          
          <div class="toast-content">
            <div class="toast-icon">
              <div class="magic-circle">
                <div class="circle-ring"></div>
                <div class="circle-center">{{ icon }}</div>
              </div>
            </div>
            
            <div class="toast-message">
              <h3 class="toast-title">{{ title }}</h3>
              <p class="toast-text">{{ message }}</p>
            </div>
          </div>
          
          <button @click="close" class="toast-close">
            <span>×</span>
          </button>
          
          <div class="magic-border"></div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script>
import { ref, onMounted } from 'vue'

export default {
  name: 'MagicToast',
  props: {
    title: {
      type: String,
      default: '成功'
    },
    message: {
      type: String,
      required: true
    },
    icon: {
      type: String,
      default: '🎉'
    },
    duration: {
      type: Number,
      default: 3000
    }
  },
  emits: ['close'],
  setup(props, { emit }) {
    const visible = ref(false)
    let timer = null

    const close = () => {
      visible.value = false
      if (timer) {
        clearTimeout(timer)
      }
      setTimeout(() => {
        emit('close')
      }, 300)
    }

    onMounted(() => {
      visible.value = true
      if (props.duration > 0) {
        timer = setTimeout(() => {
          close()
        }, props.duration)
      }
    })

    return {
      visible,
      close
    }
  }
}
</script>

<style scoped>
.magic-toast-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10000;
  backdrop-filter: blur(5px);
}

.magic-toast {
  position: relative;
  background: linear-gradient(135deg, 
    rgba(123, 31, 162, 0.95) 0%, 
    rgba(103, 58, 183, 0.95) 50%, 
    rgba(63, 81, 181, 0.95) 100%);
  border-radius: 20px;
  padding: 30px;
  max-width: 400px;
  min-width: 300px;
  box-shadow: 
    0 20px 60px rgba(123, 31, 162, 0.4),
    0 0 0 1px rgba(255, 255, 255, 0.1),
    inset 0 1px 0 rgba(255, 255, 255, 0.2);
  overflow: hidden;
  animation: toastGlow 2s ease-in-out infinite alternate;
}

.toast-sparkles {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
}

.sparkle {
  position: absolute;
  font-size: 1.2rem;
  animation: sparkleFloat 3s ease-in-out infinite;
}

.sparkle-1 {
  top: 15%;
  left: 10%;
  animation-delay: 0s;
}

.sparkle-2 {
  top: 25%;
  right: 15%;
  animation-delay: 0.5s;
}

.sparkle-3 {
  bottom: 30%;
  left: 20%;
  animation-delay: 1s;
}

.sparkle-4 {
  bottom: 20%;
  right: 25%;
  animation-delay: 1.5s;
}

.sparkle-5 {
  top: 60%;
  left: 80%;
  animation-delay: 2s;
}

.sparkle-6 {
  top: 80%;
  right: 70%;
  animation-delay: 2.5s;
}

.toast-content {
  display: flex;
  align-items: center;
  gap: 20px;
  position: relative;
  z-index: 2;
}

.toast-icon {
  flex-shrink: 0;
}

.magic-circle {
  position: relative;
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.circle-ring {
  position: absolute;
  width: 100%;
  height: 100%;
  border: 3px solid var(--accent-color);
  border-radius: 50%;
  border-top-color: transparent;
  animation: spin 2s linear infinite;
}

.circle-center {
  font-size: 2rem;
  z-index: 1;
}

.toast-message {
  flex: 1;
  color: white;
}

.toast-title {
  font-size: 1.3rem;
  font-weight: 600;
  margin: 0 0 8px 0;
  color: var(--accent-color);
  font-family: 'Dancing Script', cursive;
}

.toast-text {
  margin: 0;
  line-height: 1.5;
  opacity: 0.9;
}

.toast-close {
  position: absolute;
  top: 15px;
  right: 15px;
  background: rgba(255, 255, 255, 0.2);
  border: none;
  border-radius: 50%;
  width: 30px;
  height: 30px;
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  transition: all 0.3s ease;
  z-index: 3;
}

.toast-close:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: scale(1.1);
}

.magic-border {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  border-radius: 20px;
  background: linear-gradient(45deg, 
    var(--accent-color), 
    transparent, 
    var(--accent-color));
  padding: 2px;
  z-index: 1;
}

.magic-border::before {
  content: '';
  position: absolute;
  top: 2px;
  left: 2px;
  right: 2px;
  bottom: 2px;
  background: linear-gradient(135deg, 
    rgba(123, 31, 162, 0.95) 0%, 
    rgba(103, 58, 183, 0.95) 50%, 
    rgba(63, 81, 181, 0.95) 100%);
  border-radius: 18px;
}

/* 动画 */
@keyframes toastGlow {
  0% {
    box-shadow: 
      0 20px 60px rgba(123, 31, 162, 0.4),
      0 0 0 1px rgba(255, 255, 255, 0.1),
      inset 0 1px 0 rgba(255, 255, 255, 0.2);
  }
  100% {
    box-shadow: 
      0 25px 80px rgba(123, 31, 162, 0.6),
      0 0 0 1px rgba(255, 255, 255, 0.2),
      inset 0 1px 0 rgba(255, 255, 255, 0.3);
  }
}

@keyframes sparkleFloat {
  0%, 100% {
    transform: translateY(0px) scale(0.8);
    opacity: 0.4;
  }
  50% {
    transform: translateY(-10px) scale(1);
    opacity: 1;
  }
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

/* 过渡动画 */
.toast-enter-active, .toast-leave-active {
  transition: all 0.3s ease;
}

.toast-enter-from {
  opacity: 0;
  transform: scale(0.8) translateY(-20px);
}

.toast-leave-to {
  opacity: 0;
  transform: scale(0.8) translateY(-20px);
}

@media (max-width: 768px) {
  .magic-toast {
    margin: 20px;
    min-width: auto;
    max-width: calc(100vw - 40px);
  }
  
  .toast-content {
    gap: 15px;
  }
  
  .magic-circle {
    width: 50px;
    height: 50px;
  }
  
  .circle-center {
    font-size: 1.5rem;
  }
  
  .toast-title {
    font-size: 1.1rem;
  }
}
</style>