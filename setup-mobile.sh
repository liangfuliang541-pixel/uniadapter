#!/bin/bash

# 心迹移动版快速启动脚本

echo "🚀 心迹移动版开发环境设置"

# 检查Node.js版本
echo "🔍 检查Node.js环境..."
node_version=$(node --version)
echo "Node.js版本: $node_version"

# 检查npm版本
npm_version=$(npm --version)
echo "npm版本: $npm_version"

# 安装React Native CLI
echo "📦 安装React Native CLI..."
npm install -g react-native-cli

# 进入项目目录
cd rn-app

# 安装项目依赖
echo "📥 安装项目依赖..."
npm install

# 检查平台
platform=$(uname)

if [[ "$platform" == "Darwin" ]]; then
    echo "🍎 检测到macOS系统"
    echo "📱 初始化iOS项目..."
    
    # 检查Xcode命令行工具
    if ! command -v xcodebuild &> /dev/null; then
        echo "⚠️  请先安装Xcode命令行工具"
        echo "   运行: xcode-select --install"
    else
        echo "✅ Xcode命令行工具已安装"
    fi
    
    # 安装CocoaPods依赖
    if [ -d "ios" ]; then
        echo "💎 安装iOS依赖..."
        cd ios && pod install && cd ..
    fi
    
    echo "📱 启动iOS模拟器..."
    npm run ios
    
elif [[ "$platform" == "Linux" ]] || [[ "$platform" == "MINGW64"* ]]; then
    echo "🤖 检测到Linux/Windows系统"
    echo "📱 初始化Android项目..."
    
    # 检查Android环境
    if [ -z "$ANDROID_HOME" ]; then
        echo "⚠️  请设置ANDROID_HOME环境变量"
        echo "   示例: export ANDROID_HOME=/Users/username/Library/Android/sdk"
    else
        echo "✅ Android环境已配置"
    fi
    
    echo "📱 启动Android模拟器..."
    npm run android
fi

echo "🚀 启动Metro开发服务器..."
npm start