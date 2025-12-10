"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import type { UserRead } from "@/lib/api/user"

interface AuthContextType {
  user: UserRead | null
  isLoading: boolean
  isAuthenticated: boolean
  isDevMode: boolean
  login: (accessToken: string, refreshToken: string, user: UserRead) => void
  logout: () => void
  refreshUser: () => Promise<void>
  updateUser: (user: UserRead) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const [user, setUser] = useState<UserRead | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isDevMode, setIsDevMode] = useState(false)

  // 초기 인증 상태 로드
  useEffect(() => {
    const loadAuthState = () => {
      const accessToken = localStorage.getItem("access_token")
      const storedUser = localStorage.getItem("user")
      const devMode = localStorage.getItem("dev_mode") === "true"

      if (devMode) {
        setIsDevMode(true)
        setUser({
          id: 0,
          email: "devs@kaist.ac.kr",
          username: "DEV User",
          is_active: true,
          select_all_decks: true,
          daily_goal: 20,
          timezone: "Asia/Seoul",
          theme: "light",
          notification_enabled: true,
          current_streak: 0,
          longest_streak: 0,
          last_study_date: null,
          total_study_time_minutes: 0,
          created_at: new Date().toISOString(),
          updated_at: null,
          provider: "guest",
        })
        setIsLoading(false)
        return
      }

      if (accessToken && storedUser) {
        try {
          const parsedUser = JSON.parse(storedUser)
          setUser(parsedUser)
          setIsDevMode(false)
        } catch {
          // 파싱 실패 시 초기화
          localStorage.removeItem("user")
        }
      }

      setIsLoading(false)
    }

    loadAuthState()
  }, [])

  const login = useCallback((accessToken: string, refreshToken: string, userData: UserRead) => {
    localStorage.setItem("access_token", accessToken)
    localStorage.setItem("refresh_token", refreshToken)
    localStorage.setItem("user", JSON.stringify(userData))
    localStorage.removeItem("dev_mode")
    setUser(userData)
    setIsDevMode(false)
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem("access_token")
    localStorage.removeItem("refresh_token")
    localStorage.removeItem("user")
    localStorage.removeItem("authInfo")
    localStorage.removeItem("dev_mode")
    setUser(null)
    setIsDevMode(false)
    router.push("/")
  }, [router])

  const refreshUser = useCallback(async () => {
    const accessToken = localStorage.getItem("access_token")
    if (!accessToken) return

    try {
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL
      const response = await fetch(`${API_BASE_URL}/api/v1/users/me`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      })

      if (response.ok) {
        const userData: UserRead = await response.json()
        localStorage.setItem("user", JSON.stringify(userData))
        setUser(userData)
      } else if (response.status === 401) {
        // 토큰 만료 시 리프레시 시도
        const refreshToken = localStorage.getItem("refresh_token")
        if (refreshToken) {
          const refreshResponse = await fetch(`${API_BASE_URL}/api/v1/auth/refresh`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ refresh_token: refreshToken }),
          })

          if (refreshResponse.ok) {
            const authData = await refreshResponse.json()
            localStorage.setItem("access_token", authData.access_token)
            localStorage.setItem("refresh_token", authData.refresh_token)
            localStorage.setItem("user", JSON.stringify(authData.user))
            setUser(authData.user)
          } else {
            logout()
          }
        } else {
          logout()
        }
      }
    } catch (error) {
      console.error("[v0] Failed to refresh user:", error)
    }
  }, [logout])

  const updateUser = useCallback((userData: UserRead) => {
    localStorage.setItem("user", JSON.stringify(userData))
    setUser(userData)
  }, [])

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        isDevMode,
        login,
        logout,
        refreshUser,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
