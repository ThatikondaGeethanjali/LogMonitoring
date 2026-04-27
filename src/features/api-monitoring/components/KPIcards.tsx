import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { formatPercent } from "@/features/api-monitoring/utils"
import type { DashboardSummary } from "@/features/api-monitoring/types"
import { Activity, AlertTriangle, BarChart3, ServerCrash } from "lucide-react"

interface KPIcardsProps {
  summary: DashboardSummary
}

export function KPIcards({ summary }: KPIcardsProps) {
  const cards = [
    {
      label: "Total APIs",
      value: summary.totalApis.toLocaleString(),
      helper: "Monitored endpoints",
      icon: Activity,
      tone: "text-sky-700 bg-sky-50 border-sky-200",
    },
    {
      label: "Active Failures",
      value: summary.activeFailures.toLocaleString(),
      helper: "Currently failing",
      icon: ServerCrash,
      tone:
        summary.activeFailures > 0
          ? "text-red-700 bg-red-50 border-red-200"
          : "text-emerald-700 bg-emerald-50 border-emerald-200",
    },
    {
      label: "Average Failure Rate",
      value: formatPercent(summary.averageFailureRates.tenMinutes),
      helper: `${formatPercent(summary.averageFailureRates.oneMinute)} 1m / ${formatPercent(
        summary.averageFailureRates.oneHour
      )} 1h`,
      icon: BarChart3,
      tone: "text-amber-700 bg-amber-50 border-amber-200",
    },
  ]

  return (
    <div className="grid gap-3 lg:grid-cols-[repeat(3,minmax(0,1fr))_1.35fr]">
      {cards.map((card) => {
        const Icon = card.icon

        return (
          <Card key={card.label} className="dashboard-card gap-3 rounded-lg">
            <CardHeader className="flex-row items-start justify-between px-4 pt-4">
              <div>
                <CardTitle className="text-sm text-muted-foreground">
                  {card.label}
                </CardTitle>
                <div className="mt-2 text-3xl font-semibold tracking-normal">
                  {card.value}
                </div>
              </div>
              <div className={cn("rounded-md border p-2", card.tone)}>
                <Icon className="size-4" aria-hidden="true" />
              </div>
            </CardHeader>
            <CardContent className="px-4 pb-4 text-sm text-muted-foreground">
              {card.helper}
            </CardContent>
          </Card>
        )
      })}

      <Card className="dashboard-card gap-3 rounded-lg">
        <CardHeader className="px-4 pt-4">
          <div className="flex items-center justify-between gap-3">
            <CardTitle className="text-sm text-muted-foreground">
              APIs With Highest Failures
            </CardTitle>
            <AlertTriangle className="size-4 text-red-600" aria-hidden="true" />
          </div>
        </CardHeader>
        <CardContent className="space-y-3 px-4 pb-4">
          {summary.highestFailures.length === 0 ? (
            <p className="text-sm text-muted-foreground">No failures found.</p>
          ) : (
            summary.highestFailures.map((api) => (
              <div
                key={api.apiName}
                className="pressable grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 rounded-md px-2 py-1.5 text-sm transition-colors hover:bg-zinc-50"
              >
                <span className="truncate font-medium">{api.apiName}</span>
                <span
                  className={cn(
                    "rounded-md px-2 py-1 text-xs font-semibold",
                    api.failureRate10m > 50
                      ? "bg-red-100 text-red-700"
                      : "bg-zinc-100 text-zinc-700"
                  )}
                >
                  {api.failureCount} fails
                </span>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  )
}
