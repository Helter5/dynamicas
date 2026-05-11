import { useMemo, useState } from 'react'
import { LoaderCircle } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { SimulationPanel } from './SimulationPanel'
import type { SimulationChartGroup, SimulationDataPoint } from './SimulationResults'

type SimulationResponse = {
  config: {
    dt: number
  }
  series: SimulationDataPoint[]
}

type NumericForm = Record<string, number>
type SimulationKind = 'inverted' | 'ball'

interface SimulationsCardProps {
  apiBaseUrl: string
  apiKey: string
  anonToken: string
}

type ApiErrorResponse = {
  message?: string
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

const invertedDefaults: NumericForm = {
  duration: 5,
  dt: 0.01,
  reference: 0.2,
  initial_x: 0,
  initial_v: 0,
  initial_theta: 0,
  initial_omega: 0,
}

const ballAndBeamDefaults: NumericForm = {
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
  const [invertedForm, setInvertedForm] = useState(invertedDefaults)
  const [ballAndBeamForm, setBallAndBeamForm] = useState(ballAndBeamDefaults)
  const [invertedData, setInvertedData] = useState<SimulationDataPoint[]>([])
  const [ballAndBeamData, setBallAndBeamData] = useState<SimulationDataPoint[]>([])
  const [invertedDt, setInvertedDt] = useState(invertedDefaults.dt)
  const [ballAndBeamDt, setBallAndBeamDt] = useState(ballAndBeamDefaults.dt)
  const [loadingSimulation, setLoadingSimulation] = useState<SimulationKind | null>(null)
  const [simulationErrors, setSimulationErrors] = useState<Record<SimulationKind, string | null>>({
    inverted: null,
    ball: null,
  })

  const apiRoot = useMemo(() => apiBaseUrl.replace(/\/$/, ''), [apiBaseUrl])

  async function readJsonResponse(response: Response) {
    try {
      return await response.json()
    } catch {
      return null
    }
  }

  async function runSimulation(endpoint: string, payload: NumericForm): Promise<SimulationResponse> {
    const response = await fetch(`${apiRoot}/api/simulations/${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-KEY': apiKey,
        'X-ANON-TOKEN': anonToken,
      },
      credentials: 'include',
      body: JSON.stringify(payload),
    })

    const data = await readJsonResponse(response)

    if (!response.ok) {
      const errorData = data as ApiErrorResponse | null
      throw new Error(errorData?.message ?? t('simulationRequestFailed'))
    }

    if (!data) {
      throw new Error(t('cannotConnect'))
    }

    return data as SimulationResponse
  }

  async function runInvertedPendulum() {
    setLoadingSimulation('inverted')
    setSimulationErrors((current) => ({ ...current, inverted: null }))

    try {
      const data = await runSimulation('inverted-pendulum', invertedForm)
      setInvertedData(data.series)
      setInvertedDt(data.config.dt)
    } catch (error) {
      setSimulationErrors((current) => ({
        ...current,
        inverted: error instanceof Error ? error.message : t('simulationRequestFailed'),
      }))
    } finally {
      setLoadingSimulation(null)
    }
  }

  async function runBallAndBeam() {
    setLoadingSimulation('ball')
    setSimulationErrors((current) => ({ ...current, ball: null }))

    try {
      const data = await runSimulation('ball-and-beam', ballAndBeamForm)
      setBallAndBeamData(data.series)
      setBallAndBeamDt(data.config.dt)
    } catch (error) {
      setSimulationErrors((current) => ({
        ...current,
        ball: error instanceof Error ? error.message : t('simulationRequestFailed'),
      }))
    } finally {
      setLoadingSimulation(null)
    }
  }

  return (
    <Card className="bg-[#1d1d1f] text-white shadow-[0_0_0_1px_rgba(40,40,40,0.8)]">
      <CardHeader className="gap-2">
        <p className="text-sm font-semibold text-[#2997ff]">Control models</p>
        <CardTitle className="text-[40px] leading-[44px] tracking-normal text-white">Simulations</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="inverted-pendulum" className="gap-5">
          <TabsList className="w-full bg-white/10 text-white/64 shadow-[0_0_0_1px_rgba(255,255,255,0.08)]">
            <TabsTrigger value="inverted-pendulum" className="flex-1">Inverted Pendulum</TabsTrigger>
            <TabsTrigger value="ball-and-beam" className="flex-1">Ball and Beam</TabsTrigger>
          </TabsList>

          <TabsContent value="inverted-pendulum" className="space-y-4">
            <div className="grid gap-4 rounded-[24px] bg-white p-4 text-foreground md:p-5 lg:grid-cols-[1fr_220px] lg:items-stretch">
              <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                <NumberField id="ip-duration" label="Duration (s)" value={invertedForm.duration} onChange={(value) => setInvertedForm({ ...invertedForm, duration: value })} />
                <NumberField id="ip-dt" label="dt (s)" value={invertedForm.dt} step={0.001} onChange={(value) => setInvertedForm({ ...invertedForm, dt: value })} />
                <NumberField id="ip-reference" label="Reference x (m)" value={invertedForm.reference} onChange={(value) => setInvertedForm({ ...invertedForm, reference: value })} />
                <NumberField id="ip-initial-x" label="Initial x (m)" value={invertedForm.initial_x} onChange={(value) => setInvertedForm({ ...invertedForm, initial_x: value })} />
                <NumberField id="ip-initial-v" label="Initial v (m/s)" value={invertedForm.initial_v} onChange={(value) => setInvertedForm({ ...invertedForm, initial_v: value })} />
                <NumberField id="ip-initial-theta" label="Initial theta (rad)" value={invertedForm.initial_theta} onChange={(value) => setInvertedForm({ ...invertedForm, initial_theta: value })} />
                <NumberField id="ip-initial-omega" label="Initial omega (rad/s)" value={invertedForm.initial_omega} onChange={(value) => setInvertedForm({ ...invertedForm, initial_omega: value })} />
              </div>
              <div className="flex items-end lg:justify-end">
                <Button onClick={runInvertedPendulum} disabled={loadingSimulation != null} className="w-full lg:w-auto lg:min-w-48">
                  {loadingSimulation === 'inverted' ? (
                    <>
                      <LoaderCircle className="animate-spin" />
                      {t('runningInvertedPendulum')}
                    </>
                  ) : (
                    'Run Inverted Pendulum'
                  )}
                </Button>
              </div>
            </div>
            {simulationErrors.inverted ? (
              <Alert variant="destructive">
                <AlertDescription>{simulationErrors.inverted}</AlertDescription>
              </Alert>
            ) : null}
            {invertedData.length > 0 ? (
              <SimulationPanel
                kind="inverted-pendulum"
                data={invertedData}
                dt={invertedDt}
                chartGroups={invertedChartGroups}
              />
            ) : (
              <SimulationEmptyState message={t('simulationEmptyState')} />
            )}
          </TabsContent>

          <TabsContent value="ball-and-beam" className="space-y-4">
            <div className="grid gap-4 rounded-[24px] bg-white p-4 text-foreground md:p-5 lg:grid-cols-[1fr_220px] lg:items-stretch">
              <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                <NumberField id="bb-duration" label="Duration (s)" value={ballAndBeamForm.duration} onChange={(value) => setBallAndBeamForm({ ...ballAndBeamForm, duration: value })} />
                <NumberField id="bb-dt" label="dt (s)" value={ballAndBeamForm.dt} step={0.001} onChange={(value) => setBallAndBeamForm({ ...ballAndBeamForm, dt: value })} />
                <NumberField id="bb-reference" label="Reference r (m)" value={ballAndBeamForm.reference} onChange={(value) => setBallAndBeamForm({ ...ballAndBeamForm, reference: value })} />
                <NumberField id="bb-initial-r" label="Initial r (m)" value={ballAndBeamForm.initial_r} onChange={(value) => setBallAndBeamForm({ ...ballAndBeamForm, initial_r: value })} />
                <NumberField id="bb-initial-r-dot" label="Initial r_dot (m/s)" value={ballAndBeamForm.initial_r_dot} onChange={(value) => setBallAndBeamForm({ ...ballAndBeamForm, initial_r_dot: value })} />
                <NumberField id="bb-initial-alpha" label="Initial alpha (rad)" value={ballAndBeamForm.initial_alpha} onChange={(value) => setBallAndBeamForm({ ...ballAndBeamForm, initial_alpha: value })} />
                <NumberField id="bb-initial-alpha-dot" label="Initial alpha_dot (rad/s)" value={ballAndBeamForm.initial_alpha_dot} onChange={(value) => setBallAndBeamForm({ ...ballAndBeamForm, initial_alpha_dot: value })} />
              </div>
              <div className="flex items-end lg:justify-end">
                <Button onClick={runBallAndBeam} disabled={loadingSimulation != null} className="w-full lg:w-auto lg:min-w-48">
                  {loadingSimulation === 'ball' ? (
                    <>
                      <LoaderCircle className="animate-spin" />
                      {t('runningBallAndBeam')}
                    </>
                  ) : (
                    'Run Ball and Beam'
                  )}
                </Button>
              </div>
            </div>
            {simulationErrors.ball ? (
              <Alert variant="destructive">
                <AlertDescription>{simulationErrors.ball}</AlertDescription>
              </Alert>
            ) : null}
            {ballAndBeamData.length > 0 ? (
              <SimulationPanel
                kind="ball-and-beam"
                data={ballAndBeamData}
                dt={ballAndBeamDt}
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
