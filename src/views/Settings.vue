<template>
  <div class="container">
    <div class="card">
      <div class="settings-header text-center mb-20">
        <h1 class="magic-font">⚙️ 设置中心 ⚙️</h1>
        <p class="settings-subtitle">配置你的占卜工具</p>
      </div>

      <div class="settings-section">
        <h2 class="section-title">API 配置</h2>
        <p class="section-description">
          配置API密钥以启用完整的塔罗占卜功能。Kimi负责图像识别，DeepSeek负责占卜解读。
        </p>
        
        <!-- Kimi API 配置 -->
        <div class="api-config-group">
          <h3 class="api-title">🌙 Kimi API (图像识别)</h3>
          <form @submit.prevent="saveKimiToken" class="api-form">
            <div class="input-group">
              <label for="kimiToken">Kimi API 密钥：</label>
              <div class="token-input-container">
                <input
                  id="kimiToken"
                  v-model="kimiToken"
                  :type="showKimiToken ? 'text' : 'password'"
                  placeholder="请输入你的Kimi API密钥"
                />
                <button 
                  type="button" 
                  @click="toggleKimiTokenVisibility" 
                  class="toggle-visibility-btn"
                >
                  {{ showKimiToken ? '🙈' : '👁️' }}
                </button>
              </div>
            </div>

            <div class="form-actions">
              <button type="submit" class="btn btn-accent magic-btn" :disabled="isTestingKimi || !kimiToken.trim()">
                <span v-if="isTestingKimi" class="btn-loading">
                  <span class="loading-spinner">🔄</span>
                  <span>测试中...</span>
                </span>
                <span v-else class="btn-content">
                  <span class="btn-icon">💾</span>
                  <span>保存Kimi密钥</span>
                </span>
              </button>
              <button 
                type="button" 
                @click="testKimiConnection" 
                class="btn magic-btn test-btn" 
                :disabled="!kimiToken.trim() || isTestingKimi"
              >
                <span v-if="isTestingKimi" class="btn-loading">
                  <span class="loading-spinner">🔄</span>
                  <span>测试中...</span>
                </span>
                <span v-else class="btn-content">
                  <span class="btn-icon">🧪</span>
                  <span>测试Kimi连接</span>
                </span>
              </button>
            </div>
          </form>

          <div v-if="kimiTestResult" class="test-result" :class="kimiTestResult.success ? 'success' : 'error'">
            <div class="result-icon">
              {{ kimiTestResult.success ? '✅' : '❌' }}
            </div>
            <div class="result-message">
              {{ kimiTestResult.message }}
            </div>
          </div>
        </div>

        <!-- DeepSeek API 配置 -->
        <div class="api-config-group">
          <h3 class="api-title">🧠 DeepSeek API (占卜解读)</h3>
          <form @submit.prevent="saveApiToken" class="api-form">
            <div class="input-group">
              <label for="apiToken">DeepSeek API 密钥：</label>
              <div class="token-input-container">
                <input
                  id="apiToken"
                  v-model="apiToken"
                  :type="showToken ? 'text' : 'password'"
                  placeholder="请输入你的DeepSeek API密钥"
                />
                <button 
                  type="button" 
                  @click="toggleTokenVisibility" 
                  class="toggle-visibility-btn"
                >
                  {{ showToken ? '🙈' : '👁️' }}
                </button>
              </div>
            </div>

            <div class="form-actions">
              <button type="submit" class="btn btn-accent magic-btn" :disabled="isTesting || !apiToken.trim()">
                <span v-if="isTesting" class="btn-loading">
                  <span class="loading-spinner">🔄</span>
                  <span>测试中...</span>
                </span>
                <span v-else class="btn-content">
                  <span class="btn-icon">💾</span>
                  <span>保存DeepSeek密钥</span>
                </span>
              </button>
              <button 
                type="button" 
                @click="testConnection" 
                class="btn magic-btn test-btn" 
                :disabled="!apiToken.trim() || isTesting"
              >
                <span v-if="isTesting" class="btn-loading">
                  <span class="loading-spinner">🔄</span>
                  <span>测试中...</span>
                </span>
                <span v-else class="btn-content">
                  <span class="btn-icon">🧪</span>
                  <span>测试DeepSeek连接</span>
                </span>
              </button>
            </div>
          </form>

          <div v-if="testResult" class="test-result" :class="testResult.success ? 'success' : 'error'">
            <div class="result-icon">
              {{ testResult.success ? '✅' : '❌' }}
            </div>
            <div class="result-message">
              {{ testResult.message }}
            </div>
          </div>
        </div>
      </div>

      <div class="settings-section">
        <h2 class="section-title">如何获取API密钥</h2>
        <div class="help-content">
          <div class="api-help-group">
            <h4>🌙 Kimi API密钥获取：</h4>
            <ol class="help-steps">
              <li>访问 <a href="https://platform.moonshot.cn" target="_blank" class="help-link">Kimi开放平台</a></li>
              <li>注册并登录你的账户</li>
              <li>在控制台中创建新的API密钥</li>
              <li>复制密钥并粘贴到上方Kimi输入框中</li>
            </ol>
          </div>

          <div class="api-help-group">
            <h4>🧠 DeepSeek API密钥获取：</h4>
            <ol class="help-steps">
              <li>访问 <a href="https://platform.deepseek.com" target="_blank" class="help-link">DeepSeek开放平台</a></li>
              <li>注册并登录你的账户</li>
              <li>在控制台中创建新的API密钥</li>
              <li>复制密钥并粘贴到上方DeepSeek输入框中</li>
            </ol>
          </div>
          
          <div class="help-note">
            <strong>重要说明：</strong>
            <ul>
              <li>📸 Kimi的视觉模型（moonshot-v1-vision-preview）刚发布，可能需要特殊权限</li>
              <li>🔮 如果视觉功能不可用，系统会自动使用文本模拟识别</li>
              <li>💡 两个API密钥都配置后，才能使用完整的图像占卜功能</li>
              <li>🔒 所有密钥仅保存在你的浏览器本地，不会上传到任何服务器</li>
              <li>⚠️ 如果Kimi API报错"模型未找到"，可能需要等待官方开放或申请权限</li>
            </ul>
          </div>
        </div>
      </div>

      <div class="settings-section">
        <h2 class="section-title">关于应用</h2>
        <div class="about-content">
          <div class="app-info">
            <h3 class="magic-font">🔮 塔罗占卜网站</h3>
            <p>版本：1.0.0</p>
            <p>一个结合AI技术的现代塔罗占卜体验</p>
          </div>
          
          <div class="features-list">
            <h4>主要功能：</h4>
            <ul>
              <li>📸 智能拍照识别塔罗排阵</li>
              <li>🤖 AI驱动的占卜解析</li>
              <li>🎨 精美的魔法风格界面</li>
              <li>📱 响应式设计，支持移动设备</li>
              <li>🔒 本地数据存储，保护隐私</li>
            </ul>
          </div>
        </div>
      </div>

      <div class="settings-section">
        <h2 class="section-title">数据管理</h2>
        <div class="data-management">
          <p class="data-info">
            清除本地存储的数据，包括API密钥和占卜历史。
          </p>
          <button @click="clearAllData" class="btn btn-danger">
            🗑️ 清除所有数据
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { useTarotStore } from '../stores/tarot'
import { DeepSeekAPI, KimiAPI } from '../services/api'
import { showSuccessToast, showErrorToast } from '../utils/toast'

export default {
  name: 'Settings',
  setup() {
    const tarotStore = useTarotStore()
    
    const apiToken = ref('')
    const kimiToken = ref('')
    const showToken = ref(false)
    const showKimiToken = ref(false)
    const isTesting = ref(false)
    const isTestingKimi = ref(false)
    const testResult = ref(null)
    const kimiTestResult = ref(null)

    const toggleTokenVisibility = () => {
      showToken.value = !showToken.value
    }

    const toggleKimiTokenVisibility = () => {
      showKimiToken.value = !showKimiToken.value
    }

    const saveKimiToken = async () => {
      if (!kimiToken.value.trim()) {
        showErrorToast('请输入Kimi API密钥', '配置错误')
        return
      }

      tarotStore.setKimiToken(kimiToken.value.trim())
      
      // 自动测试连接
      await testKimiConnection()
      
      if (kimiTestResult.value?.success) {
        showSuccessToast('Kimi API密钥已保存并测试成功！现在可以使用图像识别功能了', '🌙 Kimi配置成功')
      }
    }

    const saveApiToken = async () => {
      if (!apiToken.value.trim()) {
        showErrorToast('请输入DeepSeek API密钥', '配置错误')
        return
      }

      tarotStore.setDeepSeekToken(apiToken.value.trim())
      
      // 自动测试连接
      await testConnection()
      
      if (testResult.value?.success) {
        showSuccessToast('DeepSeek API密钥已保存并测试成功！现在可以使用占卜解读功能了', '🧠 DeepSeek配置成功')
      }
    }

    const testKimiConnection = async () => {
      if (!kimiToken.value.trim()) {
        kimiTestResult.value = {
          success: false,
          message: '请先输入Kimi API密钥'
        }
        return
      }

      isTestingKimi.value = true
      kimiTestResult.value = null

      try {
        const api = new KimiAPI(kimiToken.value.trim())
        const connectionResult = await api.testConnection()
        
        if (connectionResult.basic) {
          if (connectionResult.vision) {
            kimiTestResult.value = {
              success: true,
              message: 'Kimi API连接测试成功！✅ 基础功能正常 ✅ Vision图像识别功能可用'
            }
          } else {
            kimiTestResult.value = {
              success: false,
              message: `Kimi API基础连接成功，但Vision图像识别功能不可用。错误信息: ${connectionResult.visionError || '未知错误'}`
            }
          }
        } else {
          kimiTestResult.value = {
            success: false,
            message: 'Kimi API连接失败'
          }
        }
      } catch (error) {
        console.error('Kimi API测试失败:', error)
        
        let errorMessage = 'Kimi连接测试失败'
        
        if (error.response) {
          const status = error.response.status
          const errorData = error.response.data
          
          if (status === 401) {
            errorMessage = 'Kimi API密钥无效，请检查密钥是否正确'
          } else if (status === 429) {
            errorMessage = 'Kimi API调用频率过高，请稍后再试'
          } else if (status === 403) {
            errorMessage = 'Kimi API密钥权限不足或已被禁用'
          } else if (errorData?.error?.message) {
            errorMessage = `Kimi API错误: ${errorData.error.message}`
          } else {
            errorMessage = `Kimi API错误 (${status}): 请检查密钥是否正确`
          }
        } else if (error.request) {
          errorMessage = '网络连接失败，请检查网络连接或稍后重试'
        } else {
          errorMessage = error.message || 'Kimi API未知错误，请重试'
        }
        
        kimiTestResult.value = {
          success: false,
          message: errorMessage
        }
      } finally {
        isTestingKimi.value = false
      }
    }

    const testConnection = async () => {
      if (!apiToken.value.trim()) {
        testResult.value = {
          success: false,
          message: '请先输入DeepSeek API密钥'
        }
        return
      }

      isTesting.value = true
      testResult.value = null

      try {
        const api = new DeepSeekAPI(apiToken.value.trim())
        const isConnected = await api.testConnection()
        
        testResult.value = {
          success: true,
          message: 'DeepSeek API连接测试成功！可以正常使用占卜功能。'
        }
      } catch (error) {
        console.error('DeepSeek API测试失败:', error)
        
        let errorMessage = 'DeepSeek连接测试失败'
        
        if (error.response) {
          const status = error.response.status
          const errorData = error.response.data
          
          if (status === 401) {
            errorMessage = 'DeepSeek API密钥无效，请检查密钥是否正确'
          } else if (status === 429) {
            errorMessage = 'DeepSeek API调用频率过高，请稍后再试'
          } else if (status === 403) {
            errorMessage = 'DeepSeek API密钥权限不足或已被禁用'
          } else if (errorData?.error?.message) {
            errorMessage = `DeepSeek API错误: ${errorData.error.message}`
          } else {
            errorMessage = `DeepSeek API错误 (${status}): 请检查密钥是否正确`
          }
        } else if (error.request) {
          errorMessage = '网络连接失败，请检查网络连接或稍后重试'
        } else {
          errorMessage = error.message || 'DeepSeek API未知错误，请重试'
        }
        
        testResult.value = {
          success: false,
          message: errorMessage
        }
      } finally {
        isTesting.value = false
      }
    }

    const clearAllData = () => {
      if (confirm('确定要清除所有本地数据吗？此操作不可恢复。')) {
        localStorage.clear()
        tarotStore.setDeepSeekToken('')
        tarotStore.setKimiToken('')
        tarotStore.clearSession()
        apiToken.value = ''
        kimiToken.value = ''
        testResult.value = null
        kimiTestResult.value = null
        showSuccessToast('所有本地数据已清除，包括API密钥和占卜历史', '🗑️ 数据清除完成')
      }
    }

    onMounted(() => {
      apiToken.value = tarotStore.deepseekToken
      kimiToken.value = tarotStore.kimiToken
    })

    return {
      apiToken,
      kimiToken,
      showToken,
      showKimiToken,
      isTesting,
      isTestingKimi,
      testResult,
      kimiTestResult,
      toggleTokenVisibility,
      toggleKimiTokenVisibility,
      saveApiToken,
      saveKimiToken,
      testConnection,
      testKimiConnection,
      clearAllData
    }
  }
}
</script>

<style scoped>
.settings-header {
  border-bottom: 2px solid rgba(255, 215, 0, 0.3);
  padding-bottom: 30px;
  margin-bottom: 40px;
}

.settings-header h1 {
  font-size: 2.5rem;
  background: linear-gradient(45deg, var(--accent-color), #ff6b6b, #4ecdc4);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 15px;
}

.settings-subtitle {
  font-size: 1.1rem;
  opacity: 0.8;
}

.settings-section {
  margin: 40px 0;
  padding: 30px 0;
  border-bottom: 1px solid rgba(255, 215, 0, 0.2);
}

.settings-section:last-child {
  border-bottom: none;
}

.section-title {
  color: var(--accent-color);
  font-size: 1.5rem;
  margin-bottom: 15px;
  font-family: 'Dancing Script', cursive;
  font-weight: 600;
}

.section-description {
  margin-bottom: 25px;
  line-height: 1.6;
  opacity: 0.9;
}

.api-config-group {
  margin: 30px 0;
  padding: 25px;
  background: rgba(255, 215, 0, 0.05);
  border-radius: 15px;
  border: 2px solid rgba(255, 215, 0, 0.2);
}

.api-title {
  color: var(--accent-color);
  font-size: 1.2rem;
  margin-bottom: 20px;
  font-weight: 600;
}

.api-help-group {
  margin: 25px 0;
  padding: 20px;
  background: rgba(255, 215, 0, 0.08);
  border-radius: 10px;
  border-left: 4px solid var(--accent-color);
}

.api-help-group h4 {
  color: var(--accent-color);
  margin-bottom: 15px;
  font-size: 1.1rem;
}

.api-form {
  max-width: 600px;
}

.token-input-container {
  position: relative;
  display: flex;
  align-items: center;
}

.token-input-container input {
  flex: 1;
  padding-right: 50px;
}

.toggle-visibility-btn {
  position: absolute;
  right: 10px;
  background: none;
  border: none;
  color: var(--accent-color);
  cursor: pointer;
  font-size: 1.2rem;
  padding: 5px;
}

.form-actions {
  display: flex;
  gap: 15px;
  margin-top: 25px;
}

.magic-btn {
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 140px;
  justify-content: center;
}

.magic-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none !important;
}

.magic-btn:not(:disabled):hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(123, 31, 162, 0.4);
}

.test-btn {
  background: linear-gradient(45deg, var(--secondary-color), #9c27b0);
}

.test-btn:not(:disabled):hover {
  box-shadow: 0 8px 25px rgba(156, 39, 176, 0.4);
}

.btn-content,
.btn-loading {
  display: flex;
  align-items: center;
  gap: 8px;
}

.btn-icon {
  font-size: 1.1rem;
}

.loading-spinner {
  animation: spin 1s linear infinite;
  font-size: 1.1rem;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.test-result {
  margin-top: 20px;
  padding: 15px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  gap: 10px;
}

.test-result.success {
  background: rgba(76, 175, 80, 0.2);
  border: 2px solid rgba(76, 175, 80, 0.5);
}

.test-result.error {
  background: rgba(244, 67, 54, 0.2);
  border: 2px solid rgba(244, 67, 54, 0.5);
}

.result-icon {
  font-size: 1.5rem;
}

.result-message {
  flex: 1;
  line-height: 1.4;
}

.help-content {
  background: rgba(255, 215, 0, 0.05);
  padding: 25px;
  border-radius: 15px;
  border: 2px solid rgba(255, 215, 0, 0.2);
}

.help-steps {
  margin: 20px 0;
  padding-left: 20px;
}

.help-steps li {
  margin: 10px 0;
  line-height: 1.5;
}

.help-link {
  color: var(--accent-color);
  text-decoration: none;
  font-weight: 500;
}

.help-link:hover {
  text-decoration: underline;
}

.help-note {
  margin-top: 25px;
  padding: 20px;
  background: rgba(255, 215, 0, 0.1);
  border-radius: 10px;
  border-left: 4px solid var(--accent-color);
}

.help-note strong {
  color: var(--accent-color);
  display: block;
  margin-bottom: 10px;
}

.help-note ul {
  margin: 10px 0;
  padding-left: 20px;
}

.help-note li {
  margin: 8px 0;
  line-height: 1.4;
}

.about-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 30px;
}

.app-info h3 {
  color: var(--accent-color);
  font-size: 1.3rem;
  margin-bottom: 15px;
}

.app-info p {
  margin: 8px 0;
  opacity: 0.9;
}

.features-list h4 {
  color: var(--accent-color);
  margin-bottom: 15px;
}

.features-list ul {
  padding-left: 20px;
}

.features-list li {
  margin: 8px 0;
  line-height: 1.4;
}

.data-management {
  background: rgba(244, 67, 54, 0.1);
  padding: 25px;
  border-radius: 15px;
  border: 2px solid rgba(244, 67, 54, 0.3);
}

.data-info {
  margin-bottom: 20px;
  line-height: 1.5;
}

.btn-danger {
  background: linear-gradient(45deg, #f44336, #d32f2f);
  color: white;
}

.btn-danger:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(244, 67, 54, 0.4);
}

@media (max-width: 768px) {
  .form-actions {
    flex-direction: column;
  }
  
  .about-content {
    grid-template-columns: 1fr;
    gap: 20px;
  }
  
  .settings-header h1 {
    font-size: 2rem;
  }
}
</style>