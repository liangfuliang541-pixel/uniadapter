/**
 * 日历组件 - 升级版
 */

import { useState, useMemo } from 'react'
import { 
  format, 
  startOfMonth, 
  endOfMonth, 
  eachDayOfInterval, 
  isToday, 
  addMonths, 
  subMonths, 
  getDay
} from 'date-fns'
import { zhCN } from 'date-fns/locale'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useMonthEntries } from '@/hooks/useJournal'
import { MOOD_CONFIG } from '@/core/constants'
import type { JournalEntry, MoodType } from '@/core/types'

const moodBgColors: Record<MoodType, string> = {
  great: 'bg-[hsl(var(--mood-great))]',
  good: 'bg-[hsl(var(--mood-good))]',
  okay: 'bg-[hsl(var(--mood-okay))]',
  bad: 'bg-[hsl(var(--mood-bad))]',
  awful: 'bg-[hsl(var(--mood-awful))]',
}

const WEEKDAYS = ['日', '一', '二', '三', '四', '五', '六']

interface MoodCalendarProps {
  onSelectEntry?: (entry: JournalEntry) => void
}

export default function MoodCalendar({ onSelectEntry }: MoodCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  
  const year = currentDate.getFullYear()
  const month = currentDate.getMonth()
  
  const { entries, entriesByDate } = useMonthEntries(year, month)
  
  const days = useMemo(() => {
    const monthStart = startOfMonth(currentDate)
    const monthEnd = endOfMonth(currentDate)
    return eachDayOfInterval({ start: monthStart, end: monthEnd })
  }, [currentDate])
  
  const startDay = getDay(startOfMonth(currentDate))
  
  const goToPrev = () => setCurrentDate(subMonths(currentDate, 1))
  const goToNext = () => setCurrentDate(addMonths(currentDate, 1))
  const goToToday = () => setCurrentDate(new Date())
  
  const handleDayClick = (date: Date) => {
    const dateStr = format(date, 'yyyy-MM-dd')
    setSelectedDate(selectedDate === dateStr ? null : dateStr)
    
    const entry = entriesByDate.get(dateStr)
    if (entry && onSelectEntry) {
      onSelectEntry(entry)
    }
  }
  
  return (
    <div className="card p-5">
      {/* 月份导航 */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={goToPrev}
          className="btn-icon"
          aria-label="上个月"
        >
          <ChevronLeft className="w-5 h-5 text-muted-foreground" />
        </button>
        
        <div className="text-center">
          <h2 className="text-lg font-semibold">
            {format(currentDate, 'yyyy年 M月', { locale: zhCN })}
          </h2>
          <button 
            onClick={goToToday}
            className="text-xs text-primary hover:underline"
          >
            回到今天
          </button>
        </div>
        
        <button
          onClick={goToNext}
          className="btn-icon"
          aria-label="下个月"
        >
          <ChevronRight className="w-5 h-5 text-muted-foreground" />
        </button>
      </div>
      
      {/* 星期头 */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {WEEKDAYS.map((day, i) => (
          <div
            key={day}
            className={cn(
              'text-center text-xs font-medium py-2',
              i === 0 || i === 6 ? 'text-mood-awful/70' : 'text-muted-foreground'
            )}
          >
            {day}
          </div>
        ))}
      </div>
      
      {/* 日期网格 */}
      <div className="grid grid-cols-7 gap-1">
        {/* 空白占位 */}
        {Array.from({ length: startDay }).map((_, i) => (
          <div key={`empty-${i}`} className="calendar-day empty" />
        ))}
        
        {/* 日期 */}
        {days.map((day) => {
          const dateStr = format(day, 'yyyy-MM-dd')
          const entry = entriesByDate.get(dateStr)
          const isCurrentDay = isToday(day)
          const isSelected = selectedDate === dateStr
          const dayOfWeek = getDay(day)
          const isWeekend = dayOfWeek === 0 || dayOfWeek === 6
          
          return (
            <button
              key={dateStr}
              onClick={() => handleDayClick(day)}
              className={cn(
                'calendar-day',
                isCurrentDay && 'today',
                entry && 'has-entry',
                entry && moodBgColors[entry.mood],
                isSelected && 'ring-2 ring-primary',
                !entry && isWeekend && 'text-mood-awful/50'
              )}
            >
              <span>{format(day, 'd')}</span>
              {entry && (
                <span className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 text-[10px] leading-none">
                  {MOOD_CONFIG[entry.mood].emoji}
                </span>
              )}
            </button>
          )
        })}
      </div>
      
      {/* 图例 */}
      <div className="mt-6 pt-4 border-t border-border">
        <div className="flex flex-wrap items-center justify-center gap-3">
          {Object.entries(MOOD_CONFIG).map(([mood, config]) => (
            <div key={mood} className="flex items-center gap-1.5">
              <div className={cn('w-3 h-3 rounded', moodBgColors[mood as MoodType])} />
              <span className="text-xs text-muted-foreground">
                {config.emoji} {config.label}
              </span>
            </div>
          ))}
        </div>
      </div>
      
      {/* 统计 */}
      <div className="mt-4 text-center text-sm text-muted-foreground">
        本月已记录 <span className="font-semibold text-primary">{entries.length}</span> 天
      </div>
    </div>
  )
}
