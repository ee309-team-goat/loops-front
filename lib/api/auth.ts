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
  const response = await fetch(`${API_BASE_URL}/api/v1/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })

  if (response.status === 401) {
    throw new Error("이메일 또는 비밀번호가 잘못되었습니다.")
  }

  if (response.status === 404) {
    throw new Error("사용자를 찾을 수 없습니다.")
  }

  if (!response.ok) {
    throw new Error("로그인에 실패했습니다.")
  }

  const authResponse: AuthResponse = await response.json()

  // 토큰을 localStorage에 저장
  localStorage.setItem("access_token", authResponse.access_token)
  localStorage.setItem("refresh_token", authResponse.refresh_token)
  localStorage.setItem("user", JSON.stringify(authResponse.user))

  return authResponse
}

export async function register(data: RegisterRequest): Promise<AuthResponse> {
  const response = await fetch(`${API_BASE_URL}/api/v1/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })

  if (response.status === 400) {
    throw new Error("이메일 또는 사용자명이 이미 사용 중입니다.")
  }

  if (!response.ok) {
    throw new Error("회원가입에 실패했습니다.")
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
