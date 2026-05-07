import * as React from "react"
import { Input as InputPrimitive } from "@base-ui/react/input"

import { cn } from "@/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <InputPrimitive
      type={type}
      data-slot="input"
      className={cn(
        "h-10 w-full min-w-0 rounded-lg border border-transparent bg-card px-3 py-2 text-base shadow-[0_0_0_1px_rgba(166,233,228,0.85)] transition-colors duration-200 ease-[cubic-bezier(0.4,0,0.6,1)] outline-none file:inline-flex file:h-6 file:border-0 file:bg-transparent file:text-sm file:font-normal file:text-foreground placeholder:text-muted-foreground hover:shadow-[0_0_0_1px_rgba(43,160,161,0.55)] focus-visible:shadow-[0_0_0_3px_rgba(43,160,161,0.25)] disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-muted disabled:opacity-60 aria-invalid:shadow-[0_0_0_2px_rgba(215,0,21,0.35)] md:text-sm dark:bg-input/30 dark:disabled:bg-input/80",
        className
      )}
      {...props}
    />
  )
}

export { Input }
