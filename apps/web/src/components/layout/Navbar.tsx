import { Settings } from 'lucide-react'
import { NavLink } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { ConnectionCard } from '@/components/console/ConnectionCard'
import { cn } from '@/lib/utils'

type Language = 'sk' | 'en'

type Props = {
  t: (key: string) => string
  lang: Language
  apiBaseUrl: string
  apiKey: string
  anonToken: string
  onApiBaseUrlChange: (value: string) => void
  onApiKeyChange: (value: string) => void
  onAnonTokenChange: (value: string) => void
  onLanguageChange: (language: Language) => void
}

export function Navbar({
  t,
  lang,
  apiBaseUrl,
  apiKey,
  anonToken,
  onApiBaseUrlChange,
  onApiKeyChange,
  onAnonTokenChange,
  onLanguageChange,
}: Props) {
  const navItems = [
    { to: `/${lang}`, label: t('homeNav'), end: true },
    { to: `/${lang}/simulations`, label: t('simulationsNav'), end: false },
    { to: `/${lang}/console`, label: t('consoleNav'), end: false },
    { to: `/${lang}/stats`, label: t('statsNav'), end: false },
  ]

  return (
    <nav className="sticky top-0 z-40 h-[52px] w-full border-b border-black/10 bg-[#f5f5f7]/75 backdrop-blur-xl">
      <div className="mx-auto grid h-full w-full max-w-6xl grid-cols-[1fr_auto_1fr] items-center gap-4 px-4 md:px-8">
        <h1 className="text-[21px] font-semibold tracking-[0.011em]">
          {t('title')}
        </h1>
        <div className="flex min-w-0 items-center justify-center gap-5 overflow-x-auto">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                cn(
                  'inline-flex h-7 items-center justify-center whitespace-nowrap text-md font-medium transition-colors',
                  isActive
                    ? 'text-[#1d1d1f]'
                    : 'text-[#1d1d1f]/60 hover:text-[#1d1d1f]',
                )
              }
            >
              {item.label}
            </NavLink>
          ))}
        </div>
        <div className="flex items-center justify-end gap-2">
          <Dialog>
            <DialogTrigger
              aria-label={t('settings')}
              className="inline-flex h-8 cursor-pointer items-center justify-center gap-2 rounded-full bg-[#1d1d1f]/85 px-3 text-xs text-white transition duration-[320ms] ease-[cubic-bezier(0.4,0,0.6,1)] hover:bg-[#1d1d1f] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              <Settings className="size-3.5" />
              <span className="hidden sm:inline">{t('settings')}</span>
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
                onApiBaseUrlChange={onApiBaseUrlChange}
                onApiKeyChange={onApiKeyChange}
                onAnonTokenChange={onAnonTokenChange}
              />
            </DialogContent>
          </Dialog>
          <div className="flex rounded-full bg-white p-1 shadow-[0_0_0_1px_rgba(180,180,180,0.3)]">
            <Button
              type="button"
              variant={lang === 'sk' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => onLanguageChange('sk')}
              aria-pressed={lang === 'sk'}
              className="h-7 px-3 text-xs"
            >
              SK
            </Button>
            <Button
              type="button"
              variant={lang === 'en' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => onLanguageChange('en')}
              aria-pressed={lang === 'en'}
              className="h-7 px-3 text-xs"
            >
              EN
            </Button>
          </div>
        </div>
      </div>
    </nav>
  )
}
