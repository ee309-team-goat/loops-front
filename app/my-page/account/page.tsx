"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, MessageCircle, Copy, Check, Plus } from "lucide-react"
import { useRouter } from "next/navigation"

export default function AccountPage() {
  const router = useRouter()
  const [copied, setCopied] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [learningPurpose, setLearningPurpose] = useState("유학/대학원 진학")
  const [showPurposeSelect, setShowPurposeSelect] = useState(false)

  // 임시 계정 코드 (실제로는 서버에서 생성)
  const accountCode = "LOOPS-" + Math.random().toString(36).substring(2, 10).toUpperCase()

  // 연결된 계정 정보 (실제로는 서버에서 가져옴)
  const [connectedAccount, setConnectedAccount] = useState({
    type: "kakao",
    email: "user@example.com",
  })

  useEffect(() => {
    const saved = localStorage.getItem("learningPurpose")
    if (saved) setLearningPurpose(saved)
  }, [])

  const handleCopyCode = () => {
    navigator.clipboard.writeText(accountCode)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleLogout = () => {
    // 실제로는 서버에 로그아웃 요청
    localStorage.clear()
    router.push("/")
  }

  const handleDeleteAccount = () => {
    // 실제로는 서버에 탈퇴 요청
    localStorage.clear()
    router.push("/")
  }

  const handlePurposeSelect = (purpose: string) => {
    setLearningPurpose(purpose)
    localStorage.setItem("learningPurpose", purpose)
    setShowPurposeSelect(false)
  }

  const purposes = ["유학/대학원 진학", "취업/이직", "자기계발", "시험 준비 (토익, 토플 등)", "여행/해외생활", "기타"]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white px-4 py-4 flex items-center gap-3 border-b border-gray-200">
        <button onClick={() => router.back()} className="p-1">
          <ChevronLeft className="w-6 h-6" />
        </button>
        <h1 className="text-lg font-bold">계정 관리</h1>
      </div>

      <div className="p-4 space-y-4">
        {/* 계정 코드 섹션 */}
        <div className="bg-white rounded-2xl overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-100">
            <h2 className="font-bold text-gray-900">계정 코드</h2>
          </div>
          <div className="p-4 flex items-center justify-between">
            <span className="text-gray-700">Loops 고유 계정 코드</span>
            <Button
              variant="outline"
              size="sm"
              onClick={handleCopyCode}
              className="flex items-center gap-2 bg-transparent"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4" />
                  복사됨
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  코드 복사하기
                </>
              )}
            </Button>
          </div>
        </div>

        {/* 계정 연결 섹션 */}
        <div className="bg-white rounded-2xl overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-100">
            <h2 className="font-bold text-gray-900">계정 연결</h2>
          </div>

          {/* 로그아웃 */}
          <div className="p-4 flex items-center justify-between border-b border-gray-100">
            <span className="text-gray-700">로그아웃하고 싶으세요?</span>
            <Button variant="outline" size="sm" onClick={handleLogout}>
              로그아웃
            </Button>
          </div>

          {/* 연결된 계정 */}
          <div className="p-4 space-y-3">
            <span className="text-sm text-gray-500">연결된 계정</span>

            {connectedAccount && (
              <div className="bg-yellow-400 rounded-xl overflow-hidden">
                <div className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <MessageCircle className="w-6 h-6 text-gray-900" />
                    <span className="font-medium text-gray-900">카카오 계정</span>
                  </div>
                  <button className="flex items-center gap-1 text-gray-700 text-sm">
                    연결해제
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
                <div className="px-4 pb-4">
                  <span className="text-sm text-gray-700">이메일: {connectedAccount.email}</span>
                </div>
              </div>
            )}

            <button className="w-full border-2 border-dashed border-gray-300 rounded-xl p-4 flex items-center justify-center gap-2 text-gray-500 hover:bg-gray-50 transition-colors">
              <Plus className="w-5 h-5" />
              추가 계정 연결하기
              <span className="w-5 h-5 rounded-full bg-gray-300 text-white text-xs flex items-center justify-center">
                ?
              </span>
            </button>
          </div>
        </div>

        {/* 계정 관리 섹션 */}
        <div className="bg-white rounded-2xl overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-100">
            <h2 className="font-bold text-gray-900">계정 관리</h2>
          </div>

          {/* 학습 목적 */}
          <button
            onClick={() => setShowPurposeSelect(true)}
            className="w-full p-4 flex items-center justify-between border-b border-gray-100 hover:bg-gray-50 transition-colors"
          >
            <span className="text-gray-700">학습 목적</span>
            <div className="flex items-center gap-1 text-gray-500">
              <span>{learningPurpose}</span>
              <ChevronRight className="w-4 h-4" />
            </div>
          </button>

          {/* 탈퇴하기 */}
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="w-full p-4 text-left text-gray-700 hover:bg-gray-50 transition-colors"
          >
            탈퇴하기
          </button>
        </div>
      </div>

      {/* 학습 목적 선택 모달 */}
      {showPurposeSelect && (
        <div className="fixed inset-0 bg-black/50 flex items-end justify-center z-50">
          <div className="bg-white w-full max-w-lg rounded-t-2xl">
            <div className="p-4 border-b border-gray-200 flex items-center justify-between">
              <h3 className="font-bold text-lg">학습 목적 선택</h3>
              <button onClick={() => setShowPurposeSelect(false)} className="text-gray-500">
                취소
              </button>
            </div>
            <div className="p-2">
              {purposes.map((purpose) => (
                <button
                  key={purpose}
                  onClick={() => handlePurposeSelect(purpose)}
                  className={`w-full p-4 text-left rounded-xl transition-colors ${
                    learningPurpose === purpose ? "bg-violet-100 text-violet-700" : "hover:bg-gray-100"
                  }`}
                >
                  {purpose}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 탈퇴 확인 모달 */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white w-full max-w-sm rounded-2xl p-6">
            <h3 className="font-bold text-lg mb-2">정말 탈퇴하시겠습니까?</h3>
            <p className="text-gray-600 text-sm mb-6">탈퇴 시 모든 학습 데이터가 삭제되며 복구할 수 없습니다.</p>
            <div className="flex gap-3">
              <Button variant="outline" className="flex-1 bg-transparent" onClick={() => setShowDeleteConfirm(false)}>
                취소
              </Button>
              <Button variant="destructive" className="flex-1" onClick={handleDeleteAccount}>
                탈퇴하기
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
