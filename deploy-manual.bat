@echo off
echo 开始构建和部署到GitHub Pages...

echo.
echo 1. 构建项目...
call npm run build
if %errorlevel% neq 0 (
    echo 构建失败！
    pause
    exit /b 1
)

echo.
echo 2. 添加所有文件到git...
git add .

echo.
echo 3. 提交更改...
set /p commit_msg="请输入提交信息 (默认: Update project): "
if "%commit_msg%"=="" set commit_msg=Update project
git commit -m "%commit_msg%"

echo.
echo 4. 推送到远程仓库...
git push origin master

echo.
echo 部署完成！
echo GitHub Actions将自动构建并部署到GitHub Pages
echo 请稍等几分钟后访问您的GitHub Pages网站
pause