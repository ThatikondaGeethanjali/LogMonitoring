/**
 * Utility functions for severity handling and data formatting
 */

/**
 * Get CSS classes for severity badge styling
 */
export const getSeverityColor = (severity: string): string => {
  switch (severity) {
    case "Crash":
      return "bg-red-50 text-red-600 ring-1 ring-red-100"
    case "ANR":
      return "bg-amber-50 text-amber-600 ring-1 ring-amber-100"
    case "Warning":
      return "bg-sky-50 text-sky-600 ring-1 ring-sky-100"
    default:
      return "bg-slate-100 text-slate-700 ring-1 ring-slate-200"
  }
}

/**
 * Get emoji icon for severity type
 */
export const getSeverityIcon = (severity: string): string => {
  switch (severity) {
    case "Crash":
      return "⚠️"
    case "ANR":
      return "⏸️"
    case "Warning":
      return "ℹ️"
    default:
      return "•"
  }
}

/**
 * Format date string to show only date part
 */
export const formatLogDate = (dateString: string): string => {
  const parsedDate = new Date(dateString)

  if (Number.isNaN(parsedDate.getTime())) {
    return dateString
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(parsedDate)
}

/**
 * Format large numbers with thousand separators
 */
export const formatNumber = (num: number): string => {
  return num.toLocaleString()
}
