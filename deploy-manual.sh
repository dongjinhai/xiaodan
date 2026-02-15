#!/bin/bash

echo "开始构建和部署到GitHub Pages..."

echo ""
echo "1. 构建项目..."
npm run build
if [ $? -ne 0 ]; then
    echo "构建失败！"
    exit 1
fi

echo ""
echo "2. 添加所有文件到git..."
git add .

echo ""
echo "3. 提交更改..."
read -p "请输入提交信息 (默认: Update project): " commit_msg
commit_msg=${commit_msg:-"Update project"}
git commit -m "$commit_msg"

echo ""
echo "4. 推送到远程仓库..."
git push origin master

echo ""
echo "部署完成！"
echo "GitHub Actions将自动构建并部署到GitHub Pages"
echo "请稍等几分钟后访问您的GitHub Pages网站"