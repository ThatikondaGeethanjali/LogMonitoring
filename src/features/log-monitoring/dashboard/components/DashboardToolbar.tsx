import { Button } from "@/components/ui/button"
import { Calendar, Download, Filter } from "lucide-react"

export function DashboardToolbar() {
  return (
    <div className="flex flex-wrap items-center justify-start gap-3 sm:justify-end">
      <Button
        variant="outline"
        className="h-10 rounded-xl border-[#e3e8f2] bg-white px-3 text-xs text-slate-600 sm:px-4 sm:text-sm"
      >
        <Calendar className="size-4 text-slate-500" />
        May 12 - May 19, 2024
      </Button>
      <Button
        variant="outline"
        className="h-10 rounded-xl border-[#e3e8f2] bg-white px-3 text-xs text-slate-600 sm:px-4 sm:text-sm"
      >
        <Filter className="size-4 text-slate-500" />
        Filters
      </Button>
      <Button
        variant="outline"
        className="h-10 rounded-xl border-[#e3e8f2] bg-white px-3 text-xs text-slate-600 sm:px-4 sm:text-sm"
      >
        <Download className="size-4 text-slate-500" />
        Export
      </Button>
    </div>
  )
}
