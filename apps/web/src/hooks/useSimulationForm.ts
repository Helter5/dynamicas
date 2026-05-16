import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { readJsonResponse } from '@/lib/api'
import type { SimulationDataPoint } from '@/components/simulations/SimulationResults'

type NumericForm = Record<string, number>
type FormState = Record<string, string>

type SimulationResponse = {
  config: { dt: number }
  series: SimulationDataPoint[]
}

type ApiErrorResponse = {
  message?: string
}

type Params = {
  endpoint: string
  defaults: NumericForm
  apiRoot: string
  apiKey: string
  anonToken: string
}

type Result = {
  form: FormState
  setForm: (form: FormState) => void
  data: SimulationDataPoint[]
  dt: number
  isLoading: boolean
  error: string | null
  run: () => Promise<void>
}

function createFormState(defaults: NumericForm): FormState {
  return Object.fromEntries(
    Object.entries(defaults).map(([key, value]) => [key, String(value)]),
  )
}

function toNumericPayload(form: FormState): NumericForm | null {
  const entries = Object.entries(form).map(([key, value]) => {
    const trimmed = value.trim().replace(',', '.')

    if (trimmed === '') {
      return null
    }

    const numericValue = Number(trimmed)
    return Number.isFinite(numericValue) ? [key, numericValue] : null
  })

  if (entries.some((entry) => entry == null)) {
    return null
  }

  return Object.fromEntries(entries as [string, number][])
}

function isSimulationResponse(value: unknown): value is SimulationResponse {
  if (!value || typeof value !== 'object') {
    return false
  }

  const candidate = value as Partial<SimulationResponse>

  return (
    Array.isArray(candidate.series) &&
    !!candidate.config &&
    typeof candidate.config === 'object' &&
    typeof candidate.config.dt === 'number'
  )
}

export function useSimulationForm({
  endpoint,
  defaults,
  apiRoot,
  apiKey,
  anonToken,
}: Params): Result {
  const { t } = useTranslation()
  const [form, setForm] = useState<FormState>(() => createFormState(defaults))
  const [data, setData] = useState<SimulationDataPoint[]>([])
  const [dt, setDt] = useState(defaults.dt)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function run() {
    setIsLoading(true)
    setError(null)

    try {
      const payload = toNumericPayload(form)

      if (!payload) {
        throw new Error(t('invalidNumberFields'))
      }

      const requestUrl = `${apiRoot}/api/simulations/${endpoint}`
      let response: Response

      try {
        response = await fetch(requestUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-API-KEY': apiKey,
            'X-ANON-TOKEN': anonToken,
          },
          credentials: 'include',
          body: JSON.stringify(payload),
        })
      } catch {
        throw new Error(t('cannotConnect'))
      }

      const json = await readJsonResponse(response)

      if (!response.ok) {
        const errorData = json as ApiErrorResponse | null
        throw new Error(errorData?.message ?? `${t('simulationRequestFailed')} (${response.status})`)
      }

      if (!isSimulationResponse(json)) {
        throw new Error(t('invalidSimulationResponse'))
      }

      setData(json.series)
      setDt(json.config.dt)
    } catch (err) {
      const message = err instanceof Error ? err.message : t('simulationRequestFailed')
      setError(message)
      toast.error(message)
    } finally {
      setIsLoading(false)
    }
  }

  return { form, setForm, data, dt, isLoading, error, run }
}
