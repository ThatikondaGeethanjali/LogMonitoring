import { Dashboard, SideBar } from "@/features/log-monitoring"
import { DEFAULT_LOGS } from "@/features/log-monitoring/sidebar/constants"
import {
  getDateFilterBounds,
  getDefaultDateRange,
  getQuickRangeDateRange,
} from "@/features/log-monitoring/sidebar/hooks"
import type { DateRange, QuickRangeOption } from "@/features/log-monitoring/sidebar"
import { useState } from "react"

export default function Home() {
  const [dateRange, setDateRange] = useState<DateRange>(() =>
    getDefaultDateRange()
  )
  const [activeQuickRange, setActiveQuickRange] =
    useState<QuickRangeOption>("all")
  const [selectedLogId, setSelectedLogId] = useState<string | undefined>(
    DEFAULT_LOGS[0]?.id
  )
  const { minDate, maxDate } = getDateFilterBounds(DEFAULT_LOGS)
  const selectedLog =
    DEFAULT_LOGS.find((log) => log.id === selectedLogId) ?? DEFAULT_LOGS[0]

  const handleDateRangeChange = (nextDateRange: DateRange) => {
    setDateRange(nextDateRange)
    setActiveQuickRange("all")
  }

  const handleQuickRangeChange = (nextQuickRange: QuickRangeOption) => {
    setActiveQuickRange(nextQuickRange)
    setDateRange(
      nextQuickRange === "all"
        ? getDefaultDateRange()
        : getQuickRangeDateRange(nextQuickRange)
    )
  }

  return (
    <div className="flex h-full min-h-0 overflow-hidden">
      <div className="h-full w-[26%] min-w-[260px]">
        <SideBar
          logs={DEFAULT_LOGS}
          dateRange={dateRange}
          selectedLogId={selectedLogId}
          onSelectLog={setSelectedLogId}
        />
      </div>
      <div className="min-h-0 flex-1 overflow-auto">
        <Dashboard
          log={selectedLog}
          logs={DEFAULT_LOGS}
          dateRange={dateRange}
          minDate={minDate}
          maxDate={maxDate}
          activeQuickRange={activeQuickRange}
          onDateRangeChange={handleDateRangeChange}
          onQuickRangeChange={handleQuickRangeChange}
        />
      </div>
    </div>
  )
}
