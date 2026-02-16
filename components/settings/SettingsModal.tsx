"use client"

import * as React from "react"
import { useStore } from "@nanostores/react"
import { DialogRoot, Dialog, DialogTitle, DialogDescription } from "@/components/ui/OldDialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { settingsModalStore, closeSettingsModal, setSettingsTab, type SettingsTab } from "@/lib/stores/settings-modal"
import { themeStore, toggleTheme } from "@/lib/stores/theme"
import { cn } from "@/lib/utils"

const tabs: { id: SettingsTab; label: string }[] = [
  { id: 'general', label: 'General' },
  { id: 'team', label: 'Team' },
  { id: 'billing', label: 'Billing' },
  { id: 'limits', label: 'Limits' },
]

function GeneralTab() {
  const theme = useStore(themeStore)

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h3 className="text-lg font-medium">Appearance</h3>
        <p className="text-sm text-muted-foreground">
          Customize the look and feel of your application.
        </p>
      </div>
      
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <p className="text-sm font-medium">Theme</p>
          <p className="text-xs text-muted-foreground">
            Select your preferred color scheme.
          </p>
        </div>
        <button
          onClick={toggleTheme}
          className={cn(
            "relative inline-flex h-6 w-11 items-center rounded-full transition-colors",
            theme === 'dark' ? "bg-primary" : "bg-muted"
          )}
        >
          <span
            className={cn(
              "inline-block h-4 w-4 transform rounded-full bg-background transition-transform",
              theme === 'dark' ? "translate-x-6" : "translate-x-1"
            )}
          />
        </button>
      </div>

      <div className="space-y-2 pt-4 border-t">
        <h3 className="text-lg font-medium">Preferences</h3>
        <p className="text-sm text-muted-foreground">
          Configure your default settings.
        </p>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-sm font-medium">Auto-save conversations</p>
            <p className="text-xs text-muted-foreground">
              Automatically save chat history.
            </p>
          </div>
          <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-primary">
            <span className="inline-block h-4 w-4 transform translate-x-6 rounded-full bg-background" />
          </button>
        </div>
      </div>
    </div>
  )
}

function PlaceholderTab({ label }: { label: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="rounded-full bg-muted p-4 mb-4">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-muted-foreground"
        >
          <path d="M12 20h9" />
          <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" />
        </svg>
      </div>
      <h3 className="text-lg font-medium">{label} Settings</h3>
      <p className="text-sm text-muted-foreground mt-2 max-w-[250px]">
        This settings section is coming soon. Check back later for {label.toLowerCase()} configuration options.
      </p>
    </div>
  )
}

export function SettingsModal() {
  const { isOpen, activeTab } = useStore(settingsModalStore)

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      closeSettingsModal()
    }
  }

  return (
    <DialogRoot open={isOpen} onOpenChange={handleOpenChange}>
      <Dialog className="max-w-[600px] max-h-[80vh]">
        <DialogTitle>Settings</DialogTitle>
        <DialogDescription className="sr-only">
          Manage your application settings
        </DialogDescription>
        
        <div className="px-5 pb-5">
          <Tabs value={activeTab} onValueChange={(value) => setSettingsTab(value as SettingsTab)} className="w-full">
            <TabsList className="w-full justify-start mb-6">
              {tabs.map((tab) => (
                <TabsTrigger key={tab.id} value={tab.id}>
                  {tab.label}
                </TabsTrigger>
              ))}
            </TabsList>
            
            <TabsContent value="general">
              <GeneralTab />
            </TabsContent>
            
            <TabsContent value="team">
              <PlaceholderTab label="Team" />
            </TabsContent>
            
            <TabsContent value="billing">
              <PlaceholderTab label="Billing" />
            </TabsContent>
            
            <TabsContent value="limits">
              <PlaceholderTab label="Limits" />
            </TabsContent>
          </Tabs>
        </div>
      </Dialog>
    </DialogRoot>
  )
}
