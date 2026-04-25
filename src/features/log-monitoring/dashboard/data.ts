import { ArrowUpRight, Calendar, Users, type LucideIcon } from "lucide-react"

export const statCards: readonly {
  title: string
  value: string
  subtext: string
  icon: LucideIcon
}[] = [
  {
    title: "Occurrences",
    value: "3,542",
    subtext: "+ 18.6%  vs May 5 - May 11",
    icon: ArrowUpRight,
  },
  {
    title: "Affected Users",
    value: "1,243",
    subtext: "+ 12.4%  vs May 5 - May 11",
    icon: Users,
  },
  {
    title: "First Seen",
    value: "May 12, 2024",
    subtext: "08:14 AM",
    icon: Calendar,
  },
  {
    title: "Last Seen",
    value: "May 19, 2024",
    subtext: "10:24 AM",
    icon: Calendar,
  },
] as const

export const chartData = [
  { label: "May 12", value: 120 },
  { label: "May 13", value: 310 },
  { label: "May 14", value: 140 },
  { label: "May 15", value: 250 },
  { label: "May 16", value: 610 },
  { label: "May 17", value: 1125 },
  { label: "May 18", value: 820 },
  { label: "May 19", value: 860 },
] as const

export const topOccurrences = [
  [
    "May 19, 2024 10:24 AM",
    "Samsung Galaxy S22",
    "2.4.1 (241)",
    "Android 13",
    "128",
  ],
  [
    "May 19, 2024 10:20 AM",
    "Samsung Galaxy S22",
    "2.4.1 (241)",
    "Android 13",
    "96",
  ],
  ["May 19, 2024 10:15 AM", "OnePlus 11", "2.4.0 (240)", "Android 13", "72"],
  ["May 19, 2024 10:10 AM", "Xiaomi 13", "2.4.1 (241)", "Android 13", "58"],
  ["May 19, 2024 10:05 AM", "Pixel 7", "2.4.1 (241)", "Android 13", "47"],
] as const

export const crashDetails = [
  ["Exception", "NullPointerException"],
  ["Thread", "main"],
  [
    "Message",
    "Attempt to invoke virtual method 'void com.example.app.model.User.getName()' on a null object reference",
  ],
  ["Error Code", "--"],
  ["Priority", "High"],
  ["Escalation Level", "3"],
  ["Escalation Count", "2"],
  ["Desired Count", "5"],
] as const

export const stackTraceLines = [
  "java.lang.NullPointerException: Attempt to invoke virtual method",
  "'void com.example.app.model.User.getName()' on a null object reference",
  "",
  "at com.example.app.MainActivity.onCreate(MainActivity.java:42)",
  "at android.app.Activity.performCreate(Activity.java:8000)",
  "at android.app.Activity.performCreate(Activity.java:7984)",
] as const

export const additionalInformationLeft = [
  ["Service Name", "--"],
  ["API Service Name", "--"],
  ["Vendor", "--"],
  ["Status", "--"],
  ["Last Update Timestamp", "May 19, 2024 10:24:11 AM"],
  ["Error Description", "--"],
  ["Log Group Name", "mobile-crash-logs"],
  ["Data Scanned", "May 19, 2024 10:24:05 AM"],
  ["Cost", "--"],
] as const

export const additionalInformationRight = [
  ["Error Count", "3,542"],
  ["Consecutive Failure Count", "12"],
  ["Escalation 1 Email", "dev-team@example.com"],
  ["Threshold Time 1", "15.0"],
  ["Escalation 2 Email", "qa-team@example.com"],
  ["Threshold Time 2", "30.0"],
  ["Escalation 3 Email", "ops-team@example.com"],
  ["Threshold Time 3", "60.0"],
  ["Escalation 4 Email", "cto@example.com"],
  ["Threshold Time 4", "120.0"],
  ["Success Failure Updated Time", "May 19, 2024 10:24:11 AM"],
] as const
