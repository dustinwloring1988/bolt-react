import * as React from "react"
import { type LucideIcon } from "lucide-react"

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

export function NavSecondary({
  items,
  ...props
}: {
  items: {
    title: string
    url: string
    target?: string
    icon: LucideIcon
  }[]
} & React.ComponentPropsWithoutRef<typeof SidebarGroup>) {
  return (
    <SidebarGroup {...props}>
      <div className="sidebar-divider" />
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton asChild size="sm" className="sidebar-nav-item">
                <a href={item.url} target={item.target} className="flex items-center gap-3">
                  <item.icon className="sidebar-icon w-4 h-4" />
                  <span className="font-body text-sm">{item.title}</span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}
