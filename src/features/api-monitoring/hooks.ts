import {
  fetchApiDetails,
  fetchApiMonitoringDashboard,
} from "@/api/services/apiMonitoring"
import {
  MOCK_API_DETAILS,
  MOCK_DASHBOARD_DATA,
} from "@/features/api-monitoring/data/mockData"
import type {
  ApiDetailsData,
  ApiMonitoringDashboardData,
} from "@/features/api-monitoring/types"
import { useCallback, useEffect, useMemo, useState } from "react"

const REFRESH_INTERVAL_MS = 10_000

function filterDashboardData(
  data: ApiMonitoringDashboardData,
  apiFilter: string
): ApiMonitoringDashboardData {
  const normalizedFilter = apiFilter.trim().toLowerCase()

  if (!normalizedFilter) {
    return data
  }

  const matchesApi = (apiName: string) =>
    apiName.toLowerCase().includes(normalizedFilter)

  const statuses = data.statuses.filter((row) => matchesApi(row.apiName))
  const failureFeatures = data.failureFeatures.filter((row) =>
    matchesApi(row.apiName)
  )
  const incidents = data.incidents.filter((row) => matchesApi(row.apiName))

  return {
    ...data,
    summary: {
      totalApis: statuses.length,
      activeFailures: statuses.filter((row) => row.currentStatus === "fail")
        .length,
      averageFailureRates: {
        oneMinute:
          failureFeatures.reduce((total, row) => total + row.failureRate1m, 0) /
            Math.max(failureFeatures.length, 1) || 0,
        tenMinutes:
          failureFeatures.reduce((total, row) => total + row.failureRate10m, 0) /
            Math.max(failureFeatures.length, 1) || 0,
        oneHour:
          failureFeatures.reduce((total, row) => total + row.failureRate1h, 0) /
            Math.max(failureFeatures.length, 1) || 0,
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

export function useApiMonitoring(apiFilter: string) {
  const [dashboardData, setDashboardData] =
    useState<ApiMonitoringDashboardData>(MOCK_DASHBOARD_DATA)
  const [selectedApi, setSelectedApi] = useState<string>(
    MOCK_DASHBOARD_DATA.statuses[0]?.apiName ?? ""
  )
  const [apiDetails, setApiDetails] = useState<ApiDetailsData | null>(
    MOCK_API_DETAILS[MOCK_DASHBOARD_DATA.statuses[0]?.apiName ?? ""] ?? null
  )
  const [isLoading, setIsLoading] = useState(true)
  const [isDetailsLoading, setIsDetailsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)

  const refreshDashboard = useCallback(async () => {
    try {
      const nextData = await fetchApiMonitoringDashboard()
      setDashboardData(nextData)
      setError(null)

      if (!selectedApi && nextData.statuses[0]) {
        setSelectedApi(nextData.statuses[0].apiName)
      }
    } catch {
      setDashboardData(MOCK_DASHBOARD_DATA)
      setError("Using sample data until the MySQL API is available.")
    } finally {
      setIsLoading(false)
      setLastUpdated(new Date())
    }
  }, [selectedApi])

  const loadApiDetails = useCallback(async (apiName: string) => {
    if (!apiName) {
      setApiDetails(null)
      return
    }

    setIsDetailsLoading(true)

    try {
      const nextDetails = await fetchApiDetails(apiName)
      setApiDetails(nextDetails)
    } catch {
      setApiDetails(
        MOCK_API_DETAILS[apiName] ?? {
          apiName,
          statusHistory: [],
          responseTimeHistory: [],
          firstFailureTime: null,
          lastFailureTime: null,
        }
      )
    } finally {
      setIsDetailsLoading(false)
    }
  }, [])

  useEffect(() => {
    void refreshDashboard()
    const intervalId = window.setInterval(refreshDashboard, REFRESH_INTERVAL_MS)

    return () => window.clearInterval(intervalId)
  }, [refreshDashboard])

  useEffect(() => {
    if (!selectedApi && dashboardData.statuses[0]) {
      setSelectedApi(dashboardData.statuses[0].apiName)
    }
  }, [dashboardData.statuses, selectedApi])

  useEffect(() => {
    void loadApiDetails(selectedApi)
  }, [loadApiDetails, selectedApi])

  const filteredData = useMemo(
    () => filterDashboardData(dashboardData, apiFilter),
    [apiFilter, dashboardData]
  )

  return {
    apiDetails,
    dashboardData: filteredData,
    rawDashboardData: dashboardData,
    error,
    isDetailsLoading,
    isLoading,
    lastUpdated,
    refreshDashboard,
    selectedApi,
    setSelectedApi,
  }
}
