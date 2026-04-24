import { create } from "zustand"
import type { Log } from "@/types"

interface LogState {
  logs: Log[]
  selectedLog: Log | null
  isLoading: boolean
  error: string | null
}

interface LogActions {
  setLogs: (logs: Log[]) => void
  addLog: (log: Log) => void
  updateLogInStore: (id: string, updated: Partial<Log>) => void
  removeLog: (id: string) => void
  selectLog: (log: Log | null) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  reset: () => void
}

const initialState: LogState = {
  logs: [],
  selectedLog: null,
  isLoading: false,
  error: null,
}

export const useLogStore = create<LogState & LogActions>((set) => ({
  ...initialState,

  setLogs: (logs) => set({ logs, error: null }),

  addLog: (log) =>
    set((state) => ({
      logs: [log, ...state.logs],
      error: null,
    })),

  updateLogInStore: (id, updated) =>
    set((state) => ({
      logs: state.logs.map((log) =>
        log.id === id ? { ...log, ...updated } : log
      ),
      error: null,
    })),

  removeLog: (id) =>
    set((state) => ({
      logs: state.logs.filter((log) => log.id !== id),
      selectedLog: state.selectedLog?.id === id ? null : state.selectedLog,
      error: null,
    })),

  selectLog: (log) => set({ selectedLog: log }),

  setLoading: (isLoading) => set({ isLoading }),

  setError: (error) => set({ error }),

  reset: () => set(initialState),
}))
