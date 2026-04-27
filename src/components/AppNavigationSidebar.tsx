import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import {
  Activity,
  ChevronLeft,
  ChevronRight,
  RadioTower,
  ServerCog,
} from "lucide-react"

export type AppView = "go-live" | "api-monitoring"

interface AppNavigationSidebarProps {
  activeView: AppView
  isCollapsed: boolean
  onCollapseChange: (isCollapsed: boolean) => void
  onViewChange: (view: AppView) => void
}

const navigationItems: Array<{
  view: AppView
  label: string
  icon: typeof RadioTower
}> = [
  { view: "go-live", label: "Go Live", icon: RadioTower },
  { view: "api-monitoring", label: "API Monitoring", icon: ServerCog },
]

export function AppNavigationSidebar({
  activeView,
  isCollapsed,
  onCollapseChange,
  onViewChange,
}: AppNavigationSidebarProps) {
  return (
    <aside
      className={cn(
        "flex h-full min-h-0 shrink-0 flex-col border-r border-white/10 bg-[linear-gradient(180deg,#07111f_0%,#0f172a_46%,#111827_100%)] text-white shadow-[12px_0_40px_rgb(15_23_42/0.18)] transition-[width] duration-200",
        isCollapsed ? "w-16" : "w-56"
      )}
    >
      <div className="flex h-16 items-center gap-3 border-b border-white/10 px-3">
        <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-sky-500 text-white shadow-[0_10px_28px_rgb(14_165_233/0.35)]">
          <Activity className="size-5" aria-hidden="true" />
        </div>
        {!isCollapsed ? (
          <div className="min-w-0">
            <div className="truncate text-sm font-semibold">IBL Logs</div>
            <div className="truncate text-xs text-zinc-400">Operations</div>
          </div>
        ) : null}
      </div>

      <nav className="flex-1 space-y-2 px-2 py-4">
        {navigationItems.map((item) => {
          const Icon = item.icon
          const isActive = activeView === item.view

          return (
            <button
              key={item.view}
              type="button"
              onClick={() => onViewChange(item.view)}
              className={cn(
                "pressable group relative flex h-10 w-full items-center gap-3 overflow-hidden rounded-lg px-2.5 text-sm font-medium transition focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-300",
                isActive
                  ? "bg-white text-zinc-950 shadow-[0_12px_28px_rgb(255_255_255/0.14)]"
                  : "text-zinc-300 hover:bg-white/10 hover:text-white hover:shadow-[inset_0_0_0_1px_rgb(255_255_255/0.08)]",
                isCollapsed && "justify-center"
              )}
              aria-current={isActive ? "page" : undefined}
              title={isCollapsed ? item.label : undefined}
            >
              {isActive ? (
                <span className="absolute left-0 top-1/2 h-5 w-1 -translate-y-1/2 rounded-r-full bg-sky-500" />
              ) : null}
              <Icon className="size-4 shrink-0" aria-hidden="true" />
              {!isCollapsed ? (
                <span className="truncate">{item.label}</span>
              ) : null}
            </button>
          )
        })}
      </nav>

      <div className="border-t border-white/10 p-2">
        <Button
          type="button"
          variant="ghost"
          size={isCollapsed ? "icon" : "default"}
          className={cn(
            "text-zinc-300 hover:bg-white/10 hover:text-white",
            isCollapsed ? "w-full" : "w-full justify-start"
          )}
          onClick={() => onCollapseChange(!isCollapsed)}
          aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {isCollapsed ? (
            <ChevronRight className="size-4" aria-hidden="true" />
          ) : (
            <>
              <ChevronLeft className="size-4" aria-hidden="true" />
              Collapse
            </>
          )}
        </Button>
      </div>
    </aside>
  )
}
