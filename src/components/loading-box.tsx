"use client"

import { Loader2 } from "lucide-react"
import { cn } from "@/utils/basic-utils"

interface LoadingBoxProps {
  message?: string
  title?: string
  className?: string
  spinnerSize?: number
}

export function LoadingBox({
  title = "Loading",
  message = "Please wait while we load the data.",
  className,
  spinnerSize = 32,
}: LoadingBoxProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center text-center gap-4 py-8 w-full",
        className
      )}
    >
      <Loader2
        className="animate-spin text-primary"
        style={{ width: spinnerSize, height: spinnerSize }}
      />
      <div className="space-y-1 max-w-md">
        <h3 className="text-base font-semibold">{title}</h3>
        <p className="text-sm text-muted-foreground">{message}</p>
      </div>
    </div>
  )
}