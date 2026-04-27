import type {
  ApiDetailsData,
  ApiFailureFeature,
  ApiMonitoringDashboardData,
  ApiStatusRow,
  FailureEvent,
  FailureTimeseriesPoint,
} from "@/features/api-monitoring/types"

const statusRows: ApiStatusRow[] = [
  {
    apiName: "payments-authorize",
    currentStatus: "fail",
    consecutiveFailures: 7,
    lastCheckedTime: "2026-04-27T14:24:10+05:30",
    responseTimeMs: 1280,
  },
  {
    apiName: "customer-profile",
    currentStatus: "success",
    consecutiveFailures: 0,
    lastCheckedTime: "2026-04-27T14:24:12+05:30",
    responseTimeMs: 142,
  },
  {
    apiName: "ledger-sync",
    currentStatus: "fail",
    consecutiveFailures: 3,
    lastCheckedTime: "2026-04-27T14:24:08+05:30",
    responseTimeMs: 2210,
  },
  {
    apiName: "risk-score",
    currentStatus: "success",
    consecutiveFailures: 0,
    lastCheckedTime: "2026-04-27T14:24:13+05:30",
    responseTimeMs: 318,
  },
  {
    apiName: "notification-dispatch",
    currentStatus: "success",
    consecutiveFailures: 0,
    lastCheckedTime: "2026-04-27T14:24:11+05:30",
    responseTimeMs: 410,
  },
]

const failureFeatures: ApiFailureFeature[] = [
  {
    apiName: "payments-authorize",
    failureRate1m: 72,
    failureRate10m: 58,
    failureRate1h: 41,
    firstFailureTime: "2026-04-27T14:16:20+05:30",
    lastFailureTime: "2026-04-27T14:24:10+05:30",
    consecutiveFailures: 7,
    failureCount: 29,
  },
  {
    apiName: "ledger-sync",
    failureRate1m: 48,
    failureRate10m: 35,
    failureRate1h: 22,
    firstFailureTime: "2026-04-27T14:20:02+05:30",
    lastFailureTime: "2026-04-27T14:24:08+05:30",
    consecutiveFailures: 3,
    failureCount: 17,
  },
  {
    apiName: "notification-dispatch",
    failureRate1m: 8,
    failureRate10m: 12,
    failureRate1h: 9,
    firstFailureTime: "2026-04-27T13:46:44+05:30",
    lastFailureTime: "2026-04-27T14:07:31+05:30",
    consecutiveFailures: 0,
    failureCount: 6,
  },
  {
    apiName: "risk-score",
    failureRate1m: 0,
    failureRate10m: 6,
    failureRate1h: 11,
    firstFailureTime: "2026-04-27T13:55:00+05:30",
    lastFailureTime: "2026-04-27T14:10:41+05:30",
    consecutiveFailures: 0,
    failureCount: 5,
  },
]

const failureTimeseries: FailureTimeseriesPoint[] = [
  { timeBucket: "14:00", failureCount: 2 },
  { timeBucket: "14:05", failureCount: 5 },
  { timeBucket: "14:10", failureCount: 4 },
  { timeBucket: "14:15", failureCount: 9 },
  { timeBucket: "14:20", failureCount: 14 },
  { timeBucket: "14:25", failureCount: 11 },
]

const incidents: FailureEvent[] = [
  {
    apiName: "payments-authorize",
    failureStartTime: "2026-04-27T14:16:20+05:30",
    failureEndTime: null,
    durationSeconds: 470,
    failureCount: 29,
  },
  {
    apiName: "ledger-sync",
    failureStartTime: "2026-04-27T14:20:02+05:30",
    failureEndTime: null,
    durationSeconds: 246,
    failureCount: 17,
  },
  {
    apiName: "notification-dispatch",
    failureStartTime: "2026-04-27T13:46:44+05:30",
    failureEndTime: "2026-04-27T13:52:02+05:30",
    durationSeconds: 318,
    failureCount: 6,
  },
  {
    apiName: "risk-score",
    failureStartTime: "2026-04-27T13:55:00+05:30",
    failureEndTime: "2026-04-27T13:56:34+05:30",
    durationSeconds: 94,
    failureCount: 5,
  },
]

export const MOCK_DASHBOARD_DATA: ApiMonitoringDashboardData = {
  summary: {
    totalApis: statusRows.length,
    activeFailures: statusRows.filter((row) => row.currentStatus === "fail")
      .length,
    averageFailureRates: {
      oneMinute: 32,
      tenMinutes: 28,
      oneHour: 21,
    },
    highestFailures: failureFeatures.slice(0, 3),
  },
  statuses: statusRows,
  failureFeatures,
  failureTimeseries,
  incidents,
}

export const MOCK_API_DETAILS: Record<string, ApiDetailsData> =
  Object.fromEntries(
    statusRows.map((row) => [
      row.apiName,
      {
        apiName: row.apiName,
        firstFailureTime:
          failureFeatures.find((feature) => feature.apiName === row.apiName)
            ?.firstFailureTime ?? null,
        lastFailureTime:
          failureFeatures.find((feature) => feature.apiName === row.apiName)
            ?.lastFailureTime ?? null,
        statusHistory: [
          { checkedAt: "14:00", status: "success" },
          { checkedAt: "14:05", status: "success" },
          { checkedAt: "14:10", status: row.apiName.includes("payments") ? "fail" : "success" },
          { checkedAt: "14:15", status: row.currentStatus },
          { checkedAt: "14:20", status: row.currentStatus },
          { checkedAt: "14:25", status: row.currentStatus },
        ],
        responseTimeHistory: [
          { checkedAt: "14:00", responseTimeMs: 180, status: "success" },
          { checkedAt: "14:05", responseTimeMs: 240, status: "success" },
          { checkedAt: "14:10", responseTimeMs: 420, status: "success" },
          {
            checkedAt: "14:15",
            responseTimeMs: Math.max(380, row.responseTimeMs ?? 450),
            status: row.currentStatus,
          },
          {
            checkedAt: "14:20",
            responseTimeMs: Math.max(520, (row.responseTimeMs ?? 450) + 180),
            status: row.currentStatus,
          },
          {
            checkedAt: "14:25",
            responseTimeMs: row.responseTimeMs ?? 450,
            status: row.currentStatus,
          },
        ],
      },
    ])
  )
