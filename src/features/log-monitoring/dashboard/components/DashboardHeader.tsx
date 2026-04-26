import { Badge } from "@/components/ui/badge"
import type { Log } from "@/features/log-monitoring/sidebar"
import {
  Bug,
  Calendar,
  CircleAlert,
  ShieldAlert,
} from "lucide-react"

function getStatusBadgeClass(log: Log) {
  if (log.status?.toLowerCase() === "failure") {
    return "border-transparent bg-[#fff0f0] text-[#ef4444]"
  }

  if (log.status?.toLowerCase() === "success") {
    return "border-transparent bg-[#ecfdf3] text-[#16a34a]"
  }

  return "border-transparent bg-[#eff6ff] text-[#2563eb]"
}

function formatLabel(value?: string) {
  if (!value) {
    return "--"
  }

  return value
    .split(/[_-\s]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ")
}

interface DashboardHeaderProps {
  log: Log
}

export function DashboardHeader({ log }: DashboardHeaderProps) {
  const tags = [
    { icon: ShieldAlert, label: `Priority: ${formatLabel(log.priority)}` },
    { icon: CircleAlert, label: `Error Code: ${log.errorCode || "--"}` },
    { icon: Calendar, label: `Updated: ${log.lastUpdateTimestamp || "--"}` },
  ] as const

  return (
    <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
      <div className="min-w-0 space-y-4">
        {/* <Button
          variant="link"
          className="h-auto justify-start gap-2 p-0 text-sm font-medium text-[#4f46e5] hover:text-[#4338ca]"
        >
          <ArrowLeft className="size-4" />
          Back to Crash Logs
        </Button> */}

        <div className="flex items-start gap-3 sm:gap-4">
          <div className="flex size-11 shrink-0 items-center justify-center rounded-full bg-[#fff1f1] text-[#ef4444] sm:size-12">
            <Bug className="size-6" />
          </div>

          <div className="min-w-0 space-y-3">
            <div>
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="min-w-0 text-[1.6rem] font-semibold tracking-tight text-slate-900 sm:text-[2rem]">
                  {log.name}
                </h1>
                <Badge variant="outline" className={getStatusBadgeClass(log)}>
                  {formatLabel(log.status || log.severity)}
                </Badge>
              </div>
              <p className="mt-1 text-sm break-all text-slate-500 sm:text-base">
                {log.package}
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              {tags.map(({ icon: Icon, label }) => (
                <Badge
                  key={label}
                  variant="outline"
                  className="gap-2 rounded-lg border-[#e6ebf2] bg-[#fbfcfe] px-3 py-1.5 text-xs font-normal text-slate-600"
                >
                  <Icon className="size-3.5 text-slate-500" />
                  {label}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* <div className="flex flex-wrap gap-3">
        <Button className="h-10 rounded-xl bg-[#4f46e5] px-4 text-white hover:bg-[#4338ca] sm:px-5">
          <Share2 className="size-4" />
          Share
        </Button>
        <Button
          variant="outline"
          className="h-10 rounded-xl border-[#e3e8f2] bg-white px-4 text-slate-600 sm:px-5"
        >
          <Check className="size-4 text-slate-500" />
          Mark as Resolved
        </Button>
      </div> */}
    </div>
  )
}
