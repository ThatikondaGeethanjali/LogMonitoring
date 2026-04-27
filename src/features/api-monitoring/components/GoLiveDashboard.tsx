import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FailureChart } from "@/features/api-monitoring/components/FailureChart"
import { IncidentTable } from "@/features/api-monitoring/components/IncidentTable"
import { useApiMonitoring } from "@/features/api-monitoring/hooks"
import { getServiceName, formatServiceName } from "@/features/api-monitoring/utils"
import { cn } from "@/lib/utils"
import {
  AlertTriangle,
  CheckCircle2,
  Gauge,
  RadioTower,
  RefreshCw,
  ShieldAlert,
  TimerReset,
} from "lucide-react"
import { useMemo } from "react"

export function GoLiveDashboard() {
  const {
    error,
    isLoading,
    lastUpdated,
    rawDashboardData,
    refreshDashboard,
  } = useApiMonitoring("")

  const liveMetrics = useMemo(() => {
    const totalApis = rawDashboardData.statuses.length
    const activeFailures = rawDashboardData.statuses.filter(
      (status) => status.currentStatus === "fail"
    ).length
    const averageFailureRate =
      rawDashboardData.failureFeatures.length > 0
        ? rawDashboardData.failureFeatures.reduce(
            (total, feature) => total + feature.failureRate10m,
            0
          ) / rawDashboardData.failureFeatures.length
        : 0
    const responseTimes = rawDashboardData.statuses
      .map((status) => status.responseTimeMs)
      .filter((value): value is number => value !== undefined)
    const averageResponseTime =
      responseTimes.length > 0
        ? responseTimes.reduce((total, value) => total + value, 0) /
          responseTimes.length
        : 0
    const openIncidents = rawDashboardData.incidents.filter(
      (incident) => !incident.failureEndTime
    ).length
    const readinessScore = Math.max(
      0,
      Math.round(
        100 -
          activeFailures * 18 -
          averageFailureRate * 0.7 -
          openIncidents * 8
      )
    )
    const blockers = rawDashboardData.failureFeatures
      .filter(
        (feature) =>
          feature.failureRate10m > 50 || feature.consecutiveFailures > 5
      )
      .sort((first, second) => second.failureRate10m - first.failureRate10m)

    return {
      activeFailures,
      averageFailureRate,
      averageResponseTime,
      blockers,
      openIncidents,
      readinessScore,
      totalApis,
    }
  }, [
    rawDashboardData.failureFeatures,
    rawDashboardData.incidents,
    rawDashboardData.statuses,
  ])

  const serviceHealth = useMemo(() => {
    const services = new Map<
      string,
      { total: number; failing: number; failureCount: number }
    >()
    const failureCountByApi = new Map(
      rawDashboardData.failureFeatures.map((feature) => [
        feature.apiName,
        feature.failureCount,
      ])
    )

    rawDashboardData.statuses.forEach((status) => {
      const serviceName = getServiceName(status.apiName)
      const current = services.get(serviceName) ?? {
        total: 0,
        failing: 0,
        failureCount: 0,
      }

      current.total += 1
      current.failing += status.currentStatus === "fail" ? 1 : 0
      current.failureCount += failureCountByApi.get(status.apiName) ?? 0
      services.set(serviceName, current)
    })

    return Array.from(services.entries())
      .map(([serviceName, service]) => ({ serviceName, ...service }))
      .sort((first, second) => second.failureCount - first.failureCount)
  }, [rawDashboardData.failureFeatures, rawDashboardData.statuses])

  const readinessTone =
    liveMetrics.readinessScore >= 90
      ? "text-emerald-700 bg-emerald-50 border-emerald-200"
      : liveMetrics.readinessScore >= 70
        ? "text-amber-700 bg-amber-50 border-amber-200"
        : "text-red-700 bg-red-50 border-red-200"

  return (
    <main className="dashboard-surface h-full overflow-auto">
      <div className="mx-auto flex w-full max-w-[1500px] flex-col gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <header className="glass-panel flex flex-col gap-4 rounded-xl p-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700">
              <span className="live-dot" />
              Go live command center
            </div>
            <h1 className="text-2xl font-semibold tracking-normal text-zinc-950 sm:text-3xl">
              Go Live Insights
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Production readiness and live operational health
            </p>
          </div>

          <Button
            type="button"
            variant="outline"
            className="pressable h-10 gap-2 self-start border-emerald-200 bg-white shadow-sm hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-700 lg:self-auto"
            onClick={() => void refreshDashboard()}
            disabled={isLoading}
          >
            <RefreshCw
              className={isLoading ? "size-4 animate-spin" : "size-4"}
              aria-hidden="true"
            />
            Refresh
          </Button>
        </header>

        <div className="flex flex-wrap items-center justify-between gap-2 text-sm text-muted-foreground">
          <span>{error ?? "Connected to monitoring data source."}</span>
          <span>
            Last updated{" "}
            {lastUpdated
              ? new Intl.DateTimeFormat(undefined, {
                  hour: "2-digit",
                  minute: "2-digit",
                  second: "2-digit",
                }).format(lastUpdated)
              : "pending"}
          </span>
        </div>

        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          <Card className="dashboard-card gap-3 rounded-lg">
            <CardHeader className="flex-row items-start justify-between px-4 pt-4">
              <div>
                <CardTitle className="text-sm text-muted-foreground">
                  Readiness Score
                </CardTitle>
                <div className="mt-2 text-3xl font-semibold">
                  {liveMetrics.readinessScore}
                </div>
              </div>
              <div className={cn("rounded-md border p-2", readinessTone)}>
                <Gauge className="size-4" aria-hidden="true" />
              </div>
            </CardHeader>
            <CardContent className="px-4 pb-4 text-sm text-muted-foreground">
              Based on failures, incidents, and rates
            </CardContent>
          </Card>

          <MetricCard
            icon={RadioTower}
            label="Live APIs"
            value={liveMetrics.totalApis.toLocaleString()}
            helper="Endpoints currently tracked"
            tone="border-sky-200 bg-sky-50 text-sky-700"
          />
          <MetricCard
            icon={ShieldAlert}
            label="Go Live Blockers"
            value={liveMetrics.blockers.length.toLocaleString()}
            helper="High failure rate or long streak"
            tone={
              liveMetrics.blockers.length > 0
                ? "border-red-200 bg-red-50 text-red-700"
                : "border-emerald-200 bg-emerald-50 text-emerald-700"
            }
          />
          <MetricCard
            icon={TimerReset}
            label="Avg Response"
            value={`${Math.round(liveMetrics.averageResponseTime)}ms`}
            helper={`${liveMetrics.openIncidents} open incidents`}
            tone="border-violet-200 bg-violet-50 text-violet-700"
          />
        </div>

        <div className="grid gap-4 xl:grid-cols-[minmax(0,1.15fr)_minmax(360px,0.85fr)]">
          <FailureChart data={rawDashboardData.failureTimeseries} />

          <Card className="dashboard-card rounded-lg">
            <CardHeader className="px-4 pt-4">
              <CardTitle>Go Live Blockers</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 px-4 pb-4">
              {liveMetrics.blockers.length === 0 ? (
                <div className="flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-700">
                  <CheckCircle2 className="size-4" aria-hidden="true" />
                  No active blockers detected
                </div>
              ) : (
                liveMetrics.blockers.map((blocker) => (
                  <div
                    key={blocker.apiName}
                    className="pressable rounded-lg border border-red-200 bg-red-50 p-3 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-[0_14px_30px_rgb(220_38_38/0.12)]"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <div className="truncate text-sm font-semibold text-red-950">
                          {blocker.apiName}
                        </div>
                        <div className="mt-1 text-xs text-red-700">
                          {blocker.consecutiveFailures} consecutive failures
                        </div>
                      </div>
                      <Badge
                        variant="outline"
                        className="border-red-200 bg-white text-red-700"
                      >
                        {Math.round(blocker.failureRate10m)}%
                      </Badge>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-4 xl:grid-cols-[minmax(360px,0.8fr)_minmax(0,1.2fr)]">
          <Card className="dashboard-card rounded-lg">
            <CardHeader className="px-4 pt-4">
              <CardTitle>Service Health</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 px-4 pb-4">
              {serviceHealth.map((service) => (
                <div
                  key={service.serviceName}
                  className="pressable grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 rounded-lg border bg-white/80 p-3 shadow-sm transition-all hover:-translate-y-0.5 hover:border-sky-200 hover:shadow-md"
                >
                  <div className="min-w-0">
                    <div className="truncate text-sm font-semibold">
                      {formatServiceName(service.serviceName)}
                    </div>
                    <div className="mt-1 text-xs text-muted-foreground">
                      {service.total} APIs, {service.failureCount} failures
                    </div>
                  </div>
                  <Badge
                    variant="outline"
                    className={cn(
                      service.failing > 0
                        ? "border-red-200 bg-red-50 text-red-700"
                        : "border-emerald-200 bg-emerald-50 text-emerald-700"
                    )}
                  >
                    {service.failing > 0 ? (
                      <>
                        <AlertTriangle className="size-3" aria-hidden="true" />
                        {service.failing} failing
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="size-3" aria-hidden="true" />
                        healthy
                      </>
                    )}
                  </Badge>
                </div>
              ))}
            </CardContent>
          </Card>

          <IncidentTable incidents={rawDashboardData.incidents} />
        </div>
      </div>
    </main>
  )
}

interface MetricCardProps {
  icon: typeof RadioTower
  label: string
  value: string
  helper: string
  tone: string
}

function MetricCard({ helper, icon: Icon, label, tone, value }: MetricCardProps) {
  return (
    <Card className="dashboard-card gap-3 rounded-lg">
      <CardHeader className="flex-row items-start justify-between px-4 pt-4">
        <div>
          <CardTitle className="text-sm text-muted-foreground">
            {label}
          </CardTitle>
          <div className="mt-2 text-3xl font-semibold">{value}</div>
        </div>
        <div className={cn("rounded-md border p-2", tone)}>
          <Icon className="size-4" aria-hidden="true" />
        </div>
      </CardHeader>
      <CardContent className="px-4 pb-4 text-sm text-muted-foreground">
        {helper}
      </CardContent>
    </Card>
  )
}
