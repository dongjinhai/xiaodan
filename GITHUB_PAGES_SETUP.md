# GitHub Pages 设置指南

## 🚨 重要：需要手动配置GitHub Pages设置

由于权限问题，您需要在GitHub仓库中手动启用Pages功能：

### 📋 步骤说明：

1. **访问仓库设置**：
   - 打开 https://github.com/dongjinhai/xiaodan
   - 点击 "Settings" 标签页

2. **找到Pages设置**：
   - 在左侧菜单中找到 "Pages"
   - 点击进入Pages设置页面

3. **配置部署源**：
   - **Source**: 选择 "GitHub Actions"
   - ⚠️ **不要选择** "Deploy from a branch"

4. **保存设置**：
   - 设置会自动保存
   - 等待几分钟让设置生效

### 🔧 如果仍然有权限问题：

#### 方法一：启用Actions权限
1. 进入仓库 Settings → Actions → General
2. 在 "Workflow permissions" 部分：
   - 选择 "Read and write permissions"
   - 勾选 "Allow GitHub Actions to create and approve pull requests"
3. 点击 "Save"

#### 方法二：使用Personal Access Token
如果上述方法不行，可以创建个人访问令牌：

1. **创建Token**：
   - 访问 https://github.com/settings/tokens
   - 点击 "Generate new token (classic)"
   - 选择权限：`repo`, `workflow`, `write:packages`
   - 生成并复制token

2. **添加到仓库Secrets**：
   - 进入仓库 Settings → Secrets and variables → Actions
   - 点击 "New repository secret"
   - Name: `DEPLOY_TOKEN`
   - Value: 粘贴您的token

3. **修改workflow文件**：
   - 将 `github_token: ${{ secrets.GITHUB_TOKEN }}` 
   - 改为 `github_token: ${{ secrets.DEPLOY_TOKEN }}`

### ✅ 验证部署：

1. **查看Actions状态**：
   - 访问 https://github.com/dongjinhai/xiaodan/actions
   - 确认workflow运行成功

2. **访问网站**：
   - 部署成功后访问：https://dongjinhai.github.io/xiaodan/

### 🔍 故障排除：

**如果网站显示404**：
- 等待5-10分钟让DNS生效
- 检查Actions是否成功运行
- 确认Pages设置正确

**如果样式丢失**：
- 检查vite.config.js中的base路径
- 确认构建文件路径正确

**如果Actions失败**：
- 检查Node.js版本兼容性
- 查看详细错误日志
- 确认所有依赖都在package.json中

### 📞 需要帮助？

如果遇到问题，请提供：
1. Actions运行的错误日志
2. Pages设置的截图
3. 具体的错误信息

---

**注意**：GitHub Pages有时需要几分钟才能生效，请耐心等待！