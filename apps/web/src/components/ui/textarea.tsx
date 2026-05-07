import * as React from "react"

import { cn } from "@/lib/utils"

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "flex field-sizing-content min-h-24 w-full rounded-[10px] border border-transparent bg-card px-3 py-2.5 text-base shadow-[0_0_0_1px_rgba(180,180,180,0.3)] transition-shadow duration-[320ms] ease-[cubic-bezier(0.4,0,0.6,1)] outline-none placeholder:text-muted-foreground hover:shadow-[0_0_0_1px_rgba(110,110,115,0.55)] focus-visible:shadow-[0_0_0_3px_rgba(0,113,227,0.22)] disabled:cursor-not-allowed disabled:bg-muted disabled:opacity-60 aria-invalid:shadow-[0_0_0_2px_rgba(215,0,21,0.35)] md:text-sm dark:bg-input/30 dark:disabled:bg-input/80",
        className
      )}
      {...props}
    />
  )
}

export { Textarea }
