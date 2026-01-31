/**
 * 日历页面 - 升级版
 */

import { useState } from 'react'
import { format } from 'date-fns'
import { zhCN } from 'date-fns/locale'
import { MoodCalendar } from '@/components'
import { MOOD_CONFIG } from '@/core/constants'
import type { JournalEntry } from '@/core/types'

export default function CalendarPage() {
  const [selectedEntry, setSelectedEntry] = useState<JournalEntry | null>(null)
  
  return (
    <div className="max-w-md mx-auto px-4 pt-12 pb-8">
      {/* 头部 */}
      <header className="mb-6 animate-in">
        <h1 className="text-2xl font-bold text-foreground">心情日历</h1>
        <p className="text-muted-foreground text-sm mt-1">
          回顾每一天的情绪变化
        </p>
      </header>
      
      {/* 日历 */}
      <div className="animate-slide-up">
        <MoodCalendar onSelectEntry={setSelectedEntry} />
      </div>
      
      {/* 选中条目详情 */}
      {selectedEntry && (
        <div className="mt-4 card p-5 animate-scale-in">
          <div className="flex items-start gap-4">
            <span className="text-4xl">{MOOD_CONFIG[selectedEntry.mood].emoji}</span>
            <div className="flex-1">
              <p className="font-semibold text-foreground">
                {format(new Date(selectedEntry.date), 'M月d日 EEEE', { locale: zhCN })}
              </p>
              <p className="text-sm text-muted-foreground mb-2">
                感觉{MOOD_CONFIG[selectedEntry.mood].label}
              </p>
              
              {selectedEntry.plainText && (
                <p className="text-foreground leading-relaxed p-3 bg-muted/30 rounded-lg">
                  {selectedEntry.plainText}
                </p>
              )}
              
              {selectedEntry.factors.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {selectedEntry.factors.map(f => (
                    <span key={f.id} className="tag tag-primary">
                      {f.icon} {f.name}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
