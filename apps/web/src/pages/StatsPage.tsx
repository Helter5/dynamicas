import { useEffect, useMemo, useState } from 'react'
import { LoaderCircle } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

type SummaryItem = {
  simulation: string
  total: number
}

type DetailItem = {
  anon_token: string
  city: string | null
  country: string | null
  used_at: string
}

type Props = {
  apiBaseUrl: string
  apiKey: string
}

const simulationLabels: Record<string, string> = {
  inverted_pendulum: 'Inverted Pendulum',
  ball_and_beam: 'Ball and Beam',
}

export function StatsPage({ apiBaseUrl, apiKey }: Props) {
  const { t } = useTranslation()
  const [summary, setSummary] = useState<SummaryItem[]>([])
  const [details, setDetails] = useState<Record<string, DetailItem[]>>({})
  const [selectedSimulation, setSelectedSimulation] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const apiRoot = useMemo(() => apiBaseUrl.replace(/\/$/, ''), [apiBaseUrl])

  useEffect(() => {
    void loadSummary()
  }, [apiRoot, apiKey])

  async function loadSummary() {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch(`${apiRoot}/api/stats/simulations`, {
        headers: {
          'X-API-KEY': apiKey,
        },
      })
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data?.message ?? t('requestFailed'))
      }

      setSummary(data.items ?? [])
    } catch {
      setError(t('cannotConnect'))
    } finally {
      setIsLoading(false)
    }
  }

  async function toggleDetails(simulation: string) {
    if (selectedSimulation === simulation) {
      setSelectedSimulation(null)
      return
    }

    setSelectedSimulation(simulation)

    if (details[simulation]) {
      return
    }

    try {
      const response = await fetch(`${apiRoot}/api/stats/simulations/${simulation}`, {
        headers: {
          'X-API-KEY': apiKey,
        },
      })
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data?.message ?? t('requestFailed'))
      }

      setDetails((current) => ({
        ...current,
        [simulation]: data.items ?? [],
      }))
    } catch {
      setError(t('cannotConnect'))
    }
  }

  return (
    <Card className="bg-[#1d1d1f] text-white shadow-[0_0_0_1px_rgba(40,40,40,0.8)]">
      <CardHeader className="gap-2">
        <p className="text-sm font-semibold text-[#2997ff]">{t('statsEyebrow')}</p>
        <CardTitle className="text-[40px] leading-[44px] tracking-normal text-white">{t('statsNav')}</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4">
        {error ? (
          <Alert variant="destructive" className="border-[#ff453a]/30 bg-[#ff453a]/10 text-white">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        ) : null}

        {isLoading ? (
          <div className="flex items-center gap-2 rounded-[20px] bg-white/[0.06] p-5 text-white/72">
            <LoaderCircle className="size-4 animate-spin" />
            {t('loadingStats')}
          </div>
        ) : summary.length === 0 ? (
          <div className="rounded-[20px] bg-white/[0.06] p-5 text-white/72">
            {t('noStatsYet')}
          </div>
        ) : (
          summary.map((item) => (
            <div key={item.simulation} className="rounded-[20px] bg-white p-4 text-[#1d1d1f] shadow-[0_0_0_1px_rgba(255,255,255,0.08)]">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-sm text-[#6e6e73]">{simulationLabels[item.simulation] ?? item.simulation}</p>
                  <p className="mt-1 text-3xl font-semibold">{item.total}</p>
                </div>
                <Button type="button" onClick={() => void toggleDetails(item.simulation)}>
                  {selectedSimulation === item.simulation ? t('hideDetails') : t('showDetails')}
                </Button>
              </div>

              {selectedSimulation === item.simulation ? (
                <div className="mt-4 overflow-x-auto">
                  <table className="w-full min-w-[560px] text-left text-sm">
                    <thead className="text-[#6e6e73]">
                      <tr>
                        <th className="py-2 pr-3 font-medium">{t('statsTime')}</th>
                        <th className="py-2 pr-3 font-medium">{t('statsLocation')}</th>
                        <th className="py-2 pr-3 font-medium">{t('statsToken')}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(details[item.simulation] ?? []).map((detail) => (
                        <tr key={`${detail.anon_token}-${detail.used_at}`} className="border-t border-black/10">
                          <td className="py-2 pr-3">{new Date(detail.used_at).toLocaleString()}</td>
                          <td className="py-2 pr-3">{[detail.city, detail.country].filter(Boolean).join(', ') || t('unknownLocation')}</td>
                          <td className="py-2 pr-3 font-mono">{detail.anon_token}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : null}
            </div>
          ))
        )}
      </CardContent>
    </Card>
  )
}
