// API 클라이언트 래퍼

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1"

export { apiFetch, ApiError } from "@/lib/api/http"
export type { ApiFetchOptions } from "@/lib/api/http"

export async function fetchClient<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = typeof window !== "undefined" ? localStorage.getItem("accessToken") : null

  const headers = {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  })

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    throw new Error(errorData.detail || "API request failed")
  }

  return response.json()
}

// Mock Data for Development (백엔드가 없을 때 사용)
export const MOCK_CARDS: any[] = [
  {
    id: 1,
    word: "innovation",
    definition: "혁신, 쇄신",
    pronunciation: "/ˌɪnəˈveɪʃən/",
    example_sentence: "The company is known for its innovation in AI.",
    example_translation: "그 회사는 AI 분야의 혁신으로 알려져 있다.",
  },
  {
    id: 2,
    word: "resilience",
    definition: "회복력, 탄력",
    pronunciation: "/rɪˈzɪliəns/",
    example_sentence: "She showed great resilience after the failure.",
    example_translation: "그녀는 실패 후 큰 회복력을 보여주었다.",
  },
  {
    id: 3,
    word: "perspective",
    definition: "관점, 시각",
    pronunciation: "/pərˈspɛktɪv/",
    example_sentence: "Try to look at the problem from a different perspective.",
    example_translation: "다른 관점에서 그 문제를 보려고 노력해봐.",
  },
  {
    id: 4,
    word: "ambitious",
    definition: "야심 찬",
    pronunciation: "/æmˈbɪʃəs/",
    example_sentence: "He has an ambitious plan to expand the business.",
    example_translation: "그는 사업을 확장하려는 야심 찬 계획을 가지고 있다.",
  },
  {
    id: 5,
    word: "collaborate",
    definition: "협력하다",
    pronunciation: "/kəˈlæbəˌreɪt/",
    example_sentence: "We need to collaborate with other teams.",
    example_translation: "우리는 다른 팀들과 협력해야 한다.",
  },
]
