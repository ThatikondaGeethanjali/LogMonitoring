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
      className={`w-full rounded-2xl border p-5 text-left shadow-sm transition duration-150 focus:ring-4 focus:ring-indigo-100 focus:outline-none ${
        isSelected
          ? "border-indigo-300 bg-indigo-50/60 shadow-[0_0_0_1px_rgba(99,102,241,0.12)]"
          : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/80"
      }`}
      aria-selected={isSelected}
      role="option"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <h3 className="truncate text-[1.05rem] font-semibold text-slate-900">
            {log.name}
          </h3>
          <p className="mt-1 truncate text-sm text-slate-500">{log.package}</p>
        </div>
        <span
          className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold whitespace-nowrap ${getSeverityColor(
            log.severity
          )}`}
        >
          {log.severity}
        </span>
      </div>

      <div className="mt-5 flex items-end justify-between gap-4">
        <div className="flex items-center gap-5 text-sm text-slate-500">
          <span className="flex items-center gap-2">
            <Activity className="h-4 w-4 text-slate-400" />
            <span className="font-semibold text-slate-700">
              {formatNumber(log.occurrences)}
            </span>
          </span>
          <span className="flex items-center gap-2">
            <Users className="h-4 w-4 text-slate-400" />
            <span className="font-semibold text-slate-700">
              {formatNumber(log.userCount)}
            </span>
          </span>
        </div>

        <div className="text-right text-sm leading-6 text-slate-500">
          <div>{formatLogDate(log.lastSeen)}</div>
        </div>
      </div>
    </button>
  )
}
