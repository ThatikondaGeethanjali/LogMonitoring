import type { ChangeEvent } from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import type {
  DateRange,
  QuickRangeOption,
} from "@/features/log-monitoring/sidebar"
import { Calendar } from "lucide-react"

const QUICK_RANGE_OPTIONS: Array<Exclude<QuickRangeOption, "all">> = [
  "1hr",
  "2hr",
  "3hr",
  "4hr",
  "5hr",
  "6hr",
]

interface DashboardToolbarProps {
  dateRange: DateRange
  minDate: string
  maxDate: string
  activeQuickRange: QuickRangeOption
  onDateRangeChange: (value: DateRange) => void
  onQuickRangeChange: (value: QuickRangeOption) => void
}

const formatLabelValue = (value: string) =>
  value.includes("T") ? value.replace("T", " ") : value

export function DashboardToolbar({
  dateRange,
  minDate,
  maxDate,
  activeQuickRange,
  onDateRangeChange,
  onQuickRangeChange,
}: DashboardToolbarProps) {
  const handleDateChange =
    (field: keyof DateRange) => (event: ChangeEvent<HTMLInputElement>) => {
      const nextValue = event.target.value
      const nextRange =
        field === "from"
          ? {
              from: nextValue,
              to: nextValue > dateRange.to ? nextValue : dateRange.to,
            }
          : {
              from: nextValue < dateRange.from ? nextValue : dateRange.from,
              to: nextValue,
            }

      onDateRangeChange(nextRange)
    }

  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-[#e3e8f2] bg-white p-3 shadow-[0_4px_14px_rgba(15,23,42,0.03)]">
      <div className="flex flex-wrap items-end gap-3">
        <div className="flex flex-1 flex-wrap items-center gap-2">
          {QUICK_RANGE_OPTIONS.map((option) => (
            <Button
              key={option}
              type="button"
              variant={activeQuickRange === option ? "default" : "outline"}
              onClick={() => onQuickRangeChange(option)}
              className={
                activeQuickRange === option
                  ? "h-9 rounded-xl bg-slate-900 px-3 text-xs text-white hover:bg-slate-800"
                  : "h-9 rounded-xl border-[#e3e8f2] bg-white px-3 text-xs text-slate-600"
              }
            >
              {option}
            </Button>
          ))}
        </div>

        <div className="min-w-[160px] flex-1 sm:flex-none">
          <div className="mb-1 text-xs text-slate-500">From</div>
          <Input
            type="date"
            aria-label="Dashboard filter from date"
            value={dateRange.from.split("T")[0]}
            min={minDate}
            max={maxDate}
            onChange={handleDateChange("from")}
            className="h-10 rounded-xl bg-background text-sm shadow-xs"
          />
        </div>

        <div className="min-w-[160px] flex-1 sm:flex-none">
          <div className="mb-1 text-xs text-slate-500">To</div>
          <Input
            type="date"
            aria-label="Dashboard filter to date"
            value={dateRange.to.split("T")[0]}
            min={dateRange.from.split("T")[0]}
            max={maxDate}
            onChange={handleDateChange("to")}
            className="h-10 rounded-xl bg-background text-sm shadow-xs"
          />
        </div>

        <Button
          type="button"
          variant="outline"
          onClick={() => onQuickRangeChange("all")}
          className="h-10 rounded-xl border-[#e3e8f2] bg-white px-3 text-xs text-slate-600"
        >
          <Calendar className="size-4 text-slate-500" />
          {formatLabelValue(dateRange.from)} - {formatLabelValue(dateRange.to)}
        </Button>
      </div>
    </div>
  )
}
