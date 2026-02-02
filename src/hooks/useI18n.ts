import { useState, useEffect } from 'react'
import { createI18n, type UseI18nReturn, type I18nOptions } from '../core/types/i18n'

let globalI18n: ReturnType<typeof createI18n> | null = null

export function initI18n<T extends string = string>(options: I18nOptions<T>) {
  globalI18n = createI18n(options)
  return globalI18n
}

export function useI18n<T extends string = string>(): UseI18nReturn<T> {
  const [, setTick] = useState(0)
  if (!globalI18n) {
    // initialize with a safe default to avoid runtime errors
    initI18n({ defaultLocale: 'en-US', messages: { 'en-US': {} } } as any)
  }

  useEffect(() => {
    // no-op for now; placeholder for subscription if implemented
    return () => {}
  }, [])

  return {
    t: (globalI18n as any).t,
    get locale() {
      return (globalI18n as any).locale
    },
    setLocale: (locale: string) => {
      (globalI18n as any).setLocale(locale)
      setTick(t => t + 1)
    }
  } as UseI18nReturn<T>
}
