/**
 * Type definitions for Log data and component props
 */

export interface Log {
  id: string
  name: string
  package: string
  severity: "Crash" | "ANR" | "Warning"
  occurrences: number
  userCount: number
  lastSeen: string
  trend?: number
  status?: string
  exception?: string
  errorDescription?: string
  vendor?: string
  logGroupName?: string
  dataScanned?: string
  cost?: string
  errorCode?: string
  priority?: string
  lastUpdateTimestamp?: string
  lastEscalationDatetime?: string
  successFailureUpdatedTime?: string
  consecutiveFailureCount?: number
  escalation1Email?: string
  escalation2Email?: string
  escalation3Email?: string
  escalation4Email?: string
  thresholdTime1?: number
  thresholdTime2?: number
  thresholdTime3?: number
  thresholdTime4?: number
  escalationLevel?: number
  escalationCount?: number
  desiredCount?: number
  serviceName?: string
  apiServiceName?: string
}

export interface SideBarProps {
  logs?: Log[]
  selectedLogId?: string
  onSelectLog?: (logId: string) => void
  isLoading?: boolean
  dateRange: DateRange
}

export type SortOption = "frequency" | "recent" | "impact"

export interface DateRange {
  from: string
  to: string
}

export type QuickRangeOption =
  | "all"
  | "1hr"
  | "2hr"
  | "3hr"
  | "4hr"
  | "5hr"
  | "6hr"
