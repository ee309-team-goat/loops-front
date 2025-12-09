import { getApiBaseUrl } from "./config"
import { getAccessToken, getRefreshToken, setTokens, clearAuth } from "@/lib/auth/storage"

interface ApiFetchOptions extends Omit<RequestInit, "body"> {
  auth?: boolean
  body?: unknown
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
        throw new Error("Session expired. Please login again.")
      }
    } else {
      clearAuth()
      throw new Error("Unauthorized")
    }
  }

  if (!res.ok) {
    const errorBody = await res.text()
    throw new Error(errorBody || `Request failed with status ${res.status}`)
  }

  // Handle empty responses
  const text = await res.text()
  if (!text) return {} as T

  return JSON.parse(text) as T
}
