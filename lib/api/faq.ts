import { apiFetch } from "./http"

export interface UserFAQQuestion {
  id: string
  user_id: string
  category: string
  question: string
  status: "pending" | "answered"
  answer?: string
  created_at: string
  answered_at?: string
}

export interface CreateFAQQuestionRequest {
  category: string
  question: string
}

export interface AnswerFAQQuestionRequest {
  answer: string
}

let mockQuestions: UserFAQQuestion[] = []
let mockIdCounter = 1

// Use mock data when API is not available
const USE_MOCK_DATA = true

// 사용자: 내 질문 목록 조회
export async function getMyFAQQuestions(): Promise<UserFAQQuestion[]> {
  if (USE_MOCK_DATA) {
    // Mock: 현재 사용자의 질문만 반환 (실제로는 localStorage에서 user_id 확인)
    const userId = "current-user"
    return Promise.resolve(mockQuestions.filter((q) => q.user_id === userId))
  }
  return apiFetch<UserFAQQuestion[]>("/api/v1/faqs/me", {
    auth: true,
  })
}

// 사용자: 새 질문 작성
export async function createFAQQuestion(data: CreateFAQQuestionRequest): Promise<UserFAQQuestion> {
  if (USE_MOCK_DATA) {
    const newQuestion: UserFAQQuestion = {
      id: String(mockIdCounter++),
      user_id: "current-user",
      category: data.category,
      question: data.question,
      status: "pending",
      created_at: new Date().toISOString(),
    }
    mockQuestions.push(newQuestion)
    return Promise.resolve(newQuestion)
  }
  return apiFetch<UserFAQQuestion>("/api/v1/faqs", {
    method: "POST",
    auth: true,
    body: data,
  })
}

// 사용자: 질문 삭제 (대기중인 질문만 가능)
export async function deleteFAQQuestion(id: string): Promise<void> {
  if (USE_MOCK_DATA) {
    mockQuestions = mockQuestions.filter((q) => q.id !== id)
    return Promise.resolve()
  }
  return apiFetch<void>(`/api/v1/faqs/${id}`, {
    method: "DELETE",
    auth: true,
  })
}

// 관리자: 모든 질문 목록 조회
export async function getAllFAQQuestions(): Promise<UserFAQQuestion[]> {
  if (USE_MOCK_DATA) {
    return Promise.resolve(mockQuestions)
  }
  return apiFetch<UserFAQQuestion[]>("/api/v1/faqs/admin", {
    auth: true,
  })
}

// 관리자: 답변 작성
export async function answerFAQQuestion(id: string, data: AnswerFAQQuestionRequest): Promise<UserFAQQuestion> {
  if (USE_MOCK_DATA) {
    const question = mockQuestions.find((q) => q.id === id)
    if (!question) {
      throw new Error("Question not found")
    }
    question.status = "answered"
    question.answer = data.answer
    question.answered_at = new Date().toISOString()
    return Promise.resolve(question)
  }
  return apiFetch<UserFAQQuestion>(`/api/v1/faqs/${id}/answer`, {
    method: "PATCH",
    auth: true,
    body: data,
  })
}
