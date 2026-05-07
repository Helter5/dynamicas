import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'

type Props = {
  t: (key: string) => string
  commandHistory: string[]
  selectedHistoryIndex: number | null
  onClearHistory: () => void
  onSelectCommand: (command: string) => void
}

export function CommandHistoryPanel({
  t,
  commandHistory,
  selectedHistoryIndex,
  onClearHistory,
  onSelectCommand,
}: Props) {
  return (
    <div className="grid gap-3 rounded-md border border-stone-200 bg-stone-50 p-3">
      <div className="flex items-center justify-between gap-2">
        <div className="grid gap-0.5">
          <Label>{t('history')}</Label>
          <p className="text-xs text-muted-foreground">{t('historyNewestFirst')}</p>
        </div>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={onClearHistory}
          disabled={commandHistory.length === 0}
        >
          {t('clearHistory')}
        </Button>
      </div>

      {commandHistory.length === 0 ? (
        <p className="text-sm text-stone-500">{t('noHistoryYet')}</p>
      ) : (
        <div className="grid gap-1.5">
          {commandHistory.map((item, index) => (
            <Button
              key={item}
              type="button"
              variant={selectedHistoryIndex === index ? 'secondary' : 'outline'}
              size="sm"
              onClick={() => onSelectCommand(item)}
              className="h-auto min-h-8 w-full justify-start px-2 py-1.5 text-left"
              title={item}
            >
              <span className="block max-w-full truncate font-mono text-xs leading-5">
                {item}
              </span>
            </Button>
          ))}
        </div>
      )}
    </div>
  )
}
