import { Button } from "@/components/ui/button"
import type { Log } from "@/features/log-monitoring/sidebar"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import { DashboardCard } from "./DashboardCard"
import { KeyValueList } from "./KeyValueList"

interface OccurrencesAndDetailsProps {
  log: Log
  logs: Log[]
}

export function OccurrencesAndDetails({
  log,
  logs,
}: OccurrencesAndDetailsProps) {
  const recentServices = [...logs]
    .sort((first, second) => {
      const firstTime = new Date(first.lastSeen).getTime()
      const secondTime = new Date(second.lastSeen).getTime()
      return secondTime - firstTime
    })
    .slice(0, 5)

  const details = [
    ["API Name", log.name],
    ["Service Name", log.package],
    ["Status", log.status || "--"],
    ["Priority", log.priority || "--"],
    ["Error Code", log.errorCode || "--"],
    ["Message", log.errorDescription || "--"],
    ["Escalation Level", `${log.escalationLevel ?? 0}`],
    ["Escalation Count", `${log.escalationCount ?? 0}`],
    ["Desired Count", `${log.desiredCount ?? 0}`],
  ] as const

  return (
    <div className="grid gap-4 xl:grid-cols-[1.05fr_1fr]">
      <DashboardCard title="Recent Services">
        <div className="mt-4 overflow-x-auto">
          <Table className="min-w-[640px] text-left">
            <TableHeader>
              <TableRow className="border-[#edf1f7] text-xs text-slate-500 hover:bg-transparent">
                {[
                  "Last Updated",
                  "API Name",
                  "Service Name",
                  "Status",
                  "Errors",
                ].map((heading) => (
                  <TableHead
                    key={heading}
                    className="pr-3 pb-3 pl-0 text-xs font-medium text-slate-500"
                  >
                    {heading}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentServices.map((row) => (
                <TableRow
                  key={row.id}
                  className="border-[#f2f4f8] text-xs text-slate-600"
                >
                  <TableCell className="py-3 pr-3 pl-0 text-xs whitespace-nowrap">
                    {row.lastUpdateTimestamp || "--"}
                  </TableCell>
                  <TableCell className="py-3 pr-3 pl-0 text-xs whitespace-nowrap">
                    {row.name}
                  </TableCell>
                  <TableCell className="py-3 pr-3 pl-0 text-xs whitespace-nowrap">
                    {row.package}
                  </TableCell>
                  <TableCell className="py-3 pr-3 pl-0 text-xs whitespace-nowrap">
                    {row.status || "--"}
                  </TableCell>
                  <TableCell className="py-3 pr-3 pl-0 text-xs whitespace-nowrap">
                    {row.occurrences}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <Button
          variant="link"
          className="mt-4 h-auto p-0 text-sm font-medium text-[#4f46e5] hover:text-[#4338ca]"
        >
          View all services
        </Button>
      </DashboardCard>

      <DashboardCard title="Service Details">
        <KeyValueList items={details} compact />
      </DashboardCard>
    </div>
  )
}
