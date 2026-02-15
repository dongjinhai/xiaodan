<template>
  <div class="container">
    <div class="result-container">
      <div class="card result-card">
        <!-- 截图内容区域 -->
        <div class="screenshot-content-area" ref="screenshotArea">
          <div class="result-header text-center mb-20">
            <h1 class="magic-font result-title">🔮 占卜结果 🔮</h1>
            <div class="divination-info">
              <p class="question-recap">
                <strong>占卜问题：</strong>{{ tarotStore.currentQuestion }}
              </p>
              <p class="spread-recap">
                <strong>使用排阵：</strong>{{ getCurrentSpread()?.name }}
              </p>
            </div>
          </div>

          <div v-if="tarotStore.uploadedImage" class="uploaded-image-display mb-20">
            <h3 class="section-title">你的塔罗排阵</h3>
            <div class="image-container">
              <img :src="tarotStore.uploadedImage" alt="塔罗排阵" />
            </div>
          </div>

          <div v-if="tarotStore.analysisResult" class="analysis-result">
            <h3 class="section-title magic-font">✨ 神秘解读 ✨</h3>
            <div class="result-content" v-html="formatAnalysisResult(tarotStore.analysisResult)"></div>
          </div>

          <div v-else class="no-result">
            <p>暂无解析结果</p>
          </div>
        </div>

        <!-- 操作按钮区域（不包含在截图中） -->
        <div class="action-buttons text-center mt-20">
          <button @click="generateScreenshot" class="btn btn-accent mr-10">
            📸 生成精美截图
          </button>
          <button @click="startNewDivination" class="btn">
            🔄 重新占卜
          </button>
        </div>
      </div>
    </div>

    <!-- 截图预览模态框 -->
    <div v-if="showScreenshotModal" class="screenshot-modal" @click="closeScreenshotModal">
      <div class="screenshot-content" @click.stop>
        <div class="modal-header">
          <h3>占卜结果截图</h3>
          <button @click="closeScreenshotModal" class="close-btn">×</button>
        </div>
        <div class="screenshot-preview">
          <img v-if="screenshotUrl" :src="screenshotUrl" alt="占卜结果截图" />
        </div>
        <div class="modal-actions">
          <button @click="downloadScreenshot" class="btn btn-accent">
            💾 下载截图
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useTarotStore } from '../stores/tarot'
import { tarotSpreads } from '../services/api'
import html2canvas from 'html2canvas'

export default {
  name: 'Result',
  setup() {
    const router = useRouter()
    const tarotStore = useTarotStore()
    
    const screenshotArea = ref(null)
    const showScreenshotModal = ref(false)
    const screenshotUrl = ref('')

    const getCurrentSpread = () => {
      return tarotSpreads.find(s => s.id === tarotStore.selectedSpread)
    }

    const formatAnalysisResult = (result) => {
      if (!result) return ''
      
      // 将换行符转换为HTML换行
      let formatted = result.replace(/\n/g, '<br>')
      
      // 为数字标题添加样式
      formatted = formatted.replace(/(\d+\.\s*[^<]+?)(<br>|$)/g, '<h4 class="result-section-title">$1</h4>')
      
      // 为关键词添加高亮
      formatted = formatted.replace(/(占卜|塔罗|命运|未来|过去|现在|建议|警告)/g, '<span class="highlight">$1</span>')
      
      return formatted
    }

    const generateScreenshot = async () => {
      console.log('开始生成截图...')
      try {
        const element = screenshotArea.value
        console.log('获取到的截图元素:', element)
        
        if (!element) {
          console.error('未找到截图区域元素')
          alert('未找到截图区域，请刷新页面重试')
          return
        }
        
        console.log('开始调用html2canvas...')
        const canvas = await html2canvas(element, {
          backgroundColor: '#1a0033',
          scale: 2,
          useCORS: true,
          allowTaint: true,
          logging: true,
          width: element.scrollWidth,
          height: element.scrollHeight
        })
        
        console.log('html2canvas调用成功，生成canvas:', canvas)
        screenshotUrl.value = canvas.toDataURL('image/png')
        console.log('截图URL生成成功')
        showScreenshotModal.value = true
      } catch (error) {
        console.error('生成截图失败:', error)
        alert(`生成截图失败：${error.message}`)
      }
    }

    const downloadScreenshot = () => {
      if (!screenshotUrl.value) return
      
      const link = document.createElement('a')
      link.download = `塔罗占卜结果_${new Date().toISOString().slice(0, 10)}.png`
      link.href = screenshotUrl.value
      link.click()
    }

    const closeScreenshotModal = () => {
      showScreenshotModal.value = false
      screenshotUrl.value = ''
    }

    const startNewDivination = () => {
      console.log('开始重新占卜...')
      console.log('清理会话数据...')
      tarotStore.clearSession()
      console.log('跳转到首页...')
      router.push('/')
    }

    onMounted(() => {
      console.log('=== 结果页面加载，检查数据状态 ===')
      console.log('currentQuestion:', tarotStore.currentQuestion)
      console.log('selectedSpread:', tarotStore.selectedSpread)
      console.log('uploadedImage存在:', !!tarotStore.uploadedImage)
      console.log('analysisResult存在:', !!tarotStore.analysisResult)
      
      // 检查localStorage中的原始数据
      console.log('=== localStorage原始数据 ===')
      console.log('current_question:', localStorage.getItem('current_question'))
      console.log('selected_spread:', localStorage.getItem('selected_spread'))
      console.log('uploaded_image存在:', !!localStorage.getItem('uploaded_image'))
      console.log('analysis_result存在:', !!localStorage.getItem('analysis_result'))
      
      // 如果store中没有数据，尝试从localStorage重新加载
      if (!tarotStore.analysisResult && localStorage.getItem('analysis_result')) {
        console.log('从localStorage重新加载数据...')
        // 强制重新初始化store状态
        tarotStore.$patch({
          currentQuestion: localStorage.getItem('current_question') || '',
          selectedSpread: localStorage.getItem('selected_spread') || '',
          uploadedImage: localStorage.getItem('uploaded_image') || null,
          analysisResult: localStorage.getItem('analysis_result') || null
        })
        console.log('重新加载后的数据状态:')
        console.log('currentQuestion:', tarotStore.currentQuestion)
        console.log('selectedSpread:', tarotStore.selectedSpread)
        console.log('uploadedImage存在:', !!tarotStore.uploadedImage)
        console.log('analysisResult存在:', !!tarotStore.analysisResult)
      }
      
      if (!tarotStore.analysisResult) {
        console.warn('没有分析结果，跳转到首页')
        alert('没有找到占卜结果，请重新开始占卜')
        router.push('/')
      }
    })

    return {
      tarotStore,
      screenshotArea,
      showScreenshotModal,
      screenshotUrl,
      getCurrentSpread,
      formatAnalysisResult,
      generateScreenshot,
      downloadScreenshot,
      closeScreenshotModal,
      startNewDivination
    }
  }
}
</script>

<style scoped>
.result-container {
  max-width: 900px;
  margin: 0 auto;
}

.screenshot-content-area {
  background: var(--card-bg);
  backdrop-filter: blur(10px);
  padding: 30px;
  border-radius: 15px;
  margin-bottom: 20px;
}

.result-card {
  position: relative;
}

.result-title {
  font-size: 2.5rem;
  background: linear-gradient(45deg, var(--accent-color), #ff6b6b, #4ecdc4);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 30px;
}

.divination-info {
  background: rgba(255, 215, 0, 0.1);
  padding: 20px;
  border-radius: 10px;
  margin: 20px 0;
}

.question-recap,
.spread-recap {
  margin: 10px 0;
  font-size: 1.1rem;
}

.question-recap strong,
.spread-recap strong {
  color: var(--accent-color);
}

.section-title {
  color: var(--accent-color);
  font-size: 1.5rem;
  margin-bottom: 20px;
  text-align: center;
}

.uploaded-image-display {
  text-align: center;
}

.image-container {
  background: rgba(255, 255, 255, 0.05);
  padding: 20px;
  border-radius: 15px;
  display: inline-block;
}

.image-container img {
  max-width: 100%;
  max-height: 300px;
  border-radius: 10px;
}

.analysis-result {
  background: rgba(255, 215, 0, 0.05);
  padding: 30px;
  border-radius: 15px;
  border: 2px solid rgba(255, 215, 0, 0.2);
}

.result-content {
  line-height: 1.8;
  font-size: 1.1rem;
}

.result-content :deep(.result-section-title) {
  color: var(--accent-color);
  font-size: 1.3rem;
  font-weight: 600;
  margin: 25px 0 15px 0;
  font-family: 'Dancing Script', cursive;
}

.result-content :deep(.highlight) {
  color: var(--accent-color);
  font-weight: 500;
  text-shadow: 0 0 5px rgba(255, 215, 0, 0.3);
}

.no-result {
  text-align: center;
  padding: 40px;
  opacity: 0.7;
}

.action-buttons {
  border-top: 2px solid rgba(255, 215, 0, 0.2);
  padding-top: 30px;
  margin-top: 40px;
  position: relative;
  z-index: 10;
}

.action-buttons .btn {
  position: relative;
  z-index: 11;
  pointer-events: auto;
}

.mr-10 {
  margin-right: 10px;
}

.screenshot-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
}

.screenshot-content {
  background: var(--card-bg);
  backdrop-filter: blur(10px);
  border-radius: 15px;
  max-width: 90vw;
  max-height: 90vh;
  overflow: auto;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  border-bottom: 2px solid rgba(255, 215, 0, 0.2);
}

.modal-header h3 {
  color: var(--accent-color);
  font-size: 1.3rem;
}

.close-btn {
  background: none;
  border: none;
  color: var(--text-light);
  font-size: 2rem;
  cursor: pointer;
  padding: 0;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.screenshot-preview {
  padding: 20px;
  text-align: center;
}

.screenshot-preview img {
  max-width: 100%;
  max-height: 60vh;
  border-radius: 10px;
}

.modal-actions {
  padding: 20px;
  text-align: center;
  border-top: 2px solid rgba(255, 215, 0, 0.2);
}

@media (max-width: 768px) {
  .result-title {
    font-size: 2rem;
  }
  
  .action-buttons {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
  
  .mr-10 {
    margin-right: 0;
  }
  
  .screenshot-content {
    margin: 20px;
    max-width: calc(100vw - 40px);
    max-height: calc(100vh - 40px);
  }
}
</style>