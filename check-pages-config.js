#!/usr/bin/env node

/**
 * GitHub Pages 配置检查脚本
 * 运行: node check-pages-config.js
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 GitHub Pages 配置检查\n');

const checks = [];

// 1. 检查GitHub Actions配置文件
const workflowPath = '.github/workflows/deploy.yml';
if (fs.existsSync(workflowPath)) {
  console.log('✅ GitHub Actions配置文件存在');
  
  const content = fs.readFileSync(workflowPath, 'utf8');
  
  // 检查关键配置
  if (content.includes('permissions:')) {
    console.log('✅ 权限配置存在');
  } else {
    console.log('❌ 缺少权限配置');
    checks.push('添加permissions配置');
  }
  
  if (content.includes('pages: write')) {
    console.log('✅ Pages写入权限配置正确');
  } else {
    console.log('❌ 缺少Pages写入权限');
    checks.push('添加pages: write权限');
  }
  
  if (content.includes('actions/deploy-pages@v4')) {
    console.log('✅ 使用官方Pages部署Action');
  } else {
    console.log('⚠️  建议使用官方Pages部署Action');
  }
  
} else {
  console.log('❌ GitHub Actions配置文件不存在');
  checks.push('创建.github/workflows/deploy.yml文件');
}

// 2. 检查Vite配置
const viteConfigPath = 'vite.config.js';
if (fs.existsSync(viteConfigPath)) {
  console.log('✅ Vite配置文件存在');
  
  const content = fs.readFileSync(viteConfigPath, 'utf8');
  
  if (content.includes('base:')) {
    console.log('✅ Base路径配置存在');
    
    // 尝试提取仓库名
    const match = content.match(/base:.*['"`]\/([^\/'"` ]+)\/['"`]/);
    if (match) {
      console.log(`📁 检测到仓库名: ${match[1]}`);
    }
  } else {
    console.log('⚠️  建议配置base路径');
    checks.push('在vite.config.js中配置base路径');
  }
  
} else {
  console.log('❌ Vite配置文件不存在');
  checks.push('创建vite.config.js文件');
}

// 3. 检查package.json
const packagePath = 'package.json';
if (fs.existsSync(packagePath)) {
  console.log('✅ package.json存在');
  
  const pkg = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
  
  if (pkg.scripts && pkg.scripts.build) {
    console.log('✅ 构建脚本存在');
  } else {
    console.log('❌ 缺少构建脚本');
    checks.push('在package.json中添加build脚本');
  }
  
} else {
  console.log('❌ package.json不存在');
  checks.push('创建package.json文件');
}

// 4. 检查构建输出目录
if (fs.existsSync('dist')) {
  console.log('✅ 构建输出目录存在');
  
  if (fs.existsSync('dist/index.html')) {
    console.log('✅ 构建输出包含index.html');
  } else {
    console.log('⚠️  构建输出中没有index.html');
  }
} else {
  console.log('⚠️  构建输出目录不存在（运行npm run build创建）');
}

// 5. 输出检查结果
console.log('\n📋 配置检查完成\n');

if (checks.length === 0) {
  console.log('🎉 所有配置看起来都正确！');
  console.log('\n📝 接下来需要手动配置：');
  console.log('1. 在GitHub仓库设置中启用Pages');
  console.log('2. Source选择"GitHub Actions"');
  console.log('3. 配置Actions权限为"Read and write"');
} else {
  console.log('⚠️  发现以下需要修复的问题：');
  checks.forEach((check, index) => {
    console.log(`${index + 1}. ${check}`);
  });
}

console.log('\n🔗 相关链接：');
console.log('- Actions状态: https://github.com/你的用户名/仓库名/actions');
console.log('- Pages设置: https://github.com/你的用户名/仓库名/settings/pages');
console.log('- Actions权限: https://github.com/你的用户名/仓库名/settings/actions');