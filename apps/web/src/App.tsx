import { useEffect, useMemo, useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { CommandHistoryPanel } from '@/components/console/CommandHistoryPanel'
import { ConnectionCard } from '@/components/console/ConnectionCard'
import { useCommandHistory } from '@/hooks/useCommandHistory'
import { SimulationPanel } from '@/components/simulations/SimulationPanel'
import type { SimulationDataPoint } from '@/components/simulations/SimulationResults'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { useTranslation } from 'react-i18next'
import {
  Navigate,
  Route,
  Routes,
  useLocation,
  useNavigate,
  useParams,
} from 'react-router-dom'

type EvalResponse = {
  status: 'success' | 'error'
  result?: {
    mock: boolean
    output: string
  }
  message?: string
}

type SimulationResponse = {
  series: SimulationDataPoint[]
}

type Language = 'sk' | 'en'

const SUPPORTED_LANGUAGES: Language[] = ['sk', 'en']

function CasConsolePage() {
  const { i18n, t } = useTranslation()
  const navigate = useNavigate()
  const location = useLocation()
  const { lang = 'sk' } = useParams<{ lang: string }>()

  const [apiBaseUrl, setApiBaseUrl] = useState(
    import.meta.env.VITE_API_BASE_URL ?? '',
  )
  const [apiKey, setApiKey] = useState(import.meta.env.VITE_API_KEY ?? '')
  const [anonToken, setAnonToken] = useState('web-user-001')
  const [command, setCommand] = useState('1+1')
  const [output, setOutput] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isResettingState, setIsResettingState] = useState(false)
  const [simulationResults, setSimulationResults] = useState<SimulationDataPoint[]>([])
  const [isSimulating, setIsSimulating] = useState(false)
  const { commandHistory, addToHistory, clearHistory } = useCommandHistory()

  useEffect(() => {
    if (!SUPPORTED_LANGUAGES.includes(lang as Language)) {
      navigate('/sk/console', { replace: true })
      return
    }

    if (i18n.language !== lang) {
      void i18n.changeLanguage(lang)
      localStorage.setItem('language', lang)
    }
  }, [i18n, lang, navigate])

  const evalUrl = useMemo(() => {
    return `${apiBaseUrl.replace(/\/$/, '')}/api/cas/eval`
  }, [apiBaseUrl])

  const resetStateUrl = useMemo(() => {
    return `${apiBaseUrl.replace(/\/$/, '')}/api/cas/state`
  }, [apiBaseUrl])

  const simulationUrl = useMemo(() => {
    return `${apiBaseUrl.replace(/\/$/, '')}/api/simulations/inverted-pendulum`
  }, [apiBaseUrl])

  async function runCommand() {
    setIsLoading(true)
    setError('')

    try {
      const response = await fetch(evalUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-API-KEY': apiKey,
          'X-ANON-TOKEN': anonToken,
        },
        body: JSON.stringify({
          command,
          source: 'form',
        }),
      })

      const data = (await response.json()) as EvalResponse

      if (!response.ok || data.status !== 'success') {
        setError(data.message ?? t('requestFailed'))
        return
      }

      setOutput(data.result?.output ?? '')
      addToHistory(command)
    } catch {
      setError(t('cannotConnect'))
    } finally {
      setIsLoading(false)
    }
  }

  async function resetState() {
    setIsResettingState(true)
    setError('')

    try {
      const response = await fetch(resetStateUrl, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'X-API-KEY': apiKey,
          'X-ANON-TOKEN': anonToken,
        },
      })

      if (!response.ok) {
        setError(t('requestFailed'))
        return
      }

      setOutput('')
      setCommand('')
    } catch {
      setError(t('cannotConnect'))
    } finally {
      setIsResettingState(false)
    }
  }


  async function runInvertedPendulumSimulation() {
    setIsSimulating(true)
    setError('')

    try {
      const response = await fetch(simulationUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-API-KEY': apiKey,
        },
        body: JSON.stringify({
          duration: 5,
          dt: 0.01,
          theta_0: 0.5,
        }),
      })

      if (!response.ok) {
        setError('Failed to run simulation')
        return
      }

      const data = (await response.json()) as SimulationResponse
      setSimulationResults(data.series)
    } catch {
      setError('Failed to run simulation')
    } finally {
      setIsSimulating(false)
    }
  }

  function switchLanguage(language: Language) {
    const pathParts = location.pathname.split('/').filter(Boolean)

    if (pathParts.length === 0) {
      navigate(`/${language}/console`)
      return
    }

    pathParts[0] = language
    navigate(`/${pathParts.join('/')}${location.search}${location.hash}`)

    if (i18n.language !== language) {
      void i18n.changeLanguage(language)
    }

    localStorage.setItem('language', language)
  }

  return (
    <main className="min-h-full p-4 md:p-8">
      <div className="mx-auto flex w-full max-w-4xl flex-col gap-4">
        
        <div className="flex items-center justify-between rounded-xl border p-4 shadow-sm bg-foreground text-background">
          <div>
            <h1 className="text-xl font-semibold tracking-tight md:text-2xl">
              {t('title')}
            </h1>
          </div>
          <div className="flex gap-2">
            <Button
              type="button"
              variant={lang === 'sk' ? 'default' : 'outline'}
              size="sm"
              onClick={() => switchLanguage('sk')}
            >
              SK
            </Button>
            <Button
              type="button"
              variant={lang === 'en' ? 'default' : 'outline'}
              size="sm"
              onClick={() => switchLanguage('en')}
            >
              EN
            </Button>
          </div>
        </div>

        <ConnectionCard
          t={t}
          apiBaseUrl={apiBaseUrl}
          apiKey={apiKey}
          anonToken={anonToken}
          onApiBaseUrlChange={setApiBaseUrl}
          onApiKeyChange={setApiKey}
          onAnonTokenChange={setAnonToken}
        />

        <Card className="shadow-md">
          <CardHeader>
            <CardTitle>Inverted Pendulum Simulation Results</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4">
            <Button 
              onClick={runInvertedPendulumSimulation} 
              disabled={isSimulating} 
              className="w-full"
            >
              {isSimulating ? 'Running...' : 'Run Inverted Pendulum Simulation'}
            </Button>
            <SimulationPanel data={simulationResults} dt={0.01} />
          </CardContent>
        </Card>

        <Card className="shadow-md">
          <CardHeader>
            <CardTitle>{t('command')}</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="command">{t('commandLabel')}</Label>
              <Textarea
                id="command"
                value={command}
                onChange={(event) => setCommand(event.target.value)}
                rows={6}
                placeholder="a=1+1"
              />
            </div>

            <div className="flex flex-wrap gap-3">
              <Button onClick={runCommand} disabled={isLoading || !command.trim()}>
                {isLoading ? t('running') : t('run')}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setCommand('')
                  setOutput('')
                  setError('')
                }}
              >
                {t('clear')}
              </Button>
              <Button
                type="button"
                variant="destructive"
                onClick={resetState}
                disabled={isResettingState}
              >
                {isResettingState ? t('resettingState') : t('resetState')}
              </Button>
            </div>

            <div className="grid gap-2">
              <Label>{t('output')}</Label>
              <Textarea readOnly rows={4} value={output} placeholder={t('resultPlaceholder')} />
            </div>

            {error ? (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            ) : null}

            <CommandHistoryPanel
              t={t}
              commandHistory={commandHistory}
              onClearHistory={clearHistory}
              onSelectCommand={setCommand}
            />
          </CardContent>
        </Card>
      </div>
    </main>
  )
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/sk/console" replace />} />
      <Route path="/:lang/console" element={<CasConsolePage />} />
      <Route path="*" element={<Navigate to="/sk/console" replace />} />
    </Routes>
  )
}

export default App
