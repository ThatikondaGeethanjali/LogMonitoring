/**
 * Filter controls component for sort and log filters
 */

import type { SortOption } from "./types"
import { ALL_FILTER_VALUE, SORT_OPTIONS } from "./constants"
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
  apiName: string
  onApiNameChange: (value: string) => void
  serviceName: string
  onServiceNameChange: (value: string) => void
  apiOptions: string[]
  serviceOptions: string[]
}

interface FilterSelectProps {
  ariaLabel: string
  value: string
  placeholder: string
  allLabel: string
  options: string[]
  onValueChange: (value: string) => void
  className?: string
}

function FilterSelect({
  ariaLabel,
  value,
  placeholder,
  allLabel,
  options,
  onValueChange,
  className,
}: FilterSelectProps) {
  return (
    <div className={className ?? "min-w-0"}>
      <Select value={value} onValueChange={onValueChange}>
        <SelectTrigger
          aria-label={ariaLabel}
          className="h-10 w-full min-w-0 rounded-xl bg-background px-3 text-sm shadow-xs"
        >
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={ALL_FILTER_VALUE}>{allLabel}</SelectItem>
          {options.map((option) => (
            <SelectItem key={option} value={option}>
              {option}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}

export function FilterControls({
  sortBy,
  onSortChange,
  apiName,
  onApiNameChange,
  serviceName,
  onServiceNameChange,
  apiOptions,
  serviceOptions,
}: FilterControlsProps) {
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
            {SORT_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <FilterSelect
        ariaLabel="Filter by API name"
        value={apiName}
        placeholder="Filter: API Name"
        allLabel="All API Names"
        options={apiOptions}
        onValueChange={onApiNameChange}
      />

      <FilterSelect
        ariaLabel="Filter by service name"
        value={serviceName}
        placeholder="Filter: Service Name"
        allLabel="All Service Names"
        options={serviceOptions}
        onValueChange={onServiceNameChange}
        className="min-w-0 sm:col-span-2"
      />
    </div>
  )
}
