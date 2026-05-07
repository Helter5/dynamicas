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
import { Footer } from '@/components/layout/Footer'
import { Navbar } from '@/components/layout/Navbar'
import { CommandConsolePage } from '@/pages/CommandConsolePage'
import { HomePage } from '@/pages/HomePage'
import { SimulationsPgae } from '@/pages/SimulationsPgae'

type Language = 'sk' | 'en'

type OutletConnection = {
  apiBaseUrl: string
  apiKey: string
  anonToken: string
}

const SUPPORTED_LANGUAGES: Language[] = ['sk', 'en']

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
  const [anonToken, setAnonToken] = useState('web-user-001')

  return (
    <>
      <Navbar
        t={t}
        lang={lang}
        apiBaseUrl={apiBaseUrl}
        apiKey={apiKey}
        anonToken={anonToken}
        onApiBaseUrlChange={setApiBaseUrl}
        onApiKeyChange={setApiKey}
        onAnonTokenChange={setAnonToken}
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
  const { apiBaseUrl, apiKey } = useOutletConnection()

  return (
    <SimulationsPgae
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
    <Routes>
      <Route path="/" element={<Navigate to="/sk" replace />} />
      <Route path="/:lang" element={<CasConsoleShell />}>
        <Route index element={<HomePage />} />
        <Route path="simulations" element={<SimulationsRoute />} />
        <Route path="console" element={<CommandConsoleRoute />} />
      </Route>
      <Route path="*" element={<Navigate to="/sk" replace />} />
    </Routes>
  )
}

export default App
