import {
  type ChangeEvent,
  type KeyboardEvent,
  type RefObject,
  type UIEvent,
  useRef,
} from 'react'
import { tokenizeCasCommand } from '@/lib/casSyntax'
import { cn } from '@/lib/utils'

type Props = {
  id: string
  value: string
  rows: number
  placeholder?: string
  textareaRef: RefObject<HTMLTextAreaElement | null>
  className?: string
  onChange: (event: ChangeEvent<HTMLTextAreaElement>) => void
  onKeyDown?: (event: KeyboardEvent<HTMLTextAreaElement>) => void
}

function highlight(command: string) {
  return tokenizeCasCommand(command).map((token, index) => {
    return (
      <span key={`${token.value}-${index}`} className={token.className}>
        {token.value}
      </span>
    )
  })
}

export function SyntaxTextarea({
  id,
  value,
  rows,
  placeholder,
  textareaRef,
  className,
  onChange,
  onKeyDown,
}: Props) {
  const highlightRef = useRef<HTMLPreElement>(null)

  function syncScroll(event: UIEvent<HTMLTextAreaElement>) {
    if (highlightRef.current) {
      highlightRef.current.scrollTop = event.currentTarget.scrollTop
      highlightRef.current.scrollLeft = event.currentTarget.scrollLeft
    }
  }

  return (
    <div className={cn('relative min-h-40 overflow-hidden rounded-md', className)}>
      <pre
        ref={highlightRef}
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden whitespace-pre-wrap break-words px-3 py-2 font-mono text-sm leading-6"
      >
        {value ? highlight(value) : <span className="text-white/36">{placeholder}</span>}
      </pre>
      <textarea
        ref={textareaRef}
        id={id}
        value={value}
        rows={rows}
        spellCheck={false}
        placeholder={placeholder}
        onChange={onChange}
        onKeyDown={onKeyDown}
        onScroll={syncScroll}
        className="relative z-10 min-h-40 w-full resize-y rounded-md border border-transparent bg-transparent px-3 py-2 font-mono text-sm leading-6 text-transparent caret-white outline-none placeholder:text-transparent focus-visible:ring-2 focus-visible:ring-[#2997ff]"
      />
    </div>
  )
}
