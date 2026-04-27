import {
  AppNavigationSidebar,
  type AppView,
} from "@/components/AppNavigationSidebar"
import { ApiMonitoringDashboard } from "@/features/api-monitoring"
import { GoLiveDashboard } from "@/features/api-monitoring/components/GoLiveDashboard"
import { useState } from "react"

export default function Home() {
  const [activeView, setActiveView] = useState<AppView>("go-live")
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)

  return (
    <div className="flex h-full min-h-0 overflow-hidden">
      <AppNavigationSidebar
        activeView={activeView}
        isCollapsed={isSidebarCollapsed}
        onCollapseChange={setIsSidebarCollapsed}
        onViewChange={setActiveView}
      />

      <div className="min-h-0 flex-1 overflow-hidden">
        {activeView === "go-live" ? (
          <GoLiveDashboard />
        ) : (
          <ApiMonitoringDashboard />
        )}
      </div>
    </div>
  )
}
