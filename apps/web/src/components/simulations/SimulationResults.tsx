import {
  ComposedChart,
  Line,
  LineChart,
  ReferenceDot,
  ReferenceLine,
  XAxis,
  YAxis,
  CartesianGrid,
} from 'recharts'
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  type ChartConfig,
} from '@/components/ui/chart'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

export interface SimulationDataPoint {
  t: number
  x: number
  v: number
  theta: number
  omega: number
}

interface SimulationResultsProps {
  data: SimulationDataPoint[]
  title?: string
  currentTime?: number
  currentIndex?: number
}

// ── Time-course charts ────────────────────────────────────────────────────────

const translationalConfig = {
  x: { label: 'Position x (m)', color: 'var(--chart-1)' },
  v: { label: 'Velocity v (m/s)', color: 'var(--chart-2)' },
} satisfies ChartConfig

const rotationalConfig = {
  theta: { label: 'Angle θ (rad)', color: 'var(--chart-3)' },
  omega: { label: 'Ang. vel. ω (rad/s)', color: 'var(--chart-4)' },
} satisfies ChartConfig

interface TimeChartProps {
  data: SimulationDataPoint[]
  title: string
  config: ChartConfig
  leftKey: 'x' | 'theta'
  rightKey: 'v' | 'omega'
  leftLabel: string
  rightLabel: string
  currentTime?: number
}

function TimeChart({ data, title, config, leftKey, rightKey, leftLabel, rightLabel, currentTime }: TimeChartProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={config} className="h-56 w-full">
          <ComposedChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="t"
              tickFormatter={(v: number) => v.toFixed(1)}
              label={{ value: 'Time (s)', position: 'insideBottomRight', offset: -5 }}
            />
            <YAxis
              yAxisId="left"
              width={58}
              tickFormatter={(v: number) => Number(v.toFixed(3)).toString()}
              label={{ value: leftLabel, angle: -90, position: 'insideLeft', offset: 10 }}
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              width={58}
              tickFormatter={(v: number) => Number(v.toFixed(3)).toString()}
              label={{ value: rightLabel, angle: 90, position: 'insideRight', offset: 10 }}
            />
            <ChartTooltip content={<ChartTooltipContent />} />
            <ChartLegend content={<ChartLegendContent />} />
            <Line yAxisId="left" type="monotone" dataKey={leftKey} stroke={`var(--color-${leftKey})`} dot={false} strokeWidth={1.5} />
            <Line yAxisId="right" type="monotone" dataKey={rightKey} stroke={`var(--color-${rightKey})`} dot={false} strokeWidth={1.5} strokeDasharray="5 2" />
            {currentTime != null && (
              <ReferenceLine yAxisId="left" x={currentTime} stroke="var(--foreground)" strokeDasharray="4 2" strokeWidth={1.5} />
            )}
          </ComposedChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

// ── Phase-plane charts ────────────────────────────────────────────────────────

const xvPhaseConfig = {
  trajectory: { label: 'Trajectory', color: 'var(--chart-1)' },
} satisfies ChartConfig

const thetaOmegaPhaseConfig = {
  trajectory: { label: 'Trajectory', color: 'var(--chart-3)' },
} satisfies ChartConfig

interface PhaseChartProps {
  data: SimulationDataPoint[]
  title: string
  config: ChartConfig
  xKey: keyof SimulationDataPoint
  yKey: keyof SimulationDataPoint
  xLabel: string
  yLabel: string
  currentIndex?: number
}

function PhaseChart({ data, title, config, xKey, yKey, xLabel, yLabel, currentIndex }: PhaseChartProps) {
  // Map series to {px, py} pairs for Recharts
  const plotData = data.map((pt) => ({ px: pt[xKey], py: pt[yKey] }))
  const colorKey = Object.keys(config)[0] as string
  const color = (config[colorKey] as { color?: string })?.color ?? 'var(--chart-1)'

  const currentPt = currentIndex != null ? plotData[currentIndex] : undefined

  const phaseConfig: ChartConfig = {
    py: { label: yLabel, color },
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={phaseConfig} className="h-56 w-full">
          <LineChart data={plotData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="px"
              type="number"
              domain={['auto', 'auto']}
              tickFormatter={(v: number) => Number(v.toFixed(2)).toString()}
              label={{ value: xLabel, position: 'insideBottomRight', offset: -5 }}
            />
            <YAxis
              width={60}
              tickFormatter={(v: number) => Number(v.toFixed(2)).toString()}
              label={{ value: yLabel, angle: -90, position: 'insideLeft', offset: 10 }}
            />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Line type="monotone" dataKey="py" stroke={color} dot={false} strokeWidth={1.5} />
            {currentPt != null && (
              <ReferenceDot
                x={currentPt.px}
                y={currentPt.py}
                r={5}
                fill="var(--foreground)"
                stroke="var(--background)"
                strokeWidth={2}
              />
            )}
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

// ── Public component ──────────────────────────────────────────────────────────

export function SimulationResults({
  data,
  title = 'Simulation Results',
  currentTime,
  currentIndex,
}: SimulationResultsProps) {
  if (!data || data.length === 0) {
    return <p className="text-center text-muted-foreground">No simulation data to display</p>
  }

  return (
    <div className="space-y-3">
      <h2 className="text-lg font-semibold">{title}</h2>

      <Tabs defaultValue="time">
        <TabsList className="w-full">
          <TabsTrigger value="time" className="flex-1">Time Courses</TabsTrigger>
          <TabsTrigger value="state" className="flex-1">State Space</TabsTrigger>
        </TabsList>

        {/* ── Time courses tab ── */}
        <TabsContent value="time">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <TimeChart
              data={data}
              title="Translational Dynamics"
              config={translationalConfig}
              leftKey="x"
              rightKey="v"
              leftLabel="x (m)"
              rightLabel="v (m/s)"
              currentTime={currentTime}
            />
            <TimeChart
              data={data}
              title="Rotational Dynamics"
              config={rotationalConfig}
              leftKey="theta"
              rightKey="omega"
              leftLabel="θ (rad)"
              rightLabel="ω (rad/s)"
              currentTime={currentTime}
            />
          </div>
        </TabsContent>

        {/* ── State space tab ── */}
        <TabsContent value="state">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <PhaseChart
              data={data}
              title="Translational Phase Plane (x vs v)"
              config={xvPhaseConfig}
              xKey="x"
              yKey="v"
              xLabel="Position x (m)"
              yLabel="Velocity v (m/s)"
              currentIndex={currentIndex}
            />
            <PhaseChart
              data={data}
              title="Rotational Phase Plane (θ vs ω)"
              config={thetaOmegaPhaseConfig}
              xKey="theta"
              yKey="omega"
              xLabel="Angle θ (rad)"
              yLabel="Ang. vel. ω (rad/s)"
              currentIndex={currentIndex}
            />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
