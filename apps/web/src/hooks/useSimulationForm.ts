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
    const trimmed = value.trim()

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

      const response = await fetch(`${apiRoot}/api/simulations/${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-API-KEY': apiKey,
          'X-ANON-TOKEN': anonToken,
        },
        credentials: 'include',
        body: JSON.stringify(payload),
      })

      const json = await readJsonResponse(response)

      if (!response.ok) {
        const errorData = json as ApiErrorResponse | null
        throw new Error(errorData?.message ?? t('simulationRequestFailed'))
      }

      if (!json) {
        throw new Error(t('cannotConnect'))
      }

      const result = json as SimulationResponse
      setData(result.series)
      setDt(result.config.dt)
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
