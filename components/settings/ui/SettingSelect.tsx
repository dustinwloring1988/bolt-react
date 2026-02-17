"use client"

import * as React from "react"
import * as SelectPrimitive from "@radix-ui/react-select"
import { Check, ChevronDown, ChevronUp } from "lucide-react"
import { cn } from "@/lib/utils"

interface SettingSelectOption {
  value: string
  label: string
  description?: string
}

interface SettingSelectProps {
  value: string
  onValueChange: (value: string) => void
  label: string
  description?: string
  options: SettingSelectOption[]
  disabled?: boolean
}

export function SettingSelect({
  value,
  onValueChange,
  label,
  description,
  options,
  disabled = false,
}: SettingSelectProps) {
  const selectedOption = options.find((opt) => opt.value === value)

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
      <SelectPrimitive.Root value={value} onValueChange={onValueChange} disabled={disabled}>
        <SelectPrimitive.Trigger
          className={cn(
            "relative inline-flex items-center justify-between gap-2 px-3 py-2",
            "text-sm font-medium rounded-lg border border-border",
            "bg-secondary/50 hover:bg-secondary text-foreground",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
            "transition-all duration-200 min-w-[140px]"
          )}
        >
          <SelectPrimitive.Value>
            <span className="truncate">{selectedOption?.label || "Select..."}</span>
          </SelectPrimitive.Value>
          <SelectPrimitive.Icon>
            <ChevronDown className="w-4 h-4 text-muted-foreground" />
          </SelectPrimitive.Icon>
        </SelectPrimitive.Trigger>

        <SelectPrimitive.Portal>
          <SelectPrimitive.Content
            position="popper"
            sideOffset={4}
            className={cn(
              "relative z-50 min-w-[180px] overflow-hidden rounded-lg border border-border",
              "bg-popover text-popover-foreground shadow-lg",
              "animate-in fade-in-0 zoom-in-95",
              "data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95"
            )}
          >
            <SelectPrimitive.ScrollUpButton className="flex items-center justify-center py-1">
              <ChevronUp className="w-4 h-4" />
            </SelectPrimitive.ScrollUpButton>
            <SelectPrimitive.Viewport className="p-1">
              {options.map((option) => (
                <SelectPrimitive.Item
                  key={option.value}
                  value={option.value}
                  className={cn(
                    "relative flex items-center gap-2 px-3 py-2 rounded-md cursor-pointer",
                    "text-sm outline-none select-none",
                    "hover:bg-secondary hover:text-foreground",
                    "data-[highlighted]:bg-secondary data-[highlighted]:text-foreground",
                    "data-[state=checked]:text-primary"
                  )}
                >
                  <span className="flex-1 truncate">{option.label}</span>
                  <SelectPrimitive.ItemIndicator>
                    <Check className="w-4 h-4 text-primary" />
                  </SelectPrimitive.ItemIndicator>
                </SelectPrimitive.Item>
              ))}
            </SelectPrimitive.Viewport>
            <SelectPrimitive.ScrollDownButton className="flex items-center justify-center py-1">
              <ChevronDown className="w-4 h-4" />
            </SelectPrimitive.ScrollDownButton>
          </SelectPrimitive.Content>
        </SelectPrimitive.Portal>
      </SelectPrimitive.Root>
    </div>
  )
}
