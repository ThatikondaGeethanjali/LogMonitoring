import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import type { ApiStatusRow } from "@/features/api-monitoring/types"
import { formatDateTime } from "@/features/api-monitoring/utils"
import { cn } from "@/lib/utils"
import { AlertTriangle, CheckCircle2, Clock3, XCircle } from "lucide-react"

interface StatusTableProps {
  statuses: ApiStatusRow[]
  selectedApi: string
  onSelectApi: (apiName: string) => void
}

export function StatusTable({
  onSelectApi,
  selectedApi,
  statuses,
}: StatusTableProps) {
  return (
    <Card className="dashboard-card rounded-lg">
      <CardHeader className="flex-row items-center justify-between gap-3 px-4 pt-4">
        <div>
          <CardTitle>Live API Status</CardTitle>
          <p className="mt-1 text-sm text-muted-foreground">
            Auto-refreshes every 10 seconds
          </p>
        </div>
        <Clock3 className="size-4 text-muted-foreground" aria-hidden="true" />
      </CardHeader>
      <CardContent className="px-4 pb-4">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>API Name</TableHead>
              <TableHead>Current Status</TableHead>
              <TableHead className="text-right">Consecutive Failures</TableHead>
              <TableHead>Last Checked</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {statuses.map((row) => {
              const isFailed = row.currentStatus === "fail"
              const isSelected = selectedApi === row.apiName

              return (
                <TableRow
                  key={row.apiName}
                  className={cn(
                    "cursor-pointer transition-all active:scale-[0.998]",
                    isSelected && "bg-sky-50 shadow-[inset_3px_0_0_#0ea5e9] hover:bg-sky-50",
                    isFailed && "bg-red-50/50 hover:bg-red-50",
                    !isSelected && !isFailed && "hover:bg-sky-50/60"
                  )}
                  onClick={() => onSelectApi(row.apiName)}
                >
                  <TableCell className="font-medium">{row.apiName}</TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={cn(
                        "gap-1.5",
                        isFailed
                          ? "border-red-200 bg-red-50 text-red-700"
                          : "border-emerald-200 bg-emerald-50 text-emerald-700"
                      )}
                    >
                      {isFailed ? (
                        <XCircle className="size-3.5" aria-hidden="true" />
                      ) : (
                        <CheckCircle2
                          className="size-3.5"
                          aria-hidden="true"
                        />
                      )}
                      {isFailed ? "Fail" : "Success"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <span
                      className={cn(
                        "inline-flex min-w-8 justify-center rounded-md px-2 py-1 text-xs font-semibold",
                        row.consecutiveFailures > 5
                          ? "bg-red-100 text-red-700"
                          : row.consecutiveFailures > 0
                            ? "bg-amber-100 text-amber-700"
                            : "bg-emerald-100 text-emerald-700"
                      )}
                    >
                      {row.consecutiveFailures}
                    </span>
                    {row.consecutiveFailures > 5 ? (
                      <AlertTriangle
                        className="ml-2 inline size-4 text-red-600"
                        aria-label="Alert: more than five consecutive failures"
                      />
                    ) : null}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {formatDateTime(row.lastCheckedTime)}
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
