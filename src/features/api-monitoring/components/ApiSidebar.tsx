import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import type {
  ApiSidebarItem,
  ApiSortOption,
} from "@/features/api-monitoring/types"
import {
  formatDateTime,
  formatPercent,
  formatServiceName,
} from "@/features/api-monitoring/utils"
import { cn } from "@/lib/utils"
import {
  Activity,
  AlertTriangle,
  CheckCircle2,
  Clock3,
  Search,
  Server,
  XCircle,
} from "lucide-react"

const ALL_SERVICES = "all-services"

const SORT_OPTIONS: Array<{ value: ApiSortOption; label: string }> = [
  { value: "occurred", label: "Most occurred" },
  { value: "recent", label: "Most recent" },
  { value: "failure-rate", label: "Highest failure rate" },
]

interface ApiSidebarProps {
  items: ApiSidebarItem[]
  selectedApi: string
  serviceFilter: string
  searchQuery: string
  sortBy: ApiSortOption
  onSelectApi: (apiName: string) => void
  onServiceFilterChange: (serviceName: string) => void
  onSearchQueryChange: (value: string) => void
  onSortChange: (value: ApiSortOption) => void
}

export function ApiSidebar({
  items,
  onSearchQueryChange,
  onSelectApi,
  onServiceFilterChange,
  onSortChange,
  searchQuery,
  selectedApi,
  serviceFilter,
  sortBy,
}: ApiSidebarProps) {
  const serviceOptions = Array.from(
    new Set(items.map((item) => item.serviceName))
  ).sort((a, b) => a.localeCompare(b))

  return (
    <aside className="flex h-full min-h-0 flex-col border-r border-zinc-200/80 bg-white/90 text-sidebar-foreground shadow-[8px_0_32px_rgb(15_23_42/0.05)] backdrop-blur-xl">
      <div className="bg-white/80 px-4 py-5 backdrop-blur">
        <div>
          <div className="flex items-center gap-2">
            <div className="rounded-md border border-sky-200 bg-sky-50 p-2 text-sky-700 shadow-sm">
              <Server className="size-4" aria-hidden="true" />
            </div>
            <div className="min-w-0">
              <h2 className="text-base font-semibold">APIs</h2>
              <p className="text-xs text-muted-foreground">
                Filter services and incidents
              </p>
            </div>
          </div>
        </div>

        <div className="mt-5 space-y-3">
          <div className="relative">
            <Input
              type="text"
              placeholder="Search API, service, status..."
              value={searchQuery}
              onChange={(event) => onSearchQueryChange(event.target.value)}
              className="h-11 rounded-xl border-zinc-200 bg-white pr-11 pl-4 text-sm shadow-sm transition-all placeholder:text-zinc-400 hover:border-sky-200 focus-visible:border-sky-300 focus-visible:ring-4 focus-visible:ring-sky-100"
              aria-label="Search APIs by words"
            />
            <Search
              className="pointer-events-none absolute top-1/2 right-3.5 size-4 -translate-y-1/2 text-muted-foreground"
              aria-hidden="true"
            />
          </div>

          <div className="grid gap-2">
            <Select
              value={serviceFilter}
              onValueChange={onServiceFilterChange}
            >
              <SelectTrigger
                aria-label="Filter by service"
                className="h-10 w-full rounded-xl border-zinc-200 bg-white px-3 text-sm shadow-sm transition-all hover:border-sky-200 focus:ring-4 focus:ring-sky-100"
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={ALL_SERVICES}>All services</SelectItem>
                {serviceOptions.map((serviceName) => (
                  <SelectItem key={serviceName} value={serviceName}>
                    {formatServiceName(serviceName)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={sortBy}
              onValueChange={(value) => onSortChange(value as ApiSortOption)}
            >
              <SelectTrigger
                aria-label="Sort APIs"
                className="h-10 w-full rounded-xl border-zinc-200 bg-white px-3 text-sm shadow-sm transition-all hover:border-sky-200 focus:ring-4 focus:ring-sky-100"
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
        </div>

        <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
          <span>{items.length} APIs found</span>
          <span className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-2 py-1 font-medium text-emerald-700">
            <span className="live-dot" />
            Live
          </span>
        </div>

        <Separator className="mt-4" />
      </div>

      <div className="flex-1 space-y-3 overflow-y-auto px-3 py-3">
        {items.length === 0 ? (
          <div className="rounded-lg border border-dashed bg-card px-4 py-8 text-center text-sm text-muted-foreground">
            No APIs found
          </div>
        ) : (
          items.map((item) => (
            <button
              key={item.apiName}
              type="button"
              onClick={() => onSelectApi(item.apiName)}
              className={cn(
                "pressable group relative w-full overflow-hidden rounded-lg border bg-card px-4 py-3 text-left shadow-sm transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring/50",
                selectedApi === item.apiName
                  ? "border-sky-400 bg-sky-50 shadow-[0_14px_34px_rgb(14_165_233/0.16)]"
                  : "hover:-translate-y-0.5 hover:border-sky-200 hover:bg-white hover:shadow-[0_14px_32px_rgb(15_23_42/0.08)]",
                item.failureRate10m > 50 && "border-red-200 bg-red-50/70"
              )}
              aria-selected={selectedApi === item.apiName}
            >
              <span
                className={cn(
                  "absolute inset-y-3 left-0 w-1 rounded-r-full transition-opacity",
                  selectedApi === item.apiName
                    ? "bg-sky-500 opacity-100"
                    : "bg-sky-300 opacity-0 group-hover:opacity-100"
                )}
              />
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <h3 className="truncate text-sm font-semibold">
                    {item.apiName}
                  </h3>
                  <p className="mt-0.5 truncate text-xs text-muted-foreground">
                    {formatServiceName(item.serviceName)}
                  </p>
                </div>
                <Badge
                  variant="outline"
                  className={cn(
                    "shrink-0 gap-1",
                    item.currentStatus === "fail"
                      ? "border-red-200 bg-red-50 text-red-700"
                      : "border-emerald-200 bg-emerald-50 text-emerald-700"
                  )}
                >
                  {item.currentStatus === "fail" ? (
                    <XCircle className="size-3" aria-hidden="true" />
                  ) : (
                    <CheckCircle2 className="size-3" aria-hidden="true" />
                  )}
                  {item.currentStatus === "fail" ? "Fail" : "OK"}
                </Badge>
              </div>

              <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <Activity className="size-3.5" aria-hidden="true" />
                  <span className="font-medium text-foreground">
                    {item.failureCount}
                  </span>
                  occurred
                </span>
                <span className="flex items-center justify-end gap-1.5">
                  <AlertTriangle
                    className={cn(
                      "size-3.5",
                      item.consecutiveFailures > 5
                        ? "text-red-600"
                        : "text-muted-foreground"
                    )}
                    aria-hidden="true"
                  />
                  <span className="font-medium text-foreground">
                    {item.consecutiveFailures}
                  </span>
                  streak
                </span>
                <span className="col-span-2 flex items-center justify-between gap-2">
                  <span className="flex items-center gap-1.5">
                    <Clock3 className="size-3.5" aria-hidden="true" />
                    {formatDateTime(item.lastCheckedTime)}
                  </span>
                  <span
                  className={cn(
                      "rounded-md px-1.5 py-0.5 font-semibold shadow-sm",
                      item.failureRate10m > 50
                        ? "bg-red-100 text-red-700"
                        : "bg-zinc-100 text-zinc-700"
                    )}
                  >
                    {formatPercent(item.failureRate10m)}
                  </span>
                </span>
              </div>
            </button>
          ))
        )}
      </div>
    </aside>
  )
}

export { ALL_SERVICES }
