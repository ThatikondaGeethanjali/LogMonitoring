/**
 * LogList component for displaying list of logs with loading and empty states
 */

import React from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import type { Log } from "./types"
import { LogItem } from "./LogItem"

interface LogListProps {
  logs: Log[]
  selectedLogId?: string
  onSelectLog: (logId: string) => void
  isLoading?: boolean
}

export const LogList: React.FC<LogListProps> = ({
  logs,
  selectedLogId,
  onSelectLog,
  isLoading = false,
}) => {
  const [currentPage, setCurrentPage] = React.useState(1)
  const pageSize = 7
  const totalPages = Math.max(1, Math.ceil(logs.length / pageSize))

  React.useEffect(() => {
    setCurrentPage(1)
  }, [logs])

  React.useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages)
    }
  }, [currentPage, totalPages])

  const startIndex = (currentPage - 1) * pageSize
  const paginatedLogs = logs.slice(startIndex, startIndex + pageSize)

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center px-6 py-10">
        <div className="rounded-2xl border border-slate-200 bg-white px-5 py-4 text-sm text-slate-500 shadow-sm">
          Loading logs...
        </div>
      </div>
    )
  }

  if (logs.length === 0) {
    return (
      <div className="px-6 py-10">
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-10 text-center">
          <p className="text-sm text-slate-500">No logs found</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-full flex-col">
      <div className="flex-1 space-y-4 overflow-y-auto px-3 py-3">
        {paginatedLogs.map((log) => (
          <LogItem
            key={log.id}
            log={log}
            isSelected={selectedLogId === log.id}
            onClick={() => onSelectLog(log.id)}
          />
        ))}
      </div>

      {totalPages > 1 ? (
        <div className="border-t border-slate-200 bg-white px-6 py-4">
          <div className="flex items-center justify-center gap-1 text-sm text-slate-500">
            <button
              type="button"
              onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
              disabled={currentPage === 1}
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-transparent transition hover:border-slate-200 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
              aria-label="Previous page"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>

            {Array.from({ length: totalPages }, (_, index) => index + 1).map(
              (page) => (
                <button
                  key={page}
                  type="button"
                  onClick={() => setCurrentPage(page)}
                  className={`flex h-9 min-w-9 items-center justify-center rounded-lg border px-3 transition ${
                    currentPage === page
                      ? "border-indigo-300 bg-indigo-50 text-indigo-600"
                      : "border-transparent bg-transparent text-slate-500 hover:border-slate-200 hover:bg-slate-50"
                  }`}
                  aria-current={currentPage === page ? "page" : undefined}
                >
                  {page}
                </button>
              )
            )}

            <button
              type="button"
              onClick={() =>
                setCurrentPage((page) => Math.min(totalPages, page + 1))
              }
              disabled={currentPage === totalPages}
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-transparent transition hover:border-slate-200 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
              aria-label="Next page"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      ) : null}
    </div>
  )
}
