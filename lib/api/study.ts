import { apiFetch } from "./http"

// Types
export interface StudyCard {
  card_id: string
  word: string
  meaning: string
  example_sentence?: string
  example_translation?: string
  pronunciation?: string
  deck_name?: string
  [key: string]: unknown
}

export interface StartSessionRequest {
  new_cards_limit?: number
  review_cards_limit?: number
}

export interface StartSessionResponse {
  session_id: string
  cards_remaining: number
  cards_completed: number
  started_at: string
}

export interface CardResponse {
  card: StudyCard | null
  cards_remaining: number
  cards_completed: number
}

export interface SubmitAnswerRequest {
  session_id: string
  card_id: string
  answer: string
}

export interface SubmitAnswerResponse {
  correct: boolean
  cards_remaining: number
  cards_completed: number
}

export interface SessionSummary {
  total_cards_studied: number
  correct_count: number
  accuracy_percent: number
  time_spent_seconds: number
  xp_earned: number
  new_cards_learned: number
  cards_reviewed: number
}

export interface CompleteSessionResponse {
  session_summary: SessionSummary
  streak: {
    current_streak: number
    longest_streak: number
  }
  daily_goal: {
    target: number
    completed: number
    is_completed: boolean
  }
  xp: {
    total_xp: number
    level: number
  }
}

// API Functions
export async function startSession(params: StartSessionRequest): Promise<StartSessionResponse> {
  return apiFetch<StartSessionResponse>("/api/v1/study/session/start", {
    method: "POST",
    auth: true,
    body: params,
  })
}

export async function getNextCard(sessionId: string): Promise<CardResponse> {
  return apiFetch<CardResponse>("/api/v1/study/session/card", {
    method: "POST",
    auth: true,
    body: { session_id: sessionId },
  })
}

export async function submitAnswer(params: SubmitAnswerRequest): Promise<SubmitAnswerResponse> {
  return apiFetch<SubmitAnswerResponse>("/api/v1/study/session/answer", {
    method: "POST",
    auth: true,
    body: params,
  })
}

export async function completeSession(sessionId: string): Promise<CompleteSessionResponse> {
  return apiFetch<CompleteSessionResponse>("/api/v1/study/session/complete", {
    method: "POST",
    auth: true,
    body: { session_id: sessionId },
  })
}
