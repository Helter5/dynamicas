import { useEffect, useMemo, useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
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

type Language = 'sk' | 'en'

const SUPPORTED_LANGUAGES: Language[] = ['sk', 'en']
const COMMAND_HISTORY_KEY = 'cas_command_history'
const MAX_HISTORY_ITEMS = 10

function CasConsolePage() {
  const { i18n, t } = useTranslation()
  const navigate = useNavigate()
  const location = useLocation()
  const { lang = 'sk' } = useParams<{ lang: string }>()

  const [apiBaseUrl, setApiBaseUrl] = useState(
    import.meta.env.VITE_API_BASE_URL ?? 'http://127.0.0.1:8000',
  )
  const [apiKey, setApiKey] = useState(import.meta.env.VITE_API_KEY ?? '')
  const [anonToken, setAnonToken] = useState('web-user-001')
  const [command, setCommand] = useState('1+1')
  const [output, setOutput] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isResettingState, setIsResettingState] = useState(false)
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

      const normalizedCommand = command.trim()
      if (normalizedCommand !== '') {
        setCommandHistory((current) => {
          const next = [
            normalizedCommand,
            ...current.filter((item) => item !== normalizedCommand),
          ].slice(0, MAX_HISTORY_ITEMS)

          localStorage.setItem(COMMAND_HISTORY_KEY, JSON.stringify(next))
          return next
        })
      }
    } catch {
      setError(t('cannotConnect'))
    } finally {
      setIsLoading(false)
    }
  }

  function clearHistory() {
    setCommandHistory([])
    localStorage.removeItem(COMMAND_HISTORY_KEY)
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
    <main className="min-h-full bg-gradient-to-b from-stone-100 via-white to-stone-200 p-4 md:p-8">
      <div className="mx-auto flex w-full max-w-4xl flex-col gap-4">
        <div className="flex items-center justify-between rounded-xl border bg-white/80 p-4 shadow-sm backdrop-blur">
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

        <Card className="border-stone-300/70 shadow-md">
          <CardHeader>
            <CardTitle>{t('connection')}</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-3">
            <div className="grid gap-2 md:col-span-2">
              <Label htmlFor="base-url">{t('apiBaseUrl')}</Label>
              <Input
                id="base-url"
                value={apiBaseUrl}
                onChange={(event) => setApiBaseUrl(event.target.value)}
                placeholder="http://127.0.0.1:8000"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="api-key">{t('apiKey')}</Label>
              <Input
                id="api-key"
                value={apiKey}
                onChange={(event) => setApiKey(event.target.value)}
                placeholder="local-smoke-key"
              />
            </div>
            <div className="grid gap-2 md:col-span-3">
              <Label htmlFor="anon-token">{t('anonToken')}</Label>
              <Input
                id="anon-token"
                value={anonToken}
                onChange={(event) => setAnonToken(event.target.value)}
                placeholder="web-user-001"
              />
            </div>
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
              <p className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                {error}
              </p>
            ) : null}

            <div className="grid gap-2 rounded-md border border-stone-200 bg-stone-50 p-3">
              <div className="flex items-center justify-between gap-2">
                <Label>{t('history')}</Label>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={clearHistory}
                  disabled={commandHistory.length === 0}
                >
                  {t('clearHistory')}
                </Button>
              </div>

              {commandHistory.length === 0 ? (
                <p className="text-sm text-stone-500">{t('noHistoryYet')}</p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {commandHistory.map((item) => (
                    <Button
                      key={item}
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setCommand(item)}
                      className="max-w-full truncate"
                      title={item}
                    >
                      {item}
                    </Button>
                  ))}
                </div>
              )}
            </div>
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
