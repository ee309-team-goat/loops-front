"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ChevronLeft } from "lucide-react"

export default function SupportPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200 px-4 py-4 flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ChevronLeft className="w-5 h-5 text-gray-700" />
        </Button>
        <h1 className="text-xl font-bold text-gray-900">고객지원</h1>
      </div>

      <div className="p-4">
        <div className="bg-white rounded-2xl p-6 text-center">
          <p className="text-gray-500">고객센터, 수강증/출석확인 발급, 공지사항</p>
          <p className="text-sm text-gray-400 mt-2">준비 중입니다</p>
        </div>
      </div>
    </div>
  )
}
