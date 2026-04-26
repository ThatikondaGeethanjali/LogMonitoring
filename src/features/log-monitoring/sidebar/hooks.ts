/**
 * Hooks for sidebar filtering, sorting, and filter option generation.
 */

import { useMemo } from "react"
import type { DateRange, Log, QuickRangeOption, SortOption } from "./types"

interface UseFilteredLogsParams {
  logs: Log[]
  searchQuery: string
  sortBy: SortOption
  apiName: string
  serviceName: string
  dateRange: DateRange
}

const MS_PER_DAY = 24 * 60 * 60 * 1000

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

const parseDateValue = (value: string) => {
  if (!value) {
    return null
  }

  if (value.includes("T")) {
    const parsedDateTime = new Date(value)
    return Number.isNaN(parsedDateTime.getTime()) ? null : parsedDateTime
  }

  const [year = "", month = "", day = ""] = value.split("-")

  if (!year || !month || !day) {
    return null
  }

  const parsedDate = new Date(
    Number(year),
    Number(month) - 1,
    Number(day),
    0,
    0,
    0,
    0
  )

  if (Number.isNaN(parsedDate.getTime())) {
    return null
  }

  return parsedDate
}

const getFromTime = (value: string) => {
  const parsedDate = parseDateValue(value)

  if (!parsedDate) {
    return null
  }

  if (!value.includes("T")) {
    parsedDate.setHours(0, 0, 0, 0)
  }

  return parsedDate.getTime()
}

const getToTime = (value: string) => {
  const parsedDate = parseDateValue(value)

  if (!parsedDate) {
    return null
  }

  if (!value.includes("T")) {
    parsedDate.setHours(23, 59, 59, 999)
  }

  return parsedDate.getTime()
}

const matchesDateRange = (log: Log, dateRange: DateRange) => {
  const logTime = parseDateValue(log.lastSeen)?.getTime() ?? null
  const fromTime = getFromTime(dateRange.from)
  const toTime = getToTime(dateRange.to)

  if (logTime === null || fromTime === null || toTime === null) {
    return false
  }

  return logTime >= fromTime && logTime <= toTime
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

const formatDateInputValue = (date: Date) => {
  const year = date.getFullYear()
  const month = `${date.getMonth() + 1}`.padStart(2, "0")
  const day = `${date.getDate()}`.padStart(2, "0")

  return `${year}-${month}-${day}`
}

const formatDateTimeInputValue = (date: Date) => {
  const year = date.getFullYear()
  const month = `${date.getMonth() + 1}`.padStart(2, "0")
  const day = `${date.getDate()}`.padStart(2, "0")
  const hours = `${date.getHours()}`.padStart(2, "0")
  const minutes = `${date.getMinutes()}`.padStart(2, "0")

  return `${year}-${month}-${day}T${hours}:${minutes}`
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
  dateRange,
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
        matchesExactFilter(resolvedServiceName, normalizedServiceName) &&
        matchesDateRange(log, dateRange)
      )
    })

    return sortLogs(filteredLogs, sortBy)
  }, [apiName, dateRange, logs, searchQuery, serviceName, sortBy])
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

export const getDefaultDateRange = (): DateRange => {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const twoMonthsAgo = new Date(today)
  twoMonthsAgo.setMonth(twoMonthsAgo.getMonth() - 2)

  // Clamp edge cases like month rollover while preserving a roughly 2-month window.
  if (twoMonthsAgo > today) {
    twoMonthsAgo.setTime(today.getTime() - 60 * MS_PER_DAY)
  }

  return {
    from: formatDateInputValue(twoMonthsAgo),
    to: formatDateInputValue(today),
  }
}

export const getQuickRangeDateRange = (
  range: Exclude<QuickRangeOption, "all">
): DateRange => {
  const hours = Number.parseInt(range, 10)
  const now = new Date()
  const from = new Date(now.getTime() - hours * 60 * 60 * 1000)

  return {
    from: formatDateTimeInputValue(from),
    to: formatDateTimeInputValue(now),
  }
}

export const getDateFilterBounds = (logs: Log[]) => {
  const defaultRange = getDefaultDateRange()
  const logDates = logs
    .map((log) => parseDateValue(log.lastSeen))
    .filter((date): date is Date => date !== null)
    .sort((first, second) => first.getTime() - second.getTime())

  return {
    minDate: logDates[0] ? formatDateInputValue(logDates[0]) : defaultRange.from,
    maxDate: defaultRange.to,
  }
}
