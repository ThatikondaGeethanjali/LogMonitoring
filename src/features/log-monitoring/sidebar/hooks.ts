/**
 * Hooks for sidebar filtering, sorting, and filter option generation.
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

const getSearchableValues = (log: Log) => [
  log.name,
  log.package,
  log.apiServiceName ?? "",
  log.serviceName ?? "",
]

const matchesSearchQuery = (log: Log, normalizedQuery: string) => {
  if (!normalizedQuery) {
    return true
  }

  return getSearchableValues(log).some((value) =>
    value.toLowerCase().includes(normalizedQuery)
  )
}

const matchesExactFilter = (value: string, selectedValue: string) => {
  if (!selectedValue) {
    return true
  }

  return value.toLowerCase() === selectedValue
}

const sortLogs = (logs: Log[], sortBy: SortOption) => {
  const sortedLogs = [...logs]

  sortedLogs.sort((a, b) => {
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

  return sortedLogs
}

const getUniqueSortedOptions = (values: string[]) =>
  Array.from(new Set(values.filter(Boolean))).sort((a, b) => a.localeCompare(b))

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

    const filteredLogs = logs.filter((log) => {
      const resolvedApiName = log.apiServiceName ?? log.name
      const resolvedServiceName = log.serviceName ?? log.package

      return (
        matchesSearchQuery(log, normalizedQuery) &&
        matchesExactFilter(resolvedApiName, normalizedApiName) &&
        matchesExactFilter(resolvedServiceName, normalizedServiceName)
      )
    })

    return sortLogs(filteredLogs, sortBy)
  }, [apiName, logs, searchQuery, serviceName, sortBy])
}

export const useLogFilterOptions = (logs: Log[]) => {
  return useMemo(
    () => ({
      apiNames: getUniqueSortedOptions(
        logs.map((log) => log.apiServiceName ?? log.name)
      ),
      serviceNames: getUniqueSortedOptions(
        logs.map((log) => log.serviceName ?? log.package)
      ),
    }),
    [logs]
  )
}
