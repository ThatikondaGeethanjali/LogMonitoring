import { useCallback } from "react"
import { fetchLogs, fetchLogById, createLog, updateLog, deleteLog } from "@/api"
import { useLogStore } from "@/stores"
import type { CreateLogPayload } from "@/types"

export function useLogs() {
  const logs = useLogStore((state) => state.logs)
  const selectedLog = useLogStore((state) => state.selectedLog)
  const isLoading = useLogStore((state) => state.isLoading)
  const error = useLogStore((state) => state.error)

  const setLoading = useLogStore((state) => state.setLoading)
  const setError = useLogStore((state) => state.setError)
  const setLogs = useLogStore((state) => state.setLogs)
  const addLog = useLogStore((state) => state.addLog)
  const updateLogInStore = useLogStore((state) => state.updateLogInStore)
  const removeLog = useLogStore((state) => state.removeLog)
  const selectLog = useLogStore((state) => state.selectLog)

  const getAllLogs = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await fetchLogs()
      setLogs(data)
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to fetch logs"
      setError(message)
    } finally {
      setLoading(false)
    }
  }, [setLoading, setError, setLogs])

  const getLogById = useCallback(
    async (id: string) => {
      setLoading(true)
      setError(null)
      try {
        const data = await fetchLogById(id)
        selectLog(data)
        return data
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Failed to fetch log"
        setError(message)
      } finally {
        setLoading(false)
      }
    },
    [setLoading, setError, selectLog]
  )

  const addNewLog = useCallback(
    async (payload: CreateLogPayload) => {
      setLoading(true)
      setError(null)
      try {
        const data = await createLog(payload)
        addLog(data)
        return data
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Failed to create log"
        setError(message)
      } finally {
        setLoading(false)
      }
    },
    [setLoading, setError, addLog]
  )

  const editLog = useCallback(
    async (id: string, payload: Partial<CreateLogPayload>) => {
      setLoading(true)
      setError(null)
      try {
        const data = await updateLog(id, payload)
        updateLogInStore(id, data)
        return data
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Failed to update log"
        setError(message)
      } finally {
        setLoading(false)
      }
    },
    [setLoading, setError, updateLogInStore]
  )

  const removeLogById = useCallback(
    async (id: string) => {
      setLoading(true)
      setError(null)
      try {
        await deleteLog(id)
        removeLog(id)
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Failed to delete log"
        setError(message)
      } finally {
        setLoading(false)
      }
    },
    [setLoading, setError, removeLog]
  )

  return {
    logs,
    selectedLog,
    isLoading,
    error,
    getAllLogs,
    getLogById,
    addNewLog,
    editLog,
    removeLogById,
    selectLog,
  }
}
