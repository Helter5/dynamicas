import { Pause, Play, RotateCcw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useSimulationPlayback } from '@/hooks/useSimulationPlayback'
import { InvertedPendulumCanvas } from './InvertedPendulumCanvas'
import { SimulationResults, type SimulationDataPoint } from './SimulationResults'

interface SimulationPanelProps {
  data: SimulationDataPoint[]
  dt: number
  pendulumLength?: number
}

const SPEED_OPTIONS = [0.25, 0.5, 1, 2, 4] as const

export function SimulationPanel({ data, dt, pendulumLength }: SimulationPanelProps) {
  const playback = useSimulationPlayback({ data, dt })

  const togglePlayPause = () => {
    if (playback.isPlaying) {
      playback.pause()
    } else {
      playback.play()
    }
  }

  const cycleSpeed = () => {
    const idx = SPEED_OPTIONS.indexOf(playback.speed as (typeof SPEED_OPTIONS)[number])
    const next = SPEED_OPTIONS[(idx + 1) % SPEED_OPTIONS.length] ?? 1
    playback.setSpeed(next)
  }

  return (
    <div className="space-y-4">
      {/* Animation */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Animation</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <InvertedPendulumCanvas
            point={playback.currentPoint}
            pendulumLength={pendulumLength}
            className="h-48 w-full rounded-md bg-slate-50"
          />

          {/* Playback controls */}
          <div className="flex items-center gap-2">
            <Button size="icon" variant="outline" onClick={togglePlayPause} aria-label={playback.isPlaying ? 'Pause' : 'Play'}>
              {playback.isPlaying ? <Pause className="size-4" /> : <Play className="size-4" />}
            </Button>
            <Button size="icon" variant="outline" onClick={playback.reset} aria-label="Reset">
              <RotateCcw className="size-4" />
            </Button>
            <Button size="sm" variant="outline" onClick={cycleSpeed} className="w-14 tabular-nums">
              {playback.speed}×
            </Button>
            <input
              type="range"
              min={0}
              max={data.length - 1}
              value={playback.currentIndex}
              onChange={(e) => playback.seekTo(Number(e.target.value))}
              className="h-1.5 flex-1 cursor-pointer accent-primary"
              aria-label="Seek"
            />
            <span className="w-14 text-right font-mono text-xs text-muted-foreground tabular-nums">
              {(playback.currentPoint?.t ?? 0).toFixed(2)}s
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Charts synchronized with animation */}
      <SimulationResults
        data={data}
        title="Simulation Results"
        currentTime={playback.currentPoint?.t}
      />
    </div>
  )
}