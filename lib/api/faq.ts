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

// 사용자: 내 질문 목록 조회
export async function getMyFAQQuestions(): Promise<UserFAQQuestion[]> {
  return apiFetch<UserFAQQuestion[]>("/api/v1/faqs/me", {
    auth: true,
  })
}

// 사용자: 새 질문 작성
export async function createFAQQuestion(data: CreateFAQQuestionRequest): Promise<UserFAQQuestion> {
  return apiFetch<UserFAQQuestion>("/api/v1/faqs", {
    method: "POST",
    auth: true,
    body: data,
  })
}

// 사용자: 질문 삭제 (대기중인 질문만 가능)
export async function deleteFAQQuestion(id: string): Promise<void> {
  return apiFetch<void>(`/api/v1/faqs/${id}`, {
    method: "DELETE",
    auth: true,
  })
}

// 관리자: 모든 질문 목록 조회
export async function getAllFAQQuestions(): Promise<UserFAQQuestion[]> {
  return apiFetch<UserFAQQuestion[]>("/api/v1/faqs/admin", {
    auth: true,
  })
}

// 관리자: 답변 작성
export async function answerFAQQuestion(id: string, data: AnswerFAQQuestionRequest): Promise<UserFAQQuestion> {
  return apiFetch<UserFAQQuestion>(`/api/v1/faqs/${id}/answer`, {
    method: "PATCH",
    auth: true,
    body: data,
  })
}
