import { useState } from 'react'

const COMMAND_HISTORY_KEY = 'cas_command_history'
const MAX_HISTORY_ITEMS = 10

export function useCommandHistory() {
  const [commandHistory, setCommandHistory] = useState<string[]>(() => {
    const stored = localStorage.getItem(COMMAND_HISTORY_KEY)

    if (!stored) {
      return []
    }

    try {
      const parsed = JSON.parse(stored)
      return Array.isArray(parsed)
        ? parsed.filter((item): item is string => typeof item === 'string').slice(0, MAX_HISTORY_ITEMS)
        : []
    } catch {
      return []
    }
  })

  function addToHistory(command: string) {
    const normalized = command.trim()
    if (normalized === '') {
      return
    }

    setCommandHistory((current) => {
      const next = [
        normalized,
        ...current.filter((item) => item !== normalized),
      ].slice(0, MAX_HISTORY_ITEMS)

      localStorage.setItem(COMMAND_HISTORY_KEY, JSON.stringify(next))
      return next
    })
  }

  function clearHistory() {
    setCommandHistory([])
    localStorage.removeItem(COMMAND_HISTORY_KEY)
  }

  return {
    commandHistory,
    addToHistory,
    clearHistory,
  }
}
