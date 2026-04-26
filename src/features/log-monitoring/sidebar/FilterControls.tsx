/**
 * Filter controls component for sort and log filters
 */

import React from "react"
import type { Log, SortOption } from "./types"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface FilterControlsProps {
  logs: Log[]
  sortBy: SortOption
  onSortChange: (value: SortOption) => void
  apiName: string
  onApiNameChange: (value: string) => void
  serviceName: string
  onServiceNameChange: (value: string) => void
}

export const FilterControls: React.FC<FilterControlsProps> = ({
  logs,
  sortBy,
  onSortChange,
  apiName,
  onApiNameChange,
  serviceName,
  onServiceNameChange,
}) => {
  const apiOptions = Array.from(
    new Set(logs.map((log) => log.apiServiceName ?? log.name).filter(Boolean))
  ).sort((a, b) => a.localeCompare(b))

  const serviceOptions = Array.from(
    new Set(logs.map((log) => log.serviceName ?? log.package).filter(Boolean))
  ).sort((a, b) => a.localeCompare(b))

  return (
    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
      <div className="min-w-0">
        <Select
          value={sortBy}
          onValueChange={(value) => onSortChange(value as SortOption)}
        >
          <SelectTrigger
            aria-label="Sort logs"
            className="h-10 w-full min-w-0 rounded-xl bg-background px-3 text-sm shadow-xs"
          >
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="frequency">Sort: Most Frequent</SelectItem>
            <SelectItem value="recent">Sort: Most Recent</SelectItem>
            <SelectItem value="impact">Sort: Most Impact</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="min-w-0">
        <Select value={apiName} onValueChange={onApiNameChange}>
          <SelectTrigger
            aria-label="Filter by API name"
            className="h-10 w-full min-w-0 rounded-xl bg-background px-3 text-sm shadow-xs"
          >
            <SelectValue placeholder="Filter: API Name" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All API Names</SelectItem>
            {apiOptions.map((option) => (
              <SelectItem key={option} value={option}>
                {option}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="min-w-0 sm:col-span-2">
        <Select value={serviceName} onValueChange={onServiceNameChange}>
          <SelectTrigger
            aria-label="Filter by service name"
            className="h-10 w-full min-w-0 rounded-xl bg-background px-3 text-sm shadow-xs"
          >
            <SelectValue placeholder="Filter: Service Name" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Service Names</SelectItem>
            {serviceOptions.map((option) => (
              <SelectItem key={option} value={option}>
                {option}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}
