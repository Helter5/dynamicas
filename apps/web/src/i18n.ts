import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

const resources = {
  sk: {
    translation: {
      title: 'CAS Konzola',
      settings: 'Nastavenia',
      connection: 'Pripojenie',
      command: 'Príkaz',
      commandLabel: 'Príkaz',
      output: 'Výstup',
      run: 'Spustiť príkaz',
      running: 'Spúšťam...',
      clear: 'Vymazať',
      resetState: 'Vynulovať stav',
      resettingState: 'Nulujem...',
      stateResetSuccess: 'Stav úspešne vynulovaný.',
      commandRunSuccess: 'Príkaz bol úspešne spustený.',
      history: 'História príkazov',
      historyNewestFirst: 'Najnovšie príkazy sú hore. V poli príkazu použi šípky hore/dole.',
      clearHistory: 'Vyčistiť históriu',
      noHistoryYet: 'Zatiaľ tu nič nie je.',
      apiBaseUrl: 'API Base URL',
      apiKey: 'X-API-KEY',
      anonToken: 'X-ANON-TOKEN',
      requestFailed: 'Požiadavka zlyhala.',
      cannotConnect: 'Nedá sa pripojiť na backend API.',
      casCooldown: 'CAS je dočasne pozastavený. Skús to znova o {{count}} s.',
      resultPlaceholder: 'Výstup výsledku...',
      runningInvertedPendulum: 'Spúšťam inverted pendulum...',
      runningBallAndBeam: 'Spúšťam ball and beam...',
      simulationRequestFailed: 'Simuláciu sa nepodarilo spustiť.',
      simulationEmptyState: 'Spustite simuláciu pre zobrazenie výsledkov.',
    },
  },
  en: {
    translation: {
      title: 'CAS Console',
      settings: 'Settings',
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
      commandRunSuccess: 'Command ran successfully.',
      history: 'Command history',
      historyNewestFirst: 'Newest commands are at the top. Use Arrow Up/Down in the command field.',
      clearHistory: 'Clear history',
      noHistoryYet: 'No commands yet.',
      apiBaseUrl: 'API Base URL',
      apiKey: 'X-API-KEY',
      anonToken: 'X-ANON-TOKEN',
      requestFailed: 'Request failed.',
      cannotConnect: 'Cannot connect to backend API.',
      casCooldown: 'CAS is on cooldown. Try again in {{count}}s.',
      resultPlaceholder: 'Result output...',
      runningInvertedPendulum: 'Running inverted pendulum...',
      runningBallAndBeam: 'Running ball and beam...',
      simulationRequestFailed: 'Failed to run simulation.',
      simulationEmptyState: 'Run a simulation to display results.',
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
