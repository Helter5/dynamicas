import { useMemo } from 'react'
import { LoaderCircle } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useSimulationForm } from '@/hooks/useSimulationForm'
import { SimulationPanel } from './SimulationPanel'
import type { SimulationChartGroup } from './SimulationResults'

interface SimulationsCardProps {
  apiBaseUrl: string
  apiKey: string
  anonToken: string
}

const invertedChartGroups: SimulationChartGroup[] = [
  {
    title: 'Translational Dynamics',
    leftKey: 'x',
    rightKey: 'v',
    leftLabel: 'x (m)',
    rightLabel: 'v (m/s)',
    leftColor: 'var(--chart-1)',
    rightColor: 'var(--chart-2)',
    phaseTitle: 'Translational Phase Plane (x vs v)',
    phaseXLabel: 'Position x (m)',
    phaseYLabel: 'Velocity v (m/s)',
  },
  {
    title: 'Rotational Dynamics',
    leftKey: 'theta',
    rightKey: 'omega',
    leftLabel: 'theta (rad)',
    rightLabel: 'omega (rad/s)',
    leftColor: 'var(--chart-3)',
    rightColor: 'var(--chart-4)',
    phaseTitle: 'Rotational Phase Plane (theta vs omega)',
    phaseXLabel: 'Angle theta (rad)',
    phaseYLabel: 'Angular velocity omega (rad/s)',
  },
]

const ballAndBeamChartGroups: SimulationChartGroup[] = [
  {
    title: 'Ball Dynamics',
    leftKey: 'r',
    rightKey: 'r_dot',
    leftLabel: 'r (m)',
    rightLabel: 'r_dot (m/s)',
    leftColor: 'var(--chart-1)',
    rightColor: 'var(--chart-2)',
    phaseTitle: 'Ball Phase Plane (r vs r_dot)',
    phaseXLabel: 'Position r (m)',
    phaseYLabel: 'Velocity r_dot (m/s)',
  },
  {
    title: 'Beam Dynamics',
    leftKey: 'alpha',
    rightKey: 'alpha_dot',
    leftLabel: 'alpha (rad)',
    rightLabel: 'alpha_dot (rad/s)',
    leftColor: 'var(--chart-3)',
    rightColor: 'var(--chart-4)',
    phaseTitle: 'Beam Phase Plane (alpha vs alpha_dot)',
    phaseXLabel: 'Angle alpha (rad)',
    phaseYLabel: 'Angular velocity alpha_dot (rad/s)',
  },
]

const invertedDefaults = {
  duration: 5,
  dt: 0.01,
  reference: 0.2,
  initial_x: 0,
  initial_v: 0,
  initial_theta: 0,
  initial_omega: 0,
}

const ballAndBeamDefaults = {
  duration: 5,
  dt: 0.01,
  reference: 0.25,
  initial_r: 0,
  initial_r_dot: 0,
  initial_alpha: 0,
  initial_alpha_dot: 0,
}

function NumberField({
  id,
  label,
  value,
  step = 0.01,
  onChange,
}: {
  id: string
  label: string
  value: number
  step?: number
  onChange: (value: number) => void
}) {
  return (
    <div className="grid gap-1.5">
      <Label htmlFor={id} className="text-xs font-semibold tracking-[-0.01em] text-muted-foreground">{label}</Label>
      <Input
        id={id}
        type="number"
        step={step}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
      />
    </div>
  )
}

function SimulationEmptyState({ message }: { message: string }) {
  return (
    <div className="rounded-[20px] bg-white px-4 py-10 text-center text-sm text-muted-foreground shadow-[0_0_0_1px_rgba(180,180,180,0.3)]">
      {message}
    </div>
  )
}

export function SimulationsCard({ apiBaseUrl, apiKey, anonToken }: SimulationsCardProps) {
  const { t } = useTranslation()
  const apiRoot = useMemo(() => apiBaseUrl.replace(/\/$/, ''), [apiBaseUrl])

  const inverted = useSimulationForm({
    endpoint: 'inverted-pendulum',
    defaults: invertedDefaults,
    apiRoot,
    apiKey,
    anonToken,
  })

  const ball = useSimulationForm({
    endpoint: 'ball-and-beam',
    defaults: ballAndBeamDefaults,
    apiRoot,
    apiKey,
    anonToken,
  })

  const anyLoading = inverted.isLoading || ball.isLoading

  return (
    <Card className="bg-[#1d1d1f] text-white shadow-[0_0_0_1px_rgba(40,40,40,0.8)]">
      <CardHeader className="gap-2">
        <p className="text-sm font-semibold text-[#2997ff]">Control models</p>
        <CardTitle className="text-[40px] leading-[44px] tracking-normal text-white">Simulations</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="inverted-pendulum" className="gap-5">
          <TabsList className="h-auto w-full bg-white/10 text-white/64 shadow-[0_0_0_1px_rgba(255,255,255,0.08)]">
            <TabsTrigger value="inverted-pendulum" className="flex-1 whitespace-normal py-2 text-center leading-tight">Inverted Pendulum</TabsTrigger>
            <TabsTrigger value="ball-and-beam" className="flex-1 whitespace-normal py-2 text-center leading-tight">Ball and Beam</TabsTrigger>
          </TabsList>

          <TabsContent value="inverted-pendulum" className="space-y-4">
            <div className="grid gap-4 rounded-[24px] bg-white p-4 text-foreground md:p-5 lg:grid-cols-[1fr_220px] lg:items-stretch">
              <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                <NumberField id="ip-duration" label="Duration (s)" value={inverted.form.duration} onChange={(v) => inverted.setForm({ ...inverted.form, duration: v })} />
                <NumberField id="ip-dt" label="dt (s)" value={inverted.form.dt} step={0.001} onChange={(v) => inverted.setForm({ ...inverted.form, dt: v })} />
                <NumberField id="ip-reference" label="Reference x (m)" value={inverted.form.reference} onChange={(v) => inverted.setForm({ ...inverted.form, reference: v })} />
                <NumberField id="ip-initial-x" label="Initial x (m)" value={inverted.form.initial_x} onChange={(v) => inverted.setForm({ ...inverted.form, initial_x: v })} />
                <NumberField id="ip-initial-v" label="Initial v (m/s)" value={inverted.form.initial_v} onChange={(v) => inverted.setForm({ ...inverted.form, initial_v: v })} />
                <NumberField id="ip-initial-theta" label="Initial theta (rad)" value={inverted.form.initial_theta} onChange={(v) => inverted.setForm({ ...inverted.form, initial_theta: v })} />
                <NumberField id="ip-initial-omega" label="Initial omega (rad/s)" value={inverted.form.initial_omega} onChange={(v) => inverted.setForm({ ...inverted.form, initial_omega: v })} />
              </div>
              <div className="flex items-end lg:justify-end">
                <Button onClick={() => void inverted.run()} disabled={anyLoading} className="h-auto w-full whitespace-normal py-2 lg:w-auto lg:min-w-48">
                  {inverted.isLoading ? (
                    <>
                      <LoaderCircle className="shrink-0 animate-spin" />
                      {t('runningInvertedPendulum')}
                    </>
                  ) : (
                    'Run Inverted Pendulum'
                  )}
                </Button>
              </div>
            </div>
            {inverted.data.length > 0 ? (
              <SimulationPanel
                kind="inverted-pendulum"
                data={inverted.data}
                dt={inverted.dt}
                chartGroups={invertedChartGroups}
              />
            ) : (
              <SimulationEmptyState message={t('simulationEmptyState')} />
            )}
          </TabsContent>

          <TabsContent value="ball-and-beam" className="space-y-4">
            <div className="grid gap-4 rounded-[24px] bg-white p-4 text-foreground md:p-5 lg:grid-cols-[1fr_220px] lg:items-stretch">
              <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                <NumberField id="bb-duration" label="Duration (s)" value={ball.form.duration} onChange={(v) => ball.setForm({ ...ball.form, duration: v })} />
                <NumberField id="bb-dt" label="dt (s)" value={ball.form.dt} step={0.001} onChange={(v) => ball.setForm({ ...ball.form, dt: v })} />
                <NumberField id="bb-reference" label="Reference r (m)" value={ball.form.reference} onChange={(v) => ball.setForm({ ...ball.form, reference: v })} />
                <NumberField id="bb-initial-r" label="Initial r (m)" value={ball.form.initial_r} onChange={(v) => ball.setForm({ ...ball.form, initial_r: v })} />
                <NumberField id="bb-initial-r-dot" label="Initial r_dot (m/s)" value={ball.form.initial_r_dot} onChange={(v) => ball.setForm({ ...ball.form, initial_r_dot: v })} />
                <NumberField id="bb-initial-alpha" label="Initial alpha (rad)" value={ball.form.initial_alpha} onChange={(v) => ball.setForm({ ...ball.form, initial_alpha: v })} />
                <NumberField id="bb-initial-alpha-dot" label="Initial alpha_dot (rad/s)" value={ball.form.initial_alpha_dot} onChange={(v) => ball.setForm({ ...ball.form, initial_alpha_dot: v })} />
              </div>
              <div className="flex items-end lg:justify-end">
                <Button onClick={() => void ball.run()} disabled={anyLoading} className="h-auto w-full whitespace-normal py-2 lg:w-auto lg:min-w-48">
                  {ball.isLoading ? (
                    <>
                      <LoaderCircle className="shrink-0 animate-spin" />
                      {t('runningBallAndBeam')}
                    </>
                  ) : (
                    'Run Ball and Beam'
                  )}
                </Button>
              </div>
            </div>
            {ball.data.length > 0 ? (
              <SimulationPanel
                kind="ball-and-beam"
                data={ball.data}
                dt={ball.dt}
                chartGroups={ballAndBeamChartGroups}
                beamLength={1}
              />
            ) : (
              <SimulationEmptyState message={t('simulationEmptyState')} />
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
