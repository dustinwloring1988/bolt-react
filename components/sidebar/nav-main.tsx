"use client"

import { ChevronRight, type LucideIcon } from "lucide-react"
import * as React from "react"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar"

interface NavItem {
  title?: string | React.ReactNode;
  url?: string;
}

interface NavMainProps {
  items: {
    title: string;
    url?: string;
    icon: LucideIcon;
    isActive?: boolean;
    items?: (NavItem | React.ReactNode)[];
  }[];
}

export function NavMain({
  items,
}: NavMainProps) {
  return (
    <SidebarGroup className="sidebar-group">
      <SidebarMenu>
        {items.map((item) => (
          <Collapsible key={item.title} asChild defaultOpen={item.isActive}>
            <SidebarMenuItem>
              <CollapsibleTrigger asChild>
                <SidebarMenuButton 
                  className="sidebar-nav-item"
                  data-active={item.isActive}
                >
                  <button 
                    className="flex items-center gap-3 w-full"
                    onClick={(e) => {
                      if (!item.items?.length && item.url) {
                        window.location.href = item.url;
                      }
                    }}
                  >
                    <item.icon className="sidebar-icon" />
                    <span className="font-body text-sm">{item.title}</span>
                    {item.items?.length ? (
                      <ChevronRight className="sidebar-collapse-indicator ml-auto" />
                    ) : null}
                  </button>
                </SidebarMenuButton>
              </CollapsibleTrigger>
              {item.items?.length ? (
                <>
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      {item.items?.map((subItem, index) => (
                        <SidebarMenuSubItem key={index}>
                          <SidebarMenuSubButton asChild>
                            {React.isValidElement(subItem) ? (
                              subItem
                            ) : (
                              (subItem as NavItem)?.url ? (
                                <a href={(subItem as NavItem).url} className="sidebar-model-item">
                                  {(subItem as NavItem).title ? (typeof (subItem as NavItem).title === 'string' ? <span>{(subItem as NavItem).title}</span> : <>{ (subItem as NavItem).title}</>) : null}
                                </a>
                              ) : (
                                <div className="sidebar-model-item">{(subItem as NavItem)?.title}</div>
                              )
                            )}
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      ))}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </>
              ) : null}
            </SidebarMenuItem>
          </Collapsible>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  )
}