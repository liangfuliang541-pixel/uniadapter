/**
 * 快速笔记弹窗 - 升级版
 */

import { useState } from 'react'
import { X, Image, Tag, Sparkles, Send } from 'lucide-react'
import { cn } from '@/lib/utils'
import { MOOD_CONFIG } from '@/core/constants'
import type { MoodType, EmotionFactor } from '@/core/types'
import FactorSelector from './FactorSelector'

interface QuickNoteProps {
  mood: MoodType
  onSave: (data: { note: string; factors: EmotionFactor[] }) => void
  onClose: () => void
}

export default function QuickNote({ mood, onSave, onClose }: QuickNoteProps) {
  const [note, setNote] = useState('')
  const [factors, setFactors] = useState<EmotionFactor[]>([])
  const [showFactors, setShowFactors] = useState(false)
  
  const config = MOOD_CONFIG[mood]
  
  const handleSubmit = () => {
    onSave({ note, factors })
  }
  
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      {/* 背景遮罩 */}
      <div 
        className="absolute inset-0 bg-foreground/20 backdrop-blur-sm animate-in"
        onClick={onClose}
      />
      
      {/* 弹窗内容 */}
      <div className="relative w-full max-w-md glass rounded-t-3xl p-6 animate-slide-up safe-bottom">
        {/* 头部 */}
        <div className="flex items-center justify-between mb-6">
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
          <button
            onClick={onClose}
            className="btn-icon"
          >
            <X className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>
        
        {/* 文本输入 */}
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="今天发生了什么？有什么想法和感受..."
          className="textarea mb-4"
          rows={4}
          autoFocus
        />
        
        {/* 因素选择区域 */}
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
        
        {/* 已选因素展示 */}
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
            <button 
              className="btn-icon"
              title="添加照片"
            >
              <Image className="w-5 h-5 text-muted-foreground" />
            </button>
            <button 
              className={cn(
                'btn-icon',
                showFactors && 'bg-primary/10 text-primary'
              )}
              onClick={() => setShowFactors(!showFactors)}
              title="添加影响因素"
            >
              <Tag className="w-5 h-5" />
            </button>
          </div>
          
          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="btn-secondary"
            >
              取消
            </button>
            <button
              onClick={handleSubmit}
              className="btn-primary flex items-center gap-2"
            >
              <Send className="w-4 h-4" />
              保存
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
