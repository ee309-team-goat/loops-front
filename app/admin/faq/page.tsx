"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { ChevronLeft, Send, Clock, CheckCircle } from "lucide-react"
import { getAllFAQQuestions, answerFAQQuestion, type UserFAQQuestion } from "@/lib/api/faq"
import { FAQ_CATEGORIES } from "@/lib/data/faq-data"
import { useToast } from "@/hooks/use-toast"

export default function AdminFAQPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [questions, setQuestions] = useState<UserFAQQuestion[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [selectedQuestion, setSelectedQuestion] = useState<UserFAQQuestion | null>(null)
  const [answer, setAnswer] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [filterStatus, setFilterStatus] = useState<"all" | "pending" | "answered">("all")

  useEffect(() => {
    loadQuestions()
  }, [])

  const loadQuestions = async () => {
    setIsLoading(true)
    try {
      const data = await getAllFAQQuestions()
      setQuestions(data)
    } catch (error) {
      console.error("Failed to load questions:", error)
      toast({
        title: "질문 목록을 불러오는데 실패했습니다",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleAnswerSubmit = async () => {
    if (!selectedQuestion || !answer.trim()) return

    setIsSubmitting(true)
    try {
      const updatedQuestion = await answerFAQQuestion(selectedQuestion.id, {
        answer: answer.trim(),
      })

      setQuestions(questions.map((q) => (q.id === updatedQuestion.id ? updatedQuestion : q)))
      setSelectedQuestion(null)
      setAnswer("")

      toast({
        title: "답변이 등록되었습니다",
        description: "사용자에게 답변이 전달됩니다",
      })
    } catch (error) {
      console.error("Failed to submit answer:", error)
      toast({
        title: "답변 등록에 실패했습니다",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const filteredQuestions = questions.filter((q) => {
    if (filterStatus === "all") return true
    return q.status === filterStatus
  })

  const pendingCount = questions.filter((q) => q.status === "pending").length
  const answeredCount = questions.filter((q) => q.status === "answered").length

  return (
    <div className="min-h-screen bg-white">
      <div className="border-b border-gray-200 px-4 py-4 flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ChevronLeft className="w-5 h-5 text-gray-700" />
        </Button>
        <h1 className="text-lg font-medium text-gray-900">FAQ 관리 (관리자)</h1>
      </div>

      <div className="px-4 py-4">
        <div className="flex gap-2 mb-4">
          <button
            onClick={() => setFilterStatus("all")}
            className={`px-4 py-2 rounded-full text-sm ${
              filterStatus === "all" ? "bg-violet-600 text-white" : "bg-gray-100 text-gray-700"
            }`}
          >
            전체 {questions.length}
          </button>
          <button
            onClick={() => setFilterStatus("pending")}
            className={`px-4 py-2 rounded-full text-sm flex items-center gap-1 ${
              filterStatus === "pending" ? "bg-amber-600 text-white" : "bg-gray-100 text-gray-700"
            }`}
          >
            <Clock className="w-3 h-3" /> 대기중 {pendingCount}
          </button>
          <button
            onClick={() => setFilterStatus("answered")}
            className={`px-4 py-2 rounded-full text-sm flex items-center gap-1 ${
              filterStatus === "answered" ? "bg-green-600 text-white" : "bg-gray-100 text-gray-700"
            }`}
          >
            <CheckCircle className="w-3 h-3" /> 답변완료 {answeredCount}
          </button>
        </div>

        {isLoading ? (
          <div className="text-center py-8 text-gray-500">질문을 불러오는 중...</div>
        ) : (
          <div className="space-y-2">
            {filteredQuestions.map((q) => (
              <div
                key={q.id}
                className={`border rounded-xl p-4 ${
                  q.status === "pending" ? "border-amber-200 bg-amber-50" : "border-green-200 bg-green-50"
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs text-gray-500">
                        {FAQ_CATEGORIES.find((c) => c.id === q.category)?.label || q.category}
                      </span>
                      {q.status === "pending" ? (
                        <span className="flex items-center gap-1 text-xs text-amber-600 bg-amber-100 px-2 py-0.5 rounded-full">
                          <Clock className="w-3 h-3" /> 대기중
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-xs text-green-600 bg-green-100 px-2 py-0.5 rounded-full">
                          <CheckCircle className="w-3 h-3" /> 답변완료
                        </span>
                      )}
                    </div>
                    <p className="text-sm font-medium text-gray-900 mb-1">{q.question}</p>
                    <p className="text-xs text-gray-400">
                      작성일: {new Date(q.created_at).toLocaleDateString("ko-KR")}
                    </p>
                    {q.status === "answered" && q.answer && (
                      <div className="mt-2 p-2 bg-white rounded border border-green-200">
                        <p className="text-xs text-green-600 mb-1">답변:</p>
                        <p className="text-sm text-gray-700">{q.answer}</p>
                        <p className="text-xs text-gray-400 mt-1">
                          답변일: {q.answered_at && new Date(q.answered_at).toLocaleDateString("ko-KR")}
                        </p>
                      </div>
                    )}
                  </div>
                  {q.status === "pending" && (
                    <Button size="sm" onClick={() => setSelectedQuestion(q)} className="ml-2">
                      답변하기
                    </Button>
                  )}
                </div>
              </div>
            ))}
            {filteredQuestions.length === 0 && <div className="text-center py-8 text-gray-500">질문이 없습니다</div>}
          </div>
        )}
      </div>

      {selectedQuestion && (
        <div className="fixed inset-0 bg-black/50 flex items-end justify-center z-50">
          <div className="bg-white w-full max-w-2xl rounded-t-2xl p-6 max-h-[80vh] overflow-y-auto">
            <h2 className="text-lg font-medium mb-4">답변 작성</h2>
            <div className="mb-4 p-3 bg-gray-50 rounded">
              <p className="text-sm text-gray-600 mb-1">질문:</p>
              <p className="text-sm font-medium text-gray-900">{selectedQuestion.question}</p>
            </div>
            <Textarea
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              placeholder="답변을 입력하세요..."
              className="min-h-[150px] mb-4"
            />
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  setSelectedQuestion(null)
                  setAnswer("")
                }}
                disabled={isSubmitting}
                className="flex-1"
              >
                취소
              </Button>
              <Button
                onClick={handleAnswerSubmit}
                disabled={!answer.trim() || isSubmitting}
                className="flex-1 flex items-center gap-2"
              >
                <Send className="w-4 h-4" />
                {isSubmitting ? "전송 중..." : "답변 전송"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
