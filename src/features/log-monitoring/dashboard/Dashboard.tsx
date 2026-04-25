import { Card, CardContent } from "@/components/ui/card"
import type { Log } from "@/features/log-monitoring/sidebar"

import { CrashTrend } from "./components/CrashTrend"
import { DashboardHeader } from "./components/DashboardHeader"
import { DashboardToolbar } from "./components/DashboardToolbar"
import { OccurrencesAndDetails } from "./components/OccurrencesAndDetails"
import { StackTraceAndAdditionalInfo } from "./components/StackTraceAndAdditionalInfo"
import { StatsGrid } from "./components/StatsGrid"

interface DashboardProps {
  log?: Log
  logs?: Log[]
}

export default function Dashboard({ log, logs = [] }: DashboardProps) {
  const activeLog = log ?? logs[0]

  if (!activeLog) {
    return (
      <div className="min-h-full w-full bg-[#f6f8fc] p-3 sm:p-4 lg:p-6">
        <Card className="border-[#e7ebf3]">
          <CardContent className="p-6 text-sm text-slate-500">
            No service data available.
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-full w-full bg-[#f6f8fc] p-3 sm:p-4 lg:p-6">
      <div className="flex w-full min-w-0 flex-col gap-4">
        <DashboardToolbar />

        <Card className="w-full min-w-0 gap-0 rounded-2xl border-[#e7ebf3] shadow-[0_4px_14px_rgba(15,23,42,0.03)]">
          <CardContent className="p-4 sm:p-5 lg:p-6">
            <div className="flex flex-col gap-6">
              <DashboardHeader log={activeLog} />
              <StatsGrid log={activeLog} />
              <CrashTrend log={activeLog} />
              <OccurrencesAndDetails log={activeLog} logs={logs} />
              <StackTraceAndAdditionalInfo log={activeLog} />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
