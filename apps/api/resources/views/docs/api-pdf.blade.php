<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<style>
* { box-sizing: border-box; margin: 0; padding: 0; }

body {
    font-family: Helvetica, Arial, sans-serif;
    font-size: 10pt;
    color: #1a1a1a;
    line-height: 1.5;
}

@page {
    margin: 3.2cm 2cm 2.8cm 2cm;
}

.page-header {
    position: fixed;
    top: -2.8cm;
    left: 0;
    right: 0;
    height: 1.5cm;
    border-bottom: 1px solid #d1d5db;
    padding-bottom: 5px;
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    font-size: 8pt;
    color: #6b7280;
}

.page-footer {
    position: fixed;
    bottom: -2.4cm;
    left: 0;
    right: 0;
    height: 1.2cm;
    border-top: 1px solid #d1d5db;
    padding-top: 5px;
    font-size: 8pt;
    color: #6b7280;
    text-align: center;
}

/* Cover */
.cover {
    text-align: center;
    padding-top: 5cm;
    page-break-after: always;
}
.cover-logo {
    font-size: 28pt;
    font-weight: bold;
    color: #1d1d1f;
    letter-spacing: -0.5px;
}
.cover-subtitle {
    font-size: 13pt;
    color: #6b7280;
    margin-top: 8px;
}
.cover-meta {
    margin-top: 2cm;
    font-size: 9pt;
    color: #9ca3af;
}
.cover-badge {
    display: inline-block;
    background: #f3f4f6;
    border: 1px solid #e5e7eb;
    border-radius: 4px;
    padding: 4px 10px;
    font-size: 9pt;
    color: #374151;
    margin-top: 6px;
}

/* Section */
.section {
    margin-bottom: 28px;
}
.section-title {
    font-size: 15pt;
    font-weight: bold;
    color: #111827;
    border-bottom: 2px solid #3b82f6;
    padding-bottom: 5px;
    margin-bottom: 14px;
}

/* Auth box */
.auth-box {
    background: #f8fafc;
    border: 1px solid #e2e8f0;
    border-left: 4px solid #3b82f6;
    border-radius: 4px;
    padding: 12px 14px;
    margin-bottom: 12px;
}
.auth-box p { margin-bottom: 4px; }

/* Endpoint card */
.endpoint {
    border: 1px solid #e5e7eb;
    border-radius: 6px;
    margin-bottom: 16px;
    page-break-inside: avoid;
}
.endpoint-header {
    padding: 10px 14px;
    background: #f9fafb;
    border-bottom: 1px solid #e5e7eb;
    border-radius: 5px 5px 0 0;
    display: flex;
    align-items: center;
    gap: 10px;
}
.method {
    font-weight: bold;
    font-size: 9pt;
    padding: 2px 8px;
    border-radius: 3px;
    color: #fff;
    min-width: 48px;
    text-align: center;
}
.method-get    { background: #16a34a; }
.method-post   { background: #2563eb; }
.method-put    { background: #d97706; }
.method-patch  { background: #7c3aed; }
.method-delete { background: #dc2626; }
.endpoint-path {
    font-family: "Courier New", monospace;
    font-size: 10pt;
    font-weight: bold;
    color: #1d1d1f;
}
.endpoint-summary {
    font-size: 9pt;
    color: #6b7280;
    margin-left: auto;
}
.endpoint-body {
    padding: 10px 14px;
}

/* Table */
table {
    width: 100%;
    border-collapse: collapse;
    font-size: 9pt;
    margin-top: 8px;
}
th {
    background: #f3f4f6;
    text-align: left;
    padding: 5px 8px;
    border: 1px solid #e5e7eb;
    font-weight: bold;
    color: #374151;
}
td {
    padding: 5px 8px;
    border: 1px solid #e5e7eb;
    vertical-align: top;
    color: #1f2937;
}
td code, th code {
    font-family: "Courier New", monospace;
    background: #f3f4f6;
    padding: 1px 4px;
    border-radius: 2px;
    font-size: 8.5pt;
}

/* Sub-labels */
.sub-label {
    font-size: 8.5pt;
    font-weight: bold;
    color: #374151;
    margin-top: 10px;
    margin-bottom: 4px;
    text-transform: uppercase;
    letter-spacing: 0.4px;
}

/* Response badges */
.status-code {
    display: inline-block;
    font-size: 8pt;
    font-weight: bold;
    padding: 1px 7px;
    border-radius: 3px;
    color: #fff;
}
.status-2xx { background: #16a34a; }
.status-4xx { background: #dc2626; }
.status-5xx { background: #d97706; }

/* Schema section */
.schema-item {
    margin-bottom: 16px;
    page-break-inside: avoid;
}
.schema-name {
    font-size: 10.5pt;
    font-weight: bold;
    color: #1d1d1f;
    margin-bottom: 6px;
}

p { margin-bottom: 6px; }
</style>
</head>
<body>

{{-- Fixed header on every page --}}
<div class="page-header">
    <span>Dynamicas API Documentation</span>
    <span>v{{ $spec['info']['version'] ?? '1.0.0' }}</span>
</div>

{{-- Fixed footer with page numbers --}}
<div class="page-footer">
    <script type="text/php">
        if (isset($pdf)) {
            $font = $fontMetrics->get_font("Helvetica", "normal");
            $size = 8;
            $pageText = $PAGE_NUM . " / " . $PAGE_COUNT;
            $w = $pdf->get_width();
            $h = $pdf->get_height();
            $textWidth = $fontMetrics->get_text_width($pageText, $font, $size);
            $pdf->text(($w - $textWidth) / 2, $h - 28, $pageText, $font, $size, [0.42, 0.45, 0.50]);
        }
    </script>
</div>

{{-- Cover page --}}
<div class="cover">
    <div class="cover-logo">{{ $spec['info']['title'] ?? 'Dynamicas API' }}</div>
    <div class="cover-subtitle">REST API Documentation</div>
    <div class="cover-meta">
        <div class="cover-badge">OpenAPI {{ $spec['openapi'] ?? '3.1.0' }}</div><br>
        <div class="cover-badge" style="margin-top:8px;">Version {{ $spec['info']['version'] ?? '1.0.0' }}</div><br>
        <div class="cover-badge" style="margin-top:8px;">Generated {{ now()->format('d.m.Y H:i') }}</div>
    </div>
</div>

{{-- Overview --}}
<div class="section">
    <div class="section-title">Overview</div>

    @if(!empty($spec['info']['description']))
        <p>{{ $spec['info']['description'] }}</p>
    @endif

    @if(!empty($spec['servers']))
        <p class="sub-label">Base URL</p>
        @foreach($spec['servers'] as $server)
            <p><code>{{ $server['url'] }}</code>
            @if(!empty($server['description']))— {{ $server['description'] }}@endif
            </p>
        @endforeach
    @endif
</div>

{{-- Authentication --}}
@if(!empty($spec['components']['securitySchemes']))
<div class="section">
    <div class="section-title">Authentication</div>
    @foreach($spec['components']['securitySchemes'] as $schemeName => $scheme)
    <div class="auth-box">
        <p><strong>{{ $schemeName }}</strong> &mdash; {{ $scheme['type'] ?? '' }}</p>
        @if(!empty($scheme['in']) && !empty($scheme['name']))
            <p>Send the API key in the <code>{{ $scheme['name'] }}</code> {{ $scheme['in'] }}.</p>
        @endif
        @if(!empty($scheme['description']))
            <p>{{ $scheme['description'] }}</p>
        @endif
    </div>
    @endforeach
    <p style="font-size:9pt;color:#6b7280;">All endpoints require authentication unless marked with <code>security: []</code>.</p>
</div>
@endif

{{-- Shared Parameters --}}
@if(!empty($spec['components']['parameters']))
<div class="section">
    <div class="section-title">Shared Headers</div>
    <table>
        <tr>
            <th>Name</th><th>In</th><th>Required</th><th>Type</th><th>Description</th>
        </tr>
        @foreach($spec['components']['parameters'] as $pName => $param)
        <tr>
            <td><code>{{ $param['name'] ?? $pName }}</code></td>
            <td>{{ $param['in'] ?? '' }}</td>
            <td>{{ ($param['required'] ?? false) ? 'Yes' : 'No' }}</td>
            <td>{{ $param['schema']['type'] ?? '—' }}</td>
            <td>{{ $param['description'] ?? '—' }}</td>
        </tr>
        @endforeach
    </table>
</div>
@endif

{{-- Endpoints --}}
@if(!empty($spec['paths']))
<div class="section">
    <div class="section-title">Endpoints</div>

    @php
        $methodOrder = ['get','post','put','patch','delete','options'];
    @endphp

    @foreach($spec['paths'] as $path => $pathItem)
        @foreach($methodOrder as $method)
            @if(!isset($pathItem[$method])) @continue @endif
            @php $op = $pathItem[$method]; @endphp

            <div class="endpoint">
                <div class="endpoint-header">
                    <span class="method method-{{ $method }}">{{ strtoupper($method) }}</span>
                    <span class="endpoint-path">{{ $path }}</span>
                    @if(!empty($op['summary']))
                        <span class="endpoint-summary">{{ $op['summary'] }}</span>
                    @endif
                </div>
                <div class="endpoint-body">

                    {{-- Auth --}}
                    @if(isset($op['security']) && count($op['security']) === 0)
                        <p style="font-size:9pt;color:#6b7280;">No authentication required.</p>
                    @endif

                    {{-- Parameters --}}
                    @php
                        $params = collect($op['parameters'] ?? [])
                            ->filter(fn($p) => !isset($p['$ref']));
                    @endphp
                    @if($params->isNotEmpty())
                        <p class="sub-label">Parameters</p>
                        <table>
                            <tr><th>Name</th><th>In</th><th>Required</th><th>Type</th><th>Description</th></tr>
                            @foreach($params as $param)
                            <tr>
                                <td><code>{{ $param['name'] ?? '—' }}</code></td>
                                <td>{{ $param['in'] ?? '—' }}</td>
                                <td>{{ ($param['required'] ?? false) ? 'Yes' : 'No' }}</td>
                                <td>{{ $param['schema']['type'] ?? '—' }}</td>
                                <td>{{ $param['description'] ?? '—' }}</td>
                            </tr>
                            @endforeach
                        </table>
                    @endif

                    {{-- Request Body --}}
                    @if(!empty($op['requestBody']['content']))
                        <p class="sub-label">Request Body</p>
                        @foreach($op['requestBody']['content'] as $contentType => $content)
                            <p style="font-size:9pt;color:#6b7280;">Content-Type: <code>{{ $contentType }}</code></p>
                            @if(!empty($content['schema']['$ref']))
                                @php $refName = basename(str_replace('/', DIRECTORY_SEPARATOR, $content['schema']['$ref'])); @endphp
                                <p>Schema: <code>{{ $refName }}</code></p>
                                @if(!empty($spec['components']['schemas'][$refName]['properties']))
                                    <table>
                                        <tr><th>Field</th><th>Type</th><th>Constraints</th><th>Default</th></tr>
                                        @foreach($spec['components']['schemas'][$refName]['properties'] as $propName => $prop)
                                        <tr>
                                            <td><code>{{ $propName }}</code></td>
                                            <td>{{ $prop['type'] ?? '—' }}</td>
                                            <td>
                                                @if(isset($prop['minimum']))min: {{ $prop['minimum'] }}@endif
                                                @if(isset($prop['maximum'])) max: {{ $prop['maximum'] }}@endif
                                                @if(isset($prop['maxLength'])) maxLength: {{ $prop['maxLength'] }}@endif
                                            </td>
                                            <td>{{ $prop['default'] ?? '—' }}</td>
                                        </tr>
                                        @endforeach
                                    </table>
                                @endif
                            @elseif(!empty($content['schema']['properties']))
                                <table>
                                    <tr><th>Field</th><th>Type</th></tr>
                                    @foreach($content['schema']['properties'] as $propName => $prop)
                                    <tr>
                                        <td><code>{{ $propName }}</code></td>
                                        <td>{{ $prop['type'] ?? '—' }}</td>
                                    </tr>
                                    @endforeach
                                </table>
                            @endif
                        @endforeach
                    @endif

                    {{-- Responses --}}
                    @if(!empty($op['responses']))
                        <p class="sub-label">Responses</p>
                        <table>
                            <tr><th>Status</th><th>Description</th><th>Schema</th></tr>
                            @foreach($op['responses'] as $statusCode => $response)
                            @php
                                $codeInt = (int) $statusCode;
                                $badgeClass = $codeInt >= 500 ? 'status-5xx' : ($codeInt >= 400 ? 'status-4xx' : 'status-2xx');
                                $schemaRef = '—';
                                foreach (($response['content'] ?? []) as $ct => $c) {
                                    if (!empty($c['schema']['$ref'])) {
                                        $schemaRef = basename(str_replace('/', DIRECTORY_SEPARATOR, $c['schema']['$ref']));
                                    } elseif (!empty($c['schema']['type'])) {
                                        $schemaRef = $c['schema']['type'];
                                    }
                                }
                            @endphp
                            <tr>
                                <td><span class="status-code {{ $badgeClass }}">{{ $statusCode }}</span></td>
                                <td>{{ $response['description'] ?? '—' }}</td>
                                <td>{{ $schemaRef !== '—' ? $schemaRef : '—' }}</td>
                            </tr>
                            @endforeach
                        </table>
                    @endif

                </div>
            </div>
        @endforeach
    @endforeach
</div>
@endif

{{-- Schemas --}}
@if(!empty($spec['components']['schemas']))
<div class="section">
    <div class="section-title">Schemas</div>
    @foreach($spec['components']['schemas'] as $schemaName => $schema)
    <div class="schema-item">
        <div class="schema-name">{{ $schemaName }}</div>
        @if(!empty($schema['properties']))
        <table>
            <tr><th>Property</th><th>Type</th><th>Description</th><th>Example</th></tr>
            @foreach($schema['properties'] as $propName => $prop)
            <tr>
                <td><code>{{ $propName }}</code></td>
                <td>
                    @if(is_array($prop['type'] ?? null))
                        {{ implode(' | ', $prop['type']) }}
                    @else
                        {{ $prop['type'] ?? '—' }}
                    @endif
                </td>
                <td>{{ $prop['description'] ?? '—' }}</td>
                <td>{{ isset($prop['example']) ? (is_bool($prop['example']) ? ($prop['example'] ? 'true' : 'false') : $prop['example']) : '—' }}</td>
            </tr>
            @endforeach
        </table>
        @else
        <p style="font-size:9pt;color:#6b7280;">{{ $schema['description'] ?? 'No properties defined.' }}</p>
        @endif
    </div>
    @endforeach
</div>
@endif

</body>
</html>
