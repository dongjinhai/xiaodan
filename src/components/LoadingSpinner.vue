<template>
  <div class="loading-spinner">
    <div class="spinner-container">
      <div class="magic-circle">
        <div class="circle-outer"></div>
        <div class="circle-inner"></div>
        <div class="circle-center">🔮</div>
      </div>
      <p class="magic-font loading-text">{{ text }}</p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'LoadingSpinner',
  props: {
    text: {
      type: String,
      default: '加载中...'
    }
  }
}
</script>

<style scoped>
.loading-spinner {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.spinner-container {
  text-align: center;
  color: white;
}

.magic-circle {
  position: relative;
  width: 120px;
  height: 120px;
  margin: 0 auto 30px;
}

.circle-outer,
.circle-inner {
  position: absolute;
  border: 3px solid var(--accent-color);
  border-radius: 50%;
  animation: rotate 3s linear infinite;
}

.circle-outer {
  width: 120px;
  height: 120px;
  border-top-color: transparent;
}

.circle-inner {
  width: 80px;
  height: 80px;
  top: 20px;
  left: 20px;
  border-bottom-color: transparent;
  animation-direction: reverse;
  animation-duration: 2s;
}

.circle-center {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 2.5rem;
}

.loading-text {
  font-size: 1.2rem;
  animation: pulse 2s ease-in-out infinite;
}

@keyframes rotate {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

@keyframes pulse {
  0%, 100% { opacity: 0.7; }
  50% { opacity: 1; }
}
</style>