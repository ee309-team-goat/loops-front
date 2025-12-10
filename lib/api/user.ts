// API 클라이언트 - 사용자 정보 관련
// 백엔드 API와 연동하여 사용자 정보를 가져옵니다.

export interface UserRead {
  id: string
  email: string
  nickname: string
  created_at: string
  updated_at: string
  learning_purpose?: string
  provider?: string // google, kakao, naver, apple, email 등
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

export async function updateUserProfile(data: Partial<UserRead>): Promise<UserRead> {
  const accessToken = localStorage.getItem("access_token")

  if (!accessToken) {
    throw new Error("NO_TOKEN")
  }

  const response = await fetch(`${API_BASE_URL}/api/v1/users/me`, {
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

  if (!response.ok) {
    throw new Error("UPDATE_FAILED")
  }

  return response.json()
}

export async function deleteUserAccount(): Promise<void> {
  const accessToken = localStorage.getItem("access_token")

  if (!accessToken) {
    throw new Error("NO_TOKEN")
  }

  const response = await fetch(`${API_BASE_URL}/api/v1/users/me`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  })

  if (!response.ok) {
    throw new Error("DELETE_FAILED")
  }
}
