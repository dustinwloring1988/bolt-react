"use client"

import * as React from "react"
import { useStore } from "@nanostores/react"
import * as DialogPrimitive from "@radix-ui/react-dialog"
import * as TabsPrimitive from "@radix-ui/react-tabs"
import { motion, type Variants } from "framer-motion"
import { X, Sparkle, Users, CreditCard, Gauge, Trash, Download } from "lucide-react"
import { settingsModalStore, closeSettingsModal, setSettingsTab, type SettingsTab } from "@/lib/stores/settings-modal"
import { themeStore, toggleTheme } from "@/lib/stores/theme"
import { cn } from "@/lib/utils"
import { SettingToggle, SettingSection, SettingSelect, SettingRow } from "./ui"

const tabs: { id: SettingsTab; label: string; icon: React.ElementType }[] = [
  { id: 'general', label: 'General', icon: Sparkle },
  { id: 'team', label: 'Team', icon: Users },
  { id: 'billing', label: 'Billing', icon: CreditCard },
  { id: 'limits', label: 'Limits', icon: Gauge },
]

function GeneralTab() {
  const theme = useStore(themeStore)
  
  const [settings, setSettings] = React.useState({
    autoSave: true,
    soundEffects: true,
    enterToSend: true,
    reducedMotion: false,
    fontSize: 'medium',
    defaultModel: 'gemini-3-flash',
    anonymousUsage: false,
  })

  const themeOptions = [
    { value: 'light', label: 'Light' },
    { value: 'dark', label: 'Dark' },
    { value: 'system', label: 'System' },
  ]

  const fontSizeOptions = [
    { value: 'small', label: 'Small' },
    { value: 'medium', label: 'Medium' },
    { value: 'large', label: 'Large' },
  ]

  const modelOptions = [
    { value: 'gemini-3-flash', label: 'Gemini 3 Flash' },
    { value: 'gemini-3-pro', label: 'Gemini 3 Pro' },
    { value: 'claude-sonnet-4-5-20251120', label: 'Claude Sonnet 4.5' },
    { value: 'claude-haiku-4-5-20251120', label: 'Claude Haiku 4.5' },
  ]

  const handleThemeChange = (newTheme: string) => {
    if (newTheme !== theme) {
      toggleTheme()
    }
  }

  return (
    <div className="space-y-1">
      <SettingSection
        title="Appearance"
        description="Customize the look and feel"
        accent
      >
        <SettingSelect
          value={theme}
          onValueChange={handleThemeChange}
          label="Theme"
          description="Select your preferred color scheme"
          options={themeOptions}
        />
        
        <SettingSelect
          value={settings.fontSize}
          onValueChange={(v) => setSettings(s => ({ ...s, fontSize: v }))}
          label="Font Size"
          description="Adjust text size throughout the app"
          options={fontSizeOptions}
        />
        
        <SettingToggle
          checked={settings.reducedMotion}
          onCheckedChange={(v) => setSettings(s => ({ ...s, reducedMotion: v }))}
          label="Reduced Motion"
          description="Minimize animations throughout the interface"
        />
      </SettingSection>

      <SettingSection
        title="Preferences"
        description="Customize your chat experience"
      >
        <SettingToggle
          checked={settings.autoSave}
          onCheckedChange={(v) => setSettings(s => ({ ...s, autoSave: v }))}
          label="Auto-save Conversations"
          description="Automatically save chat history locally"
        />
        
        <SettingToggle
          checked={settings.soundEffects}
          onCheckedChange={(v) => setSettings(s => ({ ...s, soundEffects: v }))}
          label="Sound Effects"
          description="Play sounds for notifications and actions"
        />
        
        <SettingToggle
          checked={settings.enterToSend}
          onCheckedChange={(v) => setSettings(s => ({ ...s, enterToSend: v }))}
          label="Enter to Send"
          description="Press Enter to send messages (Shift+Enter for new line)"
        />
        
        <SettingSelect
          value={settings.defaultModel}
          onValueChange={(v) => setSettings(s => ({ ...s, defaultModel: v }))}
          label="Default Model"
          description="Choose the default AI model for new chats"
          options={modelOptions}
        />
      </SettingSection>

      <SettingSection
        title="Privacy & Data"
        description="Manage your data and privacy settings"
      >
        <SettingToggle
          checked={settings.anonymousUsage}
          onCheckedChange={(v) => setSettings(s => ({ ...s, anonymousUsage: v }))}
          label="Anonymous Usage Data"
          description="Help improve the app by sharing anonymous usage data"
        />
        
        <SettingRow
          label="Clear Chat History"
          description="Delete all local chat history"
          action={
            <button className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg border border-destructive/30 text-destructive hover:bg-destructive/10 transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2">
              <Trash className="w-4 h-4" />
              Clear
            </button>
          }
        />
        
        <SettingRow
          label="Export Data"
          description="Download all your data in JSON format"
          action={
            <button className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg border border-border text-foreground hover:bg-secondary transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2">
              <Download className="w-4 h-4" />
              Export
            </button>
          }
        />
      </SettingSection>
    </div>
  )
}

function PlaceholderTab({ 
  label, 
  icon: Icon, 
  description 
}: { 
  label: string
  icon: React.ElementType
  description: string
}) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <motion.div 
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="relative mb-6"
      >
        <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl" />
        <div className="relative rounded-full bg-secondary p-5 border border-border">
          <Icon className="w-7 h-7 text-primary" weight="fill" />
        </div>
      </motion.div>
      
      <motion.h3 
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="font-display text-xl font-semibold text-foreground"
      >
        {label} Settings
      </motion.h3>
      
      <motion.p 
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.2 }}
        className="text-sm text-muted-foreground mt-2 max-w-[280px]"
      >
        {description}
      </motion.p>
      
      <motion.div
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.3 }}
        className="mt-6"
      >
        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-full bg-primary/10 text-primary border border-primary/20">
          <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
          Coming Soon
        </span>
      </motion.div>
    </div>
  )
}

export function SettingsModal() {
  const { isOpen, activeTab } = useStore(settingsModalStore)
  const [isMounted, setIsMounted] = React.useState(false)

  React.useEffect(() => {
    setIsMounted(true)
  }, [])

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      closeSettingsModal()
    }
  }

  const dialogVariants: Variants = {
    closed: {
      x: '-50%',
      y: '-45%',
      scale: 0.95,
      opacity: 0,
      transition: { duration: 0.2, ease: [0.4, 0, 0.2, 1] }
    },
    open: {
      x: '-50%',
      y: '-50%',
      scale: 1,
      opacity: 1,
      transition: { duration: 0.3, ease: [0.4, 0, 0.2, 1] }
    },
  }

  const backdropVariants: Variants = {
    closed: { opacity: 0 },
    open: { opacity: 1, transition: { duration: 0.2 } },
  }

  const contentVariants: Variants = {
    closed: { opacity: 0 },
    open: { 
      opacity: 1,
      transition: { staggerChildren: 0.05, delayChildren: 0.1 }
    },
  }

  const itemVariants: Variants = {
    closed: { opacity: 0, y: 8 },
    open: { opacity: 1, y: 0 },
  }

  if (!isMounted) return null

  return (
    <DialogPrimitive.Root open={isOpen} onOpenChange={handleOpenChange}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay asChild forceMount>
          <motion.div
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
            variants={backdropVariants}
            initial="closed"
            animate="open"
            exit="closed"
          />
        </DialogPrimitive.Overlay>
        
        <DialogPrimitive.Content asChild forceMount>
          <motion.div
            className="fixed top-[50%] left-[50%] z-50 w-[95vw] max-w-[640px] max-h-[85vh] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-xl border border-border/50 bg-[#0a0e14] shadow-2xl focus:outline-none"
            variants={dialogVariants}
            initial="closed"
            animate="open"
            exit="closed"
          >
            <motion.div variants={contentVariants} initial="closed" animate="open">
              <motion.div 
                variants={itemVariants}
                className="flex items-center justify-between px-6 py-4 border-b border-border/50"
              >
                <div>
                  <DialogPrimitive.Title className="font-display text-2xl font-semibold tracking-tight text-foreground">
                    Settings
                  </DialogPrimitive.Title>
                  <DialogPrimitive.Description className="sr-only">
                    Manage your application settings
                  </DialogPrimitive.Description>
                </div>
                <DialogPrimitive.Close asChild>
                  <button
                    className="relative p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background"
                    aria-label="Close settings"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </DialogPrimitive.Close>
              </motion.div>

              <motion.div variants={itemVariants} className="px-6 pt-4">
                <TabsPrimitive.Root 
                  value={activeTab} 
                  onValueChange={(value) => setSettingsTab(value as SettingsTab)}
                  className="w-full"
                >
                  <TabsPrimitive.List className="flex gap-1 p-1 rounded-lg bg-secondary/50 w-fit">
                    {tabs.map((tab) => (
                      <TabsPrimitive.Trigger
                        key={tab.id}
                        value={tab.id}
                        className={cn(
                          "inline-flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all duration-200",
                          "text-muted-foreground hover:text-foreground",
                          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                          "data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm"
                        )}
                      >
                        <tab.icon className="w-4 h-4" />
                        <span className="hidden sm:inline">{tab.label}</span>
                      </TabsPrimitive.Trigger>
                    ))}
                  </TabsPrimitive.List>
                </TabsPrimitive.Root>
              </motion.div>

              <motion.div 
                variants={itemVariants}
                className="overflow-y-auto max-h-[calc(85vh-140px)] px-6 pb-6 pt-2"
              >
                <div className="[&_h3]:font-display">
                  {activeTab === 'general' && <GeneralTab />}
                  {activeTab === 'team' && (
                    <PlaceholderTab 
                      label="Team" 
                      icon={Users}
                      description="Invite team members, manage roles, and collaborate on projects."
                    />
                  )}
                  {activeTab === 'billing' && (
                    <PlaceholderTab 
                      label="Billing" 
                      icon={CreditCard}
                      description="Manage your subscription, view invoices, and update payment methods."
                    />
                  )}
                  {activeTab === 'limits' && (
                    <PlaceholderTab 
                      label="Limits" 
                      icon={Gauge}
                      description="Configure rate limits, API quotas, and usage monitoring."
                    />
                  )}
                </div>
              </motion.div>
            </motion.div>
          </motion.div>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  )
}
