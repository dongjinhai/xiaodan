@echo off
echo 开始构建塔罗占卜网站...

REM 检查 Node.js 是否安装
node --version >nul 2>&1
if errorlevel 1 (
    echo 错误：未检测到 Node.js，请先安装 Node.js
    echo 访问 https://nodejs.org/ 下载安装
    pause
    exit /b 1
)

echo Node.js 已安装，版本：
node --version

REM 安装依赖
echo 正在安装依赖...
npm install
if errorlevel 1 (
    echo 依赖安装失败，请检查网络连接
    pause
    exit /b 1
)

REM 构建项目
echo 正在构建项目...
npm run build
if errorlevel 1 (
    echo 构建失败，请检查代码
    pause
    exit /b 1
)

echo 构建完成！
echo 构建文件位于 dist 目录
echo 你可以将 dist 目录的内容部署到任何静态网站托管服务

pause