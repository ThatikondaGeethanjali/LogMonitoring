import { apiClient } from "@/api"
import type {
  ApiDetailsData,
  ApiMonitoringDashboardData,
} from "@/features/api-monitoring/types"

export async function fetchApiMonitoringDashboard(apiName?: string) {
  const response = await apiClient.get<ApiMonitoringDashboardData>(
    "/api-monitoring/dashboard",
    {
      params: apiName ? { apiName } : undefined,
    }
  )

  return response.data
}

export async function fetchApiDetails(apiName: string) {
  const response = await apiClient.get<ApiDetailsData>(
    `/api-monitoring/apis/${encodeURIComponent(apiName)}`
  )

  return response.data
}
