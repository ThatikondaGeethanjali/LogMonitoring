import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { ApiFailureFeature } from "@/features/api-monitoring/types"
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"

interface FailureRateChartProps {
  data: ApiFailureFeature[]
}

export function FailureRateChart({ data }: FailureRateChartProps) {
  return (
    <Card className="dashboard-card rounded-lg">
      <CardHeader className="px-4 pt-4">
        <CardTitle>Failure Rate Analysis</CardTitle>
      </CardHeader>
      <CardContent className="h-[280px] px-2 pb-4 sm:px-4">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 8, right: 18, left: 0 }}>
            <CartesianGrid stroke="#e4e4e7" strokeDasharray="3 3" />
            <XAxis
              dataKey="apiName"
              tickLine={false}
              axisLine={false}
              fontSize={12}
              interval={0}
              tick={{ width: 90 }}
            />
            <YAxis
              tickFormatter={(value) => `${value}%`}
              tickLine={false}
              axisLine={false}
              fontSize={12}
            />
            <Tooltip
              formatter={(value) => [`${value}%`, "Failure rate"]}
              contentStyle={{
                borderRadius: 8,
                borderColor: "#e4e4e7",
                boxShadow: "0 10px 25px rgb(0 0 0 / 0.08)",
              }}
            />
            <Legend />
            <Bar
              dataKey="failureRate1m"
              name="1 min"
              fill="#dc2626"
              radius={[4, 4, 0, 0]}
            />
            <Bar
              dataKey="failureRate10m"
              name="10 min"
              fill="#f59e0b"
              radius={[4, 4, 0, 0]}
            />
            <Bar
              dataKey="failureRate1h"
              name="1 hr"
              fill="#0ea5e9"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
