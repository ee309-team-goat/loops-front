// API 클라이언트 - 인증 관련
// 백엔드 API와 연동하여 로그인/회원가입을 처리합니다.

import type { UserRead } from "./user"

export interface LoginRequest {
  email: string
  password: string
}

export interface RegisterRequest {
  email: string
  password: string
  username: string
}

export interface AuthResponse {
  access_token: string
  refresh_token: string
  token_type: string
  user: UserRead
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL

export async function login(data: LoginRequest): Promise<AuthResponse> {
  if (!API_BASE_URL) {
    throw new Error("API URL이 설정되지 않았습니다. 환경 변수를 확인해주세요.")
  }

  console.log("[v0] Login API URL:", `${API_BASE_URL}/api/v1/auth/login`)

  const response = await fetch(`${API_BASE_URL}/api/v1/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })

  const contentType = response.headers.get("content-type")
  if (!contentType || !contentType.includes("application/json")) {
    console.log("[v0] Response is not JSON:", await response.text())
    throw new Error("서버 연결에 문제가 있습니다. 잠시 후 다시 시도해주세요.")
  }

  if (response.status === 401) {
    throw new Error("이메일 또는 비밀번호가 잘못되었습니다.")
  }

  if (response.status === 404) {
    throw new Error("사용자를 찾을 수 없습니다.")
  }

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    throw new Error(errorData.detail || "로그인에 실패했습니다.")
  }

  const authResponse: AuthResponse = await response.json()

  // 토큰을 localStorage에 저장
  localStorage.setItem("access_token", authResponse.access_token)
  localStorage.setItem("refresh_token", authResponse.refresh_token)
  localStorage.setItem("user", JSON.stringify(authResponse.user))

  return authResponse
}

export async function register(data: RegisterRequest): Promise<AuthResponse> {
  if (!API_BASE_URL) {
    throw new Error("API URL이 설정되지 않았습니다. 환경 변수를 확인해주세요.")
  }

  console.log("[v0] Register API URL:", `${API_BASE_URL}/api/v1/auth/register`)
  console.log("[v0] Register data:", { email: data.email, username: data.username })

  const response = await fetch(`${API_BASE_URL}/api/v1/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })

  const contentType = response.headers.get("content-type")
  if (!contentType || !contentType.includes("application/json")) {
    const textResponse = await response.text()
    console.log("[v0] Response is not JSON:", textResponse)
    throw new Error("서버 연결에 문제가 있습니다. 잠시 후 다시 시도해주세요.")
  }

  if (response.status === 400) {
    const errorData = await response.json().catch(() => ({}))
    throw new Error(errorData.detail || "이메일 또는 사용자명이 이미 사용 중입니다.")
  }

  if (response.status === 422) {
    const errorData = await response.json().catch(() => ({}))
    throw new Error(errorData.detail || "입력 정보를 확인해주세요.")
  }

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    throw new Error(errorData.detail || "회원가입에 실패했습니다.")
  }

  const authResponse: AuthResponse = await response.json()

  // 토큰을 localStorage에 저장
  localStorage.setItem("access_token", authResponse.access_token)
  localStorage.setItem("refresh_token", authResponse.refresh_token)
  localStorage.setItem("user", JSON.stringify(authResponse.user))

  return authResponse
}

export async function refreshToken(): Promise<AuthResponse> {
  const refreshTokenValue = localStorage.getItem("refresh_token")

  if (!refreshTokenValue) {
    throw new Error("NO_REFRESH_TOKEN")
  }

  const response = await fetch(`${API_BASE_URL}/api/v1/auth/refresh`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ refresh_token: refreshTokenValue }),
  })

  if (!response.ok) {
    // 리프레시 토큰도 만료된 경우 로그아웃 처리
    logout()
    throw new Error("세션이 만료되었습니다. 다시 로그인해주세요.")
  }

  const authResponse: AuthResponse = await response.json()

  // 새 토큰으로 업데이트
  localStorage.setItem("access_token", authResponse.access_token)
  localStorage.setItem("refresh_token", authResponse.refresh_token)
  localStorage.setItem("user", JSON.stringify(authResponse.user))

  return authResponse
}

export function logout(): void {
  localStorage.removeItem("access_token")
  localStorage.removeItem("refresh_token")
  localStorage.removeItem("user")
  localStorage.removeItem("authInfo")
}

export function isLoggedIn(): boolean {
  return !!localStorage.getItem("access_token")
}

export function getStoredUser(): UserRead | null {
  const userStr = localStorage.getItem("user")
  if (!userStr) return null
  try {
    return JSON.parse(userStr)
  } catch {
    return null
  }
}
