/**
 * Toast通知Hook
 */

import { useState, useCallback } from 'react'

type ToastType = 'success' | 'error' | 'info'

interface Toast {
  id: string
  type: ToastType
  message: string
}

let toastId = 0

export function useToast() {
  const [toasts, setToasts] = useState<Toast[]>([])
  
  const show = useCallback((type: ToastType, message: string, duration = 3000) => {
    const id = String(++toastId)
    const toast: Toast = { id, type, message }
    
    setToasts(prev => [...prev, toast])
    
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id))
    }, duration)
    
    return id
  }, [])
  
  const success = useCallback((message: string) => show('success', message), [show])
  const error = useCallback((message: string) => show('error', message), [show])
  const info = useCallback((message: string) => show('info', message), [show])
  
  const dismiss = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id))
  }, [])
  
  return {
    toasts,
    show,
    success,
    error,
    info,
    dismiss,
  }
}

// 全局Toast实例
let globalToast: ReturnType<typeof useToast> | null = null

export function setGlobalToast(toast: ReturnType<typeof useToast>) {
  globalToast = toast
}

export function toast(type: ToastType, message: string) {
  globalToast?.show(type, message)
}

toast.success = (message: string) => globalToast?.success(message)
toast.error = (message: string) => globalToast?.error(message)
toast.info = (message: string) => globalToast?.info(message)
