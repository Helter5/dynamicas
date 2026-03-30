import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'

type Props = {
  t: (key: string) => string
  commandHistory: string[]
  onClearHistory: () => void
  onSelectCommand: (command: string) => void
}

export function CommandHistoryPanel({
  t,
  commandHistory,
  onClearHistory,
  onSelectCommand,
}: Props) {
  return (
    <div className="grid gap-2 rounded-md border border-stone-200 bg-stone-50 p-3">
      <div className="flex items-center justify-between gap-2">
        <Label>{t('history')}</Label>
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
        <div className="flex flex-wrap gap-2">
          {commandHistory.map((item) => (
            <Button
              key={item}
              type="button"
              variant="outline"
              size="sm"
              onClick={() => onSelectCommand(item)}
              className="max-w-full truncate"
              title={item}
            >
              {item}
            </Button>
          ))}
        </div>
      )}
    </div>
  )
}
