@echo off
echo ========================================
echo 心迹移动版开发环境设置
echo ========================================

echo 正在检查必要工具...

:: 检查Node.js
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo 错误: 未找到Node.js，请先安装Node.js (>=16)
    echo 下载地址: https://nodejs.org/
    pause
    exit /b 1
)

echo Node.js已安装
node --version

:: 检查npm
npm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo 错误: 未找到npm
    pause
    exit /b 1
)

echo npm已安装
npm --version

:: 进入项目目录
cd /d "%~dp0rn-app"

:: 安装依赖
echo 正在安装项目依赖...
npm install

if %errorlevel% neq 0 (
    echo 依赖安装失败
    pause
    exit /b 1
)

echo.
echo ========================================
echo 开发环境设置完成！
echo ========================================
echo.
echo 启动开发服务器:
echo   npm start
echo.
echo 运行Android应用:
echo   npm run android
echo.
echo 运行iOS应用 (仅Mac):
echo   npm run ios
echo.
pause