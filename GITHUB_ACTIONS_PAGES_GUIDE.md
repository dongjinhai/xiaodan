# GitHub Actions + GitHub Pages 完整配置指南

## 🎯 目标
使用GitHub Actions自动构建和部署Vue.js项目到GitHub Pages

## 📋 完整配置步骤

### 1. 仓库设置

#### 1.1 启用GitHub Pages
1. 访问仓库设置：`https://github.com/你的用户名/仓库名/settings/pages`
2. **Source** 选择：`GitHub Actions`
3. **不要**选择 "Deploy from a branch"

#### 1.2 配置Actions权限
1. 访问：`https://github.com/你的用户名/仓库名/settings/actions`
2. 在 **Workflow permissions** 部分：
   - ✅ 选择 `Read and write permissions`
   - ✅ 勾选 `Allow GitHub Actions to create and approve pull requests`
3. 点击 **Save**

### 2. GitHub Actions配置文件

创建 `.github/workflows/deploy.yml`：

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ master ]  # 或者 main，根据你的默认分支

# 设置GITHUB_TOKEN的权限
permissions:
  contents: read
  pages: write
  id-token: write

# 允许一个并发部署
concurrency:
  group: "pages"
  cancel-in-progress: false

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Build
        run: npm run build

      - name: Setup Pages
        uses: actions/configure-pages@v4

      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: ./dist

  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    needs: build
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

### 3. Vite配置 (vite.config.js)

```javascript
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  base: process.env.NODE_ENV === 'production' ? '/仓库名/' : '/',
  build: {
    outDir: 'dist',
    assetsDir: 'assets'
  }
})
```

### 4. 项目结构要求

```
your-repo/
├── .github/
│   └── workflows/
│       └── deploy.yml
├── src/
├── public/
├── package.json
├── vite.config.js
└── index.html
```

### 5. package.json脚本

确保有以下脚本：

```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  }
}
```

## 🔧 关键配置说明

### Actions权限解释

```yaml
permissions:
  contents: read      # 读取仓库内容
  pages: write        # 写入Pages
  id-token: write     # 写入ID token（用于OIDC）
```

### 部署流程

1. **build** job：
   - 检出代码
   - 安装Node.js和依赖
   - 构建项目
   - 上传构建产物

2. **deploy** job：
   - 等待build完成
   - 部署到GitHub Pages

### 环境配置

```yaml
environment:
  name: github-pages
  url: ${{ steps.deployment.outputs.page_url }}
```

这会创建一个名为 `github-pages` 的环境，可以在仓库设置中看到。

## 🚨 常见问题解决

### 问题1：权限被拒绝 (403错误)

**解决方案**：
1. 确认Pages设置为 "GitHub Actions"
2. 检查Workflow permissions设置
3. 确认仓库是public或者有GitHub Pro

### 问题2：找不到构建文件

**检查**：
- `vite.config.js` 中的 `outDir` 设置
- Actions中的 `path: ./dist` 是否正确

### 问题3：资源路径错误

**解决方案**：
- 确认 `base` 路径配置正确
- 检查构建后的HTML中的资源路径

### 问题4：Actions运行失败

**调试步骤**：
1. 查看Actions日志
2. 检查Node.js版本兼容性
3. 确认所有依赖都在package.json中

## ✅ 验证部署

### 1. 检查Actions状态
访问：`https://github.com/你的用户名/仓库名/actions`

### 2. 查看Pages环境
访问：`https://github.com/你的用户名/仓库名/deployments`

### 3. 访问网站
URL：`https://你的用户名.github.io/仓库名/`

## 🔄 更新部署

每次推送到master分支时，Actions会自动运行：

```bash
git add .
git commit -m "Update website"
git push origin master
```

## 📊 监控和日志

- **Actions日志**：详细的构建和部署过程
- **Pages设置**：显示最后部署时间和状态
- **Environments**：显示部署历史

## 🎉 完成！

配置完成后，您的网站将在每次推送时自动更新！

---

**注意**：首次部署可能需要5-10分钟才能访问，后续更新通常在2-3分钟内生效。