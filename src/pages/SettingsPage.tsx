/**
 * 设置页面
 */

import { useState } from 'react'
import { 
  Bell, Shield, Download, Trash2, 
  ChevronRight, Moon, Sun, Smartphone, 
  Award, Info, Heart, ExternalLink
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useExport, useMoodStats } from '@/hooks/useJournal'
import { useToast } from '@/hooks/useToast'
import { ACHIEVEMENTS, getUnlockedAchievements, type AchievementStats } from '@/core/quotes'
import { AchievementList } from '@/components/AchievementBadge'
import { ToastContainer } from '@/components'

type Theme = 'light' | 'dark' | 'system'

export default function SettingsPage() {
  const [theme, setTheme] = useState<Theme>('system')
  const [showAchievements, setShowAchievements] = useState(false)
  const { stats } = useMoodStats()
  const { exporting, exportJSON, exportMarkdown } = useExport()
  const toast = useToast()
  
  const handleThemeChange = (newTheme: Theme) => {
    setTheme(newTheme)
    // 实际应用主题
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark')
    } else if (newTheme === 'light') {
      document.documentElement.classList.remove('dark')
    } else {
      // system
      if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        document.documentElement.classList.add('dark')
      } else {
        document.documentElement.classList.remove('dark')
      }
    }
    toast.success('主题已更新')
  }
  
  const handleExportJSON = async () => {
    await exportJSON()
    toast.success('数据已导出为JSON格式')
  }
  
  const handleExportMD = async () => {
    await exportMarkdown()
    toast.success('数据已导出为Markdown格式')
  }
  
  const handleClearData = () => {
    if (confirm('确定要清除所有数据吗？此操作不可恢复！')) {
      localStorage.clear()
      toast.success('数据已清除，即将刷新页面')
      setTimeout(() => window.location.reload(), 1500)
    }
  }
  
  // 计算成就统计
  const achievementStats: AchievementStats = stats ? {
    totalEntries: stats.totalEntries,
    streak: stats.streak,
    longestStreak: stats.longestStreak,
    moodCounts: stats.moodDistribution,
    daysWithPhotos: 0,
    daysWithFactors: stats.factorCorrelation.length > 0 ? Math.min(stats.totalEntries, 20) : 0,
  } : {
    totalEntries: 0,
    streak: 0,
    longestStreak: 0,
    moodCounts: { great: 0, good: 0, okay: 0, bad: 0, awful: 0 },
    daysWithPhotos: 0,
    daysWithFactors: 0,
  }
  
  const unlockedAchievements = getUnlockedAchievements(achievementStats)
  const unlockedIds = new Set(unlockedAchievements.map(a => a.id))
  
  return (
    <div className="max-w-md mx-auto px-4 pt-12 pb-8">
      {/* 头部 */}
      <header className="mb-6 animate-in">
        <h1 className="text-2xl font-bold text-foreground">设置</h1>
        <p className="text-muted-foreground text-sm mt-1">
          个性化你的心迹
        </p>
      </header>
      
      {/* 用户信息卡片 */}
      <section className="card p-5 mb-6 animate-slide-up">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center text-3xl">
            🌟
          </div>
          <div>
            <h2 className="font-semibold text-lg text-foreground">心迹用户</h2>
            <p className="text-sm text-muted-foreground">
              已记录 {stats?.totalEntries || 0} 天心情
            </p>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                🏆 {unlockedAchievements.length} 个成就
              </span>
              {stats && stats.streak > 0 && (
                <span className="text-xs bg-orange-100 text-orange-600 dark:bg-orange-900/30 px-2 py-0.5 rounded-full">
                  🔥 连续 {stats.streak} 天
                </span>
              )}
            </div>
          </div>
        </div>
      </section>
      
      {/* 成就徽章 */}
      <section className="card p-5 mb-6 animate-slide-up" style={{ animationDelay: '50ms' }}>
        <button 
          className="w-full flex items-center justify-between"
          onClick={() => setShowAchievements(!showAchievements)}
        >
          <div className="flex items-center gap-3">
            <Award className="w-5 h-5 text-primary" />
            <span className="font-medium">成就徽章</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <span className="text-sm">{unlockedAchievements.length}/{ACHIEVEMENTS.length}</span>
            <ChevronRight className={cn(
              "w-4 h-4 transition-transform",
              showAchievements && "rotate-90"
            )} />
          </div>
        </button>
        
        {showAchievements && (
          <div className="mt-4 pt-4 border-t border-border animate-scale-in">
            <AchievementList 
              achievements={ACHIEVEMENTS} 
              unlockedIds={unlockedIds}
            />
          </div>
        )}
      </section>
      
      {/* 外观设置 */}
      <section className="card p-5 mb-6 animate-slide-up" style={{ animationDelay: '100ms' }}>
        <h3 className="font-medium mb-4 flex items-center gap-2">
          <Sun className="w-4 h-4 text-primary" />
          外观
        </h3>
        
        <div className="grid grid-cols-3 gap-2">
          {[
            { value: 'light' as Theme, icon: Sun, label: '浅色' },
            { value: 'dark' as Theme, icon: Moon, label: '深色' },
            { value: 'system' as Theme, icon: Smartphone, label: '跟随系统' },
          ].map(({ value, icon: Icon, label }) => (
            <button
              key={value}
              onClick={() => handleThemeChange(value)}
              className={cn(
                'flex flex-col items-center gap-2 p-3 rounded-xl transition-all',
                theme === value 
                  ? 'bg-primary/10 text-primary ring-2 ring-primary/30' 
                  : 'bg-muted/50 text-muted-foreground hover:bg-muted'
              )}
            >
              <Icon className="w-5 h-5" />
              <span className="text-xs font-medium">{label}</span>
            </button>
          ))}
        </div>
      </section>
      
      {/* 数据管理 */}
      <section className="card p-5 mb-6 animate-slide-up" style={{ animationDelay: '150ms' }}>
        <h3 className="font-medium mb-4 flex items-center gap-2">
          <Download className="w-4 h-4 text-primary" />
          数据管理
        </h3>
        
        <div className="space-y-2">
          <button 
            onClick={handleExportJSON}
            disabled={exporting}
            className="w-full flex items-center justify-between p-3 rounded-xl bg-muted/50 hover:bg-muted transition-colors"
          >
            <span className="text-sm">导出为 JSON</span>
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
          </button>
          
          <button 
            onClick={handleExportMD}
            disabled={exporting}
            className="w-full flex items-center justify-between p-3 rounded-xl bg-muted/50 hover:bg-muted transition-colors"
          >
            <span className="text-sm">导出为 Markdown</span>
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>
      </section>
      
      {/* 危险操作 */}
      <section className="card p-5 mb-6 border-red-200 dark:border-red-900/50 animate-slide-up" style={{ animationDelay: '200ms' }}>
        <button 
          onClick={handleClearData}
          className="w-full flex items-center justify-between p-3 rounded-xl bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
        >
          <div className="flex items-center gap-2">
            <Trash2 className="w-4 h-4" />
            <span className="text-sm font-medium">清除所有数据</span>
          </div>
          <ChevronRight className="w-4 h-4" />
        </button>
      </section>
      
      {/* 反馈 */}
      <section className="card p-5 mb-6 animate-slide-up" style={{ animationDelay: '250ms' }}>
        <h3 className="font-medium mb-4 flex items-center gap-2">
          <Heart className="w-4 h-4 text-primary" />
          反馈与建议
        </h3>
        
        <div className="space-y-2">
          <a 
            href="/feedback-history"
            className="w-full flex items-center justify-between p-3 rounded-xl bg-muted/50 hover:bg-muted transition-colors"
          >
            <span className="text-sm">查看反馈历史</span>
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
          </a>
        </div>
      </section>
      
      {/* 关于 */}
      <section className="card p-5 animate-slide-up" style={{ animationDelay: '300ms' }}>
        <h3 className="font-medium mb-4 flex items-center gap-2">
          <Info className="w-4 h-4 text-primary" />
          关于
        </h3>
        
        <div className="space-y-3 text-sm text-muted-foreground">
          <div className="flex justify-between">
            <span>版本</span>
            <span>1.0.0</span>
          </div>
          <div className="flex justify-between">
            <span>开发者</span>
            <span className="flex items-center gap-1">
              心迹团队 <Heart className="w-3 h-3 text-pink-500" />
            </span>
          </div>
          <div className="pt-3 border-t border-border">
            <a 
              href="https://github.com/liangfuliang541-pixel/xinji"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between hover:text-foreground transition-colors"
            >
              <span>GitHub 开源</span>
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>
      </section>
      
      {/* 版权 */}
      <p className="text-center text-xs text-muted-foreground mt-8">
        © 2024 心迹 XinJi. Made with ❤️
      </p>
      
      <ToastContainer toasts={toast.toasts} onDismiss={toast.dismiss} />
    </div>
  )
}
