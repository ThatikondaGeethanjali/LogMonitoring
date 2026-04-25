import csvText from "./DATA2.csv?raw"

import type { Log } from "../sidebar/types"

type CsvRow = Record<string, string>

function parseCsvLine(line: string) {
  const values: string[] = []
  let current = ""
  let inQuotes = false

  for (let index = 0; index < line.length; index += 1) {
    const char = line[index]
    const nextChar = line[index + 1]

    if (char === '"') {
      if (inQuotes && nextChar === '"') {
        current += '"'
        index += 1
      } else {
        inQuotes = !inQuotes
      }
      continue
    }

    if (char === "," && !inQuotes) {
      values.push(current.trim())
      current = ""
      continue
    }

    current += char
  }

  values.push(current.trim())
  return values
}

function parseCsv(text: string) {
  const lines = text
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)

  if (lines.length === 0) {
    return []
  }

  const headers = parseCsvLine(lines[0])

  return lines.slice(1).map((line) => {
    const values = parseCsvLine(line)
    const row: CsvRow = {}

    headers.forEach((header, index) => {
      row[header] = values[index] ?? ""
    })

    return row
  })
}

function parseNumber(value: string) {
  const numericValue = Number.parseFloat(value)
  return Number.isFinite(numericValue) ? numericValue : 0
}

function parseCsvDate(value: string) {
  if (!value) {
    return ""
  }

  const [datePart = "", timePart = "00:00"] = value.split(" ")
  const [day = "", month = "", year = ""] = datePart.split("-")

  if (!day || !month || !year) {
    return value
  }

  return `${year}-${month}-${day}T${timePart}:00`
}

function getSeverity(status: string, errorCount: number): Log["severity"] {
  if (status.toLowerCase() === "failure" || errorCount > 0) {
    return "Crash"
  }

  return "Warning"
}

function getTrend(errorCount: number, consecutiveFailureCount: number) {
  if (errorCount === 0 && consecutiveFailureCount === 0) {
    return 0
  }

  return Number((errorCount * 10 + consecutiveFailureCount * 2.5).toFixed(1))
}

const rows = parseCsv(csvText)

export const MONITORING_LOGS: Log[] = rows.map((row) => {
  const occurrences = parseNumber(row.ErrorCount)
  const consecutiveFailureCount = parseNumber(row.ConsecutiveFailureCount)
  const escalationLevel = parseNumber(row.EscalationLevel)
  const escalationCount = parseNumber(row.EscalationCount)
  const desiredCount = parseNumber(row.DesiredCount)
  const thresholdTime1 = parseNumber(row.ThresholdTime1)
  const thresholdTime2 = parseNumber(row.ThresholdTime2)
  const thresholdTime3 = parseNumber(row.ThresholdTime3)
  const thresholdTime4 = parseNumber(row.ThresholdTime4)
  const lastSeen =
    parseCsvDate(row.success_failure_updated_time) ||
    parseCsvDate(row.LastUpdateTimestamp)

  return {
    id: row.id,
    name: row.APIServiceName || "Unknown API",
    package: row.ServiceName || "Unknown Service",
    severity: getSeverity(row.Status, occurrences),
    occurrences,
    userCount: consecutiveFailureCount,
    lastSeen,
    trend: getTrend(occurrences, consecutiveFailureCount),
    status: row.Status,
    exception: row.Exception,
    errorDescription: row.ErrorDescription,
    vendor: row.Vendor,
    logGroupName: row.logGroupName,
    dataScanned: row.DataScanned,
    cost: row.cost,
    errorCode: row.error_code,
    priority: row.priority,
    lastUpdateTimestamp: row.LastUpdateTimestamp,
    lastEscalationDatetime: row.LastEscalationDatetime,
    successFailureUpdatedTime: row.success_failure_updated_time,
    consecutiveFailureCount,
    escalation1Email: row.Escalation1Email,
    escalation2Email: row.Escalation2Email,
    escalation3Email: row.Escalation3Email,
    escalation4Email: row.Escalation4Email,
    thresholdTime1,
    thresholdTime2,
    thresholdTime3,
    thresholdTime4,
    escalationLevel,
    escalationCount,
    desiredCount,
    serviceName: row.ServiceName,
    apiServiceName: row.APIServiceName,
  }
})
