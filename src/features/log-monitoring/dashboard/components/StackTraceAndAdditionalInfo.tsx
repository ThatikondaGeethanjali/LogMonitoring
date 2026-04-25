import { Button } from "@/components/ui/button"
import type { Log } from "@/features/log-monitoring/sidebar"
import { Copy } from "lucide-react"

import { DashboardCard } from "./DashboardCard"
import { KeyValueList } from "./KeyValueList"

interface StackTraceAndAdditionalInfoProps {
  log: Log
}

export function StackTraceAndAdditionalInfo({
  log,
}: StackTraceAndAdditionalInfoProps) {
  const stackTraceLines = [
    `Service: ${log.package}`,
    `API: ${log.name}`,
    `Status: ${log.status || "--"}`,
    `Exception: ${log.exception || "--"}`,
    `Error: ${log.errorDescription || "--"}`,
    `Last Escalation: ${log.lastEscalationDatetime || "--"}`,
  ]

  const additionalInformationLeft = [
    ["Service Name", log.serviceName || log.package],
    ["API Service Name", log.apiServiceName || log.name],
    ["Vendor", log.vendor || "--"],
    ["Status", log.status || "--"],
    ["Last Update Timestamp", log.lastUpdateTimestamp || "--"],
    ["Error Description", log.errorDescription || "--"],
    ["Log Group Name", log.logGroupName || "--"],
    ["Data Scanned", log.dataScanned || "--"],
    ["Cost", log.cost || "--"],
  ] as const

  const additionalInformationRight = [
    ["Error Count", `${log.occurrences}`],
    ["Consecutive Failure Count", `${log.consecutiveFailureCount ?? 0}`],
    ["Escalation 1 Email", log.escalation1Email || "--"],
    ["Threshold Time 1", `${log.thresholdTime1 ?? 0}`],
    ["Escalation 2 Email", log.escalation2Email || "--"],
    ["Threshold Time 2", `${log.thresholdTime2 ?? 0}`],
    ["Escalation 3 Email", log.escalation3Email || "--"],
    ["Threshold Time 3", `${log.thresholdTime3 ?? 0}`],
    ["Escalation 4 Email", log.escalation4Email || "--"],
    ["Threshold Time 4", `${log.thresholdTime4 ?? 0}`],
    ["Success Failure Updated", log.successFailureUpdatedTime || "--"],
  ] as const

  return (
    <div className="grid gap-4 xl:grid-cols-[0.82fr_1.18fr]">
      <DashboardCard title="Stack Trace">
        <div className="mt-4 flex justify-end">
          <Button
            variant="outline"
            size="sm"
            className="rounded-lg border-[#e3e8f2] bg-white text-slate-600"
          >
            <Copy className="size-3.5" />
            Copy
          </Button>
        </div>

        <div className="mt-3 rounded-xl bg-[#f8faff] p-4 font-mono text-xs leading-7 text-slate-600">
          {stackTraceLines.map((line, index) => (
            <p key={`${line}-${index}`} className={line ? "" : "h-3"}>
              {line}
            </p>
          ))}
        </div>

        <Button
          variant="link"
          className="mt-4 h-auto p-0 text-sm font-medium text-[#4f46e5] hover:text-[#4338ca]"
        >
          View more
        </Button>
      </DashboardCard>

      <DashboardCard title="Additional Information">
        <div className="mt-4 grid gap-6 lg:grid-cols-2">
          <KeyValueList items={additionalInformationLeft} />
          <KeyValueList items={additionalInformationRight} />
        </div>
      </DashboardCard>
    </div>
  )
}
