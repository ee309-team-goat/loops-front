"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, MessageCircle, Copy, Check, Plus, Mail, User } from "lucide-react"
import { useRouter } from "next/navigation"

type AuthInfo = {
  type: "guest" | "email" | "google" | "kakao"
  email: string
  loginMethod: string
}

export default function AccountPage() {
  const router = useRouter()
  const [copied, setCopied] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [learningPurpose, setLearningPurpose] = useState("유학/대학원 진학")
  const [showPurposeSelect, setShowPurposeSelect] = useState(false)

  const [authInfo, setAuthInfo] = useState<AuthInfo | null>(null)

  // 임시 계정 코드 (실제로는 서버에서 생성)
  const [accountCode, setAccountCode] = useState("")

  useEffect(() => {
    const savedAuth = localStorage.getItem("authInfo")
    if (savedAuth) {
      setAuthInfo(JSON.parse(savedAuth))
    }

    const savedPurpose = localStorage.getItem("learningPurpose")
    if (savedPurpose) setLearningPurpose(savedPurpose)

    // 계정 코드 생성 (세션마다 동일하게 유지)
    const savedCode = localStorage.getItem("accountCode")
    if (savedCode) {
      setAccountCode(savedCode)
    } else {
      const newCode = "LOOPS-" + Math.random().toString(36).substring(2, 10).toUpperCase()
      localStorage.setItem("accountCode", newCode)
      setAccountCode(newCode)
    }
  }, [])

  const handleCopyCode = () => {
    navigator.clipboard.writeText(accountCode)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleLogout = () => {
    localStorage.removeItem("authInfo")
    router.push("/")
  }

  const handleDeleteAccount = () => {
    localStorage.clear()
    router.push("/")
  }

  const handlePurposeSelect = (purpose: string) => {
    setLearningPurpose(purpose)
    localStorage.setItem("learningPurpose", purpose)
    setShowPurposeSelect(false)
  }

  const purposes = ["유학/대학원 진학", "취업/이직", "자기계발", "시험 준비 (토익, 토플 등)", "여행/해외생활", "기타"]

  const getAccountDisplay = () => {
    if (!authInfo) return null

    switch (authInfo.type) {
      case "guest":
        return {
          icon: <User className="w-6 h-6 text-gray-600" />,
          label: "게스트 계정",
          bgColor: "bg-gray-200",
          textColor: "text-gray-900",
        }
      case "email":
        return {
          icon: <Mail className="w-6 h-6 text-blue-600" />,
          label: "이메일 계정",
          bgColor: "bg-blue-100",
          textColor: "text-blue-900",
        }
      case "google":
        return {
          icon: (
            <svg className="w-6 h-6" viewBox="0 0 24 24">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
          ),
          label: "Google 계정",
          bgColor: "bg-white border border-gray-200",
          textColor: "text-gray-900",
        }
      case "kakao":
        return {
          icon: <MessageCircle className="w-6 h-6 text-gray-900" />,
          label: "카카오 계정",
          bgColor: "bg-yellow-400",
          textColor: "text-gray-900",
        }
      default:
        return null
    }
  }

  const accountDisplay = getAccountDisplay()

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

          <div className="p-4 space-y-3">
            <span className="text-sm text-gray-500">연결된 계정</span>

            {authInfo && accountDisplay && (
              <div className={`${accountDisplay.bgColor} rounded-xl overflow-hidden`}>
                <div className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {accountDisplay.icon}
                    <span className={`font-medium ${accountDisplay.textColor}`}>{accountDisplay.label}</span>
                  </div>
                  {authInfo.type !== "guest" && (
                    <button className="flex items-center gap-1 text-gray-700 text-sm">
                      연결해제
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  )}
                </div>
                <div className="px-4 pb-4">
                  <span className={`text-sm ${authInfo.type === "guest" ? "text-gray-600" : "text-gray-700"}`}>
                    이메일: {authInfo.email}
                  </span>
                </div>
              </div>
            )}

            {/* 게스트가 아닐 때만 추가 계정 연결 버튼 표시 */}
            {authInfo?.type !== "guest" && (
              <button className="w-full border-2 border-dashed border-gray-300 rounded-xl p-4 flex items-center justify-center gap-2 text-gray-500 hover:bg-gray-50 transition-colors">
                <Plus className="w-5 h-5" />
                추가 계정 연결하기
                <span className="w-5 h-5 rounded-full bg-gray-300 text-white text-xs flex items-center justify-center">
                  ?
                </span>
              </button>
            )}

            {authInfo?.type === "guest" && (
              <div className="bg-violet-50 rounded-xl p-4 text-center">
                <p className="text-sm text-violet-700 mb-3">
                  게스트 상태입니다. 학습 데이터를 저장하려면 계정을 연결하세요.
                </p>
                <Button size="sm" onClick={() => router.push("/signup")} className="bg-violet-600 hover:bg-violet-700">
                  계정 연결하기
                </Button>
              </div>
            )}
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
