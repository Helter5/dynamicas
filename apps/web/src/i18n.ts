import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

const resources = {
  sk: {
    translation: {
      title: 'CAS Konzola',
      connection: 'Pripojenie',
      command: 'Príkaz',
      commandLabel: 'Príkaz',
      output: 'Výstup',
      run: 'Spustiť príkaz',
      running: 'Spúšťam...',
      clear: 'Vymazať',
      resetState: 'Vynulovania stav',
      resettingState: 'Nulujem...',
      stateResetSuccess: 'Stav úspešne vynulovaný.',
      apiBaseUrl: 'API Base URL',
      apiKey: 'X-API-KEY',
      anonToken: 'X-ANON-TOKEN',
      requestFailed: 'Požiadavka zlyhala.',
      cannotConnect: 'Nedá sa pripojiť na backend API.',
      resultPlaceholder: 'Výstup výsledku...',
    },
  },
  en: {
    translation: {
      title: 'CAS Console',
      connection: 'Connection',
      command: 'Command',
      commandLabel: 'Command',
      output: 'Output',
      run: 'Run command',
      running: 'Running...',
      clear: 'Clear',
      resetState: 'Reset State',
      resettingState: 'Resetting...',
      stateResetSuccess: 'State reset successfully.',
      apiBaseUrl: 'API Base URL',
      apiKey: 'X-API-KEY',
      anonToken: 'X-ANON-TOKEN',
      requestFailed: 'Request failed.',
      cannotConnect: 'Cannot connect to backend API.',
      resultPlaceholder: 'Result output...',
    },
  },
} as const

const initialLanguage = localStorage.getItem('language') === 'en' ? 'en' : 'sk'

void i18n.use(initReactI18next).init({
  resources,
  lng: initialLanguage,
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false,
  },
})

export default i18n
