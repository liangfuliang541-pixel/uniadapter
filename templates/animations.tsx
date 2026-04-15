/**
 * VibeHub Template: Animations
 * 动画效果模板 - 包含多种动画效果和过渡动画
 *
 * Usage: uniadapter template add animations
 */
import { View, Text, Image } from '@tarojs/components'
import { Button } from '@liangfu/uniadapter'
import { useState, useEffect } from 'react'

interface AnimationPageProps {
  onAnimationComplete?: () => void
}

export function AnimationPage({ onAnimationComplete }: AnimationPageProps) {
  const [currentDemo, setCurrentDemo] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [toastMessage, setToastMessage] = useState('')
  const [loadingProgress, setLoadingProgress] = useState(0)

  // 演示项目
  const demos = [
    { id: 'fade', name: '淡入淡出', description: '基础的透明度动画' },
    { id: 'slide', name: '滑动动画', description: '从不同方向滑入' },
    { id: 'scale', name: '缩放动画', description: '大小变化效果' },
    { id: 'bounce', name: '弹跳动画', description: '弹性动画效果' },
    { id: 'rotate', name: '旋转动画', description: '旋转和翻转效果' },
    { id: 'loading', name: '加载动画', description: '进度条和加载指示器' }
  ]

  // 播放动画
  const playAnimation = (demoId: string) => {
    setIsAnimating(true)
    setCurrentDemo(demos.findIndex(d => d.id === demoId))

    // 模拟动画播放时间
    setTimeout(() => {
      setIsAnimating(false)
      if (demoId === 'loading') {
        setLoadingProgress(0)
      }
    }, 2000)
  }

  // 显示模态框
  const showModalAnimation = () => {
    setShowModal(true)
  }

  // 隐藏模态框
  const hideModalAnimation = () => {
    setShowModal(false)
  }

  // 显示Toast
  const showToast = (message: string) => {
    setToastMessage(message)
    setTimeout(() => setToastMessage(''), 3000)
  }

  // 加载进度动画
  useEffect(() => {
    if (currentDemo === 5 && isAnimating) { // loading demo
      const interval = setInterval(() => {
        setLoadingProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval)
            return 100
          }
          return prev + 10
        })
      }, 200)
      return () => clearInterval(interval)
    }
  }, [currentDemo, isAnimating])

  return (
    <View className="animation-page">
      {/* 标题 */}
      <View className="page-header">
        <Text className="page-title">动画效果演示</Text>
        <Text className="page-subtitle">探索各种动画效果和过渡动画</Text>
      </View>

      {/* 动画控制面板 */}
      <View className="control-panel">
        <Text className="panel-title">选择动画效果</Text>
        <View className="demo-buttons">
          {demos.map((demo, index) => (
            <Button
              key={demo.id}
              className={`demo-btn ${currentDemo === index && isAnimating ? 'active' : ''}`}
              onClick={() => playAnimation(demo.id)}
              disabled={isAnimating}
            >
              {demo.name}
            </Button>
          ))}
        </View>
      </View>

      {/* 动画演示区域 */}
      <View className="demo-area">
        {/* 淡入淡出动画 */}
        {currentDemo === 0 && (
          <View className={`demo-content fade-demo ${isAnimating ? 'animate' : ''}`}>
            <View className="fade-box">
              <Text className="demo-text">淡入淡出效果</Text>
            </View>
          </View>
        )}

        {/* 滑动动画 */}
        {currentDemo === 1 && (
          <View className="demo-content slide-demo">
            <View className={`slide-box from-left ${isAnimating ? 'animate' : ''}`}>
              <Text className="demo-text">从左滑入</Text>
            </View>
            <View className={`slide-box from-right ${isAnimating ? 'animate' : ''}`}>
              <Text className="demo-text">从右滑入</Text>
            </View>
            <View className={`slide-box from-top ${isAnimating ? 'animate' : ''}`}>
              <Text className="demo-text">从上滑入</Text>
            </View>
            <View className={`slide-box from-bottom ${isAnimating ? 'animate' : ''}`}>
              <Text className="demo-text">从下滑入</Text>
            </View>
          </View>
        )}

        {/* 缩放动画 */}
        {currentDemo === 2 && (
          <View className="demo-content scale-demo">
            <View className={`scale-box ${isAnimating ? 'animate' : ''}`}>
              <Text className="demo-text">缩放效果</Text>
            </View>
          </View>
        )}

        {/* 弹跳动画 */}
        {currentDemo === 3 && (
          <View className="demo-content bounce-demo">
            <View className={`bounce-box ${isAnimating ? 'animate' : ''}`}>
              <Text className="demo-text">弹跳效果</Text>
            </View>
          </View>
        )}

        {/* 旋转动画 */}
        {currentDemo === 4 && (
          <View className="demo-content rotate-demo">
            <View className={`rotate-box ${isAnimating ? 'animate' : ''}`}>
              <Text className="demo-text">旋转效果</Text>
            </View>
            <View className={`flip-box ${isAnimating ? 'animate' : ''}`}>
              <Text className="demo-text">翻转效果</Text>
            </View>
          </View>
        )}

        {/* 加载动画 */}
        {currentDemo === 5 && (
          <View className="demo-content loading-demo">
            <View className="loading-container">
              <View className="spinner"></View>
              <Text className="loading-text">加载中...</Text>
              <View className="progress-bar">
                <View
                  className="progress-fill"
                  style={{ width: `${loadingProgress}%` }}
                ></View>
              </View>
              <Text className="progress-text">{loadingProgress}%</Text>
            </View>
          </View>
        )}
      </View>

      {/* 其他动画演示 */}
      <View className="other-animations">
        <Text className="panel-title">其他动画效果</Text>
        <View className="animation-buttons">
          <Button
            className="anim-btn"
            onClick={showModalAnimation}
          >
            模态框动画
          </Button>
          <Button
            className="anim-btn"
            onClick={() => showToast('这是一个Toast提示')}
          >
            Toast动画
          </Button>
          <Button
            className="anim-btn"
            onClick={() => {
              setIsAnimating(true)
              setTimeout(() => setIsAnimating(false), 1000)
            }}
          >
            按钮点击效果
          </Button>
        </View>
      </View>

      {/* 模态框 */}
      {showModal && (
        <View className="modal-overlay" onClick={hideModalAnimation}>
          <View className="modal-content" onClick={(e: any) => e.stopPropagation()}>
            <Text className="modal-title">模态框动画</Text>
            <Text className="modal-text">这是一个带动画效果的模态框</Text>
            <Button className="modal-close-btn" onClick={hideModalAnimation}>
              关闭
            </Button>
          </View>
        </View>
      )}

      {/* Toast提示 */}
      {toastMessage && (
        <View className="toast">
          <Text className="toast-text">{toastMessage}</Text>
        </View>
      )}
    </View>
  )
}