/**
 * 日记相关Hooks
 */

import { useState, useEffect, useCallback, useMemo } from 'react'
import { format } from 'date-fns'
import { journalService } from '@/core/services'
import type { JournalEntry, MoodType, MoodStats, EmotionFactor } from '@/core/types'

// ==================== 日记数据Hook ====================

export function useJournalEntries() {
  const [entries, setEntries] = useState<JournalEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  
  const refresh = useCallback(async () => {
    try {
      setLoading(true)
      const data = await journalService.getAll()
      setEntries(data)
      setError(null)
    } catch (e) {
      setError(e as Error)
    } finally {
      setLoading(false)
    }
  }, [])
  
  useEffect(() => {
    refresh()
  }, [refresh])
  
  const create = useCallback(async (entry: Parameters<typeof journalService.create>[0]) => {
    const newEntry = await journalService.create(entry)
    await refresh()
    return newEntry
  }, [refresh])
  
  const update = useCallback(async (id: string, updates: Partial<JournalEntry>) => {
    const updated = await journalService.update(id, updates)
    if (updated) await refresh()
    return updated
  }, [refresh])
  
  const remove = useCallback(async (id: string) => {
    const success = await journalService.delete(id)
    if (success) await refresh()
    return success
  }, [refresh])
  
  return {
    entries,
    loading,
    error,
    refresh,
    create,
    update,
    remove,
  }
}

// ==================== 今日签到Hook ====================

export function useTodayEntry() {
  const [entry, setEntry] = useState<JournalEntry | null>(null)
  const [loading, setLoading] = useState(true)
  
  const today = format(new Date(), 'yyyy-MM-dd')
  
  const refresh = useCallback(async () => {
    setLoading(true)
    const data = await journalService.getByDate(today)
    setEntry(data)
    setLoading(false)
  }, [today])
  
  useEffect(() => {
    refresh()
  }, [refresh])
  
  const checkIn = useCallback(async (
    mood: MoodType, 
    note: string = '', 
    factors: EmotionFactor[] = []
  ) => {
    const newEntry = await journalService.create({
      date: today,
      mood,
      content: note,
      plainText: note,
      tags: [],
      photos: [],
      factors,
      isEncrypted: false,
    })
    setEntry(newEntry)
    return newEntry
  }, [today])
  
  return {
    entry,
    loading,
    hasCheckedIn: !!entry,
    checkIn,
    refresh,
  }
}

// ==================== 月度数据Hook ====================

export function useMonthEntries(year: number, month: number) {
  const [entries, setEntries] = useState<JournalEntry[]>([])
  const [loading, setLoading] = useState(true)
  
  useEffect(() => {
    const load = async () => {
      setLoading(true)
      const data = await journalService.getByMonth(year, month)
      setEntries(data)
      setLoading(false)
    }
    load()
  }, [year, month])
  
  // 按日期索引
  const entriesByDate = useMemo(() => {
    const map = new Map<string, JournalEntry>()
    entries.forEach(e => map.set(e.date, e))
    return map
  }, [entries])
  
  return {
    entries,
    entriesByDate,
    loading,
  }
}

// ==================== 统计数据Hook ====================

export function useMoodStats() {
  const [stats, setStats] = useState<MoodStats | null>(null)
  const [loading, setLoading] = useState(true)
  
  const refresh = useCallback(async () => {
    setLoading(true)
    const data = await journalService.getStats()
    setStats(data)
    setLoading(false)
  }, [])
  
  useEffect(() => {
    refresh()
  }, [refresh])
  
  return {
    stats,
    loading,
    refresh,
  }
}

// ==================== 搜索Hook ====================

export function useJournalSearch() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<JournalEntry[]>([])
  const [loading, setLoading] = useState(false)
  
  const search = useCallback(async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([])
      return
    }
    
    setLoading(true)
    const data = await journalService.search(searchQuery)
    setResults(data)
    setLoading(false)
  }, [])
  
  // 防抖搜索
  useEffect(() => {
    const timer = setTimeout(() => {
      search(query)
    }, 300)
    
    return () => clearTimeout(timer)
  }, [query, search])
  
  return {
    query,
    setQuery,
    results,
    loading,
  }
}

// ==================== 导出Hook ====================

export function useExport() {
  const [exporting, setExporting] = useState(false)
  
  const exportJSON = useCallback(async () => {
    setExporting(true)
    try {
      const data = await journalService.exportToJSON()
      const blob = new Blob([data], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `mood_journal_${format(new Date(), 'yyyyMMdd')}.json`
      link.click()
      URL.revokeObjectURL(url)
      return true
    } finally {
      setExporting(false)
    }
  }, [])
  
  const exportMarkdown = useCallback(async () => {
    setExporting(true)
    try {
      const data = await journalService.exportToMarkdown()
      const blob = new Blob([data], { type: 'text/markdown' })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `mood_journal_${format(new Date(), 'yyyyMMdd')}.md`
      link.click()
      URL.revokeObjectURL(url)
      return true
    } finally {
      setExporting(false)
    }
  }, [])
  
  return {
    exporting,
    exportJSON,
    exportMarkdown,
  }
}
