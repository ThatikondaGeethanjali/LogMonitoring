import { useEffect } from "react"
import { useLogs } from "@/hooks/useLogs"
import { Button } from "@/components/ui/button"

export function Dashboard() {
  const { logs, isLoading, error, getAllLogs } = useLogs()

  useEffect(() => {
    getAllLogs()
  }, [getAllLogs])

  return (
    <div className="flex min-h-svh flex-col gap-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-medium">Log Dashboard</h1>
        <Button onClick={getAllLogs} disabled={isLoading}>
          {isLoading ? "Loading..." : "Refresh"}
        </Button>
      </div>

      {error && (
        <div className="rounded-md bg-red-50 p-4 text-sm text-red-600">
          {error}
        </div>
      )}

      <div className="flex flex-col gap-3">
        {logs.length === 0 && !isLoading ? (
          <p className="text-sm text-muted-foreground">No logs found.</p>
        ) : (
          logs.map((log) => (
            <div
              key={log.id}
              className="flex items-center justify-between rounded-lg border p-4"
            >
              <div className="flex flex-col gap-1">
                <span className="font-medium">{log.message}</span>
                <span className="text-xs text-muted-foreground">
                  {log.source} · {new Date(log.timestamp).toLocaleString()}
                </span>
              </div>
              <span
                className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                  log.level === "error"
                    ? "bg-red-100 text-red-700"
                    : log.level === "warn"
                      ? "bg-yellow-100 text-yellow-700"
                      : log.level === "debug"
                        ? "bg-gray-100 text-gray-700"
                        : "bg-blue-100 text-blue-700"
                }`}
              >
                {log.level}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default Dashboard
