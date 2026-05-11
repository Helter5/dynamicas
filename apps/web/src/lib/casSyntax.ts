const tokenPattern = /(\/\/.*|%.*|'[^']*'|"[^"]*"|\b(?:sin|cos|tan|sqrt|diff|plot|linspace|step|ss|lqr|place|eig|zeros|ones|eye)\b|\b\d+(?:\.\d+)?\b|[=+\-*/^()[\]{},;])/g

export type CasSyntaxToken = {
  value: string
  className: string
}

export function tokenizeCasCommand(command: string): CasSyntaxToken[] {
  return command
    .split(tokenPattern)
    .filter((part) => part !== '')
    .map((part) => ({
      value: part,
      className: getTokenClassName(part),
    }))
}

function getTokenClassName(token: string) {
  if (/^(\/\/|%)/.test(token)) {
    return 'text-white/38'
  }

  if (/^['"]/.test(token)) {
    return 'text-[#ffd60a]'
  }

  if (/^\d/.test(token)) {
    return 'text-[#30d158]'
  }

  if (/^[=+\-*/^()[\]{},;]$/.test(token)) {
    return 'text-[#ff9f0a]'
  }

  if (/^[a-z]+$/i.test(token)) {
    return 'text-[#64d2ff]'
  }

  return 'text-white/88'
}
