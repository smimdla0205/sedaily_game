import { ReactNode } from "react"

interface StatePageProps {
  icon: ReactNode
  title: string
  description: string
  children?: ReactNode
  className?: string
}

export function StatePage({ icon, title, description, children, className = "" }: StatePageProps) {
  return (
    <div className={`min-h-[60vh] flex items-center justify-center px-4 ${className}`}>
      <div className="max-w-md w-full text-center space-y-6">
        <div className="flex justify-center">
          <div className="rounded-full p-3" style={{ backgroundColor: "rgba(59, 130, 246, 0.1)" }}>
            {icon}
          </div>
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl font-bold korean-heading">{title}</h1>
          <p className="text-muted-foreground korean-text">{description}</p>
        </div>

        {children && <div className="flex flex-col sm:flex-row gap-3 justify-center">
          {children}
        </div>}
      </div>
    </div>
  )
}
