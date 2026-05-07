import { SimulationsCard } from '@/components/simulations/SimulationsCard'

type Props = {
  apiBaseUrl: string
  apiKey: string
}

export function SimulationsPgae({ apiBaseUrl, apiKey }: Props) {
  return (
    <SimulationsCard
      apiBaseUrl={apiBaseUrl}
      apiKey={apiKey}
    />
  )
}
