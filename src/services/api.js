import axios from 'axios'

const DEEPSEEK_API_URL = 'https://api.deepseek.com/v1/chat/completions'
const KIMI_API_URL = 'https://api.moonshot.cn/v1/chat/completions'

export class KimiAPI {
  constructor(apiKey) {
    this.apiKey = apiKey
    this.client = axios.create({
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      }
    })
  }

  async recognizeCards(imageBase64, question, spread) {
    try {
      // 检测图片格式
      let imageFormat = 'jpeg'
      if (imageBase64.startsWith('/9j/')) {
        imageFormat = 'jpeg'
      } else if (imageBase64.startsWith('iVBORw0KGgo')) {
        imageFormat = 'png'
      } else if (imageBase64.startsWith('R0lGODlh')) {
        imageFormat = 'gif'
      } else if (imageBase64.startsWith('UklGR')) {
        imageFormat = 'webp'
      }

      console.log('调用Kimi Vision API，图片格式:', imageFormat)
      
      const response = await this.client.post(KIMI_API_URL, {
        model: 'kimi-k2.5',
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: `请仔细识别这张塔罗牌排阵图片中的所有塔罗牌。

占卜问题：${question}
排阵类型：${spread}

请按照以下格式严格回答，只返回识别结果，不要进行占卜解读：

识别到的塔罗牌：
1. 位置1：[塔罗牌名称] - [正位/逆位]
2. 位置2：[塔罗牌名称] - [正位/逆位]
...

注意：
- 请准确识别每张牌的名称（如：愚者、魔术师、女祭司等）
- 请判断每张牌是正位还是逆位
- 如果无法确定某张牌，请标注"无法识别"
- 只返回识别结果，不要添加其他内容`
              },
              {
                type: 'image_url',
                image_url: {
                  url: `data:image/${imageFormat};base64,${imageBase64}`
                }
              }
            ]
          }
        ],
        max_tokens: 1500,
        temperature: 1
      })

      const result = response.data.choices[0].message.content
      console.log('Kimi Vision API调用成功，返回结果:', result)
      return result

    } catch (error) {
      console.error('Kimi Vision API调用失败:', error)
      
      // 详细的错误日志
      if (error.response) {
        console.error('错误状态码:', error.response.status)
        console.error('错误响应:', error.response.data)
      }
      
      // 如果是模型不存在或权限问题，直接抛出错误，不使用备用方案
      if (error.response && (
          error.response.status === 404 || 
          error.response.status === 403 ||
          (error.response.data && error.response.data.error && 
           (error.response.data.error.message.includes('model') ||
            error.response.data.error.message.includes('permission') ||
            error.response.data.error.message.includes('not found')))
        )) {
        
        const errorMsg = error.response.data?.error?.message || error.response.data?.message || '模型不可用'
        throw new Error(`Kimi Vision模型暂时不可用: ${errorMsg}。请检查API密钥权限或稍后重试。`)
      }
      
      // 其他错误
      if (error.response) {
        const errorMessage = error.response.data?.error?.message || error.response.data?.message || '未知错误'
        throw new Error(`图片识别失败: ${error.response.status} - ${errorMessage}`)
      } else if (error.request) {
        throw new Error('网络连接失败，请检查网络连接')
      } else {
        throw new Error(`请求配置错误: ${error.message}`)
      }
    }
  }

  async testConnection() {
    try {
      // 首先测试基础模型连接
      console.log('测试Kimi基础API连接...')
      const basicResponse = await this.client.post(KIMI_API_URL, {
        model: 'kimi-k2.5',
        messages: [
          {
            role: 'user',
            content: '测试连接'
          }
        ],
        max_tokens: 10
      })
      
      if (basicResponse.status === 200) {
        console.log('Kimi基础API连接成功')
        
        // 测试Vision模型是否可用
        try {
          console.log('测试Kimi Vision模型可用性...')
          // 创建一个简单的测试图片（1x1像素的透明PNG）
          const testImageBase64 = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg=='
          
          const visionResponse = await this.client.post(KIMI_API_URL, {
            model: 'kimi-k2.5',
            messages: [
              {
                role: 'user',
                content: [
                  {
                    type: 'text',
                    text: '这是一个测试图片，请简单描述一下。'
                  },
                  {
                    type: 'image_url',
                    image_url: {
                      url: `data:image/png;base64,${testImageBase64}`
                    }
                  }
                ]
              }
            ],
            max_tokens: 50
          })
          
          if (visionResponse.status === 200) {
            console.log('Kimi Vision模型可用')
            return { basic: true, vision: true }
          }
        } catch (visionError) {
          console.warn('Kimi Vision模型不可用:', visionError.response?.data || visionError.message)
          return { basic: true, vision: false, visionError: visionError.response?.data?.error?.message || visionError.message }
        }
      }
      
      return { basic: true, vision: true }
    } catch (error) {
      console.error('Kimi API连接测试失败:', error)
      throw error
    }
  }
}

export class DeepSeekAPI {
  constructor(apiKey) {
    this.apiKey = apiKey
    this.client = axios.create({
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      }
    })
  }

  async analyzeCards(cardRecognitionResult, question, spread) {
    try {
      const spreadInfo = tarotSpreads.find(s => s.id === spread)
      const spreadName = spreadInfo ? spreadInfo.name : spread
      const positions = spreadInfo ? spreadInfo.positions : []
      
      const response = await this.client.post(DEEPSEEK_API_URL, {
        model: 'deepseek-chat',
        messages: [
          {
            role: 'user',
            content: `作为一位经验丰富的塔罗师，请根据以下信息进行专业的塔罗占卜解读：

占卜问题：${question}
排阵类型：${spreadName}
${positions.length > 0 ? `牌位含义：${positions.join('、')}` : ''}

识别到的塔罗牌：
${cardRecognitionResult}

请按照以下格式进行专业解读：

1. 牌面确认：确认识别到的塔罗牌和位置
2. 单牌解读：逐一解释每张牌在当前位置的含义和象征
3. 整体解析：结合问题和排阵给出综合性的占卜结果
4. 深度洞察：揭示隐藏的信息和潜在的发展趋势
5. 行动建议：给出具体的行动建议和指导

请用神秘而富有诗意的语言来表达，营造塔罗占卜的氛围。请确保解读内容与提出的问题高度相关，并体现塔罗牌的深层智慧。`
          }
        ],
        max_tokens: 2500,
        temperature: 0.8
      })

      return response.data.choices[0].message.content
    } catch (error) {
      console.error('DeepSeek API调用失败:', error)
      if (error.response) {
        const errorMessage = error.response.data?.error?.message || error.response.data?.message || '未知错误'
        throw new Error(`占卜解读失败: ${error.response.status} - ${errorMessage}`)
      } else if (error.request) {
        throw new Error('网络连接失败，请检查网络连接')
      } else {
        throw new Error(`请求配置错误: ${error.message}`)
      }
    }
  }

  async analyzeImage(imageBase64, question, spread) {
    try {
      // 保留原有的纯文本占卜功能作为备用
      const spreadInfo = tarotSpreads.find(s => s.id === spread)
      const spreadName = spreadInfo ? spreadInfo.name : spread
      const positions = spreadInfo ? spreadInfo.positions : []
      
      const response = await this.client.post(DEEPSEEK_API_URL, {
        model: 'deepseek-chat',
        messages: [
          {
            role: 'user',
            content: `作为一位经验丰富的塔罗师，请为以下占卜进行解读：

占卜问题：${question}
排阵类型：${spreadName}
${positions.length > 0 ? `牌位含义：${positions.join('、')}` : ''}

请你模拟进行塔罗牌占卜，并按照以下格式回答：

1. 抽取的塔罗牌：为每个牌位随机选择合适的塔罗牌（从78张塔罗牌中选择）
2. 牌面解读：解释每张牌在当前位置的含义和象征
3. 整体解析：结合问题和排阵给出综合性的占卜结果
4. 建议：给出具体的行动建议和指导

请用神秘而富有诗意的语言来表达，营造塔罗占卜的氛围。请确保解读内容与提出的问题高度相关。`
          }
        ],
        max_tokens: 2000,
        temperature: 0.8
      })

      return response.data.choices[0].message.content
    } catch (error) {
      console.error('DeepSeek API调用失败:', error)
      if (error.response) {
        const errorMessage = error.response.data?.error?.message || error.response.data?.message || '未知错误'
        throw new Error(`API调用失败: ${error.response.status} - ${errorMessage}`)
      } else if (error.request) {
        throw new Error('网络连接失败，请检查网络连接')
      } else {
        throw new Error(`请求配置错误: ${error.message}`)
      }
    }
  }

  async testConnection() {
    try {
      const response = await this.client.post(DEEPSEEK_API_URL, {
        model: 'deepseek-chat',
        messages: [
          {
            role: 'user',
            content: '测试连接'
          }
        ],
        max_tokens: 10
      })
      return response.status === 200
    } catch (error) {
      console.error('API连接测试失败:', error)
      throw error
    }
  }
}

export const tarotSpreads = [
  {
    id: 'single',
    name: '单牌占卜',
    description: '适合简单问题的快速占卜',
    positions: ['当前状况']
  },
  {
    id: 'three-card',
    name: '三牌占卜',
    description: '过去、现在、未来的时间线占卜',
    positions: ['过去', '现在', '未来']
  },
  {
    id: 'cross',
    name: '十字占卜',
    description: '深入分析问题的各个方面',
    positions: ['现状', '挑战', '过去影响', '可能未来', '建议']
  },
  {
    id: 'celtic-cross',
    name: '凯尔特十字',
    description: '最经典的综合性占卜排阵',
    positions: [
      '当前状况', '挑战/机遇', '远程过去', '近期过去',
      '可能未来', '近期未来', '你的方法', '外在影响',
      '内在感受', '最终结果'
    ]
  }
]