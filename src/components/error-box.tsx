"use client"

import { RefreshCcw, AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/utils/basic-utils"

interface ErrorBoxProps {
  message?: string
  onRetry?: () => any
  title?: string
  icon?: React.ReactNode
  className?: string
}

export function ErrorBox({
  message = "Something went wrong. Please try again.",
  onRetry,
  title = "Error Loading",
  icon,
  className,
}: ErrorBoxProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center text-center gap-4 py-8 w-full",
        className
      )}
    >
      <div className="space-y-2 max-w-md">
        {icon ?? <AlertTriangle className="mx-auto h-8 w-8 text-destructive" />}
        <h2 className="text-sm font-semibold text-destructive">{title}</h2>
        <p className="text-xs text-muted-foreground">{message}</p>
      </div>
      <div className="flex gap-2">
        {onRetry && (
          <Button onClick={onRetry} size="sm" variant="outline">
            <RefreshCcw className="h-2 w-2" />
            Try Again
          </Button>
        )}
        <Button size="sm" onClick={() => window.location.reload()} variant="outline">
          Reload Page
        </Button>
      </div>
    </div>
  )
}