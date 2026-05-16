import { useEffect, useState } from 'react'
import { Download, ExternalLink, Lock, Minus } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

type Props = {
  apiBaseUrl: string
  apiKey: string
}

type OpenApiSpec = {
  openapi?: string
  info?: { title?: string; version?: string; description?: string }
  servers?: { url: string; description?: string }[]
  paths?: Record<string, Record<string, OpenApiOperation>>
  components?: {
    schemas?: Record<string, OpenApiSchema>
    securitySchemes?: Record<string, OpenApiSecurityScheme>
    parameters?: Record<string, OpenApiParameter>
  }
}

type OpenApiOperation = {
  summary?: string
  description?: string
  security?: unknown[]
  parameters?: OpenApiParameter[]
  requestBody?: {
    required?: boolean
    content?: Record<string, { schema?: OpenApiSchemaRef }>
  }
  responses?: Record<string, { description?: string; content?: Record<string, { schema?: OpenApiSchemaRef }> }>
}

type OpenApiParameter = {
  name?: string
  in?: string
  required?: boolean
  description?: string
  schema?: { type?: string }
}

type OpenApiSchema = {
  type?: string
  description?: string
  properties?: Record<string, {
    type?: string | string[]
    description?: string
    example?: unknown
    minimum?: number
    maximum?: number
    maxLength?: number
    default?: unknown
    format?: string
  }>
  required?: string[]
  additionalProperties?: unknown
}

type OpenApiSchemaRef = {
  $ref?: string
  type?: string
  properties?: Record<string, unknown>
}

type OpenApiSecurityScheme = {
  type?: string
  in?: string
  name?: string
  description?: string
}

const METHOD_COLORS: Record<string, string> = {
  get: 'bg-green-600',
  post: 'bg-blue-600',
  put: 'bg-amber-600',
  patch: 'bg-violet-600',
  delete: 'bg-red-600',
}

const METHOD_ORDER = ['get', 'post', 'put', 'patch', 'delete']

function getRefName(ref: string): string {
  return ref.split('/').pop() ?? ref
}

function StatusBadge({ code }: { code: string }) {
  const n = parseInt(code)
  const color = n >= 500 ? 'bg-amber-600' : n >= 400 ? 'bg-red-600' : 'bg-green-600'
  return (
    <span className={`${color} text-white text-[11px] font-bold px-2 py-0.5 rounded`}>
      {code}
    </span>
  )
}

function SchemaTable({
  schemaName,
  spec,
}: {
  schemaName: string
  spec: OpenApiSpec
}) {
  const schema = spec.components?.schemas?.[schemaName]
  if (!schema?.properties) return <span className="text-xs text-neutral-500">{schemaName}</span>

  return (
    <div>
      <span className="text-xs font-mono text-neutral-500 mb-1 block">{schemaName}</span>
      <div className="overflow-x-auto">
      <table className="w-full text-xs border-collapse">
        <thead>
          <tr className="bg-neutral-100">
            <th className="text-left px-2 py-1 border border-neutral-200 font-medium text-neutral-600">Field</th>
            <th className="text-left px-2 py-1 border border-neutral-200 font-medium text-neutral-600">Type</th>
            <th className="text-left px-2 py-1 border border-neutral-200 font-medium text-neutral-600">Constraints</th>
            <th className="text-left px-2 py-1 border border-neutral-200 font-medium text-neutral-600">Default</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(schema.properties).map(([name, prop]) => {
            const type = Array.isArray(prop.type) ? prop.type.join(' | ') : (prop.type ?? '—')
            const constraints = [
              prop.minimum !== undefined ? `min: ${prop.minimum}` : '',
              prop.maximum !== undefined ? `max: ${prop.maximum}` : '',
              prop.maxLength !== undefined ? `maxLen: ${prop.maxLength}` : '',
            ].filter(Boolean).join(', ')
            return (
              <tr key={name} className="even:bg-neutral-50">
                <td className="px-2 py-1 border border-neutral-200 font-mono text-[11px]">{name}</td>
                <td className="px-2 py-1 border border-neutral-200 text-neutral-600">{type}</td>
                <td className="px-2 py-1 border border-neutral-200 text-neutral-500">{constraints || '—'}</td>
                <td className="px-2 py-1 border border-neutral-200 text-neutral-500">
                  {prop.default !== undefined ? String(prop.default) : '—'}
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
      </div>
    </div>
  )
}

export function DocsPage({ apiBaseUrl, apiKey }: Props) {
  const [spec, setSpec] = useState<OpenApiSpec | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetch(`${apiBaseUrl}/api/docs/openapi.json`, {
      headers: { 'X-API-KEY': apiKey },
    })
      .then((r) => r.json())
      .then(setSpec)
      .catch(() => setError('Failed to load API specification.'))
  }, [apiBaseUrl, apiKey])

  const pdfUrl = `${apiBaseUrl}/api/docs/pdf`

  return (
    <div className="flex flex-col gap-7">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-[#1d1d1f]/40 mb-1">
            OpenAPI 3.1.0
          </p>
          <h2 className="text-2xl font-semibold text-[#1d1d1f] tracking-tight">
            {spec?.info?.title ?? 'API Documentation'}
          </h2>
          {spec?.info?.description && (
            <p className="text-sm text-neutral-500 mt-1">{spec.info.description}</p>
          )}
        </div>
        <div className="flex gap-2">
          <a
            href={pdfUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 h-9 px-4 text-sm font-medium rounded-lg bg-[#1d1d1f] text-white hover:bg-[#1d1d1f]/85 transition-colors"
          >
            <Download className="size-3.5" />
            Download PDF
          </a>
          <a
            href={`${apiBaseUrl}/api/docs/openapi.json`}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 h-9 px-4 text-sm font-medium rounded-lg border border-neutral-200 bg-white text-neutral-700 hover:bg-neutral-50 transition-colors"
          >
            <ExternalLink className="size-3.5" />
            OpenAPI JSON
          </a>
        </div>
      </div>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {!spec && !error && (
        <div className="text-sm text-neutral-400">Loading specification…</div>
      )}

      {spec && (
        <>
          {/* Info row */}
          <div className="flex flex-wrap gap-2">
            {spec.info?.version && (
              <Badge variant="outline" className="text-xs">v{spec.info.version}</Badge>
            )}
            {spec.servers?.map((s) => (
              <Badge key={s.url} variant="secondary" className="text-xs font-mono">{s.url}</Badge>
            ))}
          </div>

          {/* Authentication */}
          {spec.components?.securitySchemes && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <Lock className="size-4 text-blue-600" />
                  Authentication
                </CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-3">
                {Object.entries(spec.components.securitySchemes).map(([name, scheme]) => (
                  <div key={name} className="rounded-lg border border-blue-100 bg-blue-50 px-4 py-3">
                    <p className="text-sm font-semibold text-blue-900">{name}</p>
                    <p className="text-sm text-blue-700 mt-0.5">
                      {scheme.type === 'apiKey'
                        ? `Send the API key in the ${scheme.in} header: `
                        : ''}
                      {scheme.name && <code className="font-mono bg-blue-100 px-1.5 py-0.5 rounded text-xs">{scheme.name}</code>}
                    </p>
                    {scheme.description && (
                      <p className="text-xs text-blue-600 mt-1">{scheme.description}</p>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Endpoints */}
          {spec.paths && (
            <div className="flex flex-col gap-3">
              <h3 className="text-lg font-semibold text-[#1d1d1f]">Endpoints</h3>
              {Object.entries(spec.paths).map(([path, pathItem]) =>
                METHOD_ORDER.filter((m) => m in pathItem).map((method) => {
                  const op = pathItem[method] as OpenApiOperation
                  const isPublic = Array.isArray(op.security) && op.security.length === 0

                  const params = (op.parameters ?? []).filter(
                    (p): p is OpenApiParameter => !('$ref' in p),
                  )

                  return (
                    <Card key={`${method}-${path}`}>
                      <div className="flex items-center gap-3 px-5 py-3 border-b border-neutral-100 flex-wrap">
                        <span
                          className={`${METHOD_COLORS[method] ?? 'bg-neutral-500'} text-white text-[11px] font-bold px-2.5 py-0.5 rounded min-w-[52px] text-center`}
                        >
                          {method.toUpperCase()}
                        </span>
                        <code className="text-sm font-mono font-semibold text-[#1d1d1f]">{path}</code>
                        {op.summary && (
                          <span className="text-xs text-neutral-500 ml-auto">{op.summary}</span>
                        )}
                        {isPublic && (
                          <Badge variant="outline" className="text-[10px] text-green-700 border-green-300 ml-1">
                            No auth
                          </Badge>
                        )}
                      </div>
                      <CardContent className="pt-4 flex flex-col gap-4">
                        {op.description && (
                          <p className="text-sm text-neutral-600">{op.description}</p>
                        )}

                        {/* Parameters */}
                        {params.length > 0 && (
                          <div>
                            <p className="text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-2">Parameters</p>
                            <div className="overflow-x-auto">
                            <table className="w-full text-xs border-collapse">
                              <thead>
                                <tr className="bg-neutral-100">
                                  <th className="text-left px-2 py-1.5 border border-neutral-200 font-medium text-neutral-600">Name</th>
                                  <th className="text-left px-2 py-1.5 border border-neutral-200 font-medium text-neutral-600">In</th>
                                  <th className="text-left px-2 py-1.5 border border-neutral-200 font-medium text-neutral-600">Required</th>
                                  <th className="text-left px-2 py-1.5 border border-neutral-200 font-medium text-neutral-600">Type</th>
                                  <th className="text-left px-2 py-1.5 border border-neutral-200 font-medium text-neutral-600">Description</th>
                                </tr>
                              </thead>
                              <tbody>
                                {params.map((p, i) => (
                                  <tr key={i} className="even:bg-neutral-50">
                                    <td className="px-2 py-1.5 border border-neutral-200 font-mono text-[11px]">{p.name ?? '—'}</td>
                                    <td className="px-2 py-1.5 border border-neutral-200 text-neutral-500">{p.in ?? '—'}</td>
                                    <td className="px-2 py-1.5 border border-neutral-200">{p.required ? 'Yes' : 'No'}</td>
                                    <td className="px-2 py-1.5 border border-neutral-200 text-neutral-500">{p.schema?.type ?? '—'}</td>
                                    <td className="px-2 py-1.5 border border-neutral-200 text-neutral-500">{p.description ?? '—'}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                            </div>
                          </div>
                        )}

                        {/* Request body */}
                        {op.requestBody?.content && (
                          <div>
                            <p className="text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-2">Request Body</p>
                            {Object.entries(op.requestBody.content).map(([ct, content]) => (
                              <div key={ct}>
                                <p className="text-[11px] text-neutral-400 mb-1.5 font-mono">{ct}</p>
                                {content.schema?.$ref ? (
                                  <SchemaTable schemaName={getRefName(content.schema.$ref)} spec={spec} />
                                ) : (
                                  <span className="text-xs text-neutral-500">{content.schema?.type ?? '—'}</span>
                                )}
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Responses */}
                        {op.responses && (
                          <div>
                            <p className="text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-2">Responses</p>
                            <div className="overflow-x-auto">
                            <table className="w-full text-xs border-collapse">
                              <thead>
                                <tr className="bg-neutral-100">
                                  <th className="text-left px-2 py-1.5 border border-neutral-200 font-medium text-neutral-600">Status</th>
                                  <th className="text-left px-2 py-1.5 border border-neutral-200 font-medium text-neutral-600">Description</th>
                                  <th className="text-left px-2 py-1.5 border border-neutral-200 font-medium text-neutral-600">Schema</th>
                                </tr>
                              </thead>
                              <tbody>
                                {Object.entries(op.responses).map(([code, resp]) => {
                                  let schemaRef: string = '—'
                                  for (const [, c] of Object.entries(resp.content ?? {})) {
                                    if (c.schema?.$ref) schemaRef = getRefName(c.schema.$ref)
                                    else if (c.schema?.type) schemaRef = c.schema.type
                                  }
                                  return (
                                    <tr key={code} className="even:bg-neutral-50">
                                      <td className="px-2 py-1.5 border border-neutral-200">
                                        <StatusBadge code={code} />
                                      </td>
                                      <td className="px-2 py-1.5 border border-neutral-200 text-neutral-600">{resp.description ?? '—'}</td>
                                      <td className="px-2 py-1.5 border border-neutral-200 font-mono text-[11px] text-neutral-500">{schemaRef}</td>
                                    </tr>
                                  )
                                })}
                              </tbody>
                            </table>
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  )
                }),
              )}
            </div>
          )}

          {/* Schemas */}
          {spec.components?.schemas && (
            <div className="flex flex-col gap-3">
              <h3 className="text-lg font-semibold text-[#1d1d1f]">Schemas</h3>
              {Object.entries(spec.components.schemas).map(([name, schema]) => (
                <Card key={name}>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-mono">{name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {schema.properties ? (
                      <div className="overflow-x-auto">
                      <table className="w-full text-xs border-collapse">
                        <thead>
                          <tr className="bg-neutral-100">
                            <th className="text-left px-2 py-1.5 border border-neutral-200 font-medium text-neutral-600">Property</th>
                            <th className="text-left px-2 py-1.5 border border-neutral-200 font-medium text-neutral-600">Type</th>
                            <th className="text-left px-2 py-1.5 border border-neutral-200 font-medium text-neutral-600">Description</th>
                            <th className="text-left px-2 py-1.5 border border-neutral-200 font-medium text-neutral-600">Example</th>
                          </tr>
                        </thead>
                        <tbody>
                          {Object.entries(schema.properties).map(([pName, prop]) => {
                            const type = Array.isArray(prop.type)
                              ? prop.type.join(' | ')
                              : (prop.type ?? '—')
                            return (
                              <tr key={pName} className="even:bg-neutral-50">
                                <td className="px-2 py-1.5 border border-neutral-200 font-mono text-[11px]">{pName}</td>
                                <td className="px-2 py-1.5 border border-neutral-200 text-neutral-600">{type}</td>
                                <td className="px-2 py-1.5 border border-neutral-200 text-neutral-500">{prop.description ?? '—'}</td>
                                <td className="px-2 py-1.5 border border-neutral-200 text-neutral-500">
                                  {prop.example !== undefined
                                    ? String(prop.example)
                                    : '—'}
                                </td>
                              </tr>
                            )
                          })}
                        </tbody>
                      </table>
                      </div>
                    ) : (
                      <p className="text-xs text-neutral-400">{schema.description ?? 'No properties.'}</p>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  )
}
