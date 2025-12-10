import { getApiBaseUrl } from "./config"
import { getAccessToken, getRefreshToken, setTokens, clearAuth } from "@/lib/auth/storage"

interface ApiFetchOptions extends Omit<RequestInit, "body"> {
  auth?: boolean
  body?: unknown
}

export class ApiError extends Error {
  status: number
  data: unknown
  constructor(message: string, status: number, data: unknown) {
    super(message)
    this.name = "ApiError"
    this.status = status
    this.data = data
  }
}

async function parseErrorResponse(res: Response): Promise<{ message: string; data: unknown }> {
  let data: unknown = null
  let message = `${res.status} ${res.statusText}`

  try {
    const text = await res.text()
    if (!text) return { message, data }

    // Try to parse as JSON
    try {
      data = JSON.parse(text)
      // Extract detail field if it's a string
      if (typeof data === "object" && data !== null && "detail" in data) {
        const detail = (data as { detail: unknown }).detail
        if (typeof detail === "string") {
          message = detail
        }
      }
    } catch {
      // Not JSON, use text as message if meaningful
      if (text.length < 200) {
        message = text
      }
    }
  } catch {
    // Could not read response body
  }

  return { message, data }
}

let isRefreshing = false
let refreshPromise: Promise<boolean> | null = null

async function refreshTokens(): Promise<boolean> {
  const refreshToken = getRefreshToken()
  if (!refreshToken) return false

  try {
    const res = await fetch(`${getApiBaseUrl()}/api/v1/auth/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refresh_token: refreshToken }),
    })

    if (!res.ok) return false

    const data = await res.json()
    if (data.access_token && data.refresh_token) {
      setTokens(data.access_token, data.refresh_token)
      return true
    }
    return false
  } catch {
    return false
  }
}

export async function apiFetch<T>(path: string, options: ApiFetchOptions = {}): Promise<T> {
  const { auth = false, body, ...restOptions } = options

  const baseUrl = getApiBaseUrl()
  const url = `${baseUrl}${path}`

  const headers: HeadersInit = {
    ...(restOptions.headers || {}),
  }

  // Set Content-Type for JSON bodies
  if (body && typeof body === "object" && !(body instanceof FormData)) {
    ;(headers as Record<string, string>)["Content-Type"] = "application/json"
  }

  // Attach Authorization header if auth is required
  if (auth) {
    const accessToken = getAccessToken()
    if (accessToken) {
      ;(headers as Record<string, string>)["Authorization"] = `Bearer ${accessToken}`
    }
  }

  const fetchOptions: RequestInit = {
    ...restOptions,
    headers,
    body: body && typeof body === "object" && !(body instanceof FormData) ? JSON.stringify(body) : (body as BodyInit),
  }

  let res = await fetch(url, fetchOptions)

  // Handle 401 - attempt token refresh
  if (res.status === 401 && auth) {
    const refreshToken = getRefreshToken()
    if (refreshToken) {
      // Prevent multiple simultaneous refresh attempts
      if (!isRefreshing) {
        isRefreshing = true
        refreshPromise = refreshTokens().finally(() => {
          isRefreshing = false
          refreshPromise = null
        })
      }

      const refreshSuccess = await refreshPromise
      if (refreshSuccess) {
        // Retry original request with new token
        const newAccessToken = getAccessToken()
        if (newAccessToken) {
          ;(headers as Record<string, string>)["Authorization"] = `Bearer ${newAccessToken}`
        }
        res = await fetch(url, { ...fetchOptions, headers })
      } else {
        clearAuth()
        throw new ApiError("Session expired. Please login again.", 401, null)
      }
    } else {
      clearAuth()
      throw new ApiError("Unauthorized", 401, null)
    }
  }

  if (!res.ok) {
    const { message, data } = await parseErrorResponse(res)
    throw new ApiError(message, res.status, data)
  }

  // Handle empty responses
  const text = await res.text()
  if (!text) return {} as T

  return JSON.parse(text) as T
}
