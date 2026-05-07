import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'

type Props = {
  t: (key: string) => string
  commandHistory: string[]
  selectedHistoryIndex: number | null
  variant?: 'light' | 'dark'
  onClearHistory: () => void
  onSelectCommand: (command: string) => void
}

export function CommandHistoryPanel({
  t,
  commandHistory,
  selectedHistoryIndex,
  variant = 'light',
  onClearHistory,
  onSelectCommand,
}: Props) {
  const isDark = variant === 'dark'

  return (
    <div
      className={cn(
        'grid gap-3 rounded-[20px] p-4',
        isDark
          ? 'bg-white/[0.06] text-white shadow-[0_0_0_1px_rgba(255,255,255,0.08)]'
          : 'bg-[#f5f5f7] shadow-[0_0_0_1px_rgba(180,180,180,0.3)]',
      )}
    >
      <div className="flex items-center justify-between gap-2">
        <div className="grid gap-0.5">
          <Label className="font-semibold">{t('history')}</Label>
          <p className={cn('text-xs', isDark ? 'text-white/54' : 'text-muted-foreground')}>
            {t('historyNewestFirst')}
          </p>
        </div>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={onClearHistory}
          disabled={commandHistory.length === 0}
          className={cn(isDark && 'text-white/72 hover:bg-white/10 hover:text-white')}
        >
          {t('clearHistory')}
        </Button>
      </div>

      {commandHistory.length === 0 ? (
        <p className={cn('text-sm', isDark ? 'text-white/54' : 'text-muted-foreground')}>
          {t('noHistoryYet')}
        </p>
      ) : (
        <div className="grid gap-1.5">
          {commandHistory.map((item, index) => (
            <Button
              key={item}
              type="button"
              variant={isDark ? 'ghost' : selectedHistoryIndex === index ? 'secondary' : 'outline'}
              size="sm"
              onClick={() => onSelectCommand(item)}
              className={cn(
                'h-auto min-h-9 w-full justify-start rounded-[10px] px-3 py-2 text-left',
                isDark &&
                  (selectedHistoryIndex === index
                    ? 'bg-white text-[#1d1d1f] hover:bg-white'
                    : 'bg-white/[0.04] text-white/82 shadow-[0_0_0_1px_rgba(255,255,255,0.08)] hover:bg-white/10 hover:text-white'),
              )}
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
