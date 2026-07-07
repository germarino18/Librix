/**
 * Generic HTTP client for the Librix API.
 *
 * Usage:
 *   import { api } from "@/lib/api"
 *   const products = await api.get<Product[]>("/productos")
 */

const BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:8002/api"

export class ApiError extends Error {
  status: number
  detail: unknown

  constructor(status: number, message: string, detail?: unknown) {
    super(message)
    this.name = "ApiError"
    this.status = status
    this.detail = detail
  }
}

async function request<T>(
  method: string,
  path: string,
  body?: unknown,
): Promise<T> {
  const url = `${BASE_URL}${path}`
  const headers: Record<string, string> = {}
  let options: RequestInit = { method, headers }

  if (body !== undefined) {
    headers["Content-Type"] = "application/json"
    options.body = JSON.stringify(body)
  }

  const response = await fetch(url, options)

  if (!response.ok) {
    let detail: unknown
    try {
      detail = await response.json()
    } catch {
      detail = await response.text().catch(() => undefined)
    }
    const message =
      typeof detail === "object" && detail !== null && "detail" in detail
        ? String(detail.detail)
        : response.statusText
    throw new ApiError(response.status, message, detail)
  }

  if (response.status === 204) {
    return undefined as T
  }

  return response.json() as Promise<T>
}

export const api = {
  get<T>(path: string): Promise<T> {
    return request<T>("GET", path)
  },
  post<T>(path: string, body?: unknown): Promise<T> {
    return request<T>("POST", path, body)
  },
  put<T>(path: string, body?: unknown): Promise<T> {
    return request<T>("PUT", path, body)
  },
  patch<T>(path: string, body?: unknown): Promise<T> {
    return request<T>("PATCH", path, body)
  },
  delete<T>(path: string): Promise<T> {
    return request<T>("DELETE", path)
  },
}
