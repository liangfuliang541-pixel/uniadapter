/**
 * 日记列表页面 - 升级版
 */

import { useState } from 'react'
import { format } from 'date-fns'
import { zhCN } from 'date-fns/locale'
import { Search, Trash2, X, Filter } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useJournalEntries, useJournalSearch } from '@/hooks/useJournal'
import { useToast } from '@/hooks/useToast'
import { MOOD_CONFIG, MOOD_TYPES } from '@/core/constants'
import { ToastContainer } from '@/components'
import type { MoodType } from '@/core/types'

export default function JournalPage() {
  const { entries, remove, loading } = useJournalEntries()
  const { query, setQuery, results, loading: searching } = useJournalSearch()
  const [filterMood, setFilterMood] = useState<MoodType | 'all'>('all')
  const toast = useToast()
  
  const displayEntries = query 
    ? results 
    : filterMood === 'all' 
      ? entries 
      : entries.filter(e => e.mood === filterMood)
  
  const handleDelete = async (id: string) => {
    if (confirm('确定要删除这条记录吗？')) {
      await remove(id)
      toast.success('记录已删除')
    }
  }
  
  return (
    <div className="max-w-md mx-auto px-4 pt-12 pb-8">
      {/* 头部 */}
      <header className="mb-6 animate-in">
        <h1 className="text-2xl font-bold text-foreground">我的日记</h1>
        <p className="text-muted-foreground text-sm mt-1">
          共 {entries.length} 条记录
        </p>
      </header>
      
      {/* 搜索和筛选 */}
      <div className="space-y-3 mb-6 animate-slide-up">
        {/* 搜索框 */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="搜索日记内容..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="input pl-10 pr-10"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded hover:bg-muted"
            >
              <X className="w-4 h-4 text-muted-foreground" />
            </button>
          )}
        </div>
        
        {/* 心情筛选 */}
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          <button
            onClick={() => setFilterMood('all')}
            className={cn(
              'tag whitespace-nowrap',
              filterMood === 'all' ? 'tag-primary' : 'tag-default'
            )}
          >
            <Filter className="w-3 h-3" />
            全部
          </button>
          {MOOD_TYPES.map((mood) => {
            const config = MOOD_CONFIG[mood]
            return (
              <button
                key={mood}
                onClick={() => setFilterMood(mood)}
                className={cn(
                  'tag whitespace-nowrap',
                  filterMood === mood ? 'tag-primary' : 'tag-default'
                )}
              >
                {config.emoji} {config.label}
              </button>
            )
          })}
        </div>
      </div>
      
      {/* 日记列表 */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="card p-5 animate-pulse">
              <div className="h-6 bg-muted rounded w-1/3 mb-3" />
              <div className="h-4 bg-muted rounded w-full mb-2" />
              <div className="h-4 bg-muted rounded w-2/3" />
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {displayEntries.map((entry, index) => (
            <article
              key={entry.id}
              className="card p-5 animate-slide-up"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              {/* 头部 */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{MOOD_CONFIG[entry.mood].emoji}</span>
                  <div>
                    <p className="font-semibold text-foreground">
                      {format(new Date(entry.date), 'M月d日 EEEE', { locale: zhCN })}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {format(new Date(entry.createdAt), 'HH:mm')} · {MOOD_CONFIG[entry.mood].label}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => handleDelete(entry.id)}
                  className="btn-icon text-muted-foreground hover:text-[hsl(var(--mood-awful))] hover:bg-[hsl(var(--mood-awful-bg))]"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              
              {/* 内容 */}
              {entry.plainText && (
                <p className="text-foreground leading-relaxed whitespace-pre-wrap mb-3">
                  {entry.plainText}
                </p>
              )}
              
              {/* 因素标签 */}
              {entry.factors.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {entry.factors.map(f => (
                    <span key={f.id} className="tag tag-default text-xs">
                      {f.icon} {f.name}
                    </span>
                  ))}
                </div>
              )}
              
              {/* 照片 */}
              {entry.photos.length > 0 && (
                <div className="mt-3 flex gap-2 overflow-x-auto scrollbar-hide">
                  {entry.photos.map((photo, i) => (
                    <div
                      key={i}
                      className="w-20 h-20 rounded-lg bg-muted flex-shrink-0 overflow-hidden"
                    >
                      <img
                        src={photo.url}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              )}
            </article>
          ))}
        </div>
      )}
      
      {/* 空状态 */}
      {!loading && displayEntries.length === 0 && (
        <div className="text-center py-16 animate-in">
          <div className="text-6xl mb-4">
            {query || filterMood !== 'all' ? '🔍' : '📝'}
          </div>
          <h3 className="text-lg font-semibold text-foreground mb-2">
            {query || filterMood !== 'all' ? '没有找到相关记录' : '还没有日记'}
          </h3>
          <p className="text-muted-foreground text-sm">
            {query || filterMood !== 'all'
              ? '试试其他搜索条件'
              : '去首页记录今天的心情吧'}
          </p>
        </div>
      )}
      
      {/* Toast */}
      <ToastContainer toasts={toast.toasts} onDismiss={toast.dismiss} />
    </div>
  )
}
