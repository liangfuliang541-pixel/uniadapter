import React, { useState, useEffect } from 'react'
import { usePlatform, useUniState, useUniRouter, useUniRequest } from '../hooks'

/**
 * 多平台适配器演示组件
 * 展示抖音、高德、小红书等新平台支持
 */
export function MultiPlatformAdapterDemo() {
  const platform = usePlatform()
  const [count, setCount] = useUniState(0)
  const { push } = useUniRouter()
  const [location, setLocation] = useState<string>('未获取')
  const [isSupported, setIsSupported] = useState(false)

  useEffect(() => {
    // 检查平台支持情况
    checkPlatformSupport()
    
    // 模拟位置获取
    getLocation()
  }, [platform])

  const checkPlatformSupport = async () => {
    // 检查不同平台的特有能力支持
    const supportMap: Record<string, string[]> = {
      'h5': ['相机', '位置', '通知', '分享'],
      'douyin': ['短视频', '直播', '电商', '社交'],
      'xiaohongshu': ['种草', '购物', '社区', '美妆'],
      'amap': ['地图', '导航', '定位', 'POI搜索'],
      'weapp': ['支付', '小程序', '社交', '工具'],
      'react-native': ['原生API', '硬件访问', '性能优化', '跨平台']
    }
    
    setIsSupported(supportMap[platform.type] !== undefined)
  }

  const getLocation = async () => {
    try {
      // 根据不同平台使用相应的定位API
      switch (platform.type) {
        case 'amap':
          // 高德地图定位
          setLocation('使用高德地图API获取位置')
          break
        case 'douyin':
          // 抖音小程序定位
          setLocation('使用抖音小程序定位API')
          break
        case 'xiaohongshu':
          // 小红书小程序定位
          setLocation('使用小红书小程序定位API')
          break
        default:
          // H5/Web定位
          if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
              (position) => {
                setLocation(`${position.coords.latitude}, ${position.coords.longitude}`)
              },
              () => setLocation('位置获取失败')
            )
          } else {
            setLocation('浏览器不支持定位')
          }
      }
    } catch (error) {
      setLocation('定位服务不可用')
    }
  }

  const handleShare = async () => {
    // 根据平台使用不同的分享方式
    const shareContent = {
      title: 'UniAdapter多平台适配器演示',
      text: `当前运行在${platform.name}平台，已适配${count}次操作`,
      url: window.location.href
    }

    switch (platform.type) {
      case 'douyin':
        // 抖音分享
        console.log('调用抖音分享API:', shareContent)
        break
      case 'xiaohongshu':
        // 小红书分享
        console.log('调用小红书分享API:', shareContent)
        break
      case 'amap':
        // 高德地图分享位置
        console.log('分享当前位置:', location)
        break
      default:
        // Web分享
        if (navigator.share) {
          try {
            await navigator.share(shareContent)
          } catch {
            // fallback to clipboard
            await navigator.clipboard.writeText(
              `${shareContent.title}\n${shareContent.text}\n${shareContent.url}`
            )
          }
        }
    }
  }

  const platformFeatures = {
    'h5': ['响应式设计', 'PWA支持', 'Web API', '跨浏览器兼容'],
    'douyin': ['短视频创作', '直播互动', '电商带货', '社交分享'],
    'xiaohongshu': ['内容种草', '购物分享', '社区互动', '美妆时尚'],
    'amap': ['精准定位', '路径规划', 'POI搜索', '地图渲染'],
    'weapp': ['微信支付', '社交登录', '小程序生态', '即用即走'],
    'react-native': ['原生性能', '硬件访问', '热更新', '跨平台']
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          🌐 UniAdapter 多平台适配器演示
        </h1>
        <p className="text-gray-600">
          智能检测并适配抖音、高德、小红书等多端平台
        </p>
      </div>

      {/* 平台信息卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
          <h2 className="text-xl font-semibold text-blue-800 mb-4">🎯 当前平台信息</h2>
          <div className="space-y-2">
            <p><span className="font-medium">平台类型:</span> {platform.type}</p>
            <p><span className="font-medium">平台名称:</span> {platform.name}</p>
            <p><span className="font-medium">版本:</span> {platform.version}</p>
            <p><span className="font-medium">设备类型:</span> {platform.isMobile ? '移动端' : '桌面端'}</p>
            <p><span className="font-medium">支持状态:</span> 
              <span className={isSupported ? 'text-green-600' : 'text-red-600'}>
                {isSupported ? ' ✅ 已适配' : ' ❌ 未适配'}
              </span>
            </p>
          </div>
        </div>

        <div className="bg-green-50 p-6 rounded-lg border border-green-200">
          <h2 className="text-xl font-semibold text-green-800 mb-4">📍 位置服务</h2>
          <div className="space-y-3">
            <p className="break-words">
              <span className="font-medium">当前位置:</span> {location}
            </p>
            <button 
              onClick={getLocation}
              className="w-full bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded transition-colors"
            >
              📍 重新获取位置
            </button>
          </div>
        </div>
      </div>

      {/* 功能演示区 */}
      <div className="bg-gray-50 p-6 rounded-lg mb-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">⚡ 功能演示</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button 
            onClick={() => setCount(count + 1)}
            className="bg-purple-500 hover:bg-purple-600 text-white py-3 px-4 rounded transition-colors"
          >
            🔢 点击计数 ({count})
          </button>
          
          <button 
            onClick={() => push('/next-page')}
            className="bg-indigo-500 hover:bg-indigo-600 text-white py-3 px-4 rounded transition-colors"
          >
            🔄 页面跳转
          </button>
          
          <button 
            onClick={handleShare}
            className="bg-pink-500 hover:bg-pink-600 text-white py-3 px-4 rounded transition-colors"
          >
            📤 分享内容
          </button>
        </div>
      </div>

      {/* 平台特性展示 */}
      <div className="bg-yellow-50 p-6 rounded-lg">
        <h2 className="text-xl font-semibold text-yellow-800 mb-4">✨ 平台特色功能</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {platformFeatures[platform.type as keyof typeof platformFeatures]?.map((feature, index) => (
            <div key={index} className="bg-white p-3 rounded border border-yellow-200">
              <span className="text-yellow-700">• {feature}</span>
            </div>
          )) || (
            <p className="text-yellow-700 col-span-full text-center py-4">
              当前平台暂无特殊功能配置
            </p>
          )}
        </div>
      </div>

      {/* 技术说明 */}
      <div className="mt-8 text-sm text-gray-500 text-center">
        <p>UniAdapter v1.0 - 统一多端适配器框架</p>
        <p>支持平台: H5、抖音小程序、小红书小程序、高德地图、微信小程序、React Native</p>
      </div>
    </div>
  )
}