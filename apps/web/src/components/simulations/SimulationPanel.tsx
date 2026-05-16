import { Pause, Play, RotateCcw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ErrorBoundary } from '@/components/ui/ErrorBoundary'
import { useSimulationPlayback } from '@/hooks/useSimulationPlayback'
import { BallAndBeamCanvas, type BallAndBeamDataPoint } from './BallAndBeamCanvas'
import { InvertedPendulumCanvas, type InvertedPendulumDataPoint } from './InvertedPendulumCanvas'
import { SimulationResults, type SimulationChartGroup, type SimulationDataPoint } from './SimulationResults'

type SimulationKind = 'inverted-pendulum' | 'ball-and-beam'

interface SimulationPanelProps {
  kind: SimulationKind
  data: SimulationDataPoint[]
  dt: number
  chartGroups: SimulationChartGroup[]
  pendulumLength?: number
  beamLength?: number
}

const SPEED_OPTIONS = [0.25, 0.5, 1, 2, 4] as const

export function SimulationPanel({
  kind,
  data,
  dt,
  chartGroups,
  pendulumLength,
  beamLength,
}: SimulationPanelProps) {
  const playback = useSimulationPlayback({ data, dt, targetFps: 8 })

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
      <Card className="bg-white text-foreground">
        <CardHeader>
          <CardTitle className="text-base">Animation</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <ErrorBoundary>
            {kind === 'inverted-pendulum' ? (
              <InvertedPendulumCanvas
                point={playback.currentPoint as InvertedPendulumDataPoint | null}
                pendulumLength={pendulumLength}
                className="h-52 w-full rounded-[20px] bg-[#f5f5f7] shadow-[0_0_0_1px_rgba(180,180,180,0.3)]"
              />
            ) : (
              <BallAndBeamCanvas
                point={playback.currentPoint as BallAndBeamDataPoint | null}
                beamLength={beamLength}
                className="h-52 w-full rounded-[20px] bg-[#f5f5f7] shadow-[0_0_0_1px_rgba(180,180,180,0.3)]"
              />
            )}
          </ErrorBoundary>

          {/* Playback controls */}
          <div className="space-y-2 rounded-[20px] bg-[#f5f5f7] p-3 shadow-[0_0_0_1px_rgba(180,180,180,0.3)]">
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
            </div>
            <div className="flex min-w-0 items-center gap-2 py-1">
              <input
                type="range"
                min={0}
                max={data.length - 1}
                value={playback.currentIndex}
                onChange={(e) => playback.seekTo(Number(e.target.value))}
                className="h-2 min-w-0 flex-1 cursor-pointer accent-primary"
                aria-label="Seek"
              />
              <span className="shrink-0 font-mono text-xs tabular-nums text-muted-foreground">
                {(playback.currentPoint?.t ?? 0).toFixed(2)}s
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Charts synchronized with animation */}
      <SimulationResults
        data={data}
        chartGroups={chartGroups}
        title="Simulation Results"
        currentTime={playback.currentPoint?.t}
        currentIndex={playback.currentIndex}
      />
    </div>
  )
}
