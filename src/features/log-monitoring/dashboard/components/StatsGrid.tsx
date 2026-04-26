import { Card } from "@/components/ui/card"
import type { Log } from "@/features/log-monitoring/sidebar"
import { Activity, Calendar, RotateCcw, TriangleAlert } from "lucide-react"

interface StatsGridProps {
  log: Log
}

export function StatsGrid({ log }: StatsGridProps) {
  const statCards = [
    {
      title: "Error Count",
      value: `${log.occurrences}`,
      subtext: `Status: ${log.status || "--"}`,
      icon: TriangleAlert,
      tone: "text-[#16a34a]",
    },
    {
      title: "Consecutive Failures",
      value: `${log.consecutiveFailureCount ?? 0}`,
      subtext: `Desired Count: ${log.desiredCount ?? 0}`,
      icon: RotateCcw,
      tone: "text-[#16a34a]",
    },
    {
      title: "Last Updated",
      value: log.lastUpdateTimestamp || "--",
      subtext: `Escalation Level: ${log.escalationLevel ?? 0}`,
      icon: Calendar,
      tone: "text-slate-500",
    },
    {
      title: "Last Seen",
      value: log.successFailureUpdatedTime || log.lastSeen || "--",
      subtext: `Last Escalation: ${log.lastEscalationDatetime || "--"}`,
      icon: Activity,
      tone: "text-slate-500",
    },
  ] as const

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {statCards.map(({ title, value, subtext, icon: Icon, tone }) => (
        <Card
          key={title}
          className="gap-0 border-[#e7ebf3] p-4 shadow-[0_1px_2px_rgba(16,24,40,0.04)] transition-all duration-200 ease-out hover:-translate-y-1 hover:shadow-[0_14px_34px_rgba(15,23,42,0.10)]"
        >
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-sm text-slate-500">{title}</p>
              <p
                className={`mt-2 font-semibold tracking-tight text-slate-900 ${
                  title.includes("Updated") || title === "Last Seen"
                    ? "text-base sm:text-lg"
                    : "text-[1.6rem] sm:text-[1.9rem]"
                }`}
              >
                {value}
              </p>
            </div>
            <div className="rounded-lg bg-[#f4f3ff] p-2 text-[#6366f1]">
              <Icon className="size-5" />
            </div>
          </div>
          <p className={`mt-2 text-xs ${tone}`}>{subtext}</p>
        </Card>
      ))}
    </div>
  )
}
