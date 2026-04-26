/**
 * Custom hook for filtering and sorting logs
 */

import { useMemo } from "react"
import type { Log, SortOption } from "./types"

interface UseFilteredLogsParams {
  logs: Log[]
  searchQuery: string
  sortBy: SortOption
  apiName: string
  serviceName: string
}

/**
 * Hook to filter and sort logs based on search query and sort option
 */
export const useFilteredLogs = ({
  logs,
  searchQuery,
  sortBy,
  apiName,
  serviceName,
}: UseFilteredLogsParams): Log[] => {
  return useMemo(() => {
    const normalizedQuery = searchQuery.toLowerCase()
    const normalizedApiName = apiName.toLowerCase()
    const normalizedServiceName = serviceName.toLowerCase()

    let filtered = logs.filter(
      (log) => {
        const matchesSearch =
          log.name.toLowerCase().includes(normalizedQuery) ||
          log.package.toLowerCase().includes(normalizedQuery) ||
          (log.apiServiceName ?? "").toLowerCase().includes(normalizedQuery) ||
          (log.serviceName ?? "").toLowerCase().includes(normalizedQuery)

        const matchesApiName =
          !normalizedApiName ||
          (log.apiServiceName ?? log.name).toLowerCase() === normalizedApiName

        const matchesServiceName =
          !normalizedServiceName ||
          (log.serviceName ?? log.package).toLowerCase() ===
            normalizedServiceName

        return matchesSearch && matchesApiName && matchesServiceName
      }
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
  }, [apiName, logs, searchQuery, serviceName, sortBy])
}
