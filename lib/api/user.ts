// API 클라이언트 - 사용자 정보 관련
// 백엔드 API와 연동하여 사용자 정보를 가져옵니다.

import { apiClient } from "./client"

export interface UserRead {
  id: number
  email: string
  username: string
  is_active: boolean
  select_all_decks: boolean
  daily_goal: number
  timezone: string
  theme: string
  notification_enabled: boolean
  current_streak: number
  longest_streak: number
  last_study_date: string | null
  total_study_time_minutes: number
  created_at: string
  updated_at: string | null
  provider?: string
  learning_purpose?: string
}

export interface UserUpdate {
  username?: string
  daily_goal?: number
  timezone?: string
  theme?: string
  notification_enabled?: boolean
  select_all_decks?: boolean
  learning_purpose?: string
}

export async function fetchCurrentUser(): Promise<UserRead> {
  return apiClient<UserRead>("/api/v1/users/me", { method: "GET" })
}

export async function updateUserProfile(userId: number, data: UserUpdate): Promise<UserRead> {
  return apiClient<UserRead>(`/api/v1/users/${userId}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  })
}

export async function deleteUserAccount(userId: number): Promise<void> {
  await apiClient<void>(`/api/v1/users/${userId}`, { method: "DELETE" })
}

export async function logoutUser(): Promise<void> {
  try {
    await apiClient<void>("/api/v1/auth/logout", { method: "POST" }, false)
  } catch {
    // 로그아웃 실패해도 로컬 토큰은 삭제됨
  }
}

export interface StreakInfo {
  current_streak: number
  longest_streak: number
  last_study_date: string | null
  streak_dates: string[]
}

export async function fetchUserStreak(): Promise<StreakInfo> {
  return apiClient<StreakInfo>("/api/v1/users/me/streak", { method: "GET" })
}

export interface TodayProgress {
  new_cards_studied: number
  review_cards_studied: number
  total_cards_studied: number
  daily_goal: number
  goal_achieved: boolean
  study_time_minutes: number
}

export async function fetchTodayProgress(): Promise<TodayProgress> {
  return apiClient<TodayProgress>("/api/v1/users/me/today-progress", { method: "GET" })
}

export interface UserLevel {
  level: number
  experience: number
  next_level_experience: number
  cefr_level: string
}

export async function fetchUserLevel(): Promise<UserLevel> {
  return apiClient<UserLevel>("/api/v1/users/me/level", { method: "GET" })
}
