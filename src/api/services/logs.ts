import apiClient from "@/api/client"
import type { Log, CreateLogPayload } from "@/types"

export const fetchLogs = async (): Promise<Log[]> => {
  const { data } = await apiClient.get<Log[]>("/logs")
  return data
}

export const fetchLogById = async (id: string): Promise<Log> => {
  const { data } = await apiClient.get<Log>(`/logs/${id}`)
  return data
}

export const createLog = async (payload: CreateLogPayload): Promise<Log> => {
  const { data } = await apiClient.post<Log>("/logs", payload)
  return data
}

export const updateLog = async (
  id: string,
  payload: Partial<CreateLogPayload>
): Promise<Log> => {
  const { data } = await apiClient.patch<Log>(`/logs/${id}`, payload)
  return data
}

export const deleteLog = async (id: string): Promise<void> => {
  await apiClient.delete(`/logs/${id}`)
}
