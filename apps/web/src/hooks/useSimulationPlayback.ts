import { useCallback, useEffect, useReducer, useRef } from 'react'
import type { SimulationDataPoint } from '@/components/simulations/SimulationResults'

interface UseSimulationPlaybackOptions {
  data: SimulationDataPoint[]
  dt: number
  speed?: number
  targetFps?: number
}

interface UseSimulationPlaybackReturn {
  currentIndex: number
  currentPoint: SimulationDataPoint | null
  isPlaying: boolean
  play: () => void
  pause: () => void
  reset: () => void
  seekTo: (index: number) => void
  speed: number
  setSpeed: (speed: number) => void
}

type State = {
  currentIndex: number
  isPlaying: boolean
  speed: number
}

type Action =
  | { type: 'PLAY' }
  | { type: 'PAUSE' }
  | { type: 'RESET' }
  | { type: 'SEEK'; index: number }
  | { type: 'ADVANCE'; index: number }
  | { type: 'FINISH' }
  | { type: 'SET_SPEED'; speed: number }

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'PLAY':
      return { ...state, isPlaying: true }
    case 'PAUSE':
      return { ...state, isPlaying: false }
    case 'RESET':
      return { ...state, currentIndex: 0, isPlaying: false }
    case 'SEEK':
      return { ...state, currentIndex: action.index }
    case 'ADVANCE':
      return { ...state, currentIndex: action.index }
    case 'FINISH':
      return { ...state, isPlaying: false }
    case 'SET_SPEED':
      return { ...state, speed: action.speed }
  }
}

export function useSimulationPlayback({
  data,
  dt,
  speed: initialSpeed = 1,
  targetFps = 24,
}: UseSimulationPlaybackOptions): UseSimulationPlaybackReturn {
  const [state, dispatch] = useReducer(reducer, {
    currentIndex: 0,
    isPlaying: false,
    speed: initialSpeed,
  })

  const rafRef = useRef<number | null>(null)
  const lastTimestampRef = useRef<number | null>(null)
  const lastUiUpdateTimestampRef = useRef<number | null>(null)
  const accumulatedTimeRef = useRef(0)
  const stateRef = useRef(state)
  const dataRef = useRef(data)
  const dtRef = useRef(dt)
  const frameDurationRef = useRef(1000 / targetFps)

  // Keep refs in sync so rAF callback reads current values without re-subscribing
  useEffect(() => { stateRef.current = state })
  useEffect(() => { dataRef.current = data })
  useEffect(() => { dtRef.current = dt })
  useEffect(() => { frameDurationRef.current = 1000 / targetFps }, [targetFps])

  const stopLoop = useCallback(() => {
    if (rafRef.current != null) {
      cancelAnimationFrame(rafRef.current)
      rafRef.current = null
    }
    lastTimestampRef.current = null
    lastUiUpdateTimestampRef.current = null
  }, [])

  const startLoop = useCallback(() => {
    if (rafRef.current != null) return

    const tick = (timestamp: number) => {
      if (lastTimestampRef.current == null) {
        lastTimestampRef.current = timestamp
      }

      const delta = (timestamp - lastTimestampRef.current) / 1000
      lastTimestampRef.current = timestamp
      accumulatedTimeRef.current += delta * stateRef.current.speed

      const newIndex = Math.min(
        Math.floor(accumulatedTimeRef.current / dtRef.current),
        dataRef.current.length - 1,
      )
      const isFinalIndex = newIndex >= dataRef.current.length - 1
      const shouldUpdateUi =
        lastUiUpdateTimestampRef.current == null ||
        timestamp - lastUiUpdateTimestampRef.current >= frameDurationRef.current ||
        isFinalIndex

      if (shouldUpdateUi && newIndex !== stateRef.current.currentIndex) {
        lastUiUpdateTimestampRef.current = timestamp
        dispatch({ type: 'ADVANCE', index: newIndex })
      }

      if (isFinalIndex) {
        dispatch({ type: 'FINISH' })
        rafRef.current = null
        return
      }

      rafRef.current = requestAnimationFrame(tick)
    }

    rafRef.current = requestAnimationFrame(tick)
  }, [])

  const play = useCallback(() => {
    if (data.length === 0) return
    if (stateRef.current.currentIndex >= data.length - 1) {
      accumulatedTimeRef.current = 0
      lastUiUpdateTimestampRef.current = null
      dispatch({ type: 'SEEK', index: 0 })
    }
    dispatch({ type: 'PLAY' })
  }, [data.length])

  const pause = useCallback(() => dispatch({ type: 'PAUSE' }), [])

  const reset = useCallback(() => {
    accumulatedTimeRef.current = 0
    lastUiUpdateTimestampRef.current = null
    dispatch({ type: 'RESET' })
  }, [])

  const seekTo = useCallback(
    (index: number) => {
      const clamped = Math.max(0, Math.min(index, data.length - 1))
      accumulatedTimeRef.current = clamped * dt
      lastUiUpdateTimestampRef.current = null
      dispatch({ type: 'SEEK', index: clamped })
    },
    [data.length, dt],
  )

  const setSpeed = useCallback((speed: number) => dispatch({ type: 'SET_SPEED', speed }), [])

  // Start/stop rAF loop based on isPlaying
  useEffect(() => {
    if (state.isPlaying) {
      startLoop()
    } else {
      stopLoop()
    }
    return stopLoop
  }, [state.isPlaying, startLoop, stopLoop])

  // Reset when data changes (new simulation result arrived)
  useEffect(() => {
    stopLoop()
    accumulatedTimeRef.current = 0
    lastUiUpdateTimestampRef.current = null
    dispatch({ type: 'RESET' })
  }, [data, stopLoop])

  return {
    currentIndex: state.currentIndex,
    currentPoint: data[state.currentIndex] ?? null,
    isPlaying: state.isPlaying,
    play,
    pause,
    reset,
    seekTo,
    speed: state.speed,
    setSpeed,
  }
}
