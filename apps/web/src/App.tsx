import { type KeyboardEvent, useEffect, useMemo, useRef, useState } from 'react'
import { CheckCircle2, LoaderCircle, Settings } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { CommandHistoryPanel } from '@/components/console/CommandHistoryPanel'
import { ConnectionCard } from '@/components/console/ConnectionCard'
import { useCommandHistory } from '@/hooks/useCommandHistory'
import { SimulationsCard } from '@/components/simulations/SimulationsCard'
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
  cooldown?: {
    seconds_remaining?: number
  }
}

type Language = 'sk' | 'en'
type Feedback = {
  scope: 'cas' | 'reset'
  variant: 'success' | 'error'
  message: string
}

const SUPPORTED_LANGUAGES: Language[] = ['sk', 'en']

function CasConsolePage() {
  const { i18n, t } = useTranslation()
  const navigate = useNavigate()
  const location = useLocation()
  const { lang = 'sk' } = useParams<{ lang: string }>()
  const commandTextareaRef = useRef<HTMLTextAreaElement>(null)
  const historyDraftRef = useRef<string | null>(null)

  const [apiBaseUrl, setApiBaseUrl] = useState(
    import.meta.env.VITE_API_BASE_URL ?? '',
  )
  const [apiKey, setApiKey] = useState(import.meta.env.VITE_API_KEY ?? '')
  const [anonToken, setAnonToken] = useState('web-user-001')
  const [command, setCommand] = useState('1+1')
  const [output, setOutput] = useState('')
  const [feedback, setFeedback] = useState<Feedback | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isResettingState, setIsResettingState] = useState(false)
  const {
    commandHistory,
    selectedHistoryIndex,
    addToHistory,
    clearHistory,
    selectPreviousHistoryCommand,
    selectNextHistoryCommand,
    resetHistoryNavigation,
  } = useCommandHistory()

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

  async function readJsonResponse(response: Response) {
    try {
      return await response.json()
    } catch {
      return null
    }
  }

  function focusCommandTextarea() {
    window.requestAnimationFrame(() => {
      commandTextareaRef.current?.focus()
    })
  }

  function selectCommandFromHistory(nextCommand: string) {
    setCommand(nextCommand)
    setFeedback(null)
    resetHistoryNavigation()
    historyDraftRef.current = null
    focusCommandTextarea()
  }

  function handleCommandHistoryKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key !== 'ArrowUp' && event.key !== 'ArrowDown') {
      if (selectedHistoryIndex !== null) {
        resetHistoryNavigation()
        historyDraftRef.current = null
      }
      return
    }

    const target = event.currentTarget
    const hasSelection = target.selectionStart !== target.selectionEnd
    const textBeforeCursor = command.slice(0, target.selectionStart)
    const textAfterCursor = command.slice(target.selectionEnd)
    const isAtFirstLine = !textBeforeCursor.includes('\n')
    const isAtLastLine = !textAfterCursor.includes('\n')

    if (hasSelection) {
      return
    }

    if (event.key === 'ArrowUp' && isAtFirstLine) {
      event.preventDefault()

      if (selectedHistoryIndex === null) {
        historyDraftRef.current = command
      }

      const previousCommand = selectPreviousHistoryCommand()

      if (previousCommand !== null) {
        setCommand(previousCommand)
      }
    }

    if (event.key === 'ArrowDown' && isAtLastLine) {
      event.preventDefault()

      const nextCommand = selectNextHistoryCommand()

      if (nextCommand !== null) {
        setCommand(nextCommand)
        return
      }

      setCommand(historyDraftRef.current ?? '')
      historyDraftRef.current = null
    }
  }

  async function runCommand() {
    setIsLoading(true)
    setFeedback(null)

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

      const data = (await readJsonResponse(response)) as EvalResponse | null

      if (!data) {
        setFeedback({
          scope: 'cas',
          variant: 'error',
          message: t('cannotConnect'),
        })
        return
      }

      if (!response.ok || data.status !== 'success') {
        const secondsRemaining = data.cooldown?.seconds_remaining
        const message =
          response.status === 429 && typeof secondsRemaining === 'number'
            ? t('casCooldown', { count: secondsRemaining })
            : data.message ?? t('requestFailed')

        setFeedback({
          scope: 'cas',
          variant: 'error',
          message,
        })
        return
      }

      setOutput(data.result?.output ?? '')
      addToHistory(command)
      resetHistoryNavigation()
      historyDraftRef.current = null
      setFeedback({
        scope: 'cas',
        variant: 'success',
        message: t('commandRunSuccess'),
      })
    } catch {
      setFeedback({
        scope: 'cas',
        variant: 'error',
        message: t('cannotConnect'),
      })
    } finally {
      setIsLoading(false)
    }
  }

  async function resetState() {
    setIsResettingState(true)
    setFeedback(null)

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
        setFeedback({
          scope: 'reset',
          variant: 'error',
          message: t('requestFailed'),
        })
        return
      }

      setOutput('')
      setCommand('')
      resetHistoryNavigation()
      historyDraftRef.current = null
      setFeedback({
        scope: 'reset',
        variant: 'success',
        message: t('stateResetSuccess'),
      })
    } catch {
      setFeedback({
        scope: 'reset',
        variant: 'error',
        message: t('cannotConnect'),
      })
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
    <>
      <nav className="sticky top-0 z-40 w-full border-b border-border/80 bg-background/75 backdrop-blur-xl">
        <div className="mx-auto flex min-h-16 w-full max-w-6xl items-center justify-between gap-4 px-4 md:px-8">
          <h1 className="text-lg font-semibold md:text-xl">
            {t('title')}
          </h1>
          <div className="flex items-center gap-3">
            <Dialog>
              <DialogTrigger
                aria-label={t('settings')}
                className="inline-flex size-9 cursor-pointer items-center justify-center rounded-full bg-primary text-primary-foreground transition hover:bg-primary/85 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              >
                <Settings className="size-4" />
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>{t('settings')}</DialogTitle>
                </DialogHeader>
                <ConnectionCard
                  t={t}
                  apiBaseUrl={apiBaseUrl}
                  apiKey={apiKey}
                  anonToken={anonToken}
                  variant="plain"
                  onApiBaseUrlChange={setApiBaseUrl}
                  onApiKeyChange={setApiKey}
                  onAnonTokenChange={setAnonToken}
                />
              </DialogContent>
            </Dialog>
            <div className="flex rounded-full border border-border bg-muted p-1">
              <Button
                type="button"
                variant={lang === 'sk' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => switchLanguage('sk')}
                aria-pressed={lang === 'sk'}
              >
                SK
              </Button>
              <Button
                type="button"
                variant={lang === 'en' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => switchLanguage('en')}
                aria-pressed={lang === 'en'}
              >
                EN
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <main className="min-h-full p-4 md:p-8">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
          <SimulationsCard
            apiBaseUrl={apiBaseUrl}
            apiKey={apiKey}
          />

          <Card>
            <CardHeader>
              <CardTitle>{t('command')}</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="command">{t('commandLabel')}</Label>
                <Textarea
                  ref={commandTextareaRef}
                  id="command"
                  value={command}
                  onChange={(event) => {
                    setCommand(event.target.value)
                    resetHistoryNavigation()
                    historyDraftRef.current = null
                  }}
                  onKeyDown={handleCommandHistoryKeyDown}
                  rows={6}
                  placeholder="a=1+1"
                />
              </div>

              <div className="flex flex-wrap gap-3">
                <Button onClick={runCommand} disabled={isLoading || !command.trim()}>
                  {isLoading ? (
                    <>
                      <LoaderCircle className="animate-spin" />
                      {t('running')}
                    </>
                  ) : (
                    t('run')
                  )}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setCommand('')
                    setOutput('')
                    setFeedback(null)
                    resetHistoryNavigation()
                    historyDraftRef.current = null
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
                  {isResettingState ? (
                    <>
                      <LoaderCircle className="animate-spin" />
                      {t('resettingState')}
                    </>
                  ) : (
                    t('resetState')
                  )}
                </Button>
              </div>

              <div className="grid gap-2">
                <Label>{t('output')}</Label>
                <Textarea readOnly rows={4} value={output} placeholder={t('resultPlaceholder')} />
              </div>

              {feedback ? (
                <Alert variant={feedback.variant === 'error' ? 'destructive' : 'default'}>
                  {feedback.variant === 'success' ? <CheckCircle2 /> : null}
                  <AlertDescription>{feedback.message}</AlertDescription>
                </Alert>
              ) : null}

              <CommandHistoryPanel
                t={t}
                commandHistory={commandHistory}
                selectedHistoryIndex={selectedHistoryIndex}
                onClearHistory={clearHistory}
                onSelectCommand={selectCommandFromHistory}
              />
            </CardContent>
          </Card>
        </div>
      </main>
    </>
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
