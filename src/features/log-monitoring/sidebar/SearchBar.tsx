/**
 * SearchBar component for filtering logs
 */

import React from "react"
import { Search } from "lucide-react"

interface SearchBarProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

export const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChange,
  placeholder = "Search by exception, class or message...",
}) => {
  return (
    <div className="relative">
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-12 w-full rounded-xl border border-slate-200 bg-white pr-12 pl-4 text-sm text-slate-700 shadow-sm transition placeholder:text-slate-400 focus:border-indigo-200 focus:ring-4 focus:ring-indigo-100 focus:outline-none"
        aria-label="Search logs"
      />
      <Search className="pointer-events-none absolute top-1/2 right-4 h-4 w-4 -translate-y-1/2 text-slate-400" />
    </div>
  )
}
