/**
 * SideBar Component
 *
 * Main sidebar component for displaying crash logs with search, filter, and sorting capabilities.
 * This component is organized into smaller sub-components for better maintainability.
 */

import { useEffect, useState } from "react"
import type { SideBarProps, SortOption } from "./types"
import { DEFAULT_LOGS } from "./constants"
import { useFilteredLogs } from "./hooks"
import { SideBarHeader } from "./SideBarHeader"
import { SearchBar } from "./SearchBar"
import { FilterControls } from "./FilterControls"
import { ResultsCount } from "./ResultsCount"
import { LogList } from "./LogList"
import { Separator } from "@/components/ui/separator"

/**
 * SideBar Component
 * Displays a list of crash logs with filtering and sorting capabilities
 */
export default function SideBar({
  logs = DEFAULT_LOGS,
  selectedLogId,
  onSelectLog,
  isLoading = false,
}: SideBarProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [sortBy, setSortBy] = useState<SortOption>("frequency")
  const [apiName, setApiName] = useState("all")
  const [serviceName, setServiceName] = useState("all")
  const [internalSelectedLogId, setInternalSelectedLogId] = useState(
    selectedLogId ?? logs[0]?.id
  )

  const filteredAndSortedLogs = useFilteredLogs({
    logs,
    searchQuery,
    sortBy,
    apiName: apiName === "all" ? "" : apiName,
    serviceName: serviceName === "all" ? "" : serviceName,
  })

  const activeSelectedLogId = selectedLogId ?? internalSelectedLogId

  useEffect(() => {
    if (selectedLogId !== undefined) {
      return
    }

    if (
      internalSelectedLogId &&
      filteredAndSortedLogs.some((log) => log.id === internalSelectedLogId)
    ) {
      return
    }

    setInternalSelectedLogId(filteredAndSortedLogs[0]?.id)
  }, [filteredAndSortedLogs, internalSelectedLogId, selectedLogId])

  const handleSelectLog = (logId: string) => {
    if (selectedLogId === undefined) {
      setInternalSelectedLogId(logId)
    }

    onSelectLog?.(logId)
  }

  return (
    <aside className="flex h-full min-h-0 flex-col border-r bg-sidebar text-sidebar-foreground">
      <div className="bg-sidebar/95 px-4 py-5 backdrop-blur">
        <SideBarHeader
          title="Crash Logs"
          description="Monitor and analyze crashes in your application"
        />

        <div className="mt-5">
          <SearchBar value={searchQuery} onChange={setSearchQuery} />
        </div>

        <div className="mt-4">
          <FilterControls
            logs={logs}
            sortBy={sortBy}
            onSortChange={setSortBy}
            apiName={apiName}
            onApiNameChange={setApiName}
            serviceName={serviceName}
            onServiceNameChange={setServiceName}
          />
        </div>

        <div className="mt-4">
          <ResultsCount count={filteredAndSortedLogs.length} />
        </div>

        <Separator className="mt-4" />
      </div>

      <div className="flex-1 overflow-y-auto">
        <LogList
          logs={filteredAndSortedLogs}
          selectedLogId={activeSelectedLogId}
          onSelectLog={handleSelectLog}
          isLoading={isLoading}
        />
      </div>
    </aside>
  )
}
