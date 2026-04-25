/**
 * LogItem component for displaying individual log entries
 */

import React from "react"
import { Activity, Users } from "lucide-react"
import type { Log } from "./types"
import { getSeverityColor, formatLogDate, formatNumber } from "./utils"

interface LogItemProps {
  log: Log
  isSelected: boolean
  onClick: () => void
}

export const LogItem: React.FC<LogItemProps> = ({
  log,
  isSelected,
  onClick,
}) => {
  return (
    <button
      onClick={onClick}
      className={`w-full rounded-xl border px-4 py-3.5 text-left shadow-sm transition duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring/50 ${
        isSelected
          ? "border-blue-500 bg-blue-50/70 shadow-[0_0_0_1px_rgba(59,130,246,0.18)]"
          : "border-border bg-card hover:border-border/90 hover:bg-accent/35"
      }`}
      aria-selected={isSelected}
      role="option"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="truncate text-sm font-semibold text-foreground">
            {log.name}
          </h3>
          <p className="mt-0.5 truncate text-xs text-muted-foreground">
            {log.package}
          </p>
        </div>
        <span
          className={`shrink-0 rounded-full px-2 py-0.5 text-[11px] font-semibold whitespace-nowrap ${getSeverityColor(
            log.severity
          )}`}
        >
          {log.severity}
        </span>
      </div>

      <div className="mt-3 flex items-end justify-between gap-3">
        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <Activity className="h-3.5 w-3.5 text-muted-foreground" />
            <span className="font-medium text-foreground">
              {formatNumber(log.occurrences)}
            </span>
          </span>
          <span className="flex items-center gap-1.5">
            <Users className="h-3.5 w-3.5 text-muted-foreground" />
            <span className="font-medium text-foreground">
              {formatNumber(log.userCount)}
            </span>
          </span>
        </div>

        <div className="text-right text-[11px] leading-5 text-muted-foreground">
          <div>{formatLogDate(log.lastSeen)}</div>
        </div>
      </div>
    </button>
  )
}
