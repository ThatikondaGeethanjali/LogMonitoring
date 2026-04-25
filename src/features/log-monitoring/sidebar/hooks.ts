/**
 * Custom hook for filtering and sorting logs
 */

import { useMemo } from "react"
import type { Log, SortOption } from "./types"

interface UseFilteredLogsParams {
  logs: Log[]
  searchQuery: string
  sortBy: SortOption
}

/**
 * Hook to filter and sort logs based on search query and sort option
 */
export const useFilteredLogs = ({
  logs,
  searchQuery,
  sortBy,
}: UseFilteredLogsParams): Log[] => {
  return useMemo(() => {
    // Filter logs by search query
    let filtered = logs.filter(
      (log) =>
        log.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.package.toLowerCase().includes(searchQuery.toLowerCase())
    )

    // Sort logs by selected option
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "frequency":
          return b.occurrences - a.occurrences
        case "recent":
          return new Date(b.lastSeen).getTime() - new Date(a.lastSeen).getTime()
        case "impact":
          return b.userCount - a.userCount
        default:
          return 0
      }
    })

    return filtered
  }, [logs, searchQuery, sortBy])
}
