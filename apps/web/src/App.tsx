import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  Navigate,
  Outlet,
  Route,
  Routes,
  useLocation,
  useNavigate,
  useOutletContext,
  useParams,
} from 'react-router-dom'
import { Toaster } from 'sonner'
import { Footer } from '@/components/layout/Footer'
import { Navbar } from '@/components/layout/Navbar'
import { CommandConsolePage } from '@/pages/CommandConsolePage'
import { DocsPage } from '@/pages/DocsPage'
import { HomePage } from '@/pages/HomePage'
import { SimulationsPage } from '@/pages/SimulationsPage'
import { StatsPage } from '@/pages/StatsPage'

type Language = 'sk' | 'en'

type OutletConnection = {
  apiBaseUrl: string
  apiKey: string
  anonToken: string
}

const SUPPORTED_LANGUAGES: Language[] = ['sk', 'en']
const ANON_TOKEN_STORAGE_KEY = 'dynamicas_anon_token'

function createAnonToken() {
  if (crypto.randomUUID) {
    return crypto.randomUUID()
  }

  return `anon-${Date.now()}-${Math.random().toString(36).slice(2)}`
}

function getStoredAnonToken() {
  const storedToken = localStorage.getItem(ANON_TOKEN_STORAGE_KEY)

  if (storedToken) {
    return storedToken
  }

  const nextToken = createAnonToken()
  localStorage.setItem(ANON_TOKEN_STORAGE_KEY, nextToken)
  return nextToken
}

function useLanguageRoute() {
  const { i18n, t } = useTranslation()
  const navigate = useNavigate()
  const location = useLocation()
  const { lang = 'sk' } = useParams<{ lang: string }>()

  useEffect(() => {
    if (!SUPPORTED_LANGUAGES.includes(lang as Language)) {
      navigate('/sk', { replace: true })
      return
    }

    if (i18n.language !== lang) {
      void i18n.changeLanguage(lang)
      localStorage.setItem('language', lang)
    }
  }, [i18n, lang, navigate])

  function switchLanguage(language: Language) {
    const pathParts = location.pathname.split('/').filter(Boolean)

    if (pathParts.length === 0) {
      navigate(`/${language}`)
      return
    }

    pathParts[0] = language
    navigate(`/${pathParts.join('/')}${location.search}${location.hash}`)

    if (i18n.language !== language) {
      void i18n.changeLanguage(language)
    }

    localStorage.setItem('language', language)
  }

  return {
    t,
    lang: lang as Language,
    switchLanguage,
  }
}

function CasConsoleShell() {
  const { t, lang, switchLanguage } = useLanguageRoute()
  const [apiBaseUrl, setApiBaseUrl] = useState(
    import.meta.env.VITE_API_BASE_URL ?? '',
  )
  const [apiKey, setApiKey] = useState(import.meta.env.VITE_API_KEY ?? '')
  const [anonToken] = useState(getStoredAnonToken)

  return (
    <>
      <Navbar
        t={t}
        lang={lang}
        apiBaseUrl={apiBaseUrl}
        apiKey={apiKey}
        onApiBaseUrlChange={setApiBaseUrl}
        onApiKeyChange={setApiKey}
        onLanguageChange={switchLanguage}
      />
      <main className="min-h-full px-4 pb-10 pt-8 md:px-8 md:pb-16">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-7">
          <Outlet context={{ apiBaseUrl, apiKey, anonToken }} />
        </div>
      </main>
      <Footer />
    </>
  )
}

function SimulationsRoute() {
  const { apiBaseUrl, apiKey, anonToken } = useOutletConnection()

  return (
    <SimulationsPage
      apiBaseUrl={apiBaseUrl}
      apiKey={apiKey}
      anonToken={anonToken}
    />
  )
}

function StatsRoute() {
  const { apiBaseUrl, apiKey } = useOutletConnection()

  return (
    <StatsPage
      apiBaseUrl={apiBaseUrl}
      apiKey={apiKey}
    />
  )
}

function DocsRoute() {
  const { apiBaseUrl, apiKey } = useOutletConnection()

  return (
    <DocsPage
      apiBaseUrl={apiBaseUrl}
      apiKey={apiKey}
    />
  )
}

function CommandConsoleRoute() {
  const { apiBaseUrl, apiKey, anonToken } = useOutletConnection()

  return (
    <CommandConsolePage
      apiBaseUrl={apiBaseUrl}
      apiKey={apiKey}
      anonToken={anonToken}
    />
  )
}

function useOutletConnection() {
  return useOutletContext<OutletConnection>()
}

function App() {
  return (
    <>
      <Toaster
        position="top-center"
        expand={false}
        visibleToasts={3}
        toastOptions={{
          style: {
            background: 'rgba(29, 29, 31, 0.88)',
            backdropFilter: 'blur(24px)',
            WebkitBackdropFilter: 'blur(24px)',
            border: '1px solid rgba(255,255,255,0.10)',
            color: '#f5f5f7',
            borderRadius: '14px',
            fontSize: '14px',
            fontWeight: '500',
            boxShadow: '0 4px 24px rgba(0,0,0,0.28)',
          },
          classNames: {
            error: 'border-[#ff453a]/40',
            success: 'border-[#30d158]/30',
          },
        }}
      />
      <Routes>
        <Route path="/" element={<Navigate to="/sk" replace />} />
        <Route path="/:lang" element={<CasConsoleShell />}>
          <Route index element={<HomePage />} />
          <Route path="simulations" element={<SimulationsRoute />} />
          <Route path="console" element={<CommandConsoleRoute />} />
          <Route path="stats" element={<StatsRoute />} />
          <Route path="docs" element={<DocsRoute />} />
        </Route>
        <Route path="*" element={<Navigate to="/sk" replace />} />
      </Routes>
    </>
  )
}

export default App
