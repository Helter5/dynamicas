import { Button as ButtonPrimitive } from "@base-ui/react/button"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "group/button inline-flex shrink-0 cursor-pointer items-center justify-center rounded-full border border-transparent bg-clip-padding text-sm font-normal tracking-[-0.012em] whitespace-nowrap transition-all duration-[320ms] ease-[cubic-bezier(0.4,0,0.6,1)] outline-none select-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background active:not-aria-[haspopup]:opacity-70 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-45 aria-invalid:border-destructive aria-invalid:ring-2 aria-invalid:ring-destructive/20 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-[#0066cc] active:bg-[#0066cc]",
        outline:
          "bg-card text-foreground shadow-[0_0_0_1px_rgba(180,180,180,0.3)] hover:bg-secondary hover:shadow-[0_0_0_1px_rgba(110,110,115,0.55)] aria-expanded:bg-secondary aria-expanded:text-foreground dark:border-input dark:bg-input/30 dark:hover:bg-input/50",
        secondary:
          "bg-secondary text-secondary-foreground shadow-[0_0_0_1px_rgba(180,180,180,0.3)] hover:bg-accent aria-expanded:bg-accent aria-expanded:text-accent-foreground",
        ghost:
          "hover:bg-accent hover:text-foreground aria-expanded:bg-accent aria-expanded:text-foreground dark:hover:bg-muted/50",
        destructive:
          "bg-destructive text-white hover:bg-destructive/90 focus-visible:ring-destructive dark:bg-destructive dark:hover:bg-destructive/90 dark:focus-visible:ring-destructive/40",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default:
          "h-9 gap-2 px-4 has-data-[icon=inline-end]:pr-3 has-data-[icon=inline-start]:pl-3",
        xs: "h-7 gap-1 px-2.5 text-xs in-data-[slot=button-group]:rounded-full has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2 [&_svg:not([class*='size-'])]:size-3",
        sm: "h-8 gap-1.5 px-3 text-xs in-data-[slot=button-group]:rounded-full has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2 [&_svg:not([class*='size-'])]:size-3.5",
        lg: "h-10 gap-2 px-5 text-[1.0625rem] has-data-[icon=inline-end]:pr-4 has-data-[icon=inline-start]:pl-4",
        icon: "size-9",
        "icon-xs":
          "size-7 in-data-[slot=button-group]:rounded-full [&_svg:not([class*='size-'])]:size-3",
        "icon-sm":
          "size-8 in-data-[slot=button-group]:rounded-full",
        "icon-lg": "size-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant = "default",
  size = "default",
  ...props
}: ButtonPrimitive.Props & VariantProps<typeof buttonVariants>) {
  return (
    <ButtonPrimitive
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button }
