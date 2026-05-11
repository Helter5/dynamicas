import { SimulationsCard } from '@/components/simulations/SimulationsCard'

type Props = {
  apiBaseUrl: string
  apiKey: string
  anonToken: string
}

export function SimulationsPage({ apiBaseUrl, apiKey, anonToken }: Props) {
  return (
    <SimulationsCard
      apiBaseUrl={apiBaseUrl}
      apiKey={apiKey}
      anonToken={anonToken}
    />
  )
}
