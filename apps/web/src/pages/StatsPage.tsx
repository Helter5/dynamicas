import { useEffect, useMemo, useState } from 'react'
import { Download, LoaderCircle } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { readJsonResponse } from '@/lib/api'

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

  const apiRoot = useMemo(() => apiBaseUrl.replace(/\/$/, ''), [apiBaseUrl])

  useEffect(() => {
    setIsLoading(true)

    fetch(`${apiRoot}/api/stats/simulations`, { headers: { 'X-API-KEY': apiKey } })
      .then(async (r) => {
        const data = await readJsonResponse(r) as { message?: string; items?: SummaryItem[] } | null
        if (!r.ok) throw new Error(data?.message ?? t('requestFailed'))
        setSummary(data?.items ?? [])
      })
      .catch((err) => {
        toast.error(err instanceof Error ? err.message : t('cannotConnect'))
      })
      .finally(() => setIsLoading(false))
  }, [apiRoot, apiKey, t])

  async function downloadCsv() {
    try {
      const response = await fetch(`${apiRoot}/api/logs/export.csv`, {
        headers: { 'X-API-KEY': apiKey },
      })

      if (!response.ok) {
        const data = await readJsonResponse(response) as { message?: string } | null
        toast.error(data?.message ?? t('requestFailed'))
        return
      }

      const blob = await response.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `api-logs-${new Date().toISOString().slice(0, 10)}.csv`
      a.click()
      URL.revokeObjectURL(url)
    } catch {
      toast.error(t('cannotConnect'))
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
      const data = await readJsonResponse(response) as { message?: string; items?: DetailItem[] } | null

      if (!response.ok) {
        throw new Error(data?.message ?? t('requestFailed'))
      }

      setDetails((current) => ({
        ...current,
        [simulation]: data?.items ?? [],
      }))
    } catch (err) {
      toast.error(err instanceof Error ? err.message : t('cannotConnect'))
    }
  }

  return (
    <Card className="bg-[#1d1d1f] text-white shadow-[0_0_0_1px_rgba(40,40,40,0.8)]">
      <CardHeader className="gap-2">
        <p className="text-sm font-semibold text-[#2997ff]">{t('statsEyebrow')}</p>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <CardTitle className="text-[40px] leading-[44px] tracking-normal text-white">{t('statsNav')}</CardTitle>
          <Button
            type="button"
            size="sm"
            variant="ghost"
            onClick={() => void downloadCsv()}
            className="h-8 gap-2 rounded-full bg-white/10 px-3 text-xs text-white hover:bg-white/20 hover:text-white"
          >
            <Download className="size-3.5" />
            {t('exportCsv')}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="grid gap-4">
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
                  <table className="w-full min-w-[360px] text-left text-sm">
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
                          <td className="py-2 pr-3 font-mono text-xs" title={detail.anon_token}>{detail.anon_token.slice(0, 8)}…</td>
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
