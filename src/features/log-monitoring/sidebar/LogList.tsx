/**
 * LogList component for displaying list of logs with loading and empty states
 */

import React from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import type { Log } from "./types"
import { LogItem } from "./LogItem"
import { Button } from "@/components/ui/button"

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
  const pageSize = 15
  const visiblePageCount = 5
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
  const pageWindowStart =
    Math.floor((currentPage - 1) / visiblePageCount) * visiblePageCount + 1
  const pageWindowEnd = Math.min(
    totalPages,
    pageWindowStart + visiblePageCount - 1
  )
  const visiblePages = Array.from(
    { length: pageWindowEnd - pageWindowStart + 1 },
    (_, index) => pageWindowStart + index
  )

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center px-6 py-10">
        <div className="rounded-2xl border bg-card px-5 py-4 text-sm text-muted-foreground shadow-sm">
          Loading logs...
        </div>
      </div>
    )
  }

  if (logs.length === 0) {
    return (
      <div className="px-6 py-10">
        <div className="rounded-2xl border border-dashed bg-card px-6 py-10 text-center">
          <p className="text-sm text-muted-foreground">No logs found</p>
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
        <div className="border-t bg-background/95 px-6 py-4">
          <div className="flex items-center justify-center gap-1 text-sm text-muted-foreground">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
              disabled={currentPage === 1}
              aria-label="Previous page"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>

            {visiblePages.map((page) => (
              <Button
                key={page}
                type="button"
                variant={currentPage === page ? "secondary" : "ghost"}
                onClick={() => setCurrentPage(page)}
                className="h-9 min-w-9 px-3"
                aria-current={currentPage === page ? "page" : undefined}
              >
                {page}
              </Button>
            ))}

            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() =>
                setCurrentPage((page) => Math.min(totalPages, page + 1))
              }
              disabled={currentPage === totalPages}
              aria-label="Next page"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      ) : null}
    </div>
  )
}
