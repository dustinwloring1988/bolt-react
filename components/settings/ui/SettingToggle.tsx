"use client"

import * as React from "react"
import * as SwitchPrimitive from "@radix-ui/react-switch"
import { cn } from "@/lib/utils"

interface SettingToggleProps {
  checked: boolean
  onCheckedChange: (checked: boolean) => void
  label: string
  description?: string
  disabled?: boolean
}

export function SettingToggle({
  checked,
  onCheckedChange,
  label,
  description,
  disabled = false,
}: SettingToggleProps) {
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
      <SwitchPrimitive.Root
        checked={checked}
        onCheckedChange={onCheckedChange}
        disabled={disabled}
        className={cn(
          "relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full transition-all duration-300",
          "border-2 border-transparent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
          "disabled:cursor-not-allowed disabled:opacity-50",
          checked 
            ? "bg-primary shadow-[0_0_12px_hsl(38_70%_58%_/_0.4)]" 
            : "bg-muted hover:bg-muted/80"
        )}
      >
        <SwitchPrimitive.Thumb
          className={cn(
            "pointer-events-none block h-5 w-5 rounded-full bg-background shadow-lg ring-0 transition-transform duration-300",
            checked ? "translate-x-[22px] scale-100" : "translate-x-0.5"
          )}
        />
      </SwitchPrimitive.Root>
    </div>
  )
}
