// API 클라이언트 - 사용자 정보 관련
// 백엔드 API와 연동하여 사용자 정보를 가져옵니다.

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
  // 아래 필드는 백엔드 추가 후 사용 가능
  provider?: string // google, kakao, naver, apple, email 등
  learning_purpose?: string // 학습 목적
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

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL

export async function fetchCurrentUser(): Promise<UserRead> {
  const accessToken = localStorage.getItem("access_token")

  if (!accessToken) {
    throw new Error("NO_TOKEN")
  }

  const response = await fetch(`${API_BASE_URL}/api/v1/users/me`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
  })

  if (response.status === 401) {
    throw new Error("UNAUTHORIZED")
  }

  if (!response.ok) {
    throw new Error("FETCH_FAILED")
  }

  return response.json()
}

export async function updateUserProfile(userId: number, data: UserUpdate): Promise<UserRead> {
  const accessToken = localStorage.getItem("access_token")

  if (!accessToken) {
    throw new Error("NO_TOKEN")
  }

  const response = await fetch(`${API_BASE_URL}/api/v1/users/${userId}`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })

  if (response.status === 401) {
    throw new Error("UNAUTHORIZED")
  }

  if (response.status === 403) {
    throw new Error("FORBIDDEN")
  }

  if (!response.ok) {
    throw new Error("UPDATE_FAILED")
  }

  return response.json()
}

export async function deleteUserAccount(userId: number): Promise<void> {
  const accessToken = localStorage.getItem("access_token")

  if (!accessToken) {
    throw new Error("NO_TOKEN")
  }

  const response = await fetch(`${API_BASE_URL}/api/v1/users/${userId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  })

  if (response.status === 401) {
    throw new Error("UNAUTHORIZED")
  }

  if (response.status === 403) {
    throw new Error("FORBIDDEN")
  }

  if (!response.ok) {
    throw new Error("DELETE_FAILED")
  }
}

export async function logoutUser(): Promise<void> {
  const accessToken = localStorage.getItem("access_token")

  if (!accessToken) {
    return
  }

  try {
    await fetch(`${API_BASE_URL}/api/v1/auth/logout`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
  } catch {
    // 로그아웃 실패해도 로컬 토큰은 삭제
  }
}
