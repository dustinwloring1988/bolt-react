"use client"

import * as React from "react"
import * as AccordionPrimitive from "@radix-ui/react-accordion"
import { ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { motion, type Variants } from "framer-motion"

interface SettingSectionProps {
  title: string
  description?: string
  children: React.ReactNode
  defaultOpen?: boolean
  accent?: boolean
}

const accordionVariants: Variants = {
  hidden: { opacity: 0, height: 0 },
  visible: { 
    opacity: 1, 
    height: "auto",
    transition: { duration: 0.3, ease: [0.4, 0, 0.2, 1] }
  },
}

const chevronVariants: Variants = {
  closed: { rotate: 0, opacity: 0.5 },
  open: { rotate: 180, opacity: 1 },
}

export function SettingSection({
  title,
  description,
  children,
  defaultOpen = true,
  accent = false,
}: SettingSectionProps) {
  return (
    <AccordionPrimitive.Root
      type="single"
      defaultValue={defaultOpen ? "section" : undefined}
      collapsible
    >
      <AccordionPrimitive.Item value="section" className="border-b border-border/50 last:border-b-0">
        <AccordionPrimitive.Header>
          <AccordionPrimitive.Trigger
            className={cn(
              "flex w-full items-center justify-between py-4 group",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset rounded-lg",
              accent && "[&_.section-indicator]:text-primary"
            )}
          >
            <div className="text-left">
              <h3 
                className={cn(
                  "font-display text-base font-semibold tracking-tight",
                  accent ? "text-primary" : "text-foreground"
                )}
              >
                {title}
              </h3>
              {description && (
                <p className="text-xs text-muted-foreground mt-0.5 max-w-[280px]">
                  {description}
                </p>
              )}
            </div>
            <motion.div
              variants={chevronVariants}
              className="section-indicator text-muted-foreground transition-colors duration-200 group-hover:text-foreground"
            >
              <ChevronDown className="w-4 h-4" />
            </motion.div>
          </AccordionPrimitive.Trigger>
        </AccordionPrimitive.Header>
        <AccordionPrimitive.Content forceMount>
          <motion.div
            variants={accordionVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            className="overflow-hidden"
          >
            <div className="pb-4 pt-1">{children}</div>
          </motion.div>
        </AccordionPrimitive.Content>
      </AccordionPrimitive.Item>
    </AccordionPrimitive.Root>
  )
}
