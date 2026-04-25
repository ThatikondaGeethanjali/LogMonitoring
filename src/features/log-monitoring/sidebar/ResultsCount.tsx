/**
 * ResultsCount component for displaying count of filtered logs
 */

import React from "react"

interface ResultsCountProps {
  count: number
}

export const ResultsCount: React.FC<ResultsCountProps> = ({ count }) => {
  return (
    <div className="text-sm font-medium text-slate-500">
      {count} issue{count !== 1 ? "s" : ""} found
    </div>
  )
}
