<template>
  <div class="container">
    <div class="card">
      <div class="divination-header text-center mb-20">
        <h1 class="magic-font">🔮 占卜进行中 🔮</h1>
        <div class="question-display">
          <h3>占卜问题：</h3>
          <p class="question-text">{{ tarotStore.currentQuestion }}</p>
        </div>
        <div class="spread-display">
          <h3>选择排阵：</h3>
          <p class="spread-name">{{ getCurrentSpread()?.name }}</p>
        </div>
      </div>

      <div class="spread-visualization">
        <h3 class="text-center mb-20">排阵位置说明</h3>
        <div class="positions-grid" :class="`spread-${tarotStore.selectedSpread}`">
          <div 
            v-for="(position, index) in getCurrentSpread()?.positions" 
            :key="index"
            class="position-card"
          >
            <div class="position-number">{{ index + 1 }}</div>
            <div class="position-name">{{ position }}</div>
          </div>
        </div>
      </div>

      <div class="upload-section">
        <div class="api-notice">
          <div class="notice-icon">ℹ️</div>
          <div class="notice-content">
            <h4>塔罗牌图像识别占卜</h4>
            <p><strong>📸 上传塔罗牌图片：</strong>上传你的塔罗牌排阵照片，AI将识别牌面并进行专业解读</p>
            <p><strong>✅ 确认识别结果：</strong>AI识别后，你可以确认或修改识别结果，确保准确性</p>
          </div>
        </div>
        
        <!-- 图像识别占卜 -->
        <div class="divination-main">
          <div class="option-card main-option">
            <div class="option-header">
              <div class="option-icon">🔮</div>
              <h3>塔罗牌图像识别占卜</h3>
            </div>
            <p class="option-description">上传你的塔罗牌排阵照片，AI识别牌面后进行专业占卜解读</p>
            
            <!-- 上传区域 -->
            <div class="upload-section-main">
              <div v-if="!uploadedImage" class="upload-area-main" @click="triggerFileInput">
                <input 
                  ref="fileInput" 
                  type="file" 
                  accept="image/*" 
                  capture="environment"
                  @change="handleImageUpload"
                  style="display: none"
                >
                <div class="upload-content">
                  <div class="upload-icon">📸</div>
                  <h4>点击上传塔罗牌图片</h4>
                  <p class="upload-hint">支持JPG、PNG等格式，建议图片清晰可见</p>
                </div>
              </div>
              
              <div v-else class="uploaded-preview-main">
                <img :src="uploadedImage" alt="上传的塔罗牌图片" />
                <button @click="removeImage" class="remove-btn">×</button>
              </div>
            </div>

            <!-- 识别结果区域 -->
            <div v-if="recognitionResult && !isRecognizing" class="recognition-result">
              <h4>🔍 AI识别结果</h4>
              <div class="result-content">
                <textarea 
                  v-model="editableResult" 
                  class="result-textarea"
                  placeholder="识别结果将显示在这里..."
                  rows="8"
                ></textarea>
              </div>
              <div class="result-actions">
                <button @click="confirmRecognition" class="btn btn-accent">
                  ✅ 确认识别结果
                </button>
                <button @click="reRecognize" class="btn btn-secondary">
                  🔄 重新识别
                </button>
              </div>
            </div>

            <!-- 操作按钮 -->
            <div class="action-buttons">
              <button 
                v-if="uploadedImage && !recognitionResult" 
                @click="recognizeCards" 
                :disabled="isRecognizing || !canRecognize" 
                class="btn btn-primary magic-analyze-btn"
              >
                <span v-if="isRecognizing" class="btn-loading">
                  <span class="loading-spinner">🔍</span>
                  <span>识别中...</span>
                </span>
                <span v-else class="btn-content">
                  <span class="btn-icon">🔍</span>
                  <span>识别塔罗牌</span>
                  <span class="btn-icon">✨</span>
                </span>
              </button>

              <button 
                v-if="recognitionConfirmed" 
                @click="startDivination" 
                :disabled="isDivining || !canDivine" 
                class="btn btn-accent magic-analyze-btn"
              >
                <span v-if="isDivining" class="btn-loading">
                  <span class="loading-spinner">🔮</span>
                  <span>占卜中...</span>
                </span>
                <span v-else class="btn-content">
                  <span class="btn-icon">🔮</span>
                  <span>开始塔罗占卜</span>
                  <span class="btn-icon">✨</span>
                </span>
                <div class="btn-sparkles">
                  <span class="sparkle sparkle-1">✨</span>
                  <span class="sparkle sparkle-2">🌟</span>
                  <span class="sparkle sparkle-3">💫</span>
                </div>
              </button>
            </div>
            
            <p v-if="uploadedImage && !canRecognize" class="error-hint">
              {{ getErrorHint() }}
            </p>
          </div>
        </div>
      </div>

      <div v-if="isRecognizing || isDivining" class="analyzing-overlay">
        <div class="analyzing-content">
          <div class="magic-circle">
            <div class="circle-outer"></div>
            <div class="circle-inner"></div>
            <div class="circle-center">{{ isRecognizing ? '🔍' : '🔮' }}</div>
          </div>
          <p class="magic-font analyzing-text">
            {{ isRecognizing ? 'AI正在识别塔罗牌...' : '神秘的力量正在解读你的命运...' }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useTarotStore } from '../stores/tarot'
import { tarotSpreads, DeepSeekAPI, KimiAPI } from '../services/api'

export default {
  name: 'Divination',
  setup() {
    const router = useRouter()
    const tarotStore = useTarotStore()
    
    const fileInput = ref(null)
    const uploadedImage = ref(null)
    const isRecognizing = ref(false)
    const isDivining = ref(false)
    const recognitionResult = ref('')
    const editableResult = ref('')
    const recognitionConfirmed = ref(false)

    const canRecognize = computed(() => {
      return uploadedImage.value && 
             tarotStore.kimiToken && 
             tarotStore.currentQuestion && 
             tarotStore.selectedSpread &&
             !isRecognizing.value &&
             !isDivining.value
    })

    const canDivine = computed(() => {
      return recognitionConfirmed.value && 
             editableResult.value.trim() && 
             tarotStore.deepseekToken && 
             tarotStore.currentQuestion && 
             tarotStore.selectedSpread &&
             !isRecognizing.value &&
             !isDivining.value
    })

    const getErrorHint = () => {
      if (!tarotStore.kimiToken) {
        return '请先在设置页面配置Kimi API密钥（用于图像识别）'
      }
      if (!uploadedImage.value) {
        return '请先上传塔罗牌图片'
      }
      if (!tarotStore.currentQuestion) {
        return '缺少占卜问题，请返回首页重新开始'
      }
      if (!tarotStore.selectedSpread) {
        return '缺少排阵选择，请返回首页重新开始'
      }
      return '请检查所有必要信息是否完整'
    }

    const getCurrentSpread = () => {
      return tarotSpreads.find(s => s.id === tarotStore.selectedSpread)
    }

    const triggerFileInput = () => {
      if (fileInput.value) {
        fileInput.value.click()
      }
    }

    const handleImageUpload = (event) => {
      const file = event.target.files[0]
      if (file) {
        // 验证文件类型
        if (!file.type.startsWith('image/')) {
          alert('请选择图片文件')
          return
        }
        
        // 验证文件大小（最大10MB）
        if (file.size > 10 * 1024 * 1024) {
          alert('图片文件过大，请选择小于10MB的图片')
          return
        }

        const reader = new FileReader()
        reader.onload = (e) => {
          uploadedImage.value = e.target.result
          tarotStore.setUploadedImage(e.target.result)
        }
        reader.onerror = () => {
          alert('图片读取失败，请重试')
        }
        reader.readAsDataURL(file)
      }
    }

    const removeImage = () => {
      uploadedImage.value = null
      tarotStore.setUploadedImage(null)
      recognitionResult.value = ''
      editableResult.value = ''
      recognitionConfirmed.value = false
      if (fileInput.value) {
        fileInput.value.value = ''
      }
    }

    const recognizeCards = async () => {
      console.log('开始识别塔罗牌，检查条件...')
      console.log('uploadedImage:', !!uploadedImage.value)
      console.log('kimiToken:', !!tarotStore.kimiToken)
      console.log('currentQuestion:', tarotStore.currentQuestion)
      console.log('selectedSpread:', tarotStore.selectedSpread)
      console.log('canRecognize:', canRecognize.value)

      if (!canRecognize.value) {
        alert(getErrorHint())
        return
      }

      isRecognizing.value = true
      
      try {
        console.log('调用Kimi API识别塔罗牌...')
        const kimiApi = new KimiAPI(tarotStore.kimiToken)
        const imageBase64 = uploadedImage.value.split(',')[1]
        
        const result = await kimiApi.recognizeCards(
          imageBase64,
          tarotStore.currentQuestion,
          getCurrentSpread()?.name
        )
        
        console.log('Kimi识别结果:', result)
        recognitionResult.value = result
        editableResult.value = result
        
      } catch (error) {
        console.error('塔罗牌识别失败:', error)
        let errorMessage = '塔罗牌识别失败：' + error.message
        
        if (error.message.includes('401')) {
          errorMessage = 'Kimi API密钥无效，请在设置页面重新配置'
        } else if (error.message.includes('429')) {
          errorMessage = 'API调用频率过高，请稍后重试'
        } else if (error.message.includes('网络')) {
          errorMessage = '网络连接失败，请检查网络后重试'
        }
        
        alert(errorMessage)
      } finally {
        isRecognizing.value = false
      }
    }

    const confirmRecognition = () => {
      if (editableResult.value.trim()) {
        recognitionConfirmed.value = true
        console.log('用户确认识别结果:', editableResult.value)
      } else {
        alert('请确保识别结果不为空')
      }
    }

    const reRecognize = () => {
      recognitionResult.value = ''
      editableResult.value = ''
      recognitionConfirmed.value = false
      recognizeCards()
    }

    const startDivination = async () => {
      console.log('开始占卜解读，检查条件...')
      console.log('recognitionConfirmed:', recognitionConfirmed.value)
      console.log('editableResult:', editableResult.value.trim())
      console.log('deepseekToken:', !!tarotStore.deepseekToken)
      console.log('canDivine:', canDivine.value)

      if (!canDivine.value) {
        if (!tarotStore.deepseekToken) {
          alert('请先在设置页面配置DeepSeek API密钥（用于占卜解读）')
        } else if (!editableResult.value.trim()) {
          alert('请先确认识别结果')
        } else {
          alert('请检查所有必要信息是否完整')
        }
        return
      }

      isDivining.value = true
      
      try {
        console.log('调用DeepSeek API进行占卜解读...')
        const deepseekApi = new DeepSeekAPI(tarotStore.deepseekToken)
        
        const result = await deepseekApi.analyzeCards(
          editableResult.value,
          tarotStore.currentQuestion,
          tarotStore.selectedSpread
        )
        
        console.log('DeepSeek解读结果:', result)
        
        // 合并识别结果和占卜解读
        const finalResult = `【塔罗牌识别结果】
${editableResult.value}

【占卜解读】
${result}`
        
        console.log('=== 保存最终结果到Store ===')
        console.log('finalResult长度:', finalResult.length)
        tarotStore.setAnalysisResult(finalResult)
        
        // 验证保存是否成功
        console.log('保存后验证:')
        console.log('store.analysisResult存在:', !!tarotStore.analysisResult)
        console.log('localStorage.analysis_result存在:', !!localStorage.getItem('analysis_result'))
        
        console.log('=== 跳转到结果页面 ===')
        router.push('/result')
      } catch (error) {
        console.error('占卜解读失败:', error)
        let errorMessage = '占卜解读失败：' + error.message
        
        if (error.message.includes('401')) {
          errorMessage = 'DeepSeek API密钥无效，请在设置页面重新配置'
        } else if (error.message.includes('429')) {
          errorMessage = 'API调用频率过高，请稍后重试'
        } else if (error.message.includes('网络')) {
          errorMessage = '网络连接失败，请检查网络后重试'
        }
        
        alert(errorMessage)
      } finally {
        isDivining.value = false
      }
    }

    onMounted(() => {
      console.log('页面加载，检查状态...')
      console.log('currentQuestion:', tarotStore.currentQuestion)
      console.log('selectedSpread:', tarotStore.selectedSpread)
      console.log('deepseekToken:', !!tarotStore.deepseekToken)
      console.log('kimiToken:', !!tarotStore.kimiToken)

      if (!tarotStore.currentQuestion || !tarotStore.selectedSpread) {
        alert('缺少占卜信息，请重新开始')
        router.push('/')
        return
      }
      
      if (tarotStore.uploadedImage) {
        uploadedImage.value = tarotStore.uploadedImage
      }
    })

    return {
      tarotStore,
      fileInput,
      uploadedImage,
      isRecognizing,
      isDivining,
      recognitionResult,
      editableResult,
      recognitionConfirmed,
      canRecognize,
      canDivine,
      getCurrentSpread,
      getErrorHint,
      triggerFileInput,
      handleImageUpload,
      removeImage,
      recognizeCards,
      confirmRecognition,
      reRecognize,
      startDivination
    }
  }
}
</script>

<style scoped>
.divination-header {
  border-bottom: 2px solid rgba(255, 215, 0, 0.3);
  padding-bottom: 30px;
  margin-bottom: 40px;
}

.question-display,
.spread-display {
  margin: 20px 0;
}

.question-display h3,
.spread-display h3 {
  color: var(--accent-color);
  margin-bottom: 10px;
}

.question-text {
  font-size: 1.2rem;
  font-style: italic;
  background: rgba(255, 215, 0, 0.1);
  padding: 15px;
  border-radius: 10px;
  margin: 10px 0;
}

.spread-name {
  font-size: 1.1rem;
  color: var(--accent-color);
  font-weight: 500;
}

.spread-visualization {
  margin: 40px 0;
}

.positions-grid {
  display: grid;
  gap: 15px;
  justify-content: center;
  max-width: 800px;
  margin: 0 auto;
}

.spread-single {
  grid-template-columns: 1fr;
  max-width: 200px;
}

.spread-three-card {
  grid-template-columns: repeat(3, 1fr);
  max-width: 600px;
}

.spread-cross {
  grid-template-areas: 
    ". top ."
    "left center right"
    ". bottom .";
  grid-template-columns: 1fr 1fr 1fr;
  max-width: 600px;
}

.spread-cross .position-card:nth-child(1) { grid-area: center; }
.spread-cross .position-card:nth-child(2) { grid-area: top; }
.spread-cross .position-card:nth-child(3) { grid-area: left; }
.spread-cross .position-card:nth-child(4) { grid-area: right; }
.spread-cross .position-card:nth-child(5) { grid-area: bottom; }

.spread-celtic-cross {
  grid-template-columns: repeat(4, 1fr);
  max-width: 800px;
}

.position-card {
  background: rgba(255, 215, 0, 0.1);
  border: 2px solid rgba(255, 215, 0, 0.3);
  border-radius: 10px;
  padding: 15px;
  text-align: center;
  min-height: 100px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.position-number {
  background: var(--accent-color);
  color: var(--text-dark);
  width: 25px;
  height: 25px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  margin: 0 auto 10px;
  font-size: 0.9rem;
}

.position-name {
  font-size: 0.9rem;
  font-weight: 500;
}

.upload-section {
  margin: 40px 0;
}

.api-notice {
  background: linear-gradient(135deg, rgba(255, 215, 0, 0.1), rgba(255, 215, 0, 0.05));
  border: 2px solid rgba(255, 215, 0, 0.3);
  border-radius: 15px;
  padding: 25px;
  margin-bottom: 30px;
  display: flex;
  align-items: flex-start;
  gap: 15px;
}

.notice-icon {
  font-size: 2rem;
  flex-shrink: 0;
}

.notice-content h4 {
  color: var(--accent-color);
  margin: 0 0 10px 0;
  font-size: 1.1rem;
}

.notice-content p {
  margin: 8px 0;
  line-height: 1.5;
  color: var(--text-light);
}

.divination-main {
  display: flex;
  justify-content: center;
  margin: 30px 0;
}

.main-option {
  background: linear-gradient(135deg, rgba(255, 215, 0, 0.1), rgba(255, 215, 0, 0.05));
  border: 2px solid var(--accent-color);
  border-radius: 20px;
  padding: 30px;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  max-width: 600px;
  width: 100%;
}

.main-option::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 215, 0, 0.1), transparent);
  transition: left 0.5s ease;
}

.main-option:hover::before {
  left: 100%;
}

.main-option:hover {
  border-color: var(--accent-color);
  box-shadow: 0 10px 30px rgba(255, 215, 0, 0.3);
  transform: translateY(-2px);
}

.upload-section-main {
  margin: 20px 0;
}

.upload-area-main {
  border: 3px dashed rgba(255, 215, 0, 0.5);
  border-radius: 15px;
  padding: 40px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  background: rgba(255, 215, 0, 0.02);
}

.upload-area-main:hover {
  border-color: var(--accent-color);
  background: rgba(255, 215, 0, 0.08);
}

.upload-content h4 {
  color: var(--accent-color);
  margin: 15px 0 10px 0;
  font-size: 1.2rem;
}

.upload-hint {
  font-size: 0.9rem;
  opacity: 0.7;
  margin-top: 10px;
  color: var(--text-light);
}

.uploaded-preview-main {
  position: relative;
  display: inline-block;
  border-radius: 15px;
  overflow: hidden;
  max-width: 300px;
  margin: 20px 0;
}

.uploaded-preview-main img {
  width: 100%;
  height: auto;
  display: block;
}

.recognition-result {
  margin: 25px 0;
  padding: 20px;
  background: rgba(255, 215, 0, 0.05);
  border: 2px solid rgba(255, 215, 0, 0.2);
  border-radius: 15px;
}

.recognition-result h4 {
  color: var(--accent-color);
  margin: 0 0 15px 0;
  font-size: 1.1rem;
  display: flex;
  align-items: center;
  gap: 8px;
}

.result-content {
  margin: 15px 0;
}

.result-textarea {
  width: 100%;
  min-height: 150px;
  padding: 15px;
  border: 2px solid rgba(255, 215, 0, 0.3);
  border-radius: 10px;
  background: rgba(255, 215, 0, 0.02);
  color: var(--text-color);
  font-family: inherit;
  font-size: 0.95rem;
  line-height: 1.5;
  resize: vertical;
  transition: all 0.3s ease;
}

.result-textarea:focus {
  outline: none;
  border-color: var(--accent-color);
  background: rgba(255, 215, 0, 0.05);
}

.result-actions {
  display: flex;
  gap: 15px;
  margin-top: 15px;
}

.result-actions .btn {
  flex: 1;
  padding: 12px 20px;
  font-size: 0.95rem;
}

.action-buttons {
  margin-top: 25px;
}

.option-header {
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 15px;
  position: relative;
}

.option-icon {
  font-size: 2rem;
  flex-shrink: 0;
}

.option-header h3 {
  color: var(--accent-color);
  margin: 0;
  font-size: 1.3rem;
  font-weight: 600;
  flex: 1;
}

.option-badge {
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.option-badge.recommended {
  background: linear-gradient(45deg, var(--accent-color), #ff6b6b);
  color: white;
  animation: pulse 2s ease-in-out infinite;
}

.option-badge.experimental {
  background: rgba(156, 39, 176, 0.2);
  color: #9c27b0;
  border: 1px solid rgba(156, 39, 176, 0.3);
}

.option-description {
  margin: 0 0 20px 0;
  line-height: 1.5;
  opacity: 0.9;
}



.magic-analyze-btn {
  width: 100%;
  margin-top: 15px;
}

@media (min-width: 768px) {
  .upload-area-main {
    padding: 50px;
  }
  
  .upload-content .upload-icon {
    font-size: 5rem;
  }
}

.upload-area {
  border: 3px dashed rgba(255, 215, 0, 0.5);
  border-radius: 15px;
  padding: 40px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
}

.upload-area:hover {
  border-color: var(--accent-color);
  background: rgba(255, 215, 0, 0.05);
}

.upload-placeholder {
  color: var(--text-light);
}

.upload-icon {
  font-size: 4rem;
  margin-bottom: 20px;
}

.upload-hint {
  font-size: 0.9rem;
  opacity: 0.7;
  margin-top: 10px;
}

.uploaded-image {
  position: relative;
  display: inline-block;
}

.uploaded-image img {
  max-width: 100%;
  max-height: 400px;
  border-radius: 10px;
}

.remove-btn {
  position: absolute;
  top: -10px;
  right: -10px;
  background: #ff4444;
  color: white;
  border: none;
  border-radius: 50%;
  width: 30px;
  height: 30px;
  cursor: pointer;
  font-size: 1.2rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.action-buttons {
  margin-top: 30px;
}

.magic-analyze-btn {
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
  transition: all 0.4s ease;
}

.magic-analyze-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none !important;
}

.magic-analyze-btn:not(:disabled):hover {
  transform: translateY(-3px);
  box-shadow: 0 10px 30px rgba(255, 215, 0, 0.4);
}

.btn-content,
.btn-loading {
  display: flex;
  align-items: center;
  gap: 8px;
}

.btn-icon {
  font-size: 1.2rem;
  animation: pulse 2s ease-in-out infinite;
}

.loading-spinner {
  animation: spin 1s linear infinite;
  font-size: 1.2rem;
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

.magic-analyze-btn:not(:disabled):hover .btn-sparkles {
  opacity: 1;
}

.sparkle {
  position: absolute;
  font-size: 1rem;
  animation: sparkleFloat 2s ease-in-out infinite;
}

.sparkle-1 {
  top: 15%;
  left: 20%;
  animation-delay: 0s;
}

.sparkle-2 {
  top: 60%;
  right: 25%;
  animation-delay: 0.7s;
}

.sparkle-3 {
  bottom: 20%;
  left: 60%;
  animation-delay: 1.4s;
}

.error-hint {
  color: #ff6b6b;
  font-size: 0.9rem;
  margin-top: 15px;
  padding: 10px;
  background: rgba(255, 107, 107, 0.1);
  border-radius: 10px;
  border: 1px solid rgba(255, 107, 107, 0.3);
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
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

.analyzing-overlay {
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

.analyzing-content {
  text-align: center;
  color: white;
}

.magic-circle {
  position: relative;
  width: 150px;
  height: 150px;
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
  width: 150px;
  height: 150px;
  border-top-color: transparent;
}

.circle-inner {
  width: 100px;
  height: 100px;
  top: 25px;
  left: 25px;
  border-bottom-color: transparent;
  animation-direction: reverse;
  animation-duration: 2s;
}

.circle-center {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 3rem;
}

.analyzing-text {
  font-size: 1.3rem;
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

@media (max-width: 768px) {
  .positions-grid {
    gap: 10px;
  }
  
  .position-card {
    padding: 10px;
    min-height: 80px;
  }
  
  .upload-area {
    padding: 20px;
  }
  
  .upload-icon {
    font-size: 3rem;
  }
}
</style>