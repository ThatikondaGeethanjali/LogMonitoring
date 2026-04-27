import { Button } from "@/components/ui/button"
import { ApiDetails } from "@/features/api-monitoring/components/ApiDetails"
import {
  ALL_SERVICES,
  ApiSidebar,
} from "@/features/api-monitoring/components/ApiSidebar"
import { FailureChart } from "@/features/api-monitoring/components/FailureChart"
import { FailureRateChart } from "@/features/api-monitoring/components/FailureRateChart"
import { IncidentTable } from "@/features/api-monitoring/components/IncidentTable"
import { KPIcards } from "@/features/api-monitoring/components/KPIcards"
import { StatusTable } from "@/features/api-monitoring/components/StatusTable"
import { useApiMonitoring } from "@/features/api-monitoring/hooks"
import type {
  ApiMonitoringDashboardData,
  ApiSidebarItem,
  ApiSortOption,
} from "@/features/api-monitoring/types"
import { getServiceName } from "@/features/api-monitoring/utils"
import { RefreshCw } from "lucide-react"
import { useMemo, useState } from "react"

function getVisibleDashboardData(
  data: ApiMonitoringDashboardData,
  visibleApiNames: Set<string>
): ApiMonitoringDashboardData {
  const statuses = data.statuses.filter((row) => visibleApiNames.has(row.apiName))
  const failureFeatures = data.failureFeatures.filter((row) =>
    visibleApiNames.has(row.apiName)
  )
  const incidents = data.incidents.filter((row) =>
    visibleApiNames.has(row.apiName)
  )
  const average = (key: "failureRate1m" | "failureRate10m" | "failureRate1h") =>
    failureFeatures.length
      ? failureFeatures.reduce((total, row) => total + row[key], 0) /
        failureFeatures.length
      : 0

  return {
    ...data,
    summary: {
      totalApis: statuses.length,
      activeFailures: statuses.filter((row) => row.currentStatus === "fail")
        .length,
      averageFailureRates: {
        oneMinute: average("failureRate1m"),
        tenMinutes: average("failureRate10m"),
        oneHour: average("failureRate1h"),
      },
      highestFailures: [...failureFeatures]
        .sort((a, b) => b.failureCount - a.failureCount)
        .slice(0, 3),
    },
    statuses,
    failureFeatures,
    incidents,
  }
}

export function Dashboard() {
  const [searchQuery, setSearchQuery] = useState("")
  const [serviceFilter, setServiceFilter] = useState(ALL_SERVICES)
  const [sortBy, setSortBy] = useState<ApiSortOption>("occurred")
  const {
    apiDetails,
    error,
    isDetailsLoading,
    isLoading,
    lastUpdated,
    rawDashboardData,
    refreshDashboard,
    selectedApi,
    setSelectedApi,
  } = useApiMonitoring("")

  const sidebarItems = useMemo<ApiSidebarItem[]>(() => {
    const featureByApiName = new Map(
      rawDashboardData.failureFeatures.map((feature) => [
        feature.apiName,
        feature,
      ])
    )
    const normalizedQuery = searchQuery.trim().toLowerCase()

    const items = rawDashboardData.statuses.map((status) => {
      const feature = featureByApiName.get(status.apiName)

      return {
        apiName: status.apiName,
        serviceName: getServiceName(status.apiName),
        currentStatus: status.currentStatus,
        consecutiveFailures:
          feature?.consecutiveFailures ?? status.consecutiveFailures,
        lastCheckedTime: status.lastCheckedTime,
        failureCount: feature?.failureCount ?? 0,
        failureRate10m: feature?.failureRate10m ?? 0,
      }
    })

    return items
      .filter((item) => {
        const matchesService =
          serviceFilter === ALL_SERVICES || item.serviceName === serviceFilter
        const matchesSearch =
          !normalizedQuery ||
          [
            item.apiName,
            item.serviceName,
            item.currentStatus,
            String(item.failureCount),
            String(item.consecutiveFailures),
          ].some((value) => value.toLowerCase().includes(normalizedQuery))

        return matchesService && matchesSearch
      })
      .sort((first, second) => {
        if (sortBy === "recent") {
          return (
            new Date(second.lastCheckedTime).getTime() -
            new Date(first.lastCheckedTime).getTime()
          )
        }

        if (sortBy === "failure-rate") {
          return second.failureRate10m - first.failureRate10m
        }

        return second.failureCount - first.failureCount
      })
  }, [
    rawDashboardData.failureFeatures,
    rawDashboardData.statuses,
    searchQuery,
    serviceFilter,
    sortBy,
  ])

  const visibleApiNames = useMemo(
    () => new Set(sidebarItems.map((item) => item.apiName)),
    [sidebarItems]
  )
  const dashboardData = useMemo(
    () => getVisibleDashboardData(rawDashboardData, visibleApiNames),
    [rawDashboardData, visibleApiNames]
  )
  const selectedApiFailureRateData = useMemo(
    () =>
      rawDashboardData.failureFeatures.filter(
        (feature) => feature.apiName === selectedApi
      ),
    [rawDashboardData.failureFeatures, selectedApi]
  )

  return (
    <main className="dashboard-surface flex h-full min-h-0 overflow-hidden">
      <div className="hidden h-full w-[28%] min-w-[300px] max-w-[420px] lg:block">
        <ApiSidebar
          items={sidebarItems}
          selectedApi={selectedApi}
          serviceFilter={serviceFilter}
          searchQuery={searchQuery}
          sortBy={sortBy}
          onSelectApi={setSelectedApi}
          onServiceFilterChange={setServiceFilter}
          onSearchQueryChange={setSearchQuery}
          onSortChange={setSortBy}
        />
      </div>

      <div className="min-h-0 flex-1 overflow-auto">
        <div className="mx-auto flex w-full max-w-[1600px] flex-col gap-4 px-4 py-4 sm:px-6 lg:px-8">
          <header className="glass-panel flex flex-col gap-4 rounded-xl p-5 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-sky-200 bg-sky-50 px-2.5 py-1 text-xs font-medium text-sky-700">
                <span className="live-dot" />
                Real-time monitoring
              </div>
              <h1 className="text-2xl font-semibold tracking-normal text-zinc-950 sm:text-3xl">
                API Monitoring Dashboard
              </h1>
              <p className="mt-1 text-sm text-muted-foreground">
                Live health, failure analytics, and incident history
              </p>
            </div>

            <Button
              type="button"
              variant="outline"
              className="pressable h-10 gap-2 self-start border-sky-200 bg-white shadow-sm hover:border-sky-300 hover:bg-sky-50 hover:text-sky-700 lg:self-auto"
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

          <div className="lg:hidden">
            <ApiSidebar
              items={sidebarItems}
              selectedApi={selectedApi}
              serviceFilter={serviceFilter}
              searchQuery={searchQuery}
              sortBy={sortBy}
              onSelectApi={setSelectedApi}
              onServiceFilterChange={setServiceFilter}
              onSearchQueryChange={setSearchQuery}
              onSortChange={setSortBy}
            />
          </div>

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

          <KPIcards summary={dashboardData.summary} />

          <div className="grid gap-4 xl:grid-cols-[minmax(0,1.1fr)_minmax(420px,0.9fr)]">
            <StatusTable
              statuses={dashboardData.statuses}
              selectedApi={selectedApi}
              onSelectApi={setSelectedApi}
            />
            <ApiDetails details={apiDetails} isLoading={isDetailsLoading} />
          </div>

          <div className="grid gap-4 xl:grid-cols-2">
            <FailureChart data={dashboardData.failureTimeseries} />
            <FailureRateChart data={selectedApiFailureRateData} />
          </div>

          <IncidentTable incidents={dashboardData.incidents} />
        </div>
      </div>
    </main>
  )
}
