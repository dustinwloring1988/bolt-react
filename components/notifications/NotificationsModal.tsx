"use client"

import * as React from "react"
import { useStore } from "@nanostores/react"
import * as DialogPrimitive from "@radix-ui/react-dialog"
import { motion, type Variants } from "framer-motion"
import { X, Bell, User } from "lucide-react"
import { notificationsModalStore, closeNotificationsModal } from "@/lib/stores/notifications-modal"

// Mock notification data - will add more later
const MOCK_NOTIFICATIONS = [
  {
    id: "1",
    title: "User Created",
    timestamp: new Date().toLocaleString("en-US", {
      dateStyle: "medium",
      timeStyle: "short",
    }),
    icon: User,
  },
]

export function NotificationsModal() {
  const { isOpen } = useStore(notificationsModalStore)
  const [isMounted, setIsMounted] = React.useState(false)

  React.useEffect(() => {
    setIsMounted(true)
  }, [])

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      closeNotificationsModal()
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
            className="fixed top-[50%] left-[50%] z-50 w-[95vw] max-w-[480px] max-h-[85vh] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-xl border border-border/50 bg-[#0a0e14] shadow-2xl focus:outline-none"
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
                <div className="flex items-center gap-2">
                  <Bell className="w-5 h-5 text-primary" />
                  <DialogPrimitive.Title className="font-display text-2xl font-semibold tracking-tight text-foreground">
                    Notifications
                  </DialogPrimitive.Title>
                </div>
                <DialogPrimitive.Close asChild>
                  <button
                    className="relative p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background"
                    aria-label="Close notifications"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </DialogPrimitive.Close>
              </motion.div>

              <motion.div 
                variants={itemVariants}
                className="overflow-y-auto max-h-[calc(85vh-140px)] px-6 py-4"
              >
                <div className="space-y-3">
                  {MOCK_NOTIFICATIONS.map((notification) => {
                    const Icon = notification.icon
                    return (
                      <div
                        key={notification.id}
                        className="flex items-start gap-3 rounded-lg border border-border/50 bg-secondary/30 p-4"
                      >
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                          <Icon className="h-4 w-4 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-foreground">
                            {notification.title}
                          </p>
                          <p className="text-sm text-muted-foreground mt-0.5">
                            {notification.timestamp}
                          </p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </motion.div>
            </motion.div>
          </motion.div>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  )
}
