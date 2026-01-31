/**
 * 热力图组件
 */

import { useMemo } from 'react'
import { format, subDays } from 'date-fns'
import { zhCN } from 'date-fns/locale'
import { cn } from '@/lib/utils'
import { useJournalEntries } from '@/hooks/useJournal'
import { MOOD_CONFIG } from '@/core/constants'
import type { MoodType } from '@/core/types'

const moodBgColors: Record<MoodType, string> = {
  great: 'bg-[hsl(var(--mood-great))]',
  good: 'bg-[hsl(var(--mood-good))]',
  okay: 'bg-[hsl(var(--mood-okay))]',
  bad: 'bg-[hsl(var(--mood-bad))]',
  awful: 'bg-[hsl(var(--mood-awful))]',
}

interface HeatmapProps {
  days?: number
  cellSize?: 'sm' | 'md' | 'lg'
}

export default function Heatmap({ days = 90, cellSize = 'md' }: HeatmapProps) {
  const { entries } = useJournalEntries()
  
  const heatmapData = useMemo(() => {
    const entriesByDate = new Map(entries.map(e => [e.date, e]))
    const today = new Date()
    const data: { date: string; mood: MoodType | null }[] = []
    
    for (let i = days - 1; i >= 0; i--) {
      const date = format(subDays(today, i), 'yyyy-MM-dd')
      const entry = entriesByDate.get(date)
      data.push({
        date,
        mood: entry?.mood || null,
      })
    }
    
    return data
  }, [entries, days])
  
  // 按周分组（用于7列布局）
  const weeks = useMemo(() => {
    const result: typeof heatmapData[] = []
    for (let i = 0; i < heatmapData.length; i += 7) {
      result.push(heatmapData.slice(i, i + 7))
    }
    return result
  }, [heatmapData])
  
  const sizeClasses = {
    sm: 'w-3 h-3 rounded',
    md: 'w-4 h-4 rounded-md',
    lg: 'w-5 h-5 rounded-md',
  }
  
  const gapClasses = {
    sm: 'gap-0.5',
    md: 'gap-1',
    lg: 'gap-1.5',
  }
  
  return (
    <div className="space-y-3">
      {/* 热力图网格 */}
      <div className={cn('flex', gapClasses[cellSize])}>
        {weeks.map((week, weekIdx) => (
          <div key={weekIdx} className={cn('flex flex-col', gapClasses[cellSize])}>
            {week.map((day) => (
              <div
                key={day.date}
                title={`${format(new Date(day.date), 'M月d日', { locale: zhCN })} ${
                  day.mood ? MOOD_CONFIG[day.mood].label : '未记录'
                }`}
                className={cn(
                  'heatmap-cell',
                  sizeClasses[cellSize],
                  day.mood ? moodBgColors[day.mood] : 'bg-muted/40'
                )}
              />
            ))}
          </div>
        ))}
      </div>
      
      {/* 时间范围 */}
      <div className="flex justify-between text-xs text-muted-foreground">
        <span>{format(subDays(new Date(), days - 1), 'M月d日', { locale: zhCN })}</span>
        <span>今天</span>
      </div>
    </div>
  )
}
