import type { ReactNode } from "react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"

type DashboardCardProps = {
  title: string
  children: ReactNode
  className?: string
}

export function DashboardCard({
  title,
  children,
  className,
}: DashboardCardProps) {
  return (
    <Card
      className={cn(
        "gap-0 border-[#e7ebf3] shadow-[0_1px_2px_rgba(16,24,40,0.04)]",
        className
      )}
    >
      <CardHeader className="px-4 pt-4">
        <CardTitle className="text-sm font-semibold text-slate-800">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="px-4 pb-4">{children}</CardContent>
    </Card>
  )
}
