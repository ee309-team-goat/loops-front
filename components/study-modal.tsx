"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { X, BookOpen, RefreshCw, ChevronDown, ChevronUp, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useCourseStore } from "@/store/course-store"

interface StudyModalProps {
  isOpen: boolean
  onClose: () => void
  onStartStudy: () => void
  // Stats from API (mock for now)
  newWords?: number
  reviewWords?: number
  retryWords?: number
  totalTarget?: number
  currentProgress?: number
}

export function StudyModal({
  isOpen,
  onClose,
  onStartStudy,
  newWords = 35,
  reviewWords = 73,
  retryWords = 32,
  totalTarget = 140,
  currentProgress = 0,
}: StudyModalProps) {
  const router = useRouter()
  const { courseType } = useCourseStore()
  const [additionalCount, setAdditionalCount] = useState(10)

  if (!isOpen) return null

  const courseLabel = courseType === "integrated" ? "통합 코스" : "커스텀 코스"
  const isCompleted = currentProgress >= totalTarget

  const handleChangeCourse = () => {
    router.push("/course/change")
    onClose()
  }

  const handleStartStudy = () => {
    onStartStudy()
  }

  const adjustCount = (delta: number) => {
    const newCount = Math.max(5, Math.min(50, additionalCount + delta))
    setAdditionalCount(newCount)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      {/* Modal Content */}
      <div className="relative bg-white rounded-t-3xl w-full max-w-md p-6 pb-8 animate-in slide-in-from-bottom duration-300">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-indigo-600">어휘 학습</h2>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-full">
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        {/* Course Type */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="text-xs text-gray-400 mb-1">학습 코스</div>
            <div className="font-bold text-gray-900">{courseLabel}</div>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="text-gray-600 border-gray-300 bg-transparent"
            onClick={handleChangeCourse}
          >
            <RefreshCw className="w-3 h-3 mr-1" />
            변경
          </Button>
        </div>

        {/* Progress Circle & Stats */}
        <div className="flex items-center justify-center gap-8 mb-6">
          {/* Circular Progress (simplified) */}
          <div className="relative w-32 h-32">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="40" stroke="#E5E7EB" strokeWidth="8" fill="none" />
              <circle
                cx="50"
                cy="50"
                r="40"
                stroke="#F97316"
                strokeWidth="8"
                fill="none"
                strokeLinecap="round"
                strokeDasharray={`${(currentProgress / totalTarget) * 251.2} 251.2`}
              />
            </svg>
            {/* Mascot placeholder */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-4xl">🐥</div>
            </div>
          </div>

          {/* Stats */}
          <div className="space-y-2 text-sm">
            <div className="flex justify-between gap-4">
              <span className="text-gray-500">새로운 단어</span>
              <span className="font-bold">
                {newWords} <span className="text-gray-400 font-normal">개</span>
              </span>
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-gray-500">복습할 단어</span>
              <span className="font-bold">
                {reviewWords} <span className="text-gray-400 font-normal">개</span>
              </span>
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-gray-500">재도전 단어</span>
              <span className="font-bold">
                {retryWords} <span className="text-gray-400 font-normal">개</span>
              </span>
            </div>
          </div>
        </div>

        {/* Change Stats Button */}
        <div className="flex justify-center mb-4">
          <Button variant="ghost" size="sm" className="text-gray-400 text-xs">
            <RefreshCw className="w-3 h-3 mr-1" />
            변경
          </Button>
        </div>

        {/* Progress Text */}
        <div className="text-center mb-6">
          <span className="text-3xl font-bold text-orange-500">{currentProgress}</span>
          <span className="text-lg text-gray-400">/{totalTarget}</span>
        </div>

        {/* Additional Study Section (when completed) */}
        {isCompleted ? (
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <button onClick={() => adjustCount(-5)} className="p-1 rounded-full hover:bg-gray-100">
                <ChevronDown className="w-5 h-5 text-indigo-600" />
              </button>
              <span className="font-bold text-indigo-600 w-8 text-center">{additionalCount}</span>
              <span className="text-gray-400 text-sm">개</span>
              <button onClick={() => adjustCount(5)} className="p-1 rounded-full hover:bg-gray-100">
                <ChevronUp className="w-5 h-5 text-indigo-600" />
              </button>
            </div>
            <Button className="flex-1 bg-indigo-600 hover:bg-indigo-700" onClick={handleStartStudy}>
              <Star className="w-4 h-4 mr-2" />
              추가 학습
            </Button>
          </div>
        ) : (
          <Button className="w-full py-6 bg-indigo-600 hover:bg-indigo-700" onClick={handleStartStudy}>
            <BookOpen className="w-5 h-5 mr-2" />
            오늘의 학습
          </Button>
        )}
      </div>
    </div>
  )
}
