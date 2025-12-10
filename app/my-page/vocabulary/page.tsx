"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ChevronLeft, Check } from "lucide-react"

type QuizMode = "flashcard" | "multiple-choice" | "typing"

const QUIZ_MODES: { value: QuizMode; label: string }[] = [
  { value: "flashcard", label: "플래시카드" },
  { value: "multiple-choice", label: "객관식" },
  { value: "typing", label: "직접 입력" },
]

const DECK_TYPES = [
  { id: "toefl", name: "TOEFL 필수 단어장", icon: "🎓" },
  { id: "toeic", name: "TOEIC 필수 단어장", icon: "💼" },
  { id: "ielts", name: "IELTS 필수 단어장", icon: "✈️" },
  { id: "daily", name: "일상 회화 기초", icon: "💬" },
  { id: "business", name: "비즈니스 영어", icon: "📊" },
  { id: "travel", name: "여행 영어", icon: "🌎" },
]

export default function VocabularySettingsPage() {
  const router = useRouter()
  const [settings, setSettings] = useState({
    dailyGoal: 20,
    quizModes: ["flashcard"] as QuizMode[],
    deckTypes: ["daily"] as string[],
  })

  useEffect(() => {
    const saved = localStorage.getItem("vocabularySettings")
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        if (parsed.difficulty && !parsed.deckTypes) {
          parsed.deckTypes = ["daily"]
          delete parsed.difficulty
        }
        setSettings(parsed)
      } catch (e) {
        console.error("Failed to parse settings")
      }
    }
  }, [])

  const updateSetting = (key: string, value: any) => {
    setSettings((prev) => {
      const newSettings = { ...prev, [key]: value }
      localStorage.setItem("vocabularySettings", JSON.stringify(newSettings))
      return newSettings
    })
  }

  const toggleQuizMode = (mode: QuizMode) => {
    const currentModes = settings.quizModes
    let newModes: QuizMode[]

    if (currentModes.includes(mode)) {
      if (currentModes.length === 1) return
      newModes = currentModes.filter((m) => m !== mode)
    } else {
      newModes = [...currentModes, mode]
    }

    updateSetting("quizModes", newModes)
  }

  const toggleDeckType = (deckId: string) => {
    const currentDecks = settings.deckTypes
    let newDecks: string[]

    if (currentDecks.includes(deckId)) {
      if (currentDecks.length === 1) return
      newDecks = currentDecks.filter((d) => d !== deckId)
    } else {
      newDecks = [...currentDecks, deckId]
    }

    updateSetting("deckTypes", newDecks)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200 px-4 py-4 flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ChevronLeft className="w-5 h-5 text-gray-700" />
        </Button>
        <h1 className="text-xl font-bold text-gray-900">어휘학습</h1>
      </div>

      <div className="p-4 space-y-4">
        <div className="bg-white rounded-2xl p-4 space-y-4">
          <div className="space-y-2">
            <label className="block text-sm text-gray-700 font-medium">하루 목표 (단어 수)</label>
            <select
              value={settings.dailyGoal}
              onChange={(e) => updateSetting("dailyGoal", Number(e.target.value))}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value={10}>10개 (가볍게)</option>
              <option value={20}>20개 (적당히)</option>
              <option value={30}>30개 (집중)</option>
              <option value={50}>50개 (고강도)</option>
            </select>
          </div>

          <div className="space-y-3 pt-2 border-t border-gray-100">
            <label className="block text-sm text-gray-700 font-medium">퀴즈 방식 (복수 선택 가능)</label>
            <div className="space-y-2">
              {QUIZ_MODES.map((mode) => {
                const isSelected = settings.quizModes.includes(mode.value)
                return (
                  <button
                    key={mode.value}
                    onClick={() => toggleQuizMode(mode.value)}
                    className={`w-full flex items-center justify-between px-4 py-3 rounded-lg border transition-colors ${
                      isSelected
                        ? "border-indigo-500 bg-indigo-50 text-indigo-700"
                        : "border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    <span className="font-medium">{mode.label}</span>
                    <div
                      className={`w-5 h-5 rounded flex items-center justify-center ${
                        isSelected ? "bg-indigo-500" : "border border-gray-300"
                      }`}
                    >
                      {isSelected && <Check className="w-3 h-3 text-white" />}
                    </div>
                  </button>
                )
              })}
            </div>
            <p className="text-xs text-gray-500">선택한 방식들이 랜덤하게 섞여서 출제됩니다.</p>
          </div>

          <div className="space-y-3 pt-2 border-t border-gray-100">
            <label className="block text-sm text-gray-700 font-medium">단어장 종류 (복수 선택 가능)</label>
            <div className="space-y-2">
              {DECK_TYPES.map((deck) => {
                const isSelected = settings.deckTypes.includes(deck.id)
                return (
                  <button
                    key={deck.id}
                    onClick={() => toggleDeckType(deck.id)}
                    className={`w-full flex items-center justify-between px-4 py-3 rounded-lg border transition-colors ${
                      isSelected
                        ? "border-indigo-500 bg-indigo-50 text-indigo-700"
                        : "border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    <span className="font-medium">
                      {deck.icon} {deck.name}
                    </span>
                    <div
                      className={`w-5 h-5 rounded flex items-center justify-center ${
                        isSelected ? "bg-indigo-500" : "border border-gray-300"
                      }`}
                    >
                      {isSelected && <Check className="w-3 h-3 text-white" />}
                    </div>
                  </button>
                )
              })}
            </div>
            <p className="text-xs text-gray-500">선택한 단어장에서 단어가 출제됩니다.</p>
          </div>
        </div>
      </div>
    </div>
  )
}
