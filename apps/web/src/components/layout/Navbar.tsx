import { Menu, Settings, X } from 'lucide-react'
import { useState } from 'react'
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
  const [mobileOpen, setMobileOpen] = useState(false)

  const navItems = [
    { to: `/${lang}`, label: t('homeNav'), end: true },
    { to: `/${lang}/simulations`, label: t('simulationsNav'), end: false },
    { to: `/${lang}/console`, label: t('consoleNav'), end: false },
    { to: `/${lang}/stats`, label: t('statsNav'), end: false },
    { to: `/${lang}/docs`, label: t('docsNav'), end: false },
  ]

  return (
    <nav className="sticky top-0 z-40 w-full border-b border-black/10 bg-[#f5f5f7]/75 backdrop-blur-xl">
      {/* Main bar */}
      <div className="mx-auto grid min-h-[52px] w-full max-w-6xl grid-cols-[1fr_auto_1fr] items-center gap-x-4 gap-y-0 px-4 py-2 md:px-8">
        <h1 className="text-[21px] font-semibold tracking-[0.011em]">
          {t('title')}
        </h1>

        {/* Desktop nav — hidden on mobile */}
        <div className="hidden min-w-0 items-center justify-center gap-5 md:flex">
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

          {/* Hamburger — visible only on mobile */}
          <button
            type="button"
            aria-label="Menu"
            onClick={() => setMobileOpen((prev) => !prev)}
            className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-[#1d1d1f]/85 text-white transition hover:bg-[#1d1d1f] md:hidden"
          >
            {mobileOpen ? <X className="size-4" /> : <Menu className="size-4" />}
          </button>
        </div>
      </div>

      {/* Mobile dropdown */}
      {mobileOpen && (
        <div className="border-t border-black/10 bg-[#f5f5f7]/95 px-4 py-3 md:hidden">
          <div className="flex flex-col gap-1">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) =>
                  cn(
                    'rounded-lg px-3 py-2.5 text-[15px] font-medium transition-colors',
                    isActive
                      ? 'bg-black/[0.06] text-[#1d1d1f]'
                      : 'text-[#1d1d1f]/60 hover:bg-black/[0.04] hover:text-[#1d1d1f]',
                  )
                }
              >
                {item.label}
              </NavLink>
            ))}
          </div>
        </div>
      )}
    </nav>
  )
}
