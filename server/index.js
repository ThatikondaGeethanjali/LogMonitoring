import cors from "cors"
import dotenv from "dotenv"
import express from "express"
import mysql from "mysql2/promise"
import { sampleApiDetails, sampleDashboard } from "./sampleData.js"

dotenv.config()

const app = express()
const port = Number(process.env.API_PORT ?? 3000)
const useSampleData =
  process.env.USE_SAMPLE_DATA === "true" || !process.env.MYSQL_HOST

app.use(cors({ origin: process.env.CLIENT_ORIGIN ?? "http://localhost:5173" }))
app.use(express.json())

const pool = useSampleData
  ? null
  : mysql.createPool({
      host: process.env.MYSQL_HOST,
      port: Number(process.env.MYSQL_PORT ?? 3306),
      user: process.env.MYSQL_USER,
      password: process.env.MYSQL_PASSWORD,
      database: process.env.MYSQL_DATABASE,
      waitForConnections: true,
      connectionLimit: Number(process.env.MYSQL_CONNECTION_LIMIT ?? 10),
      namedPlaceholders: true,
    })

function normalizeStatus(value) {
  const normalized = String(value ?? "").toLowerCase()
  return ["success", "ok", "healthy", "up", "pass"].includes(normalized)
    ? "success"
    : "fail"
}

function average(rows, key) {
  if (!rows.length) {
    return 0
  }

  return rows.reduce((total, row) => total + Number(row[key] ?? 0), 0) / rows.length
}

function likeParams(apiName) {
  return apiName ? { apiName: `%${apiName}%` } : {}
}

function whereApiName(apiName, alias = "") {
  return apiName ? `WHERE ${alias}api_name LIKE :apiName` : ""
}

async function queryDashboard(apiName) {
  const params = likeParams(apiName)

  const [statusRows] = await pool.query(
    `
      SELECT
        s.api_name AS apiName,
        s.current_status AS currentStatus,
        COALESCE(f.consecutive_failures, 0) AS consecutiveFailures,
        s.last_checked_time AS lastCheckedTime,
        m.response_time_ms AS responseTimeMs
      FROM api_status_table s
      LEFT JOIN api_failure_features f ON f.api_name = s.api_name
      LEFT JOIN api_monitor_table m ON m.api_name = s.api_name
      ${whereApiName(apiName, "s.")}
      ORDER BY s.api_name
    `,
    params
  )

  const [featureRows] = await pool.query(
    `
      SELECT
        api_name AS apiName,
        failure_rate_1min AS failureRate1m,
        failure_rate_10min AS failureRate10m,
        failure_rate_1hr AS failureRate1h,
        first_failure_time AS firstFailureTime,
        last_failure_time AS lastFailureTime,
        consecutive_failures AS consecutiveFailures,
        failure_count AS failureCount
      FROM api_failure_features
      ${whereApiName(apiName)}
      ORDER BY failure_count DESC
    `,
    params
  )

  const [timeseriesRows] = await pool.query(
    `
      SELECT
        time_bucket AS timeBucket,
        SUM(failure_count) AS failureCount
      FROM api_failure_timeseries
      ${whereApiName(apiName)}
      GROUP BY time_bucket
      ORDER BY time_bucket
    `,
    params
  )

  const [incidentRows] = await pool.query(
    `
      SELECT
        api_name AS apiName,
        failure_start_time AS failureStartTime,
        failure_end_time AS failureEndTime,
        duration_seconds AS durationSeconds,
        failure_count AS failureCount
      FROM api_failure_events
      ${whereApiName(apiName)}
      ORDER BY failure_start_time DESC
      LIMIT 100
    `,
    params
  )

  const statuses = statusRows.map((row) => ({
    ...row,
    currentStatus: normalizeStatus(row.currentStatus),
    consecutiveFailures: Number(row.consecutiveFailures ?? 0),
    responseTimeMs:
      row.responseTimeMs === null || row.responseTimeMs === undefined
        ? undefined
        : Number(row.responseTimeMs),
  }))

  const failureFeatures = featureRows.map((row) => ({
    ...row,
    failureRate1m: Number(row.failureRate1m ?? 0),
    failureRate10m: Number(row.failureRate10m ?? 0),
    failureRate1h: Number(row.failureRate1h ?? 0),
    consecutiveFailures: Number(row.consecutiveFailures ?? 0),
    failureCount: Number(row.failureCount ?? 0),
  }))

  return {
    summary: {
      totalApis: statuses.length,
      activeFailures: statuses.filter((row) => row.currentStatus === "fail")
        .length,
      averageFailureRates: {
        oneMinute: average(failureFeatures, "failureRate1m"),
        tenMinutes: average(failureFeatures, "failureRate10m"),
        oneHour: average(failureFeatures, "failureRate1h"),
      },
      highestFailures: failureFeatures.slice(0, 3),
    },
    statuses,
    failureFeatures,
    failureTimeseries: timeseriesRows.map((row) => ({
      timeBucket: row.timeBucket,
      failureCount: Number(row.failureCount ?? 0),
    })),
    incidents: incidentRows.map((row) => ({
      ...row,
      durationSeconds: Number(row.durationSeconds ?? 0),
      failureCount: Number(row.failureCount ?? 0),
    })),
  }
}

async function queryApiDetails(apiName) {
  const [statusHistory] = await pool.query(
    `
      SELECT checked_at AS checkedAt, status
      FROM api_status_history
      WHERE api_name = :apiName
      ORDER BY checked_at ASC
      LIMIT 250
    `,
    { apiName }
  )

  const [responseTimeHistory] = await pool.query(
    `
      SELECT checked_at AS checkedAt, response_time_ms AS responseTimeMs, status
      FROM api_monitor_history
      WHERE api_name = :apiName
      ORDER BY checked_at ASC
      LIMIT 250
    `,
    { apiName }
  )

  const [featureRows] = await pool.query(
    `
      SELECT first_failure_time AS firstFailureTime, last_failure_time AS lastFailureTime
      FROM api_failure_features
      WHERE api_name = :apiName
      LIMIT 1
    `,
    { apiName }
  )

  return {
    apiName,
    statusHistory: statusHistory.map((row) => ({
      checkedAt: row.checkedAt,
      status: normalizeStatus(row.status),
    })),
    responseTimeHistory: responseTimeHistory.map((row) => ({
      checkedAt: row.checkedAt,
      responseTimeMs: Number(row.responseTimeMs ?? 0),
      status: normalizeStatus(row.status),
    })),
    firstFailureTime: featureRows[0]?.firstFailureTime ?? null,
    lastFailureTime: featureRows[0]?.lastFailureTime ?? null,
  }
}

app.get("/api/health", async (_request, response) => {
  if (!pool) {
    response.json({ status: "ok", dataSource: "sample" })
    return
  }

  await pool.query("SELECT 1")
  response.json({ status: "ok", dataSource: "mysql" })
})

app.get("/api/api-monitoring/dashboard", async (request, response, next) => {
  try {
    if (!pool) {
      response.json(sampleDashboard)
      return
    }

    response.json(await queryDashboard(request.query.apiName))
  } catch (error) {
    next(error)
  }
})

app.get("/api/api-monitoring/apis/:apiName", async (request, response, next) => {
  try {
    if (!pool) {
      response.json(sampleApiDetails(request.params.apiName))
      return
    }

    response.json(await queryApiDetails(request.params.apiName))
  } catch (error) {
    next(error)
  }
})

app.use((error, _request, response, _next) => {
  console.error(error)
  response.status(500).json({
    message: "Failed to read API monitoring data",
    detail: error instanceof Error ? error.message : "Unknown error",
  })
})

app.listen(port, () => {
  const dataSource = pool ? "MySQL" : "sample data"
  console.log(`API monitoring server listening on ${port} using ${dataSource}`)
})
