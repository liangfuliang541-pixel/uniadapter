/**
 * 欢迎/引导页组件
 */

import { useState } from 'react'
import { Sparkles, Heart, Calendar, BarChart3, ChevronRight, Check } from 'lucide-react'

interface OnboardingProps {
  onComplete: () => void
}

const features = [
  {
    icon: Heart,
    title: '记录心情',
    description: '用表情快速记录每天的情绪状态',
    color: 'text-pink-500',
  },
  {
    icon: Calendar,
    title: '心情日历',
    description: '彩色日历直观查看情绪变化',
    color: 'text-blue-500',
  },
  {
    icon: BarChart3,
    title: '情绪洞察',
    description: '发现影响心情的因素和规律',
    color: 'text-purple-500',
  },
]

export default function Onboarding({ onComplete }: OnboardingProps) {
  const [step, setStep] = useState(0)
  
  const nextStep = () => {
    if (step < 2) {
      setStep(step + 1)
    } else {
      onComplete()
    }
  }
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6" style={{ background: 'var(--gradient-hero)' }}>
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-12 animate-in">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-primary/10 mb-4">
            <Sparkles className="w-10 h-10 text-primary" />
          </div>
          <h1 className="text-3xl font-bold text-foreground">心迹</h1>
          <p className="text-muted-foreground mt-2">记录心灵的轨迹</p>
        </div>
        
        {/* 功能介绍 */}
        <div className="space-y-4 mb-12">
          {features.map((feature, index) => {
            const Icon = feature.icon
            const isActive = index === step
            const isPast = index < step
            
            return (
              <div
                key={index}
                className={`card p-4 flex items-center gap-4 transition-all duration-300 ${
                  isActive ? 'ring-2 ring-primary scale-105' : ''
                } ${isPast ? 'opacity-60' : ''}`}
                onClick={() => setStep(index)}
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                  isPast ? 'bg-primary/20' : 'bg-muted'
                }`}>
                  {isPast ? (
                    <Check className="w-6 h-6 text-primary" />
                  ) : (
                    <Icon className={`w-6 h-6 ${feature.color}`} />
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-foreground">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </div>
              </div>
            )
          })}
        </div>
        
        {/* 进度指示器 */}
        <div className="flex justify-center gap-2 mb-6">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                i === step ? 'w-6 bg-primary' : i < step ? 'bg-primary/50' : 'bg-muted'
              }`}
            />
          ))}
        </div>
        
        {/* 按钮 */}
        <button
          onClick={nextStep}
          className="btn-primary w-full flex items-center justify-center gap-2"
        >
          {step < 2 ? (
            <>
              继续
              <ChevronRight className="w-4 h-4" />
            </>
          ) : (
            <>
              开始记录
              <Sparkles className="w-4 h-4" />
            </>
          )}
        </button>
        
        {step < 2 && (
          <button
            onClick={onComplete}
            className="w-full text-center text-sm text-muted-foreground mt-4 hover:text-foreground transition-colors"
          >
            跳过引导
          </button>
        )}
      </div>
    </div>
  )
}
