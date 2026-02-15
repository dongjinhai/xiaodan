# 🔮 塔罗占卜网站

一个结合AI技术的现代塔罗占卜体验，使用Vue3构建，支持GitHub Pages部署。

## ✨ 功能特性

- 📸 **智能拍照识别** - 使用AI技术识别塔罗牌排阵
- 🤖 **AI驱动解析** - 集成DeepSeek API提供专业占卜解读
- 🎨 **魔法风格界面** - 精美的神秘主题设计
- 📱 **响应式设计** - 完美支持移动设备
- 🔒 **隐私保护** - 本地存储，保护用户数据
- 📸 **精美截图** - 生成可分享的占卜结果图片

## 🚀 快速开始

### 安装依赖
```bash
npm install
```

### 开发模式
```bash
npm run dev
```

### 构建生产版本
```bash
npm run build
```

### 预览构建结果
```bash
npm run preview
```

## 📋 使用说明

1. **配置API密钥**
   - 访问 [DeepSeek开放平台](https://platform.deepseek.com) 获取API密钥
   - 在设置页面配置你的API密钥

2. **开始占卜**
   - 输入占卜问题
   - 选择塔罗排阵类型
   - 拍照上传你的塔罗牌排阵
   - 获得AI解析结果

3. **保存结果**
   - 生成精美的占卜结果截图
   - 下载保存作为纪念

## 🎯 支持的塔罗排阵

- **单牌占卜** - 适合简单问题的快速占卜
- **三牌占卜** - 过去、现在、未来的时间线占卜
- **十字占卜** - 深入分析问题的各个方面
- **凯尔特十字** - 最经典的综合性占卜排阵

## 🛠 技术栈

- **前端框架**: Vue 3
- **构建工具**: Vite
- **状态管理**: Pinia
- **路由**: Vue Router
- **HTTP客户端**: Axios
- **截图功能**: html2canvas
- **AI服务**: DeepSeek API
- **部署**: GitHub Pages

## 📦 部署到GitHub Pages

1. Fork此仓库到你的GitHub账户
2. 在仓库设置中启用GitHub Pages
3. 选择GitHub Actions作为部署源
4. 推送代码到main分支，自动部署

## 🔧 配置说明

### Vite配置
项目已配置好GitHub Pages部署所需的base路径，如果你的仓库名不是`xiaodan`，请修改`vite.config.js`中的base配置：

```javascript
export default defineConfig({
  base: '/your-repo-name/',
  // ...
})
```

### API密钥安全
- API密钥仅存储在用户浏览器本地
- 不会上传到任何服务器
- 请妥善保管你的API密钥

## 🎨 自定义样式

项目使用CSS变量定义主题色彩，你可以在`src/style.css`中修改：

```css
:root {
  --primary-color: #4a148c;
  --secondary-color: #7b1fa2;
  --accent-color: #ffd700;
  /* ... */
}
```

## 📄 许可证

MIT License

## 🤝 贡献

欢迎提交Issue和Pull Request！

## 📞 支持

如果你在使用过程中遇到问题，请：
1. 检查API密钥是否正确配置
2. 确保网络连接正常
3. 查看浏览器控制台错误信息
4. 提交Issue获取帮助