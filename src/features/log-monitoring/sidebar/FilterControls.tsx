/**
 * Filter controls component for sort and group options
 */

import React from "react"
import { ChevronDown } from "lucide-react"
import type { SortOption, GroupOption } from "./types"

interface FilterControlsProps {
  sortBy: SortOption
  onSortChange: (value: SortOption) => void
  groupBy: GroupOption
  onGroupChange: (value: GroupOption) => void
}

export const FilterControls: React.FC<FilterControlsProps> = ({
  sortBy,
  onSortChange,
  groupBy,
  onGroupChange,
}) => {
  const selectClassName =
    "h-11 w-full appearance-none rounded-xl border border-slate-200 bg-white py-2 pr-10 pl-4 text-sm font-medium text-slate-700 shadow-sm transition focus:border-indigo-200 focus:ring-4 focus:ring-indigo-100 focus:outline-none"

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
      <div className="relative">
        <div className="relative">
          <select
            id="sort"
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value as SortOption)}
            className={selectClassName}
            aria-label="Sort logs"
          >
            <option value="frequency">Sort: Most Frequent</option>
            <option value="recent">Sort: Most Recent</option>
            <option value="impact">Sort: Most Impact</option>
          </select>
          <ChevronDown className="pointer-events-none absolute top-1/2 right-4 h-4 w-4 -translate-y-1/2 text-slate-400" />
        </div>
      </div>

      <div className="relative">
        <div className="relative">
          <select
            id="group"
            value={groupBy}
            onChange={(e) => onGroupChange(e.target.value as GroupOption)}
            className={selectClassName}
            aria-label="Group logs"
          >
            <option value="issue">Group by: Issue</option>
            <option value="severity">Group by: Severity</option>
            <option value="package">Group by: Package</option>
          </select>
          <ChevronDown className="pointer-events-none absolute top-1/2 right-4 h-4 w-4 -translate-y-1/2 text-slate-400" />
        </div>
      </div>
    </div>
  )
}
