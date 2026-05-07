import { useState } from 'react'

const COMMAND_HISTORY_KEY = 'cas_command_history'
const MAX_HISTORY_ITEMS = 10

export function useCommandHistory() {
  const [selectedHistoryIndex, setSelectedHistoryIndex] = useState<number | null>(null)
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
      setSelectedHistoryIndex(null)
      return next
    })
  }

  function clearHistory() {
    setCommandHistory([])
    setSelectedHistoryIndex(null)
    localStorage.removeItem(COMMAND_HISTORY_KEY)
  }

  function selectPreviousHistoryCommand() {
    if (commandHistory.length === 0) {
      return null
    }

    const nextIndex =
      selectedHistoryIndex === null
        ? 0
        : Math.min(selectedHistoryIndex + 1, commandHistory.length - 1)

    setSelectedHistoryIndex(nextIndex)
    return commandHistory[nextIndex]
  }

  function selectNextHistoryCommand() {
    if (selectedHistoryIndex === null) {
      return null
    }

    const nextIndex = selectedHistoryIndex - 1

    if (nextIndex < 0) {
      setSelectedHistoryIndex(null)
      return null
    }

    setSelectedHistoryIndex(nextIndex)
    return commandHistory[nextIndex]
  }

  function resetHistoryNavigation() {
    setSelectedHistoryIndex(null)
  }

  return {
    commandHistory,
    selectedHistoryIndex,
    addToHistory,
    clearHistory,
    selectPreviousHistoryCommand,
    selectNextHistoryCommand,
    resetHistoryNavigation,
  }
}
