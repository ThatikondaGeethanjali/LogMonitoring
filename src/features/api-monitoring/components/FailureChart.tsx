import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { FailureTimeseriesPoint } from "@/features/api-monitoring/types"
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"

interface FailureChartProps {
  data: FailureTimeseriesPoint[]
}

export function FailureChart({ data }: FailureChartProps) {
  return (
    <Card className="dashboard-card rounded-lg">
      <CardHeader className="px-4 pt-4">
        <CardTitle>Failure Trends</CardTitle>
      </CardHeader>
      <CardContent className="h-[280px] px-2 pb-4 sm:px-4">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 8, right: 18, left: 0 }}>
            <defs>
              <linearGradient id="failureFill" x1="0" x2="0" y1="0" y2="1">
                <stop offset="5%" stopColor="#dc2626" stopOpacity={0.24} />
                <stop offset="95%" stopColor="#dc2626" stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke="#e4e4e7" strokeDasharray="3 3" />
            <XAxis
              dataKey="timeBucket"
              tickLine={false}
              axisLine={false}
              fontSize={12}
            />
            <YAxis tickLine={false} axisLine={false} fontSize={12} />
            <Tooltip
              cursor={{ stroke: "#71717a", strokeDasharray: "4 4" }}
              contentStyle={{
                borderRadius: 8,
                borderColor: "#e4e4e7",
                boxShadow: "0 10px 25px rgb(0 0 0 / 0.08)",
              }}
            />
            <Area
              type="monotone"
              dataKey="failureCount"
              name="Failures"
              stroke="#dc2626"
              strokeWidth={2}
              fill="url(#failureFill)"
              activeDot={{ r: 5 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
