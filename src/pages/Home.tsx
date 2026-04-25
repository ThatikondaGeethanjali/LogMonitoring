import { Dashboard, SideBar } from "@/features/log-monitoring"
import { DEFAULT_LOGS } from "@/features/log-monitoring/sidebar/constants"
import { useState } from "react"

export default function Home() {
  const [selectedLogId, setSelectedLogId] = useState<string | undefined>(
    DEFAULT_LOGS[0]?.id
  )
  const selectedLog =
    DEFAULT_LOGS.find((log) => log.id === selectedLogId) ?? DEFAULT_LOGS[0]

  return (
    <div className="flex h-full min-h-0 overflow-hidden">
      <div className="h-full w-[26%] min-w-[260px]">
        <SideBar
          logs={DEFAULT_LOGS}
          selectedLogId={selectedLogId}
          onSelectLog={setSelectedLogId}
        />
      </div>
      <div className="min-h-0 flex-1 overflow-auto">
        <Dashboard log={selectedLog} logs={DEFAULT_LOGS} />
      </div>
    </div>
  )
}
