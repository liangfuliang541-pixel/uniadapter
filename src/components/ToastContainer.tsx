/**
 * Toast通知组件
 */

import { cn } from '@/lib/utils'
import { Check, X, Info } from 'lucide-react'

interface Toast {
  id: string
  type: 'success' | 'error' | 'info'
  message: string
}

interface ToastContainerProps {
  toasts: Toast[]
  onDismiss: (id: string) => void
}

const icons = {
  success: Check,
  error: X,
  info: Info,
}

const classes = {
  success: 'toast-success',
  error: 'toast-error',
  info: 'toast-info',
}

export default function ToastContainer({ toasts, onDismiss }: ToastContainerProps) {
  return (
    <div className="fixed bottom-24 left-0 right-0 z-[100] flex flex-col items-center gap-2 pointer-events-none">
      {toasts.map((toast) => {
        const Icon = icons[toast.type]
        return (
          <div
            key={toast.id}
            className={cn(
              classes[toast.type],
              'flex items-center gap-2 pointer-events-auto animate-scale-in'
            )}
            onClick={() => onDismiss(toast.id)}
          >
            <Icon className="w-4 h-4" />
            <span>{toast.message}</span>
          </div>
        )
      })}
    </div>
  )
}
