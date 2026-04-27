export type ApiStatusValue = "success" | "fail"
export type ApiSortOption = "occurred" | "recent" | "failure-rate"

export interface ApiStatusRow {
  apiName: string
  currentStatus: ApiStatusValue
  consecutiveFailures: number
  lastCheckedTime: string
  responseTimeMs?: number
}

export interface ApiFailureFeature {
  apiName: string
  failureRate1m: number
  failureRate10m: number
  failureRate1h: number
  firstFailureTime: string | null
  lastFailureTime: string | null
  consecutiveFailures: number
  failureCount: number
}

export interface FailureTimeseriesPoint {
  timeBucket: string
  failureCount: number
}

export interface FailureEvent {
  apiName: string
  failureStartTime: string
  failureEndTime: string | null
  durationSeconds: number
  failureCount: number
}

export interface StatusHistoryPoint {
  checkedAt: string
  status: ApiStatusValue
}

export interface ResponseTimePoint {
  checkedAt: string
  responseTimeMs: number
  status?: ApiStatusValue
}

export interface ApiDetailsData {
  apiName: string
  statusHistory: StatusHistoryPoint[]
  responseTimeHistory: ResponseTimePoint[]
  firstFailureTime: string | null
  lastFailureTime: string | null
}

export interface DashboardSummary {
  totalApis: number
  activeFailures: number
  averageFailureRates: {
    oneMinute: number
    tenMinutes: number
    oneHour: number
  }
  highestFailures: ApiFailureFeature[]
}

export interface ApiMonitoringDashboardData {
  summary: DashboardSummary
  statuses: ApiStatusRow[]
  failureFeatures: ApiFailureFeature[]
  failureTimeseries: FailureTimeseriesPoint[]
  incidents: FailureEvent[]
}

export interface ApiSidebarItem {
  apiName: string
  serviceName: string
  currentStatus: ApiStatusValue
  consecutiveFailures: number
  lastCheckedTime: string
  failureCount: number
  failureRate10m: number
}
