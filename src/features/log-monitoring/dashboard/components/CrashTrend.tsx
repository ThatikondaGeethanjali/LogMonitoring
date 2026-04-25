import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { Log } from "@/features/log-monitoring/sidebar"

import { DashboardCard } from "./DashboardCard"

interface CrashTrendProps {
  log: Log
}

type MetricPoint = {
  label: string
  value: number
}

function MetricChart({
  title,
  points,
}: {
  title: string
  points: MetricPoint[]
}) {
  const chartHeight = 180
  const chartWidth = 760
  const maxValue = Math.max(...points.map((point) => point.value), 1)
  const stepX = chartWidth / Math.max(points.length - 1, 1)
  const polylinePoints = points
    .map((item, index) => {
      const x = index * stepX
      const y = chartHeight - (item.value / maxValue) * (chartHeight - 10)
      return `${x},${y}`
    })
    .join(" ")
  const areaPoints = `0,${chartHeight} ${polylinePoints} ${chartWidth},${chartHeight}`
  const highlightedPoint = points.reduce<
    (MetricPoint & { index: number }) | null
  >((current, point, index) => {
    if (!current || point.value >= current.value) {
      return { ...point, index }
    }

    return current
  }, null) ?? { label: "--", value: 0, index: 0 }

  const tooltipLeft = `${Math.min(
    58,
    Math.max(
      10,
      (highlightedPoint.index / Math.max(points.length - 1, 1)) * 100 - 10
    )
  )}%`

  return (
    <div className="w-full min-w-0">
      <div className="relative">
        <Card
          className="absolute top-3 hidden gap-0 rounded-xl border-[#e7ebf3] px-4 py-3 text-xs shadow-[0_10px_24px_rgba(15,23,42,0.08)] sm:block"
          style={{ left: tooltipLeft }}
        >
          <p className="font-medium text-slate-700">{highlightedPoint.label}</p>
          <div className="mt-2 flex items-center justify-between gap-8 text-slate-500">
            <span>{title}</span>
            <span className="font-semibold text-slate-800">
              {highlightedPoint.value}
            </span>
          </div>
        </Card>

        <div className="grid grid-cols-[34px_1fr] gap-2 pt-6 sm:grid-cols-[56px_1fr] sm:gap-4 sm:pt-9">
          <div className="space-y-[21px] pt-2 text-right text-[10px] text-slate-400 sm:text-xs">
            {[
              maxValue,
              Math.round((maxValue * 3) / 4),
              Math.round(maxValue / 2),
              Math.round(maxValue / 4),
              0,
            ].map((tick, index) => (
              <div key={`${tick}-${index}`}>{tick}</div>
            ))}
          </div>

          <div>
            <div className="relative h-[200px] sm:h-[220px]">
              <div className="absolute inset-0 flex flex-col justify-between">
                {Array.from({ length: 5 }).map((_, index) => (
                  <div
                    key={index}
                    className="border-t border-dashed border-[#e9edf5]"
                  />
                ))}
              </div>

              <svg
                viewBox={`0 0 ${chartWidth} ${chartHeight}`}
                className="absolute inset-x-0 bottom-0 h-[172px] w-full sm:h-[190px]"
                preserveAspectRatio="none"
              >
                <defs>
                  <linearGradient
                    id={`trend-fill-${title}`}
                    x1="0"
                    x2="0"
                    y1="0"
                    y2="1"
                  >
                    <stop offset="0%" stopColor="#4f46e5" stopOpacity="0.22" />
                    <stop
                      offset="100%"
                      stopColor="#4f46e5"
                      stopOpacity="0.03"
                    />
                  </linearGradient>
                </defs>

                <polygon
                  points={areaPoints}
                  fill={`url(#trend-fill-${title})`}
                />
                <polyline
                  points={polylinePoints}
                  fill="none"
                  stroke="#4338ca"
                  strokeWidth="2.5"
                  strokeLinejoin="round"
                  strokeLinecap="round"
                />

                {points.map((item, index) => {
                  const cx = index * stepX
                  const cy =
                    chartHeight - (item.value / maxValue) * (chartHeight - 10)
                  const active = item.label === highlightedPoint.label

                  return (
                    <g key={item.label}>
                      <circle
                        cx={cx}
                        cy={cy}
                        r={active ? 6 : 4}
                        fill="#fff"
                        stroke="#4338ca"
                        strokeWidth={active ? 3 : 2}
                      />
                    </g>
                  )
                })}
              </svg>
            </div>

            <div className="mt-2 grid grid-cols-5 text-center text-[10px] text-slate-500 sm:text-xs">
              {points.map((item) => (
                <div key={item.label}>{item.label}</div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export function CrashTrend({ log }: CrashTrendProps) {
  const countMetrics: MetricPoint[] = [
    { label: "Errors", value: log.occurrences },
    { label: "Failures", value: log.consecutiveFailureCount ?? 0 },
    { label: "Esc Count", value: log.escalationCount ?? 0 },
    { label: "Esc Level", value: log.escalationLevel ?? 0 },
    { label: "Desired", value: log.desiredCount ?? 0 },
  ]
  const thresholdMetrics: MetricPoint[] = [
    { label: "T1", value: log.thresholdTime1 ?? 0 },
    { label: "T2", value: log.thresholdTime2 ?? 0 },
    { label: "T3", value: log.thresholdTime3 ?? 0 },
    { label: "T4", value: log.thresholdTime4 ?? 0 },
    { label: "Errors", value: log.occurrences },
  ]
  const escalationMetrics: MetricPoint[] = [
    { label: "Level", value: log.escalationLevel ?? 0 },
    { label: "Count", value: log.escalationCount ?? 0 },
    { label: "Desired", value: log.desiredCount ?? 0 },
    { label: "Fail", value: log.consecutiveFailureCount ?? 0 },
    { label: "Error", value: log.occurrences },
  ]

  return (
    <DashboardCard title="Service Metrics">
      <Tabs defaultValue="counts" className="mt-4">
        <div className="flex justify-end">
          <TabsList className="border border-[#dde3ee] bg-white">
            <TabsTrigger value="counts" className="text-slate-500">
              Counts
            </TabsTrigger>
            <TabsTrigger
              value="thresholds"
              className="data-[state=active]:bg-[#eef2ff] data-[state=active]:text-[#4338ca]"
            >
              Thresholds
            </TabsTrigger>
            <TabsTrigger value="escalation" className="text-slate-500">
              Escalation
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="counts" className="mt-4">
          <MetricChart title="Counts" points={countMetrics} />
        </TabsContent>

        <TabsContent value="thresholds" className="mt-4">
          <MetricChart title="Thresholds" points={thresholdMetrics} />
        </TabsContent>

        <TabsContent value="escalation" className="mt-4">
          <MetricChart title="Escalation" points={escalationMetrics} />
        </TabsContent>
      </Tabs>
    </DashboardCard>
  )
}
