import { useMemo, useState } from 'react'
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

type EvalResponse = {
  status: 'success' | 'error'
  result?: {
    mock: boolean
    output: string
  }
  message?: string
}

function App() {
  const { i18n, t } = useTranslation()
  const [apiBaseUrl, setApiBaseUrl] = useState(
    import.meta.env.VITE_API_BASE_URL ?? 'http://127.0.0.1:8000',
  )
  const [apiKey, setApiKey] = useState(import.meta.env.VITE_API_KEY ?? '')
  const [anonToken, setAnonToken] = useState('web-user-001')
  const [command, setCommand] = useState('1+1')
  const [output, setOutput] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const evalUrl = useMemo(() => {
    return `${apiBaseUrl.replace(/\/$/, '')}/api/cas/eval`
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
    } catch {
      setError(t('cannotConnect'))
    } finally {
      setIsLoading(false)
    }
  }

  function switchLanguage(language: 'sk' | 'en') {
    void i18n.changeLanguage(language)
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
              variant={i18n.language === 'sk' ? 'default' : 'outline'}
              size="sm"
              onClick={() => switchLanguage('sk')}
            >
              SK
            </Button>
            <Button
              type="button"
              variant={i18n.language === 'en' ? 'default' : 'outline'}
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
          </CardContent>
        </Card>
      </div>
    </main>
  )
}

export default App
