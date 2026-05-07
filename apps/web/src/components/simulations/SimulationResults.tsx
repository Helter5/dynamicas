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
  [key: string]: number
}

export interface SimulationChartGroup {
  title: string
  leftKey: string
  rightKey: string
  leftLabel: string
  rightLabel: string
  leftColor: string
  rightColor: string
  phaseTitle: string
  phaseXLabel: string
  phaseYLabel: string
}

interface SimulationResultsProps {
  data: SimulationDataPoint[]
  chartGroups: SimulationChartGroup[]
  title?: string
  currentTime?: number
  currentIndex?: number
}

// ── Time-course charts ────────────────────────────────────────────────────────

interface TimeChartProps {
  data: SimulationDataPoint[]
  group: SimulationChartGroup
  currentTime?: number
}

function chartConfigFor(group: SimulationChartGroup): ChartConfig {
  return {
    [group.leftKey]: { label: group.leftLabel, color: group.leftColor },
    [group.rightKey]: { label: group.rightLabel, color: group.rightColor },
  }
}

function TimeChart({ data, group, currentTime }: TimeChartProps) {
  const config = chartConfigFor(group)

  return (
    <Card className="bg-white">
      <CardHeader>
        <CardTitle className="text-sm font-semibold tracking-[-0.01em]">{group.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={config} className="h-56 w-full">
          <ComposedChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" strokeOpacity={0.55} />
            <XAxis
              dataKey="t"
              tickFormatter={(v: number) => v.toFixed(1)}
              label={{ value: 'Time (s)', position: 'insideBottomRight', offset: -5 }}
            />
            <YAxis
              yAxisId="left"
              width={58}
              tickFormatter={(v: number) => Number(v.toFixed(3)).toString()}
              label={{ value: group.leftLabel, angle: -90, position: 'insideLeft', offset: 10 }}
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              width={58}
              tickFormatter={(v: number) => Number(v.toFixed(3)).toString()}
              label={{ value: group.rightLabel, angle: 90, position: 'insideRight', offset: 10 }}
            />
            <ChartTooltip content={<ChartTooltipContent />} />
            <ChartLegend content={<ChartLegendContent />} />
            <Line yAxisId="left" type="monotone" dataKey={group.leftKey} stroke={`var(--color-${group.leftKey})`} dot={false} strokeWidth={2} />
            <Line yAxisId="right" type="monotone" dataKey={group.rightKey} stroke={`var(--color-${group.rightKey})`} dot={false} strokeWidth={2} strokeDasharray="5 2" />
            {currentTime != null && (
              <ReferenceLine yAxisId="left" x={currentTime} stroke="var(--primary)" strokeDasharray="4 2" strokeWidth={1.5} />
            )}
          </ComposedChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

// ── Phase-plane charts ────────────────────────────────────────────────────────

interface PhaseChartProps {
  data: SimulationDataPoint[]
  group: SimulationChartGroup
  currentIndex?: number
}

function PhaseChart({ data, group, currentIndex }: PhaseChartProps) {
  const plotData = data.map((pt) => ({ px: pt[group.leftKey], py: pt[group.rightKey] }))
  const currentPt = currentIndex != null ? plotData[currentIndex] : undefined

  const phaseConfig: ChartConfig = {
    py: { label: group.phaseYLabel, color: group.leftColor },
  }

  return (
    <Card className="bg-white">
      <CardHeader>
        <CardTitle className="text-sm font-semibold tracking-[-0.01em]">{group.phaseTitle}</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={phaseConfig} className="h-56 w-full">
          <LineChart data={plotData}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" strokeOpacity={0.55} />
            <XAxis
              dataKey="px"
              type="number"
              domain={['auto', 'auto']}
              tickFormatter={(v: number) => Number(v.toFixed(2)).toString()}
              label={{ value: group.phaseXLabel, position: 'insideBottomRight', offset: -5 }}
            />
            <YAxis
              width={60}
              tickFormatter={(v: number) => Number(v.toFixed(2)).toString()}
              label={{ value: group.phaseYLabel, angle: -90, position: 'insideLeft', offset: 10 }}
            />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Line type="monotone" dataKey="py" stroke={group.leftColor} dot={false} strokeWidth={2} />
            {currentPt != null && (
              <ReferenceDot
                x={currentPt.px}
                y={currentPt.py}
                r={5}
                fill="var(--primary)"
                stroke="var(--card)"
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
  chartGroups,
  title = 'Simulation Results',
  currentTime,
  currentIndex,
}: SimulationResultsProps) {
  if (!data || data.length === 0) {
    return <p className="text-center text-muted-foreground">No simulation data to display</p>
  }

  return (
    <div className="space-y-3">
      <h2 className="text-[25.5px] font-semibold leading-[31.5px] tracking-[-0.015em] text-white">{title}</h2>

      <Tabs defaultValue="time" className="gap-4">
        <TabsList className="w-full bg-white/10 text-white/64 shadow-[0_0_0_1px_rgba(255,255,255,0.08)]">
          <TabsTrigger value="time" className="flex-1">Time Courses</TabsTrigger>
          <TabsTrigger value="state" className="flex-1">State Space</TabsTrigger>
        </TabsList>

        {/* ── Time courses tab ── */}
        <TabsContent value="time">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {chartGroups.map((group) => (
              <TimeChart
                key={group.title}
                data={data}
                group={group}
                currentTime={currentTime}
              />
            ))}
          </div>
        </TabsContent>

        {/* ── State space tab ── */}
        <TabsContent value="state">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {chartGroups.map((group) => (
              <PhaseChart
                key={group.phaseTitle}
                data={data}
                group={group}
                currentIndex={currentIndex}
              />
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
