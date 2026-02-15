# 安装指南

## 前置要求

在运行此项目之前，你需要安装以下软件：

### 1. 安装 Node.js

1. 访问 [Node.js官网](https://nodejs.org/)
2. 下载并安装 LTS 版本（推荐 18.x 或更高版本）
3. 安装完成后，重启命令行工具

### 2. 验证安装

打开命令行工具，运行以下命令验证安装：

```bash
node --version
npm --version
```

如果显示版本号，说明安装成功。

## 项目安装步骤

### 1. 克隆或下载项目

```bash
git clone <your-repo-url>
cd xiaodan
```

### 2. 安装依赖

```bash
npm install
```

### 3. 开发模式运行

```bash
npm run dev
```

项目将在 `http://localhost:5173` 启动

### 4. 构建生产版本

```bash
npm run build
```

构建完成后，文件将输出到 `dist` 目录

### 5. 预览构建结果

```bash
npm run preview
```

## 部署到 GitHub Pages

### 方法一：自动部署（推荐）

1. 将代码推送到 GitHub 仓库
2. 在仓库设置中启用 GitHub Pages
3. 选择 "GitHub Actions" 作为部署源
4. 每次推送到 main 分支时会自动部署

### 方法二：手动部署

1. 构建项目：`npm run build`
2. 将 `dist` 目录内容上传到 GitHub Pages

## 配置说明

### 修改部署路径

如果你的 GitHub 仓库名不是 `xiaodan`，需要修改 `vite.config.js`：

```javascript
export default defineConfig({
  base: '/your-repo-name/', // 改为你的仓库名
  // ...
})
```

### API 密钥配置

1. 访问 [DeepSeek开放平台](https://platform.deepseek.com)
2. 注册并获取 API 密钥
3. 在网站的设置页面配置密钥

## 常见问题

### Q: npm install 失败
A: 尝试使用 `npm install --legacy-peer-deps` 或切换到 yarn

### Q: 构建失败
A: 检查 Node.js 版本是否为 16+ 

### Q: GitHub Pages 部署失败
A: 检查仓库设置中是否正确启用了 GitHub Actions

### Q: API 调用失败
A: 检查 API 密钥是否正确，网络是否正常

## 技术支持

如果遇到问题，请：
1. 检查控制台错误信息
2. 查看 GitHub Actions 日志
3. 提交 Issue 获取帮助