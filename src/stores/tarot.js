import { defineStore } from 'pinia'

export const useTarotStore = defineStore('tarot', {
  state: () => {
    console.log('=== 初始化Pinia Store ===')
    const state = {
      currentQuestion: localStorage.getItem('current_question') || '',
      selectedSpread: localStorage.getItem('selected_spread') || '',
      uploadedImage: localStorage.getItem('uploaded_image') || null,
      analysisResult: localStorage.getItem('analysis_result') || null,
      deepseekToken: localStorage.getItem('deepseek_token') || '',
      kimiToken: localStorage.getItem('kimi_token') || '',
      // 保持向后兼容
      apiToken: localStorage.getItem('deepseek_token') || ''
    }
    console.log('Store初始状态:', {
      currentQuestion: state.currentQuestion,
      selectedSpread: state.selectedSpread,
      uploadedImage: !!state.uploadedImage,
      analysisResult: !!state.analysisResult
    })
    return state
  },
  
  actions: {
    setQuestion(question) {
      this.currentQuestion = question
      localStorage.setItem('current_question', question)
    },
    
    setSpread(spread) {
      this.selectedSpread = spread
      localStorage.setItem('selected_spread', spread)
    },
    
    setUploadedImage(image) {
      this.uploadedImage = image
      if (image) {
        localStorage.setItem('uploaded_image', image)
      } else {
        localStorage.removeItem('uploaded_image')
      }
    },
    
    setAnalysisResult(result) {
      this.analysisResult = result
      if (result) {
        localStorage.setItem('analysis_result', result)
      } else {
        localStorage.removeItem('analysis_result')
      }
    },
    
    setApiToken(token) {
      this.apiToken = token
      this.deepseekToken = token
      localStorage.setItem('deepseek_token', token)
    },
    
    setDeepSeekToken(token) {
      this.deepseekToken = token
      this.apiToken = token // 保持向后兼容
      localStorage.setItem('deepseek_token', token)
    },
    
    setKimiToken(token) {
      this.kimiToken = token
      localStorage.setItem('kimi_token', token)
    },
    
    clearSession() {
      this.currentQuestion = ''
      this.selectedSpread = ''
      this.uploadedImage = null
      this.analysisResult = null
      localStorage.removeItem('current_question')
      localStorage.removeItem('selected_spread')
      localStorage.removeItem('uploaded_image')
      localStorage.removeItem('analysis_result')
    }
  }
})