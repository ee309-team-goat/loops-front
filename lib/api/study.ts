// Study API Client
// 학습 세션 관련 API

const API_URL = process.env.NEXT_PUBLIC_API_URL

// Types
export interface SessionCard {
  id: number
  english_word: string
  korean_meaning: string
  part_of_speech?: string | null
  pronunciation_ipa?: string | null
  definition_en?: string | null
  example_sentences?: Array<{ sentence: string; translation: string }> | null
  is_new: boolean
}

export interface SessionStartRequest {
  new_cards_limit?: number // 0~50, default 10
  review_cards_limit?: number // 0~100, default 20
}

export interface SessionStartResponse {
  session_id: string
  total_cards: number
  new_cards_count: number
  review_cards_count: number
  cards: SessionCard[]
  started_at: string
}

export interface SessionCompleteRequest {
  cards_studied: number
  cards_correct: number
}

export interface SessionCompleteResponse {
  session_summary: {
    total_cards: number
    correct: number
    incorrect: number
    accuracy: number
  }
  streak: {
    current: number
    longest: number
  }
  daily_goal_status: {
    goal: number
    completed: number
    progress: number
    is_completed: boolean
  }
}

export interface Deck {
  id: number
  name: string
  description?: string | null
  category?: string | null
  difficulty_level?: string | null
  is_public: boolean
  is_official: boolean
  total_cards?: number
  learned_cards?: number
}

// Helper functions
function getAccessToken(): string | null {
  if (typeof window === "undefined") return null
  return localStorage.getItem("access_token")
}

// API Functions

/**
 * 학습 세션 시작 - 학습할 카드 목록을 가져옵니다
 * DEV/게스트 모드에서는 토큰 없이 시도
 */
export async function startStudySession(params?: SessionStartRequest): Promise<SessionStartResponse> {
  const token = getAccessToken()

  if (!API_URL) {
    throw new Error("API URL이 설정되지 않았습니다.")
  }

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  }

  if (token) {
    headers["Authorization"] = `Bearer ${token}`
  }

  console.log("[v0] Starting study session with URL:", `${API_URL}/api/v1/study/session/start`)
  console.log("[v0] Request params:", params)

  const response = await fetch(`${API_URL}/api/v1/study/session/start`, {
    method: "POST",
    headers,
    body: JSON.stringify(params || {}),
  })

  const contentType = response.headers.get("content-type")

  console.log("[v0] Response status:", response.status)
  console.log("[v0] Response content-type:", contentType)

  if (!response.ok) {
    if (contentType && contentType.includes("application/json")) {
      const error = await response.json()
      throw new Error(error.detail || "학습 세션 시작에 실패했습니다.")
    }
    const rawText = await response.text()
    console.log("[v0] Non-JSON error response:", rawText.substring(0, 200))
    throw new Error(`서버 오류 (${response.status}): ${response.statusText}`)
  }

  if (!contentType || !contentType.includes("application/json")) {
    const rawText = await response.text()
    console.log("[v0] Non-JSON success response:", rawText.substring(0, 200))
    throw new Error("서버에서 올바른 응답을 받지 못했습니다.")
  }

  const data = await response.json()
  console.log("[v0] Study session started successfully:", data.session_id)
  return data
}

/**
 * 학습 세션 완료 - 학습 결과를 저장합니다
 * DEV/게스트 모드에서는 토큰 없이 시도
 */
export async function completeStudySession(data: SessionCompleteRequest): Promise<SessionCompleteResponse> {
  const token = getAccessToken()

  if (!API_URL) {
    throw new Error("API URL이 설정되지 않았습니다.")
  }

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  }

  if (token) {
    headers["Authorization"] = `Bearer ${token}`
  }

  const response = await fetch(`${API_URL}/api/v1/study/session/complete`, {
    method: "POST",
    headers,
    body: JSON.stringify(data),
  })

  const contentType = response.headers.get("content-type")

  if (!response.ok) {
    if (contentType && contentType.includes("application/json")) {
      const error = await response.json()
      throw new Error(error.detail || "학습 세션 완료에 실패했습니다.")
    }
    throw new Error("서버 연결에 문제가 있습니다.")
  }

  if (!contentType || !contentType.includes("application/json")) {
    throw new Error("서버에서 올바른 응답을 받지 못했습니다.")
  }

  return response.json()
}

/**
 * 덱 목록 조회
 */
export async function getDecks(skip = 0, limit = 100): Promise<{ decks: Deck[]; total: number }> {
  const token = getAccessToken()

  if (!API_URL) {
    throw new Error("API URL이 설정되지 않았습니다.")
  }

  if (!token) {
    throw new Error("로그인이 필요합니다.")
  }

  const response = await fetch(`${API_URL}/api/v1/decks?skip=${skip}&limit=${limit}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  if (!response.ok) {
    const contentType = response.headers.get("content-type")
    if (contentType && contentType.includes("application/json")) {
      const error = await response.json()
      throw new Error(error.detail || "덱 목록 조회에 실패했습니다.")
    }
    throw new Error("서버 연결에 문제가 있습니다.")
  }

  return response.json()
}

/**
 * 로그인 여부 확인
 */
export function isLoggedIn(): boolean {
  if (typeof window === "undefined") return false
  const token = localStorage.getItem("access_token")
  const devMode = localStorage.getItem("dev_mode")
  return !!token || devMode === "true"
}

/**
 * DEV 모드 여부 확인
 */
export function isDevMode(): boolean {
  if (typeof window === "undefined") return false
  return localStorage.getItem("dev_mode") === "true" && !localStorage.getItem("access_token")
}
