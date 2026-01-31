/**
 * 洞察页面 - 升级版
 */

import { Calendar, Activity, Smile, Award, Zap, Download } from 'lucide-react'
import { useMoodStats, useExport } from '@/hooks/useJournal'
import { useToast } from '@/hooks/useToast'
import { MOOD_CONFIG } from '@/core/constants'
import { StatCard, Heatmap, MoodDistribution, ToastContainer, AIHelper, MeditationGuide } from '@/components'

const WEEKDAYS = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']

export default function InsightsPage() {
  const { stats, loading } = useMoodStats()
  const { exporting, exportJSON, exportMarkdown } = useExport()
  const toast = useToast()
  
  const handleExportJSON = async () => {
    await exportJSON()
    toast.success('JSON文件已导出')
  }
  
  const handleExportMD = async () => {
    await exportMarkdown()
    toast.success('Markdown文件已导出')
  }
  
  if (loading) {
    return (
      <div className="max-w-md mx-auto px-4 pt-12 pb-8">
        <header className="mb-6">
          <div className="h-8 bg-muted rounded w-1/3 mb-2 animate-pulse" />
          <div className="h-4 bg-muted rounded w-1/2 animate-pulse" />
        </header>
        <div className="grid grid-cols-2 gap-3">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="card p-4 h-24 animate-pulse" />
          ))}
        </div>
      </div>
    )
  }
  
  if (!stats) {
    return (
      <div className="max-w-md mx-auto px-4 pt-12 pb-8">
        <header className="mb-6 animate-in">
          <h1 className="text-2xl font-bold text-foreground">情绪洞察</h1>
          <p className="text-muted-foreground text-sm mt-1">
            分析你的情绪趋势
          </p>
        </header>
        
        <div className="text-center py-16 animate-in">
          <div className="text-7xl mb-4 animate-float">📊</div>
          <h3 className="text-xl font-semibold text-foreground mb-2">
            还没有足够的数据
          </h3>
          <p className="text-muted-foreground">
            记录更多心情，获取情绪洞察
          </p>
        </div>
      </div>
    )
  }
  
  const mostCommonMood = stats.moodDistribution
  const bestWeekday = stats.weekdayPattern.reduce((a, b) => a.avgScore > b.avgScore ? a : b)
  
  return (
    <div className="max-w-md mx-auto px-4 pt-12 pb-8">
      {/* 头部 */}
      <header className="mb-6 animate-in">
        <h1 className="text-2xl font-bold text-foreground">情绪洞察</h1>
        <p className="text-muted-foreground text-sm mt-1">
          了解你的情绪模式
        </p>
      </header>
      
      {/* 统计卡片 */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <StatCard
          icon={<Calendar className="w-4 h-4" />}
          label="总记录"
          value={stats.totalEntries}
          subValue="天"
          delay={0}
        />
        <StatCard
          icon={<Activity className="w-4 h-4" />}
          label="连续天数"
          value={stats.streak}
          subValue={stats.longestStreak > stats.streak ? `最长${stats.longestStreak}天` : '🔥'}
          trend={stats.streak >= 7 ? 'up' : 'neutral'}
          delay={50}
        />
        <StatCard
          icon={<Smile className="w-4 h-4" />}
          label="平均心情"
          value={stats.avgScore.toFixed(1)}
          subValue="/5分"
          trend={stats.avgScore >= 3.5 ? 'up' : stats.avgScore < 2.5 ? 'down' : 'neutral'}
          delay={100}
        />
        <StatCard
          icon={<Award className="w-4 h-4" />}
          label="最佳日子"
          value={WEEKDAYS[bestWeekday.day]}
          subValue={`${bestWeekday.avgScore.toFixed(1)}分`}
          delay={150}
        />
      </div>
      
      {/* 90天热力图 */}
      <section className="card p-5 mb-6 animate-slide-up" style={{ animationDelay: '200ms' }}>
        <h2 className="text-base font-semibold mb-4 flex items-center gap-2">
          <Zap className="w-4 h-4 text-primary" />
          最近90天
        </h2>
        <Heatmap days={90} cellSize="sm" />
      </section>
      
      {/* 心情分布 */}
      <section className="card p-5 mb-6 animate-slide-up" style={{ animationDelay: '250ms' }}>
        <h2 className="text-base font-semibold mb-4">心情分布</h2>
        <MoodDistribution data={stats.moodDistribution} total={stats.totalEntries} />
      </section>
      
      {/* 星期模式 */}
      <section className="card p-5 mb-6 animate-slide-up" style={{ animationDelay: '300ms' }}>
        <h2 className="text-base font-semibold mb-4">星期模式</h2>
        <div className="flex items-end justify-between h-32 px-2">
          {stats.weekdayPattern.map((day, i) => {
            const height = day.avgScore > 0 ? (day.avgScore / 5) * 100 : 5
            const isMax = day.day === bestWeekday.day
            
            return (
              <div key={day.day} className="flex flex-col items-center gap-2 flex-1">
                <div 
                  className="w-full max-w-[32px] rounded-t-lg transition-all duration-500 bg-gradient-to-t from-primary/60 to-primary"
                  style={{ 
                    height: `${height}%`,
                    opacity: isMax ? 1 : 0.6
                  }}
                />
                <div className="text-center">
                  <p className="text-xs font-medium text-foreground">
                    {WEEKDAYS[day.day].slice(1)}
                  </p>
                  <p className="text-[10px] text-muted-foreground">
                    {day.count > 0 ? day.avgScore.toFixed(1) : '-'}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      </section>
      
      {/* 因素洞察 */}
      {stats.factorCorrelation.length > 0 && (
        <section className="card p-5 mb-6 animate-slide-up" style={{ animationDelay: '350ms' }}>
          <h2 className="text-base font-semibold mb-4">影响因素</h2>
          <div className="space-y-3">
            {stats.factorCorrelation.slice(0, 5).map((item, index) => (
              <div 
                key={item.factor.id}
                className="flex items-center gap-3 animate-slide-up"
                style={{ animationDelay: `${400 + index * 50}ms` }}
              >
                <span className="text-xl">{item.factor.icon}</span>
                <div className="flex-1">
                  <p className="text-sm font-medium">{item.factor.name}</p>
                  <p className="text-xs text-muted-foreground">
                    出现{item.occurrences}次，平均{item.avgMoodScore.toFixed(1)}分
                  </p>
                </div>
                <span className={`text-sm font-medium ${
                  item.impact > 0.2 ? 'text-[hsl(var(--mood-great))]' :
                  item.impact < -0.2 ? 'text-[hsl(var(--mood-awful))]' :
                  'text-muted-foreground'
                }`}>
                  {item.impact > 0 ? '+' : ''}{(item.impact * 100).toFixed(0)}%
                </span>
              </div>
            ))}
          </div>
        </section>
      )}
      
      {/* 导出功能 */}
      <section className="card p-5 animate-slide-up" style={{ animationDelay: '400ms' }}>
        <h2 className="text-base font-semibold mb-4 flex items-center gap-2">
          <Download className="w-4 h-4 text-primary" />
          数据导出
        </h2>
        <p className="text-sm text-muted-foreground mb-4">
          导出你的情绪记录数据
        </p>
        <div className="flex gap-3">
          <button 
            onClick={handleExportJSON}
            disabled={exporting}
            className="btn-secondary flex-1"
          >
            导出 JSON
          </button>
          <button 
            onClick={handleExportMD}
            disabled={exporting}
            className="btn-secondary flex-1"
          >
            导出 Markdown
          </button>
        </div>
      </section>
      
      {/* Toast */}
      <ToastContainer toasts={toast.toasts} onDismiss={toast.dismiss} />
    </div>
  )
}
