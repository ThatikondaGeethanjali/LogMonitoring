import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { ApiDetailsData } from "@/features/api-monitoring/types"
import { formatDateTime } from "@/features/api-monitoring/utils"
import { Activity, CalendarClock, TimerReset } from "lucide-react"
import { useMemo } from "react"
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"

interface ApiDetailsProps {
  details: ApiDetailsData | null
  isLoading: boolean
}

export function ApiDetails({ details, isLoading }: ApiDetailsProps) {
  const statusTimeline = useMemo(
    () =>
      details?.statusHistory.map((point) => ({
        ...point,
        statusScore: point.status === "fail" ? 1 : 0,
      })) ?? [],
    [details?.statusHistory]
  )

  return (
    <Card className="dashboard-card rounded-lg">
      <CardHeader className="px-4 pt-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <CardTitle>API Drill-Down</CardTitle>
            <p className="mt-1 text-sm font-medium text-muted-foreground">
              {details?.apiName ?? "Select an API"}
            </p>
          </div>
          {isLoading ? (
            <span className="rounded-md bg-zinc-100 px-2 py-1 text-xs font-medium text-zinc-600">
              Loading
            </span>
          ) : null}
        </div>
      </CardHeader>
      <CardContent className="space-y-4 px-4 pb-4">
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="pressable rounded-lg border bg-white/80 p-3 shadow-sm transition-all hover:-translate-y-0.5 hover:border-sky-200">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <CalendarClock className="size-4" aria-hidden="true" />
              First Failure
            </div>
            <div className="mt-2 font-semibold">
              {formatDateTime(details?.firstFailureTime)}
            </div>
          </div>
          <div className="pressable rounded-lg border bg-white/80 p-3 shadow-sm transition-all hover:-translate-y-0.5 hover:border-sky-200">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <TimerReset className="size-4" aria-hidden="true" />
              Last Failure
            </div>
            <div className="mt-2 font-semibold">
              {formatDateTime(details?.lastFailureTime)}
            </div>
          </div>
        </div>

        <div className="grid gap-4 xl:grid-cols-2">
          <div>
            <div className="mb-2 flex items-center gap-2 text-sm font-semibold">
              <Activity className="size-4 text-red-600" aria-hidden="true" />
              Failure Timeline
            </div>
            <div className="h-[220px] rounded-lg border bg-white/70 p-2 shadow-inner">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={statusTimeline} margin={{ right: 16, left: -22 }}>
                  <CartesianGrid stroke="#e4e4e7" strokeDasharray="3 3" />
                  <XAxis dataKey="checkedAt" tickLine={false} fontSize={12} />
                  <YAxis
                    domain={[0, 1]}
                    ticks={[0, 1]}
                    tickFormatter={(value) =>
                      Number(value) === 1 ? "Fail" : "OK"
                    }
                    tickLine={false}
                    fontSize={12}
                  />
                  <Tooltip
                    formatter={(value) => [
                      Number(value) === 1 ? "Fail" : "Success",
                      "Status",
                    ]}
                    contentStyle={{
                      borderRadius: 8,
                      borderColor: "#e4e4e7",
                    }}
                  />
                  <Line
                    type="stepAfter"
                    dataKey="statusScore"
                    stroke="#dc2626"
                    strokeWidth={2}
                    dot={{ r: 3 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div>
            <div className="mb-2 flex items-center gap-2 text-sm font-semibold">
              <TimerReset className="size-4 text-sky-600" aria-hidden="true" />
              Response Time Trend
            </div>
            <div className="h-[220px] rounded-lg border bg-white/70 p-2 shadow-inner">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={details?.responseTimeHistory ?? []}
                  margin={{ right: 16, left: -12 }}
                >
                  <CartesianGrid stroke="#e4e4e7" strokeDasharray="3 3" />
                  <XAxis dataKey="checkedAt" tickLine={false} fontSize={12} />
                  <YAxis
                    tickFormatter={(value) => `${value}ms`}
                    tickLine={false}
                    fontSize={12}
                  />
                  <Tooltip
                    formatter={(value) => [`${value}ms`, "Response time"]}
                    contentStyle={{
                      borderRadius: 8,
                      borderColor: "#e4e4e7",
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="responseTimeMs"
                    stroke="#0284c7"
                    strokeWidth={2}
                    dot={{ r: 3 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
