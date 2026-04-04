import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ReferenceLine,
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
}

const chartConfig = {
  x: { label: 'Position (x)', color: 'var(--chart-1)' },
  v: { label: 'Velocity (v)', color: 'var(--chart-2)' },
  theta: { label: 'Angle (θ)', color: 'var(--chart-3)' },
  omega: { label: 'Ang. Velocity (ω)', color: 'var(--chart-4)' },
} satisfies ChartConfig

type DataKey = keyof typeof chartConfig

interface SimChartProps {
  data: SimulationDataPoint[]
  title: string
  dataKeys: DataKey[]
  yLabel: string
  currentTime?: number
}

function SimChart({ data, title, dataKeys, yLabel, currentTime }: SimChartProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-60 w-full">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="t"
              label={{ value: 'Time (s)', position: 'insideBottomRight', offset: -5 }}
              tickFormatter={(v: number) => v.toFixed(1)}
            />
            <YAxis
              label={{ value: yLabel, angle: -90, position: 'insideLeft', offset: 10 }}
              width={60}
            />
            <ChartTooltip content={<ChartTooltipContent />} />
            <ChartLegend content={<ChartLegendContent />} />
            {dataKeys.map((key) => (
              <Line
                key={key}
                type="monotone"
                dataKey={key}
                stroke={`var(--color-${key})`}
                dot={false}
                strokeWidth={1.5}
              />
            ))}
            {currentTime != null && (
              <ReferenceLine
                x={currentTime}
                stroke="var(--foreground)"
                strokeDasharray="4 2"
                strokeWidth={1.5}
              />
            )}
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

export function SimulationResults({
  data,
  title = 'Simulation Results',
  currentTime,
}: SimulationResultsProps) {
  if (!data || data.length === 0) {
    return <p className="text-center text-muted-foreground">No simulation data to display</p>
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">{title}</h2>
      <SimChart data={data} title="Position vs Time" dataKeys={['x']} yLabel="Position (m)" currentTime={currentTime} />
      <SimChart data={data} title="Velocity vs Time" dataKeys={['v']} yLabel="Velocity (m/s)" currentTime={currentTime} />
      <SimChart data={data} title="Pendulum Angle vs Time" dataKeys={['theta']} yLabel="Angle (rad)" currentTime={currentTime} />
      <SimChart data={data} title="Angular Velocity vs Time" dataKeys={['omega']} yLabel="Ang. Vel. (rad/s)" currentTime={currentTime} />
      <SimChart data={data} title="All Variables" dataKeys={['x', 'v', 'theta', 'omega']} yLabel="Value" currentTime={currentTime} />
    </div>
  )
}