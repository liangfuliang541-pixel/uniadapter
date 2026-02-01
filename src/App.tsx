/**
 * ============================================
 * 心迹 XinJi - 情绪追踪日记应用
 * ============================================
 * 
 * 主应用入口文件
 * 
 * 功能：
 * - 配置路由系统
 * - 渲染底部导航栏
 * - 管理页面切换
 * 
 * 技术栈：React + React Router + TypeScript
 */

import { BrowserRouter, Routes, Route, useLocation, useNavigate } from 'react-router-dom'
import { Home, Calendar, BookOpen, BarChart3, Settings } from 'lucide-react'
import { cn } from '@/lib/utils'

// 页面组件导入
import HomePage from '@/pages/HomePage'           // 首页 - 心情签到
import CalendarPage from '@/pages/CalendarPage'   // 日历 - 心情日历视图
import JournalPage from '@/pages/JournalPage'     // 日记 - 日记列表
import InsightsPage from '@/pages/InsightsPage'   // 洞察 - 数据分析
import SettingsPage from '@/pages/SettingsPage'   // 设置 - 应用设置
import FeedbackHistoryPage from '@/pages/FeedbackHistoryPage' // 反馈历史 - 用户反馈记录
import VibeNestDemo from '@/vibenest/VibeNestDemo' // VibeNest创意展示系统

// 其他组件导入
import FeedbackFloatingButton from '@/components/FeedbackFloatingButton'

/**
 * 底部导航配置
 * path: 路由路径
 * icon: 图标组件
 * label: 显示文字
 */
const navItems = [
  { path: '/', icon: Home, label: '首页' },
  { path: '/calendar', icon: Calendar, label: '日历' },
  { path: '/journal', icon: BookOpen, label: '日记' },
  { path: '/insights', icon: BarChart3, label: '洞察' },
  { path: '/vibenest', icon: BarChart3, label: 'VibeNest' },
  { path: '/settings', icon: Settings, label: '设置' },
]

/**
 * 底部导航栏组件
 * 使用毛玻璃效果，固定在屏幕底部
 */
function NavBar() {
  const location = useLocation()  // 获取当前路由
  const navigate = useNavigate()  // 路由跳转函数
  
  return (
    <nav className="nav-bar">
      <div className="glass max-w-md mx-auto flex justify-around items-center py-2 px-4">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={cn('nav-item', isActive && 'active')}
            >
              <item.icon className="w-5 h-5" />
              <span className="text-xs font-medium">{item.label}</span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}

/**
 * 应用内容区域
 * 包含路由配置和导航栏
 */
function AppContent() {
  return (
    <div 
      className="min-h-screen"
      style={{ 
        background: 'var(--gradient-hero)',
        paddingBottom: 'calc(80px + var(--safe-bottom, 0px))'  // 为底部导航留出空间
      }}
    >
      {/* 路由配置 */}
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/calendar" element={<CalendarPage />} />
        <Route path="/journal" element={<JournalPage />} />
        <Route path="/insights" element={<InsightsPage />} />
        <Route path="/vibenest" element={<VibeNestDemo />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/feedback-history" element={<FeedbackHistoryPage />} />
      </Routes>
      
      {/* 底部导航 */}
      <NavBar />
      
      {/* 反馈浮动按钮 */}
      <FeedbackFloatingButton />
    </div>
  )
}

/**
 * 应用根组件
 * 包裹BrowserRouter提供路由功能
 */
export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  )
}
