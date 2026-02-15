<template>
  <div class="container">
    <div class="hero-section text-center">
      <h1 class="magic-font hero-title">
        🔮 神秘塔罗占卜 🔮
      </h1>
      <p class="hero-subtitle">
        探索命运的奥秘，聆听宇宙的声音
      </p>
    </div>

    <div class="card">
      <h2 class="section-title text-center mb-20">开始你的占卜之旅</h2>
      
      <form @submit.prevent="startDivination" class="divination-form">
        <div class="input-group">
          <label for="question">请输入你的占卜问题：</label>
          <textarea
            id="question"
            v-model="question"
            placeholder="例如：我在感情方面应该如何选择？"
            rows="3"
            required
            class="magic-textarea"
          ></textarea>
        </div>

        <div class="input-group">
          <label class="spread-label">选择塔罗排阵：</label>
          <div class="spread-options">
            <div 
              v-for="spread in spreads" 
              :key="spread.id"
              class="spread-option"
              :class="{ active: selectedSpread === spread.id }"
              @click="selectSpread(spread.id)"
            >
              <input 
                type="radio" 
                :id="spread.id" 
                :value="spread.id" 
                v-model="selectedSpread"
                class="spread-radio"
              >
              <div class="spread-card">
                <div class="spread-icon">{{ getSpreadIcon(spread.id) }}</div>
                <div class="spread-content">
                  <h3 class="spread-name">{{ spread.name }}</h3>
                  <p class="spread-description">{{ spread.description }}</p>
                  <div class="spread-positions">
                    {{ spread.positions.length }} 个位置
                  </div>
                </div>
                <div class="spread-glow"></div>
              </div>
            </div>
          </div>
        </div>

        <div v-if="selectedSpread" class="spread-info">
          <h3 class="magic-font">✨ 排阵说明 ✨</h3>
          <div class="positions">
            <span 
              v-for="(position, index) in getCurrentSpread()?.positions" 
              :key="index"
              class="position-tag"
            >
              {{ index + 1 }}. {{ position }}
            </span>
          </div>
        </div>

        <div class="text-center mt-20">
          <button type="submit" class="btn btn-accent magic-submit-btn">
            <span class="btn-icon">🔮</span>
            <span class="btn-text">开始占卜</span>
            <div class="btn-sparkles">
              <span class="sparkle">✨</span>
              <span class="sparkle">⭐</span>
              <span class="sparkle">💫</span>
            </div>
          </button>
        </div>
      </form>
    </div>

    <div class="features-section">
      <div class="feature-card">
        <div class="feature-icon">📸</div>
        <h3>拍照识别</h3>
        <p>使用AI技术识别你的塔罗牌排阵</p>
      </div>
      <div class="feature-card">
        <div class="feature-icon">🤖</div>
        <h3>智能解析</h3>
        <p>DeepSeek AI为你提供专业的占卜解读</p>
      </div>
      <div class="feature-card">
        <div class="feature-icon">📱</div>
        <h3>精美截图</h3>
        <p>生成魔法风格的占卜结果截图</p>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useTarotStore } from '../stores/tarot'
import { tarotSpreads } from '../services/api'

export default {
  name: 'Home',
  setup() {
    const router = useRouter()
    const tarotStore = useTarotStore()
    
    const question = ref('')
    const selectedSpread = ref('')
    const spreads = ref(tarotSpreads)

    const getSpreadIcon = (spreadId) => {
      const icons = {
        'single': '🃏',
        'three-card': '🔮',
        'cross': '✚',
        'celtic-cross': '🌟'
      }
      return icons[spreadId] || '🎴'
    }

    const getCurrentSpread = () => {
      return spreads.value.find(s => s.id === selectedSpread.value)
    }

    const selectSpread = (spreadId) => {
      selectedSpread.value = spreadId
    }

    const startDivination = () => {
      if (!question.value.trim()) {
        alert('请输入占卜问题')
        return
      }

      if (!selectedSpread.value) {
        alert('请选择排阵类型')
        return
      }

      if (!tarotStore.apiToken) {
        alert('请先在设置页面配置DeepSeek API密钥')
        router.push('/settings')
        return
      }

      tarotStore.setQuestion(question.value.trim())
      tarotStore.setSpread(selectedSpread.value)
      router.push('/divination')
    }

    return {
      question,
      selectedSpread,
      spreads,
      getSpreadIcon,
      getCurrentSpread,
      selectSpread,
      startDivination
    }
  }
}
</script>

<style scoped>
.hero-section {
  padding: 60px 0;
}

.hero-title {
  font-size: 3.5rem;
  margin-bottom: 20px;
  background: linear-gradient(45deg, var(--accent-color), #ff6b6b, #4ecdc4);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.hero-subtitle {
  font-size: 1.2rem;
  opacity: 0.9;
  margin-bottom: 40px;
}

.section-title {
  font-size: 2rem;
  color: var(--accent-color);
  margin-bottom: 30px;
}

.divination-form {
  max-width: 800px;
  margin: 0 auto;
}

/* 魔法文本框样式 */
.magic-textarea {
  background: rgba(255, 255, 255, 0.1) !important;
  border: 2px solid rgba(255, 215, 0, 0.3) !important;
  border-radius: 15px !important;
  color: var(--text-light) !important;
  font-family: 'Cinzel', serif !important;
  font-size: 1.1rem !important;
  padding: 15px !important;
  resize: vertical;
  transition: all 0.3s ease;
  backdrop-filter: blur(5px);
}

.magic-textarea:focus {
  outline: none !important;
  border-color: var(--accent-color) !important;
  box-shadow: 0 0 20px rgba(255, 215, 0, 0.3) !important;
  background: rgba(255, 255, 255, 0.15) !important;
}

.magic-textarea::placeholder {
  color: rgba(255, 255, 255, 0.6);
  font-style: italic;
}

/* 排阵选择样式 */
.spread-label {
  display: block;
  margin-bottom: 20px;
  font-weight: 500;
  color: var(--accent-color);
  font-size: 1.2rem;
  text-align: center;
}

.spread-options {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
  margin: 20px 0;
}

.spread-option {
  position: relative;
  cursor: pointer;
  transition: transform 0.3s ease;
}

.spread-option:hover {
  transform: translateY(-5px);
}

.spread-radio {
  display: none;
}

.spread-card {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border: 2px solid rgba(255, 215, 0, 0.2);
  border-radius: 20px;
  padding: 25px;
  position: relative;
  overflow: hidden;
  transition: all 0.4s ease;
  height: 160px;
  display: flex;
  align-items: center;
  gap: 20px;
}

.spread-option.active .spread-card {
  border-color: var(--accent-color);
  background: rgba(255, 215, 0, 0.1);
  box-shadow: 0 0 30px rgba(255, 215, 0, 0.3);
}

.spread-icon {
  font-size: 3rem;
  flex-shrink: 0;
  transition: transform 0.3s ease;
}

.spread-option:hover .spread-icon {
  transform: scale(1.1) rotate(5deg);
}

.spread-option.active .spread-icon {
  transform: scale(1.2);
  filter: drop-shadow(0 0 10px rgba(255, 215, 0, 0.8));
}

.spread-content {
  flex: 1;
}

.spread-name {
  color: var(--accent-color);
  font-size: 1.3rem;
  font-weight: 600;
  margin-bottom: 8px;
  font-family: 'Dancing Script', cursive;
}

.spread-description {
  color: var(--text-light);
  opacity: 0.9;
  font-size: 0.95rem;
  line-height: 1.4;
  margin-bottom: 10px;
}

.spread-positions {
  color: var(--accent-color);
  font-size: 0.9rem;
  font-weight: 500;
  opacity: 0.8;
}

.spread-glow {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: radial-gradient(circle at center, rgba(255, 215, 0, 0.1) 0%, transparent 70%);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.spread-option.active .spread-glow {
  opacity: 1;
}

/* 排阵信息样式 */
.spread-info {
  background: linear-gradient(135deg, rgba(255, 215, 0, 0.1), rgba(255, 215, 0, 0.05));
  border: 2px solid rgba(255, 215, 0, 0.3);
  padding: 25px;
  border-radius: 20px;
  margin: 30px 0;
  backdrop-filter: blur(10px);
}

.spread-info h3 {
  color: var(--accent-color);
  margin-bottom: 20px;
  font-size: 1.4rem;
  text-align: center;
}

.positions {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 12px;
}

.position-tag {
  background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
  color: white;
  padding: 10px 15px;
  border-radius: 25px;
  font-size: 0.9rem;
  text-align: center;
  font-weight: 500;
  box-shadow: 0 4px 15px rgba(123, 31, 162, 0.3);
  transition: transform 0.2s ease;
}

.position-tag:hover {
  transform: translateY(-2px);
}

/* 魔法提交按钮 */
.magic-submit-btn {
  position: relative;
  padding: 15px 40px;
  font-size: 1.2rem;
  border-radius: 30px;
  overflow: hidden;
  display: flex;
  align-items: center;
  gap: 10px;
  min-width: 200px;
  justify-content: center;
}

.btn-icon {
  font-size: 1.4rem;
  animation: pulse 2s ease-in-out infinite;
}

.btn-text {
  font-family: 'Dancing Script', cursive;
  font-weight: 600;
  font-size: 1.3rem;
}

.btn-sparkles {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.magic-submit-btn:hover .btn-sparkles {
  opacity: 1;
}

.btn-sparkles .sparkle {
  position: absolute;
  font-size: 1rem;
  animation: sparkleFloat 2s ease-in-out infinite;
}

.btn-sparkles .sparkle:nth-child(1) {
  top: 20%;
  left: 20%;
  animation-delay: 0s;
}

.btn-sparkles .sparkle:nth-child(2) {
  top: 60%;
  right: 25%;
  animation-delay: 0.7s;
}

.btn-sparkles .sparkle:nth-child(3) {
  bottom: 25%;
  left: 60%;
  animation-delay: 1.4s;
}

@keyframes pulse {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
}

@keyframes sparkleFloat {
  0%, 100% {
    transform: translateY(0px) scale(0.8);
    opacity: 0.3;
  }
  50% {
    transform: translateY(-8px) scale(1);
    opacity: 1;
  }
}

/* 功能卡片样式 */
.features-section {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 30px;
  margin-top: 60px;
}

.feature-card {
  background: var(--card-bg);
  backdrop-filter: blur(10px);
  padding: 30px;
  border-radius: 15px;
  text-align: center;
  transition: transform 0.3s ease;
}

.feature-card:hover {
  transform: translateY(-5px);
}

.feature-icon {
  font-size: 3rem;
  margin-bottom: 15px;
}

.feature-card h3 {
  color: var(--accent-color);
  margin-bottom: 10px;
  font-size: 1.3rem;
}

.feature-card p {
  opacity: 0.8;
  line-height: 1.5;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .hero-title {
    font-size: 2.5rem;
  }
  
  .spread-options {
    grid-template-columns: 1fr;
  }
  
  .spread-card {
    height: auto;
    flex-direction: column;
    text-align: center;
    padding: 20px;
  }
  
  .spread-icon {
    font-size: 2.5rem;
  }
  
  .positions {
    grid-template-columns: 1fr;
  }
  
  .features-section {
    grid-template-columns: 1fr;
    gap: 20px;
  }
  
  .magic-submit-btn {
    width: 100%;
  }
}

@media (max-width: 480px) {
  .divination-form {
    padding: 0 10px;
  }
  
  .spread-card {
    padding: 15px;
  }
  
  .spread-name {
    font-size: 1.2rem;
  }
  
  .spread-description {
    font-size: 0.9rem;
  }
}
</style>