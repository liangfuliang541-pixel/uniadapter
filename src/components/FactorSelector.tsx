/**
 * 情绪因素选择器
 */

import { useState, useMemo } from 'react'
import { cn } from '@/lib/utils'
import { DEFAULT_FACTORS, FACTOR_CATEGORIES } from '@/core/constants'
import type { EmotionFactor, FactorCategory } from '@/core/types'

interface FactorSelectorProps {
  selected: EmotionFactor[]
  onChange: (factors: EmotionFactor[]) => void
  maxCount?: number
}

export default function FactorSelector({ 
  selected, 
  onChange, 
  maxCount = 5 
}: FactorSelectorProps) {
  const [activeCategory, setActiveCategory] = useState<FactorCategory | 'all'>('all')
  
  const filteredFactors = useMemo(() => {
    if (activeCategory === 'all') return DEFAULT_FACTORS
    return DEFAULT_FACTORS.filter(f => f.category === activeCategory)
  }, [activeCategory])
  
  const toggleFactor = (factor: EmotionFactor) => {
    const isSelected = selected.some(f => f.id === factor.id)
    
    if (isSelected) {
      onChange(selected.filter(f => f.id !== factor.id))
    } else if (selected.length < maxCount) {
      onChange([...selected, factor])
    }
  }
  
  const categories = Object.entries(FACTOR_CATEGORIES) as [FactorCategory, { label: string; icon: string }][]
  
  return (
    <div className="space-y-4">
      {/* 分类标签 */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        <button
          onClick={() => setActiveCategory('all')}
          className={cn(
            'tag whitespace-nowrap',
            activeCategory === 'all' ? 'tag-primary' : 'tag-default'
          )}
        >
          全部
        </button>
        {categories.map(([key, { label, icon }]) => (
          <button
            key={key}
            onClick={() => setActiveCategory(key)}
            className={cn(
              'tag whitespace-nowrap',
              activeCategory === key ? 'tag-primary' : 'tag-default'
            )}
          >
            {icon} {label}
          </button>
        ))}
      </div>
      
      {/* 因素网格 */}
      <div className="grid grid-cols-4 gap-2">
        {filteredFactors.map((factor) => {
          const isSelected = selected.some(f => f.id === factor.id)
          const isDisabled = !isSelected && selected.length >= maxCount
          
          return (
            <button
              key={factor.id}
              onClick={() => toggleFactor(factor)}
              disabled={isDisabled}
              className={cn(
                'flex flex-col items-center gap-1 p-3 rounded-xl transition-all duration-200',
                isSelected 
                  ? 'bg-primary/15 text-primary ring-2 ring-primary/30' 
                  : 'bg-muted/50 text-muted-foreground hover:bg-muted',
                isDisabled && 'opacity-40 cursor-not-allowed'
              )}
            >
              <span className="text-xl">{factor.icon}</span>
              <span className="text-xs font-medium text-center leading-tight">
                {factor.name}
              </span>
            </button>
          )
        })}
      </div>
      
      {/* 已选数量提示 */}
      <p className="text-xs text-muted-foreground text-center">
        已选 {selected.length}/{maxCount} 个因素
      </p>
    </div>
  )
}
