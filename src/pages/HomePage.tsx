/**
 * 首页 - 完整版
 */

import { useState, useEffect } from 'react'
import { format } from 'date-fns'
import { zhCN } from 'date-fns/locale'
import { Sparkles, ChevronRight, Moon, Sun, Award } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useTodayEntry, useJournalEntries, useMoodStats } from '@/hooks/useJournal'
import { useToast, setGlobalToast } from '@/hooks/useToast'
import { MOOD_CONFIG } from '@/core/constants'
import { getRandomPrompt, getUnlockedAchievements, type AchievementStats } from '@/core/quotes'
import { MoodSelector, ToastContainer } from '@/components'
import QuoteCard from '@/components/QuoteCard'
import Onboarding from '@/components/Onboarding'
import type { MoodType, EmotionFactor } from '@/core/types'

export default function HomePage() {
  const [selectedMood, setSelectedMood] = useState<MoodType | null>(null)
  const [showNote, setShowNote] = useState(false)
  const [showOnboarding, setShowOnboarding] = useState(false)
  const [writingPrompt, setWritingPrompt] = useState('')
  
  const { entry: todayEntry, hasCheckedIn, checkIn, loading: todayLoading } = useTodayEntry()
  const { entries } = useJournalEntries()
  const { stats } = useMoodStats()
  const toast = useToast()
  
  setGlobalToast(toast)
  
  // 检查是否需要显示引导
  useEffect(() => {
    const hasSeenOnboarding = localStorage.getItem('xinji_onboarding_seen')
    if (!hasSeenOnboarding && entries.length === 0) {
      setShowOnboarding(true)
    }
  }, [entries.length])
  
  const handleOnboardingComplete = () => {
    localStorage.setItem('xinji_onboarding_seen', 'true')
    setShowOnboarding(false)
  }
  
  const recentEntries = entries.slice(0, 3)
  
  const greeting = () => {
    const hour = new Date().getHours()
    if (hour < 6) return '夜深了'
    if (hour < 9) return '早上好'
    if (hour < 12) return '上午好'
    if (hour < 14) return '中午好'
    if (hour < 18) return '下午好'
    if (hour < 22) return '晚上好'
    return '夜深了'
  }
  
  const greetingIcon = () => {
    const hour = new Date().getHours()
    if (hour < 6 || hour >= 22) return <Moon className="w-5 h-5" />
    return <Sun className="w-5 h-5" />
  }
  
  const handleMoodSelect = (mood: MoodType) => {
    setSelectedMood(mood)
    setWritingPrompt(getRandomPrompt(mood))
    setShowNote(true)
  }
  
  const handleSaveNote = async ({ note, factors }: { note: string; factors: EmotionFactor[] }) => {
    if (selectedMood) {
      await checkIn(selectedMood, note, factors)
      setShowNote(false)
      setSelectedMood(null)
      toast.success('心情已记录 ✨')
    }
  }
  
  // 计算成就
  const achievementStats: AchievementStats = stats ? {
    totalEntries: stats.totalEntries,
    streak: stats.streak,
    longestStreak: stats.longestStreak,
    moodCounts: stats.moodDistribution,
    daysWithPhotos: 0,
    daysWithFactors: 0,
  } : {
    totalEntries: 0,
    streak: 0,
    longestStreak: 0,
    moodCounts: { great: 0, good: 0, okay: 0, bad: 0, awful: 0 },
    daysWithPhotos: 0,
    daysWithFactors: 0,
  }
  
  const unlockedCount = getUnlockedAchievements(achievementStats).length
  
  // 显示引导
  if (showOnboarding) {
    return <Onboarding onComplete={handleOnboardingComplete} />
  }
  
  return (
    <div className="max-w-md mx-auto px-4 pt-12 pb-8">
      {/* 头部问候 */}
      <header className="mb-6 animate-in">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-primary">
            {greetingIcon()}
            <span className="text-sm font-medium">
              {format(new Date(), 'M月d日 EEEE', { locale: zhCN })}
            </span>
          </div>
          {stats && stats.streak > 0 && (
            <div className="flex items-center gap-1 text-xs bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 px-2 py-1 rounded-full">
              🔥 {stats.streak}天
            </div>
          )}
        </div>
        <h1 className="text-3xl font-bold text-foreground mt-2">
          {greeting()}！
        </h1>
        <p className="text-muted-foreground mt-1">
          {hasCheckedIn ? '今天已经记录心情啦' : '记录今天的心情吧'}
        </p>
      </header>
      
      {/* 今日签到卡片 */}
      <section className="card p-6 mb-4 animate-slide-up">
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-primary animate-pulse-soft" />
          今日签到
        </h2>
        
        {todayLoading ? (
          <div className="h-20 bg-muted/50 rounded-xl animate-pulse" />
        ) : hasCheckedIn && todayEntry ? (
          <div className="flex items-center gap-4 p-4 bg-muted/30 rounded-xl">
            <span className="text-5xl animate-float">{MOOD_CONFIG[todayEntry.mood].emoji}</span>
            <div className="flex-1">
              <p className="font-semibold text-foreground text-lg">
                今天感觉{MOOD_CONFIG[todayEntry.mood].label}
              </p>
              {todayEntry.plainText && (
                <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                  {todayEntry.plainText}
                </p>
              )}
              {todayEntry.factors.length > 0 && (
                <div className="flex gap-1 mt-2 flex-wrap">
                  {todayEntry.factors.slice(0, 3).map(f => (
                    <span key={f.id} className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                      {f.icon}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        ) : (
          <>
            <p className="text-muted-foreground mb-4">今天感觉怎么样？</p>
            <MoodSelector onSelect={handleMoodSelect} animated />
          </>
        )}
      </section>
      
      {/* 语录卡片 - 仅在签到后显示 */}
      {hasCheckedIn && todayEntry && (
        <section className="mb-4 animate-slide-up" style={{ animationDelay: '50ms' }}>
          <QuoteCard mood={todayEntry.mood} />
        </section>
      )}
      
      {/* 快速笔记弹窗 */}
      {showNote && selectedMood && (
        <QuickNoteEnhanced
          mood={selectedMood}
          prompt={writingPrompt}
          onSave={handleSaveNote}
          onClose={() => {
            setShowNote(false)
            setSelectedMood(null)
          }}
        />
      )}
      
      {/* 统计概览 */}
      {stats && stats.totalEntries > 0 && (
        <section className="grid grid-cols-3 gap-3 mb-4 animate-slide-up" style={{ animationDelay: '100ms' }}>
          <div className="card p-3 text-center">
            <p className="text-2xl font-bold text-foreground">{stats.totalEntries}</p>
            <p className="text-xs text-muted-foreground">总记录</p>
          </div>
          <div className="card p-3 text-center">
            <p className="text-2xl font-bold text-foreground">{stats.avgScore.toFixed(1)}</p>
            <p className="text-xs text-muted-foreground">平均心情</p>
          </div>
          <a href="/settings" className="card p-3 text-center hover:bg-muted/30 transition-colors">
            <p className="text-2xl font-bold text-foreground flex items-center justify-center gap-1">
              <Award className="w-5 h-5 text-primary" />
              {unlockedCount}
            </p>
            <p className="text-xs text-muted-foreground">成就</p>
          </a>
        </section>
      )}
      
      {/* 最近记录 */}
      {recentEntries.length > 0 && (
        <section className="animate-slide-up" style={{ animationDelay: '150ms' }}>
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-semibold">最近记录</h2>
            <a 
              href="/journal" 
              className="text-sm text-primary flex items-center gap-1 hover:underline"
            >
              全部 <ChevronRight className="w-4 h-4" />
            </a>
          </div>
          
          <div className="space-y-2">
            {recentEntries.map((entry, index) => (
              <div
                key={entry.id}
                className="card-interactive p-4 flex items-center gap-3 animate-slide-up"
                style={{ animationDelay: `${200 + index * 50}ms` }}
              >
                <span className="text-2xl">{MOOD_CONFIG[entry.mood].emoji}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-muted-foreground">
                    {format(new Date(entry.date), 'M月d日', { locale: zhCN })}
                  </p>
                  {entry.plainText ? (
                    <p className="text-sm text-foreground truncate">{entry.plainText}</p>
                  ) : (
                    <p className="text-sm text-muted-foreground">感觉{MOOD_CONFIG[entry.mood].label}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
      
      {/* 空状态 */}
      {entries.length === 0 && !showNote && (
        <section className="text-center py-12 animate-in">
          <div className="text-7xl mb-4 animate-float">📝</div>
          <h3 className="text-xl font-semibold text-foreground mb-2">
            开始记录你的心情
          </h3>
          <p className="text-muted-foreground text-sm">
            选择上方的表情，记录今天的感受
          </p>
        </section>
      )}
      
      <ToastContainer toasts={toast.toasts} onDismiss={toast.dismiss} />
    </div>
  )
}

/**
 * 增强版快速笔记弹窗
 */
import { Image, Tag, Send, Lightbulb as LightbulbIcon, RefreshCw } from 'lucide-react'
import FactorSelector from '@/components/FactorSelector'

interface QuickNoteEnhancedProps {
  mood: MoodType
  prompt: string
  onSave: (data: { note: string; factors: EmotionFactor[] }) => void
  onClose: () => void
}

function QuickNoteEnhanced({ mood, prompt, onSave, onClose }: QuickNoteEnhancedProps) {
  const [note, setNote] = useState('')
  const [factors, setFactors] = useState<EmotionFactor[]>([])
  const [showFactors, setShowFactors] = useState(false)
  const [currentPrompt, setCurrentPrompt] = useState(prompt)
  
  const config = MOOD_CONFIG[mood]
  
  const refreshPrompt = () => {
    setCurrentPrompt(getRandomPrompt(mood))
  }
  
  const handleSubmit = () => {
    onSave({ note, factors })
  }
  
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      <div 
        className="absolute inset-0 bg-foreground/20 backdrop-blur-sm animate-in"
        onClick={onClose}
      />
      
      <div className="relative w-full max-w-md glass rounded-t-3xl p-6 animate-slide-up safe-bottom">
        {/* 头部 */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <span className="text-4xl animate-scale-in">{config.emoji}</span>
            <div>
              <p className="font-semibold text-foreground">
                今天感觉{config.label}
              </p>
              <p className="text-sm text-muted-foreground">
                记录一下此刻的想法吧
              </p>
            </div>
          </div>
          <button onClick={onClose} className="btn-icon">
            <span className="text-xl">×</span>
          </button>
        </div>
        
        {/* 写作提示 */}
        <div className="flex items-start gap-2 p-3 bg-primary/5 rounded-xl mb-4 animate-in">
          <LightbulbIcon className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
          <p className="text-sm text-primary flex-1">{currentPrompt}</p>
          <button onClick={refreshPrompt} className="p-1 hover:bg-primary/10 rounded">
            <RefreshCw className="w-3 h-3 text-primary" />
          </button>
        </div>
        
        {/* 文本输入 */}
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="写下你的想法..."
          className="textarea mb-4"
          rows={4}
          autoFocus
        />
        
        {/* 因素选择 */}
        {showFactors && (
          <div className="mb-4 p-4 bg-muted/30 rounded-xl animate-scale-in">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-medium flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-primary" />
                影响因素
              </h3>
              <button 
                onClick={() => setShowFactors(false)}
                className="text-xs text-muted-foreground hover:text-foreground"
              >
                收起
              </button>
            </div>
            <FactorSelector 
              selected={factors} 
              onChange={setFactors}
              maxCount={5}
            />
          </div>
        )}
        
        {/* 已选因素 */}
        {factors.length > 0 && !showFactors && (
          <div className="flex flex-wrap gap-2 mb-4">
            {factors.map(f => (
              <span key={f.id} className="tag tag-primary">
                {f.icon} {f.name}
              </span>
            ))}
          </div>
        )}
        
        {/* 操作栏 */}
        <div className="flex items-center justify-between">
          <div className="flex gap-2">
            <button className="btn-icon" title="添加照片">
              <Image className="w-5 h-5 text-muted-foreground" />
            </button>
            <button 
              className={cn('btn-icon', showFactors && 'bg-primary/10 text-primary')}
              onClick={() => setShowFactors(!showFactors)}
              title="添加因素"
            >
              <Tag className="w-5 h-5" />
            </button>
          </div>
          
          <div className="flex gap-2">
            <button onClick={onClose} className="btn-secondary">
              取消
            </button>
            <button onClick={handleSubmit} className="btn-primary flex items-center gap-2">
              <Send className="w-4 h-4" />
              保存
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
