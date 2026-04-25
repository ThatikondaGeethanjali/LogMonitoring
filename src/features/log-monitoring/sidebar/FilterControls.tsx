/**
 * Filter controls component for sort and group options
 */

import React from "react"
import type { SortOption, GroupOption } from "./types"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

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
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
      <Select
        value={sortBy}
        onValueChange={(value) => onSortChange(value as SortOption)}
      >
        <SelectTrigger
          aria-label="Sort logs"
          className="h-11 w-full rounded-xl bg-background px-4 shadow-xs"
        >
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="frequency">Sort: Most Frequent</SelectItem>
          <SelectItem value="recent">Sort: Most Recent</SelectItem>
          <SelectItem value="impact">Sort: Most Impact</SelectItem>
        </SelectContent>
      </Select>

      <Select
        value={groupBy}
        onValueChange={(value) => onGroupChange(value as GroupOption)}
      >
        <SelectTrigger
          aria-label="Group logs"
          className="h-11 w-full rounded-xl bg-background px-4 shadow-xs"
        >
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="issue">Group by: Issue</SelectItem>
          <SelectItem value="severity">Group by: Severity</SelectItem>
          <SelectItem value="package">Group by: Package</SelectItem>
        </SelectContent>
      </Select>
    </div>
  )
}
