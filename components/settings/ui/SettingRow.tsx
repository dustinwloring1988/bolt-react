"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

interface SettingRowProps {
  label: string
  description?: string
  action?: React.ReactNode
  children?: React.ReactNode
  disabled?: boolean
}

export function SettingRow({
  label,
  description,
  action,
  children,
  disabled = false,
}: SettingRowProps) {
  return (
    <div
      className={cn(
        "group flex items-center justify-between py-3 px-1 -mx-1 rounded-lg transition-all duration-200",
        "hover:bg-secondary/30 hover:px-2",
        disabled && "opacity-50 pointer-events-none"
      )}
    >
      <div className="flex-1 min-w-0 pr-4">
        <p className="text-sm font-medium text-foreground">{label}</p>
        {description && (
          <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
            {description}
          </p>
        )}
      </div>
      <div className="shrink-0">
        {action || children}
      </div>
    </div>
  )
}
