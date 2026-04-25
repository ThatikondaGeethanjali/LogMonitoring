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
}

export interface SideBarProps {
  logs?: Log[]
  selectedLogId?: string
  onSelectLog?: (logId: string) => void
  isLoading?: boolean
}

export type SortOption = "frequency" | "recent" | "impact"
export type GroupOption = "issue" | "severity" | "package"
