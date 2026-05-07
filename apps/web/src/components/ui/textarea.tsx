import * as React from "react"

import { cn } from "@/lib/utils"

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "flex field-sizing-content min-h-24 w-full rounded-lg border border-transparent bg-card px-3 py-2.5 text-base shadow-[0_0_0_1px_rgba(166,233,228,0.85)] transition-colors duration-200 ease-[cubic-bezier(0.4,0,0.6,1)] outline-none placeholder:text-muted-foreground hover:shadow-[0_0_0_1px_rgba(43,160,161,0.55)] focus-visible:shadow-[0_0_0_3px_rgba(43,160,161,0.25)] disabled:cursor-not-allowed disabled:bg-muted disabled:opacity-60 aria-invalid:shadow-[0_0_0_2px_rgba(215,0,21,0.35)] md:text-sm dark:bg-input/30 dark:disabled:bg-input/80",
        className
      )}
      {...props}
    />
  )
}

export { Textarea }
