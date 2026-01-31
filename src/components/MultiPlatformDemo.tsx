import React from 'react'

/**
 * 多端适配演示组件
 * 展示UniAdapter如何统一处理不同平台的差异
 */
export function MultiPlatformDemo() {
  return (
    <div className="p-4 max-w-md mx-auto">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-2xl font-bold mb-4 text-center">
          🚀 UniAdapter 演示
        </h1>
        
        <div className="mb-6 p-4 bg-blue-50 rounded-lg">
          <h2 className="font-semibold mb-2">当前平台信息：</h2>
          <ul className="text-sm space-y-1">
            <li>📱 这是一个多端适配演示</li>
            <li>💻 演示跨平台统一API</li>
            <li>📱 展示智能适配能力</li>
          </ul>
        </div>

        <div className="mb-6 p-4 bg-green-50 rounded-lg">
          <h2 className="font-semibold mb-2">统一状态管理：</h2>
          <div className="flex items-center justify-between">
            <span>状态管理演示</span>
            <button 
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              操作
            </button>
          </div>
        </div>

        <div className="mb-6 p-4 bg-yellow-50 rounded-lg">
          <h2 className="font-semibold mb-2">统一路由操作：</h2>
          <div className="space-y-2">
            <button 
              className="w-full px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            >
              跳转页面
            </button>
            <button 
              className="w-full px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
            >
              返回上页
            </button>
          </div>
        </div>

        <div className="p-4 bg-purple-50 rounded-lg">
          <h2 className="font-semibold mb-2">统一网络请求：</h2>
          <button 
            className="w-full px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600"
          >
            发起请求
          </button>
        </div>
      </div>
    </div>
  )
}