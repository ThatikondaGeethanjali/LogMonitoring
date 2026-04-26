/**
 * Constants and default data for the SideBar component
 */

import { MONITORING_LOGS } from "../data/logs"
import type { SortOption } from "./types"

export const DEFAULT_LOGS = MONITORING_LOGS
export const ALL_FILTER_VALUE = "all"

export const SORT_OPTIONS: Array<{ value: SortOption; label: string }> = [
  { value: "frequency", label: "Sort: Most Frequent" },
  { value: "recent", label: "Sort: Most Recent" },
  { value: "impact", label: "Sort: Most Impact" },
]
