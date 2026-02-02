export type Locale = string

export type Messages<T extends string = string> = Record<T, string>

export interface I18nOptions<T extends string = string> {
  defaultLocale: Locale
  messages: Record<Locale, Messages<T>>
}

export interface UseI18nReturn<T extends string = string> {
  t(key: T): string
  locale: Locale
  setLocale(locale: Locale): void
}

export function createI18n<T extends string = string>(options: I18nOptions<T>) {
  const current = { locale: options.defaultLocale }
  return {
    t(key: T) {
      const msgs = options.messages[current.locale] || (Object.values(options.messages)[0] as any)
      return (msgs && (msgs as any)[key]) || key
    },
    get locale() {
      return current.locale
    },
    setLocale(locale: Locale) {
      if (options.messages[locale]) current.locale = locale
    }
  } as UseI18nReturn<T>
}
