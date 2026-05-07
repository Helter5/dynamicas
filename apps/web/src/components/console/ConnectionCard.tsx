import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

type Props = {
  t: (key: string) => string
  apiBaseUrl: string
  apiKey: string
  anonToken: string
  variant?: 'card' | 'plain'
  onApiBaseUrlChange: (value: string) => void
  onApiKeyChange: (value: string) => void
  onAnonTokenChange: (value: string) => void
}

export function ConnectionCard({
  t,
  apiBaseUrl,
  apiKey,
  anonToken,
  variant = 'card',
  onApiBaseUrlChange,
  onApiKeyChange,
  onAnonTokenChange,
}: Props) {
  const fields = (
    <div className="grid gap-4 md:grid-cols-3">
      <div className="grid gap-2 md:col-span-2">
        <Label htmlFor="base-url">{t('apiBaseUrl')}</Label>
        <Input
          id="base-url"
          value={apiBaseUrl}
          onChange={(event) => onApiBaseUrlChange(event.target.value)}
          placeholder="http://127.0.0.1:8000"
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="api-key">{t('apiKey')}</Label>
        <Input
          id="api-key"
          value={apiKey}
          onChange={(event) => onApiKeyChange(event.target.value)}
          placeholder="local-smoke-key"
        />
      </div>
      <div className="grid gap-2 md:col-span-3">
        <Label htmlFor="anon-token">{t('anonToken')}</Label>
        <Input
          id="anon-token"
          value={anonToken}
          onChange={(event) => onAnonTokenChange(event.target.value)}
          placeholder="web-user-001"
        />
      </div>
    </div>
  )

  if (variant === 'plain') {
    return fields
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('connection')}</CardTitle>
      </CardHeader>
      <CardContent>
        {fields}
      </CardContent>
    </Card>
  )
}
