/**
 * 统计卡片组件
 */

import { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface StatCardProps {
  icon: ReactNode
  label: string
  value: string | number
  subValue?: string
  trend?: 'up' | 'down' | 'neutral'
  className?: string
  delay?: number
}

export default function StatCard({ 
  icon, 
  label, 
  value, 
  subValue,
  trend,
  className,
  delay = 0
}: StatCardProps) {
  return (
    <div 
      className={cn(
        'card p-4 animate-slide-up',
        className
      )}
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex items-center gap-2 mb-2">
        <div className="text-primary">{icon}</div>
        <span className="text-xs text-muted-foreground">{label}</span>
      </div>
      <div className="flex items-end gap-2">
        <span className="text-2xl font-bold text-foreground">{value}</span>
        {subValue && (
          <span className={cn(
            'text-xs mb-1',
            trend === 'up' && 'text-mood-great',
            trend === 'down' && 'text-mood-awful',
            trend === 'neutral' && 'text-muted-foreground',
            !trend && 'text-muted-foreground'
          )}>
            {subValue}
          </span>
        )}
      </div>
    </div>
  )
}
