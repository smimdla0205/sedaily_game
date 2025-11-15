import { ReactNode } from "react"
import { SedailyHeader } from "./SedailyHeader"
import { Footer } from "./Footer"

interface PageShellProps {
  children: ReactNode
  hideHeader?: boolean
  hideFooter?: boolean
}

export function PageShell({ children, hideHeader = false, hideFooter = false }: PageShellProps) {
  return (
    <div className="flex flex-col min-h-screen">
      {!hideHeader && <SedailyHeader />}
      <main className="flex-1">
        {children}
      </main>
      {!hideFooter && <Footer />}
    </div>
  )
}
