import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import { SidebarInset } from '@/components/ui/sidebar'
import './globals.css'
import { AppSidebar } from '@/components/sidebar/app-sidebar'
import '@xterm/xterm/css/xterm.css';
import { Toaster } from '@/components/ui/toaster'
import BeautifulBackground from './background'

export const metadata = {
  title: 'BoltNext',
  description: 'Generate full stack apps using AI',
  icons: {
    icon: '/faviconround.ico',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body className="font-body antialiased">
        <SidebarProvider defaultOpen={true} className='max-h-[100vh]'>
          <AppSidebar />
          <SidebarInset>
            <BeautifulBackground />
            <SidebarTrigger className='' />
            <div className="text-foreground relative overflow-hidden h-full">
              <main className="mx-auto px-3 w-full relative h-full overflow-auto elegant-scrollbar">
                {children}
              </main>
            </div>
          </SidebarInset>
          <Toaster />
        </SidebarProvider>
      </body>
    </html>
  )
}
