/**
 * SearchBar component for filtering logs
 */

import React from "react"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"

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
      <Input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-11 rounded-xl border-border/70 bg-background pr-11 pl-4 text-sm shadow-xs placeholder:text-muted-foreground focus-visible:ring-2"
        aria-label="Search logs"
      />
      <Search className="pointer-events-none absolute top-1/2 right-3.5 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
    </div>
  )
}
