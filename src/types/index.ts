export interface Log {
  id: string
  message: string
  level: "info" | "warn" | "error" | "debug"
  source: string
  timestamp: string
  metadata?: Record<string, unknown>
}

export interface CreateLogPayload {
  message: string
  level: "info" | "warn" | "error" | "debug"
  source: string
  metadata?: Record<string, unknown>
}

export interface ApiError {
  message: string
  code?: string
  status?: number
}
