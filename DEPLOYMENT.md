# 塔罗牌占卜网站 - 部署指南

## 🚀 自动部署到GitHub Pages

### 方法一：使用GitHub Actions（推荐）

1. **推送代码到GitHub**：
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push origin master
   ```

2. **GitHub Actions自动部署**：
   - 推送后，GitHub Actions会自动触发
   - 构建过程大约需要2-3分钟
   - 部署完成后可以访问：`https://你的用户名.github.io/xiaodan/`

### 方法二：使用部署脚本

**Windows用户**：
```bash
./deploy-manual.bat
```

**Linux/Mac用户**：
```bash
./deploy-manual.sh
```

## 📋 部署前检查清单

- ✅ 项目构建成功 (`npm run build`)
- ✅ GitHub仓库已创建并连接
- ✅ GitHub Pages已启用
- ✅ 分支设置为 `master`
- ✅ Vite配置中的base路径正确

## 🔧 配置说明

### Vite配置 (vite.config.js)
```javascript
export default defineConfig({
  plugins: [vue()],
  base: process.env.NODE_ENV === 'production' ? '/xiaodan/' : '/',
  build: {
    outDir: 'dist',
    assetsDir: 'assets'
  }
})
```

### GitHub Pages设置
1. 进入GitHub仓库设置
2. 找到"Pages"选项
3. Source选择"Deploy from a branch"
4. Branch选择"gh-pages"
5. Folder选择"/ (root)"

## 🌐 访问网站

部署成功后，您的网站将在以下地址可用：
- **GitHub Pages**: `https://你的用户名.github.io/xiaodan/`

## 🛠️ 本地开发

```bash
# 安装依赖
npm install

# 开发模式
npm run dev

# 构建项目
npm run build

# 预览构建结果
npm run preview
```

## 📝 注意事项

1. **API密钥安全**：
   - API密钥仅存储在浏览器本地
   - 不会被包含在构建文件中
   - 用户需要在设置页面自行配置

2. **浏览器兼容性**：
   - 支持现代浏览器
   - 需要支持ES6+和WebGL（用于html2canvas）

3. **HTTPS要求**：
   - GitHub Pages自动提供HTTPS
   - API调用需要HTTPS环境

## 🔍 故障排除

### 构建失败
- 检查Node.js版本（推荐18+）
- 运行 `npm ci` 重新安装依赖
- 检查代码语法错误

### 部署失败
- 检查GitHub Actions日志
- 确认分支名称正确
- 检查GitHub Pages设置

### 页面空白
- 检查浏览器控制台错误
- 确认base路径配置正确
- 检查资源文件路径