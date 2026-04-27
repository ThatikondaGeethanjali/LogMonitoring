import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import type { FailureEvent } from "@/features/api-monitoring/types"
import {
  formatDateTime,
  formatDuration,
} from "@/features/api-monitoring/utils"

interface IncidentTableProps {
  incidents: FailureEvent[]
}

export function IncidentTable({ incidents }: IncidentTableProps) {
  return (
    <Card className="dashboard-card rounded-lg">
      <CardHeader className="px-4 pt-4">
        <CardTitle>Incident History</CardTitle>
      </CardHeader>
      <CardContent className="px-4 pb-4">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>API Name</TableHead>
              <TableHead>Failure Start</TableHead>
              <TableHead>Failure End</TableHead>
              <TableHead>Duration</TableHead>
              <TableHead className="text-right">Failure Count</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {incidents.map((incident) => (
              <TableRow
                key={`${incident.apiName}-${incident.failureStartTime}`}
                className={
                  !incident.failureEndTime
                    ? "bg-red-50/50 hover:bg-red-50"
                    : "hover:bg-sky-50/60"
                }
              >
                <TableCell className="font-medium">
                  {incident.apiName}
                </TableCell>
                <TableCell>
                  {formatDateTime(incident.failureStartTime)}
                </TableCell>
                <TableCell>{formatDateTime(incident.failureEndTime)}</TableCell>
                <TableCell>{formatDuration(incident.durationSeconds)}</TableCell>
                <TableCell className="text-right font-semibold">
                  {incident.failureCount}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
