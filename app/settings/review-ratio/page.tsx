"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ChevronLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useCourseStore } from "@/store/course-store"

export default function ReviewRatioPage() {
  const router = useRouter()
  const { reviewRatioMode, customReviewRatioPercent, setTargetWordCount } = useCourseStore()

  // Local state for editing
  const [mode, setMode] = useState<"normal" | "custom">(reviewRatioMode)
  const [customPercent, setCustomPercent] = useState(customReviewRatioPercent)

  const handleSave = () => {
    // Update store - we need to add these actions to the store
    // For now just go back
    router.back()
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b px-4 py-4 flex items-center gap-3">
        <button onClick={() => router.back()} className="p-1">
          <ChevronLeft className="w-6 h-6" />
        </button>
        <h1 className="text-lg font-bold">복습 단어 비율</h1>
      </div>

      <div className="p-4 space-y-4">
        {/* Normal Mode */}
        <button
          className={`w-full p-4 rounded-xl border-2 text-left transition-colors ${
            mode === "normal" ? "border-indigo-500 bg-indigo-50" : "border-gray-200 bg-white"
          }`}
          onClick={() => setMode("normal")}
        >
          <div className="flex items-center gap-2 mb-1">
            <span className="font-bold">기본 비율</span>
            <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full">권장</span>
          </div>
          <p className="text-sm text-gray-500">새 단어 30% / 복습 단어 70%로 학습합니다.</p>
        </button>

        {/* Custom Mode */}
        <button
          className={`w-full p-4 rounded-xl border-2 text-left transition-colors ${
            mode === "custom" ? "border-indigo-500 bg-indigo-50" : "border-gray-200 bg-white"
          }`}
          onClick={() => setMode("custom")}
        >
          <div className="font-bold mb-1">직접 설정</div>
          <p className="text-sm text-gray-500">복습 단어 비율을 직접 설정합니다.</p>
        </button>

        {/* Custom Slider (shown when custom mode) */}
        {mode === "custom" && (
          <div className="bg-white p-4 rounded-xl border border-gray-200 space-y-4">
            <div className="flex justify-between text-sm">
              <span>새 단어: {100 - customPercent}%</span>
              <span>복습 단어: {customPercent}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              step="10"
              value={customPercent}
              onChange={(e) => setCustomPercent(Number(e.target.value))}
              className="w-full accent-indigo-600"
            />
            <div className="flex justify-between text-xs text-gray-400">
              <span>0%</span>
              <span>50%</span>
              <span>100%</span>
            </div>
          </div>
        )}

        <Button className="w-full py-6" onClick={handleSave}>
          설정 완료
        </Button>
      </div>
    </div>
  )
}
