import { type KeyboardEvent, useMemo, useRef, useState } from 'react'
import { LoaderCircle } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { CommandHistoryPanel } from '@/components/console/CommandHistoryPanel'
import { Button } from '@/components/ui/button'
import { SyntaxTextarea } from '@/components/console/SyntaxTextarea'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { readJsonResponse } from '@/lib/api'
import { useCommandHistory } from '@/hooks/useCommandHistory'

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

type Props = {
  apiBaseUrl: string
  apiKey: string
  anonToken: string
}

export function CommandConsolePage({
  apiBaseUrl,
  apiKey,
  anonToken,
}: Props) {
  const { t } = useTranslation()
  const commandTextareaRef = useRef<HTMLTextAreaElement>(null)
  const historyDraftRef = useRef<string | null>(null)

  const [command, setCommand] = useState('1+1')
  const [output, setOutput] = useState('')
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

  const evalUrl = useMemo(() => {
    return `${apiBaseUrl.replace(/\/$/, '')}/api/cas/eval`
  }, [apiBaseUrl])

  const resetStateUrl = useMemo(() => {
    return `${apiBaseUrl.replace(/\/$/, '')}/api/cas/state`
  }, [apiBaseUrl])

  function focusCommandTextarea() {
    window.requestAnimationFrame(() => {
      commandTextareaRef.current?.focus()
    })
  }

  function selectCommandFromHistory(nextCommand: string) {
    setCommand(nextCommand)
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
        toast.error(t('cannotConnect'))
        return
      }

      if (!response.ok || data.status !== 'success') {
        const secondsRemaining = data.cooldown?.seconds_remaining
        const message =
          response.status === 429 && typeof secondsRemaining === 'number'
            ? t('casCooldown', { count: secondsRemaining })
            : data.message ?? t('requestFailed')

        toast.error(message)
        return
      }

      setOutput(data.result?.output ?? '')
      addToHistory(command)
      resetHistoryNavigation()
      historyDraftRef.current = null
      toast.success(t('commandRunSuccess'))
    } catch {
      toast.error(t('cannotConnect'))
    } finally {
      setIsLoading(false)
    }
  }

  async function resetState() {
    setIsResettingState(true)

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
        toast.error(t('requestFailed'))
        return
      }

      setOutput('')
      setCommand('')
      resetHistoryNavigation()
      historyDraftRef.current = null
      toast.success(t('stateResetSuccess'))
    } catch {
      toast.error(t('cannotConnect'))
    } finally {
      setIsResettingState(false)
    }
  }

  return (
    <Card className="rounded-[28px] bg-[#1d1d1f] text-white shadow-[0_0_0_1px_rgba(40,40,40,0.8)]">
      <CardHeader className="gap-2">
        <p className="text-sm font-semibold text-[#2997ff]">{t('consoleNav')}</p>
        <CardTitle className="text-[40px] leading-[44px] tracking-normal text-white">{t('command')}</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-5">
        <div className="grid gap-2">
          <Label htmlFor="command" className="text-white/72">{t('commandLabel')}</Label>
          <SyntaxTextarea
            textareaRef={commandTextareaRef}
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
            className="border border-white/10 bg-white/[0.06] shadow-[0_0_0_1px_rgba(255,255,255,0.05)]"
          />
        </div>

        <div className="flex flex-wrap gap-3">
          <Button onClick={runCommand} disabled={isLoading || !command.trim()} className="bg-primary hover:bg-[#0066cc]">
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
              resetHistoryNavigation()
              historyDraftRef.current = null
            }}
            className="border-white/16 bg-white/[0.06] text-white hover:bg-white/12 hover:text-white"
          >
            {t('clear')}
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={resetState}
            disabled={isResettingState}
            className="bg-[#d70015] hover:bg-[#c20013]"
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
          <Label className="text-white/72">{t('output')}</Label>
          <Textarea
            readOnly
            rows={4}
            value={output}
            placeholder={t('resultPlaceholder')}
            className="border-white/10 bg-white/[0.06] font-mono text-sm leading-6 text-white placeholder:text-white/36 shadow-[0_0_0_1px_rgba(255,255,255,0.05)] focus-visible:ring-[#2997ff]"
          />
        </div>

        <CommandHistoryPanel
          t={t}
          commandHistory={commandHistory}
          selectedHistoryIndex={selectedHistoryIndex}
          onClearHistory={clearHistory}
          onSelectCommand={selectCommandFromHistory}
          variant="dark"
        />
      </CardContent>
    </Card>
  )
}
