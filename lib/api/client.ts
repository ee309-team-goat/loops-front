// API 클라이언트 래퍼 - 중앙화된 에러 핸들링 및 자동 토큰 갱신

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || ""

export class ApiError extends Error {
  status: number
  detail: string

  constructor(status: number, detail: string) {
    super(detail)
    this.status = status
    this.detail = detail
    this.name = "ApiError"
  }
}

async function refreshAccessToken(): Promise<string | null> {
  const refreshToken = typeof window !== "undefined" ? localStorage.getItem("refresh_token") : null
  if (!refreshToken) return null

  try {
    const response = await fetch(`${API_BASE_URL}/api/v1/auth/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refresh_token: refreshToken }),
    })

    if (response.ok) {
      const data = await response.json()
      localStorage.setItem("access_token", data.access_token)
      localStorage.setItem("refresh_token", data.refresh_token)
      if (data.user) {
        localStorage.setItem("user", JSON.stringify(data.user))
      }
      return data.access_token
    }
  } catch (error) {
    console.error("[v0] Token refresh failed:", error)
  }

  return null
}

export async function apiClient<T>(
  endpoint: string,
  options: RequestInit = {},
  retryOnUnauthorized = true,
): Promise<T> {
  const token = typeof window !== "undefined" ? localStorage.getItem("access_token") : null

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  }

  if (token) {
    headers["Authorization"] = `Bearer ${token}`
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  })

  // 401 에러 시 토큰 갱신 후 재시도
  if (response.status === 401 && retryOnUnauthorized) {
    const newToken = await refreshAccessToken()
    if (newToken) {
      headers["Authorization"] = `Bearer ${newToken}`
      const retryResponse = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers,
      })

      if (!retryResponse.ok) {
        const errorData = await retryResponse.json().catch(() => ({}))
        throw new ApiError(retryResponse.status, errorData.detail || "요청에 실패했습니다.")
      }

      return retryResponse.json()
    } else {
      // 토큰 갱신 실패 시 로그아웃 처리
      if (typeof window !== "undefined") {
        localStorage.removeItem("access_token")
        localStorage.removeItem("refresh_token")
        localStorage.removeItem("user")
      }
      throw new ApiError(401, "세션이 만료되었습니다. 다시 로그인해주세요.")
    }
  }

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    throw new ApiError(response.status, errorData.detail || "요청에 실패했습니다.")
  }

  // 204 No Content 처리
  if (response.status === 204) {
    return {} as T
  }

  return response.json()
}

// 기존 fetchClient 호환 유지
export async function fetchClient<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  return apiClient<T>(endpoint, options)
}

export const FSRS_RATING = {
  AGAIN: 1,
  HARD: 2,
  GOOD: 3,
  EASY: 4,
} as const

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
  {
    id: 6,
    word: "comprehensive",
    definition: "종합적인, 포괄적인",
    pronunciation: "/ˌkɒmprɪˈhensɪv/",
    example_sentence: "The report provides a comprehensive analysis.",
    example_translation: "그 보고서는 종합적인 분석을 제공한다.",
  },
  {
    id: 7,
    word: "sustainable",
    definition: "지속 가능한",
    pronunciation: "/səˈsteɪnəbl/",
    example_sentence: "We need sustainable solutions for the environment.",
    example_translation: "우리는 환경을 위한 지속 가능한 해결책이 필요하다.",
  },
  {
    id: 8,
    word: "inevitable",
    definition: "피할 수 없는, 불가피한",
    pronunciation: "/ɪnˈevɪtəbl/",
    example_sentence: "Change is inevitable in any organization.",
    example_translation: "변화는 어떤 조직에서든 불가피하다.",
  },
  {
    id: 9,
    word: "sophisticated",
    definition: "정교한, 세련된",
    pronunciation: "/səˈfɪstɪkeɪtɪd/",
    example_sentence: "This is a sophisticated piece of technology.",
    example_translation: "이것은 정교한 기술 장비이다.",
  },
  {
    id: 10,
    word: "implement",
    definition: "실행하다, 이행하다",
    pronunciation: "/ˈɪmplɪment/",
    example_sentence: "We will implement the new policy next month.",
    example_translation: "우리는 다음 달에 새 정책을 시행할 것이다.",
  },
  {
    id: 11,
    word: "efficient",
    definition: "효율적인",
    pronunciation: "/ɪˈfɪʃənt/",
    example_sentence: "This method is more efficient than the old one.",
    example_translation: "이 방법은 기존 방법보다 더 효율적이다.",
  },
  {
    id: 12,
    word: "consequence",
    definition: "결과, 결말",
    pronunciation: "/ˈkɒnsɪkwəns/",
    example_sentence: "You must accept the consequences of your actions.",
    example_translation: "너는 네 행동의 결과를 받아들여야 한다.",
  },
  {
    id: 13,
    word: "substantial",
    definition: "상당한, 실질적인",
    pronunciation: "/səbˈstænʃəl/",
    example_sentence: "There has been a substantial increase in sales.",
    example_translation: "매출이 상당히 증가했다.",
  },
  {
    id: 14,
    word: "elaborate",
    definition: "정교한, 상세히 설명하다",
    pronunciation: "/ɪˈlæbərət/",
    example_sentence: "Could you elaborate on your proposal?",
    example_translation: "제안에 대해 자세히 설명해주시겠어요?",
  },
  {
    id: 15,
    word: "fundamental",
    definition: "근본적인, 기초적인",
    pronunciation: "/ˌfʌndəˈmentl/",
    example_sentence: "This is a fundamental principle of physics.",
    example_translation: "이것은 물리학의 근본적인 원리이다.",
  },
  {
    id: 16,
    word: "acquire",
    definition: "얻다, 습득하다",
    pronunciation: "/əˈkwaɪər/",
    example_sentence: "She acquired fluency in three languages.",
    example_translation: "그녀는 세 가지 언어에 유창해졌다.",
  },
  {
    id: 17,
    word: "controversy",
    definition: "논쟁, 논란",
    pronunciation: "/ˈkɒntrəvɜːsi/",
    example_sentence: "The decision sparked a major controversy.",
    example_translation: "그 결정은 큰 논란을 불러일으켰다.",
  },
  {
    id: 18,
    word: "enhance",
    definition: "향상시키다, 강화하다",
    pronunciation: "/ɪnˈhɑːns/",
    example_sentence: "This feature will enhance user experience.",
    example_translation: "이 기능은 사용자 경험을 향상시킬 것이다.",
  },
  {
    id: 19,
    word: "prevalent",
    definition: "널리 퍼진, 유행하는",
    pronunciation: "/ˈprevələnt/",
    example_sentence: "This disease is prevalent in tropical regions.",
    example_translation: "이 병은 열대 지역에서 널리 퍼져 있다.",
  },
  {
    id: 20,
    word: "autonomous",
    definition: "자율적인, 독립적인",
    pronunciation: "/ɔːˈtɒnəməs/",
    example_sentence: "The car has an autonomous driving system.",
    example_translation: "그 차는 자율 주행 시스템을 갖추고 있다.",
  },
]
