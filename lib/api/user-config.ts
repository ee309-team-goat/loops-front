// 사용자 설정 API 클라이언트
// 백엔드 API: GET/PUT /api/v1/users/me/config

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || ""

export interface UserConfig {
  daily_goal: number
  select_all_decks: boolean
  timezone: string
  theme: string
  notification_enabled: boolean
}

export interface UserConfigUpdate {
  daily_goal?: number | null
  select_all_decks?: boolean | null
  timezone?: string | null
  theme?: string | null
  notification_enabled?: boolean | null
}

// 액세스 토큰 가져오기
function getAccessToken(): string | null {
  if (typeof window === "undefined") return null
  return localStorage.getItem("access_token")
}

// DEV 모드 체크
function isDevMode(): boolean {
  if (typeof window === "undefined") return false
  return localStorage.getItem("dev_mode") === "true"
}

// 사용자 설정 조회
export async function getUserConfig(): Promise<UserConfig | null> {
  const token = getAccessToken()

  // DEV 모드인 경우 localStorage에서 설정 가져오기
  if (isDevMode() || !token) {
    const savedSettings = localStorage.getItem("vocabulary_settings")
    if (savedSettings) {
      const settings = JSON.parse(savedSettings)
      return {
        daily_goal: settings.dailyGoal || 20,
        select_all_decks: true,
        timezone: "Asia/Seoul",
        theme: "light",
        notification_enabled: true,
      }
    }
    // 기본값 반환
    return {
      daily_goal: 20,
      select_all_decks: true,
      timezone: "Asia/Seoul",
      theme: "light",
      notification_enabled: true,
    }
  }

  try {
    const response = await fetch(`${API_BASE_URL}/api/v1/users/me/config`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      console.error("[v0] Failed to get user config:", response.status)
      return null
    }

    return await response.json()
  } catch (error) {
    console.error("[v0] Error fetching user config:", error)
    return null
  }
}

// 사용자 설정 수정
export async function updateUserConfig(config: UserConfigUpdate): Promise<UserConfig | null> {
  const token = getAccessToken()

  // DEV 모드인 경우 localStorage에 저장
  if (isDevMode() || !token) {
    const savedSettings = localStorage.getItem("vocabulary_settings")
    const currentSettings = savedSettings ? JSON.parse(savedSettings) : {}

    if (config.daily_goal !== undefined && config.daily_goal !== null) {
      currentSettings.dailyGoal = config.daily_goal
    }

    localStorage.setItem("vocabulary_settings", JSON.stringify(currentSettings))

    return {
      daily_goal: currentSettings.dailyGoal || 20,
      select_all_decks: config.select_all_decks ?? true,
      timezone: config.timezone ?? "Asia/Seoul",
      theme: config.theme ?? "light",
      notification_enabled: config.notification_enabled ?? true,
    }
  }

  try {
    const response = await fetch(`${API_BASE_URL}/api/v1/users/me/config`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(config),
    })

    if (!response.ok) {
      console.error("[v0] Failed to update user config:", response.status)
      return null
    }

    return await response.json()
  } catch (error) {
    console.error("[v0] Error updating user config:", error)
    return null
  }
}
