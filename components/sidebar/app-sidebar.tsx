"use client"

import * as React from "react"
import {
  BookOpen,
  Bot,
  BotMessageSquare,
  History,
  LifeBuoy,
  Send,
  Settings2,
} from "lucide-react"

import { NavMain } from "@/components/sidebar/nav-main"
import { NavSecondary } from "@/components/sidebar/nav-secondary"
import { NavUser } from "@/components/sidebar/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { chatId, deleteById, getAll, getDb, type ChatHistoryItem } from '@/persistance';
import { chatStore } from "@/lib/stores/chat"
import { useStore } from "@nanostores/react"
import { toast } from "react-toastify"
import { useCallback, useEffect, useState } from "react"
import { Heart } from "@phosphor-icons/react"
import { HistoryItem } from "./HistoryItem"
import { DialogRoot, DialogButton, Dialog, DialogTitle, DialogDescription } from "../ui/OldDialog"
import { binDates } from "./date-binning"
import { anthropicModels, setProvider, ProviderType, googleModels, ollamaModels } from "@/lib/stores/provider"
import { GithubLogo } from "@phosphor-icons/react/dist/ssr"

type DialogContent = { type: 'delete'; item: ChatHistoryItem } | null;

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const [list, setList] = React.useState<ChatHistoryItem[]>([]);
  const [open, setOpen] = useState(true);
  const [dialogContent, setDialogContent] = useState<DialogContent>(null);
  const { showChat } = useStore(chatStore);
  const closeDialog = () => {
    setDialogContent(null);
  };

  const loadEntries = React.useCallback(async () => {
    const db = await getDb();
    if (db) {
      getAll(db)
        .then((list) => list.filter((item) => item.urlId && item.description))
        .then(setList)
        .catch((error) => toast.error(error.message));
    }
  }, []);

  const deleteItem = useCallback(async (event: React.UIEvent, item: ChatHistoryItem) => {
    event.preventDefault();
    const db = await getDb();

    if (db) {
      deleteById(db, item.id)
        .then(() => {
          loadEntries();

          if (chatId.get() === item.id) {
            window.location.pathname = '/';
          }
        })
        .catch((error) => {
          toast.error('Failed to delete conversation');
        });
    }
  }, []);

  useEffect(() => {
    if (open) {
      loadEntries();
    }
  }, [open]);

  useEffect(() => {
    if (!showChat) {
      setOpen(false);
    }
  }, [showChat])

  const data = {
    user: {
      name: "KevIsDev",
      email: "madeby@kevisdev.tech",
      avatar: "/replace-with-your-avatar.jpg",
    },
    navMain: [
      {
        title: "Chat",
        url: "/",
        icon: BotMessageSquare,
        isActive: true,
        items: [
          {
            title: "Starred",
            url: "#",
          },
          {
            title: "Settings",
            url: "#",
          },
        ],
      },
      {
        title: "History",
        icon: History,
        items:  [
          <div key="history-container" className="!bg-background !hover:bg-background !active:bg-background flex items-center h-full w-full justify-between max-w-full">
            {list.length === 0 && <div className="text-muted-foreground text-sm">No previous conversations</div>}
            <DialogRoot open={dialogContent !== null}>
                {binDates(list).map(({ category, items }) => (
                  <div key={category} className="text-foreground !hover:text-foreground mt-4 first:mt-0 space-y-1 truncate">
                    <div className="sticky top-0 z-1 pl-2 pt-2 pb-1 text-xs text-muted-foreground/70 uppercase tracking-wider font-medium">
                      {category}
                    </div>
                    {items.map((item) => (
                      <HistoryItem key={item.id} item={item} onDelete={() => setDialogContent({ type: 'delete', item })} />
                    ))}
                  </div>
                ))}
                <Dialog onBackdrop={closeDialog} onClose={closeDialog}>
                  {dialogContent?.type === 'delete' && (
                    <>
                      <DialogTitle className="font-display text-xl">Delete Chat?</DialogTitle>
                      <DialogDescription asChild>
                        <div className="text-sm text-muted-foreground">
                          <p>
                            You are about to delete <strong className="text-foreground">{dialogContent.item.description}</strong>.
                          </p>
                          <p className="mt-1">Are you sure you want to delete this chat?</p>
                        </div>
                      </DialogDescription>
                      <div className="px-5 pb-4 bg-background flex gap-2 justify-end">
                        <DialogButton type="secondary" onClick={closeDialog}>
                          Cancel
                        </DialogButton>
                        <DialogButton
                          type="danger"
                          onClick={(event) => {
                            deleteItem(event, dialogContent.item);
                            closeDialog();
                          }}
                        >
                          Delete
                        </DialogButton>
                      </div>
                    </>
                  )}
                </Dialog>
              </DialogRoot>
              </div>
        ],
      },
      {
        title: "Models",
        icon: Bot,
        items: [
          <div key="models-container" className="!bg-background !hover:bg-background active:bg-background flex flex-col !w-full h-full items-center justify-center py-2">
            <div className="text-[10px] text-muted-foreground/60 uppercase tracking-wider text-start w-full pl-2 mb-1 font-medium">Anthropic</div>
            {anthropicModels.map((model) => (
              <div
                key={model.id}
                className="!w-full py-1.5 px-2 cursor-pointer text-start text-sm text-foreground/80 hover:text-primary hover:bg-secondary/40 rounded-md transition-colors"
                onClick={() => setProvider({ type: ProviderType.ANTHROPIC, model })}
              >
                {model.displayName}
              </div>
            ))}
            <div className="text-[10px] text-muted-foreground/60 uppercase tracking-wider text-start w-full pl-2 mt-3 mb-1 font-medium">Google</div>
            {googleModels.map((model) => (
              <div
                key={model.id}
                className="!w-full py-1.5 px-2 cursor-pointer text-start text-sm text-foreground/80 hover:text-primary hover:bg-secondary/40 rounded-md transition-colors"
                onClick={() => setProvider({ type: ProviderType.GOOGLE, model })}
              >
                {model.displayName}
              </div>
            ))}
            <div className="text-[10px] text-muted-foreground/60 uppercase tracking-wider text-start w-full pl-2 mt-3 mb-1 font-medium">Ollama</div>
            {ollamaModels.map((model) => (
              <div
                key={model.id}
                className="!w-full py-1.5 px-2 cursor-pointer text-start text-sm text-foreground/80 hover:text-primary hover:bg-secondary/40 rounded-md transition-colors"
                onClick={() => setProvider({ type: ProviderType.OLLAMA, model })}
              >
                {model.displayName}
              </div>
            ))}
          </div>,
        ],
      },
      {
        title: "Documentation",
        url: "#",
        icon: BookOpen,
        items: [
          { title: "Introduction", url: "#" },
          { title: "Get Started", url: "#" },
          { title: "Tutorials", url: "#" },
          { title: "Changelog", url: "#" },
        ],
      },
      {
        title: "Settings",
        url: "#",
        icon: Settings2,
        items: [
          { title: "General", url: "#" },
          { title: "Team", url: "#" },
          { title: "Billing", url: "#" },
          { title: "Limits", url: "#" },
        ],
      },
    ],
    navSecondary: [
      {
        title: "Github",
        url: "https://github.com/xKevIsDev/",
        target: "_blank",
        icon: GithubLogo,
      },
      {
        title: "Sponsor",
        url: "https://github.com/sponsors/xKevIsDev/",
        target: "_blank",
        icon: Heart,
      },
      {
        title: "Support",
        url: "#",
        icon: LifeBuoy,
      },
      {
        title: "Feedback",
        url: "#",
        icon: Send,
      },
    ],
  }

  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader className="border-b border-border/30 pb-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="/" className="flex items-center gap-2">
                <h1 className="font-display text-2xl font-semibold tracking-tight">
                  <span className="text-foreground">Bolt</span>
                  <span className="text-primary">.</span>
                  <span className="text-foreground/80">Next</span>
                </h1>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter className="border-t border-border/30 pt-4">
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  )
}
