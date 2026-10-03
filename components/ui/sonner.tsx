"use client"

import { useTheme } from "next-themes"
import { Toaster as Sonner, type ToasterProps } from "sonner"
import { CircleCheckIcon, InfoIcon, TriangleAlertIcon, OctagonXIcon, Loader2Icon } from "lucide-react"

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      duration={4000}
      icons={{
        success: <CircleCheckIcon className="size-4 text-[#5f7358]" />,
        info: <InfoIcon className="size-4 text-[#94a478]" />,
        warning: <TriangleAlertIcon className="size-4 text-[#a6633d]" />,
        error: <OctagonXIcon className="size-4 text-destructive" />,
        loading: <Loader2Icon className="size-4 animate-spin text-muted-foreground" />,
      }}
      style={
        {
          "--normal-bg": "var(--popover)",
          "--normal-text": "var(--popover-foreground)",
          "--normal-border": "var(--border)",
          "--success-bg": "var(--popover)",
          "--success-text": "var(--popover-foreground)",
          "--success-border": "var(--border)",
          "--error-bg": "var(--popover)",
          "--error-text": "var(--popover-foreground)",
          "--error-border": "var(--border)",
          "--border-radius": "var(--radius)",
          "--font-size": "13px",
        } as React.CSSProperties
      }
      toastOptions={{
        classNames: {
          toast: "cn-toast font-sans shadow-md",
          title: "font-semibold text-[13px]",
          description: "text-xs text-muted-foreground",
          actionButton: "bg-primary text-primary-foreground text-xs",
          cancelButton: "bg-muted text-muted-foreground text-xs",
        },
      }}
      {...props}
    />
  )
}

export { Toaster }
