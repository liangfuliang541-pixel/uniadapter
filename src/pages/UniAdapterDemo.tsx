import React from 'react'

export default function UniAdapterDemo() {
  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">UniAdapter 多端适配演示</h1>
        <p className="text-gray-600 mb-6">一套代码，多端运行的智能适配框架</p>
        
        {/* 平台信息展示 */}
        <div className="bg-blue-50 rounded-lg p-4 mb-6">
          <h2 className="text-lg font-semibold text-blue-800 mb-2">当前平台信息</h2>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div>平台类型: <span className="font-medium">Web</span></div>
            <div>是否Web: <span className="font-medium">是</span></div>
            <div>是否移动端: <span className="font-medium">否</span></div>
            <div>是否小程序: <span className="font-medium">否</span></div>
            <div>是否App: <span className="font-medium">否</span></div>
            <div>用户代理: <span className="font-medium text-xs truncate">-</span></div>
          </div>
        </div>

        {/* 功能演示区域 */}
        <div className="space-y-4">
          <div className="bg-green-50 rounded-lg p-4">
            <h3 className="font-semibold text-green-800 mb-2">状态管理演示</h3>
            <p className="text-green-700 mb-3">计数器: 0</p>
            <button 
              className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition-colors"
            >
              点击增加
            </button>
          </div>

          <div className="bg-purple-50 rounded-lg p-4">
            <h3 className="font-semibold text-purple-800 mb-2">网络请求演示</h3>
            <p className="text-purple-700 mb-3">点击下方按钮测试API调用</p>
            <button 
              className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-lg transition-colors"
            >
              调用API测试
            </button>
          </div>

          <div className="bg-yellow-50 rounded-lg p-4">
            <h3 className="font-semibold text-yellow-800 mb-2">路由跳转演示</h3>
            <button 
              className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg transition-colors mr-2"
            >
              回到首页
            </button>
            <button 
              className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg transition-colors"
            >
              前往设置
            </button>
          </div>
        </div>
      </div>

      {/* 技术优势展示 */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">UniAdapter 核心优势</h2>
        
        <div className="grid md:grid-cols-2 gap-6">
          <div className="border-l-4 border-blue-500 pl-4">
            <h3 className="font-semibold text-lg text-gray-800 mb-2">智能平台检测</h3>
            <p className="text-gray-600">自动识别运行环境，无需手动配置</p>
          </div>
          
          <div className="border-l-4 border-green-500 pl-4">
            <h3 className="font-semibold text-lg text-gray-800 mb-2">统一API接口</h3>
            <p className="text-gray-600">一套代码适配Web、小程序、App所有平台</p>
          </div>
          
          <div className="border-l-4 border-purple-500 pl-4">
            <h3 className="font-semibold text-lg text-gray-800 mb-2">零学习成本</h3>
            <p className="text-gray-600">基于React Hooks，开发者无需学习新概念</p>
          </div>
          
          <div className="border-l-4 border-yellow-500 pl-4">
            <h3 className="font-semibold text-lg text-gray-800 mb-2">渐进式采用</h3>
            <p className="text-gray-600">可以逐步替换现有代码，无侵入性</p>
          </div>
        </div>
      </div>
    </div>
  )
}