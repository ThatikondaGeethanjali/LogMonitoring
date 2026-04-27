export const sampleDashboard = {
  summary: {
    totalApis: 5,
    activeFailures: 2,
    averageFailureRates: {
      oneMinute: 32,
      tenMinutes: 28,
      oneHour: 21,
    },
    highestFailures: [
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
    ],
  },
  statuses: [
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
  ],
  failureFeatures: [
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
  ],
  failureTimeseries: [
    { timeBucket: "14:00", failureCount: 2 },
    { timeBucket: "14:05", failureCount: 5 },
    { timeBucket: "14:10", failureCount: 4 },
    { timeBucket: "14:15", failureCount: 9 },
    { timeBucket: "14:20", failureCount: 14 },
    { timeBucket: "14:25", failureCount: 11 },
  ],
  incidents: [
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
  ],
}

export function sampleApiDetails(apiName) {
  const currentStatus = apiName.includes("payments") ? "fail" : "success"

  return {
    apiName,
    firstFailureTime: currentStatus === "fail" ? "2026-04-27T14:16:20+05:30" : null,
    lastFailureTime: currentStatus === "fail" ? "2026-04-27T14:24:10+05:30" : null,
    statusHistory: [
      { checkedAt: "14:00", status: "success" },
      { checkedAt: "14:05", status: "success" },
      { checkedAt: "14:10", status: currentStatus },
      { checkedAt: "14:15", status: currentStatus },
      { checkedAt: "14:20", status: currentStatus },
      { checkedAt: "14:25", status: currentStatus },
    ],
    responseTimeHistory: [
      { checkedAt: "14:00", responseTimeMs: 180, status: "success" },
      { checkedAt: "14:05", responseTimeMs: 240, status: "success" },
      { checkedAt: "14:10", responseTimeMs: 610, status: currentStatus },
      { checkedAt: "14:15", responseTimeMs: 920, status: currentStatus },
      { checkedAt: "14:20", responseTimeMs: 1280, status: currentStatus },
      { checkedAt: "14:25", responseTimeMs: 1100, status: currentStatus },
    ],
  }
}
