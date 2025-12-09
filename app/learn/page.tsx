"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { MOCK_CARDS } from "@/lib/api/client"
import { FSRS_RATING } from "@/lib/types/api"
import { useSettings } from "@/components/settings-provider"
import { Volume2, X, Mic, Lightbulb, Repeat } from "lucide-react"
import { cn } from "@/lib/utils"

export default function LearnPage() {
  const router = useRouter()
  const { settings } = useSettings()

  const [currentIndex, setCurrentIndex] = useState(0)
  const [isFlipped, setIsFlipped] = useState(false)
  const [cards, setCards] = useState(MOCK_CARDS)
  const [completedCount, setCompletedCount] = useState(0)
  const [showTutorial, setShowTutorial] = useState(true)
  const [currentExampleIndex, setCurrentExampleIndex] = useState(0)
  const [isGeneratingExample, setIsGeneratingExample] = useState(false)
  const [isRecording, setIsRecording] = useState(false)
  const [showPronunciationAnalysis, setShowPronunciationAnalysis] = useState(false)

  const prevIsFlipped = useRef(false)

  const currentCard = cards[currentIndex]
  const progress = (currentIndex / cards.length) * 100

  const mockExamples = [
    {
      sentence: "The company is known for its innovation in AI.",
      translation: "그 회사는 AI 분야의 혁신으로 알려져 있다.",
    },
    {
      sentence: "Digital innovation is transforming the healthcare industry.",
      translation: "디지털 혁신이 의료 산업을 변화시키고 있다.",
    },
    {
      sentence: "We need constant innovation to stay competitive.",
      translation: "경쟁력을 유지하려면 지속적인 혁신이 필요하다.",
    },
  ]

  useEffect(() => {
    if (isFlipped && !prevIsFlipped.current && settings.autoPlayAudio) {
      // Card just flipped to back - auto play audio
      playAudioWithSettings()
    }
    prevIsFlipped.current = isFlipped
  }, [isFlipped, settings.autoPlayAudio])

  const handleFlip = () => {
    setIsFlipped(!isFlipped)
    if (showTutorial) setShowTutorial(false)
  }

  const handleRate = (rating: number) => {
    if (currentIndex < cards.length - 1) {
      setIsFlipped(false)
      setTimeout(() => {
        setCurrentIndex((prev) => prev + 1)
        setCurrentExampleIndex(0)
      }, 300)
      setCompletedCount((prev) => prev + 1)
    } else {
      router.push("/dashboard")
    }
  }

  const playAudioWithSettings = () => {
    if ("speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(currentCard.word)
      utterance.lang = "en-US"
      utterance.rate = settings.playbackSpeed
      window.speechSynthesis.speak(utterance)
    }
  }

  const playAudio = (e: React.MouseEvent) => {
    e.stopPropagation()
    playAudioWithSettings()
  }

  const regenerateExample = (e: React.MouseEvent) => {
    e.stopPropagation()
    setIsGeneratingExample(true)
    setTimeout(() => {
      setCurrentExampleIndex((prev) => (prev + 1) % mockExamples.length)
      setIsGeneratingExample(false)
    }, 800)
  }

  const toggleRecording = (e: React.MouseEvent) => {
    e.stopPropagation()
    setIsRecording(!isRecording)

    if (!isRecording) {
      setTimeout(() => {
        setIsRecording(false)
        setShowPronunciationAnalysis(true)
      }, 2000)
    }
  }

  const currentExample = mockExamples[currentExampleIndex]

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Header */}
      <div className="bg-white px-4 py-3 flex items-center justify-between shadow-sm z-10">
        <Button variant="ghost" size="icon" onClick={() => router.push("/dashboard")}>
          <X className="w-5 h-5 text-gray-500" />
        </Button>
        <div className="flex-1 mx-4">
          <div className="flex justify-between text-xs text-gray-500 mb-1">
            <span>오늘의 학습</span>
            <span>
              {currentIndex + 1} / {cards.length}
            </span>
          </div>
          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
            <div className="h-full bg-indigo-500 transition-all duration-300" style={{ width: `${progress}%` }} />
          </div>
        </div>
        <div className="w-10" />
      </div>

      {/* Card Area */}
      <div className="flex-1 flex flex-col items-center justify-center p-4 perspective-1000">
        <div
          className={cn(
            "relative w-full max-w-sm aspect-[3/4] transition-all duration-500 transform-style-3d cursor-pointer",
            isFlipped ? "rotate-y-180" : "",
          )}
          onClick={handleFlip}
        >
          {/* Front */}
          <div className="absolute inset-0 bg-white rounded-3xl shadow-xl flex flex-col items-center justify-center p-8 backface-hidden border border-gray-100">
            <span className="text-4xl font-bold text-gray-900 mb-8">{currentCard.word}</span>

            {showTutorial && (
              <div className="absolute bottom-8 animate-bounce text-gray-400 text-sm flex flex-col items-center">
                <span>👆</span>
                <span>탭해서 뒤집기</span>
              </div>
            )}
          </div>

          {/* Back */}
          <div className="absolute inset-0 bg-white rounded-3xl shadow-xl flex flex-col p-6 backface-hidden rotate-y-180 border border-gray-100 overflow-y-auto">
            <div className="flex-1 flex flex-col items-center justify-center text-center space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-center gap-2">
                  <h2 className="text-3xl font-bold text-gray-900">{currentCard.word}</h2>
                  <button
                    onClick={playAudio}
                    className="p-2 rounded-full bg-indigo-50 text-indigo-600 hover:bg-indigo-100 transition-colors"
                  >
                    <Volume2 className="w-5 h-5" />
                  </button>
                </div>
                <p className="text-gray-500 font-mono text-sm">{currentCard.pronunciation}</p>
              </div>

              <div className="flex gap-1 text-xs">
                <span className="px-3 py-1 rounded-full bg-indigo-100 text-indigo-600 font-medium">
                  {settings.playbackSpeed}x
                </span>
              </div>

              <div className="w-12 h-1 bg-gray-100 rounded-full" />

              <div className="space-y-1">
                <p className="text-2xl font-bold text-indigo-600">{currentCard.definition}</p>
              </div>

              <div className="bg-gray-50 p-4 rounded-xl w-full text-left space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-400 font-medium">예문 {currentExampleIndex + 1}</span>
                  <button
                    onClick={regenerateExample}
                    disabled={isGeneratingExample}
                    className="flex items-center gap-1 text-xs text-indigo-600 hover:text-indigo-700 disabled:opacity-50"
                  >
                    <Repeat className={cn("w-3 h-3", isGeneratingExample && "animate-spin")} />
                    {isGeneratingExample ? "생성 중..." : "새 예문"}
                  </button>
                </div>
                <p className="text-gray-800 font-medium">"{currentExample.sentence}"</p>
                <p className="text-gray-500 text-sm">{currentExample.translation}</p>
              </div>

              <button
                onClick={toggleRecording}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-full transition-all",
                  isRecording ? "bg-red-100 text-red-600 animate-pulse" : "bg-gray-100 text-gray-600 hover:bg-gray-200",
                )}
              >
                <Mic className="w-4 h-4" />
                <span className="text-sm font-medium">{isRecording ? "녹음 중..." : "발음 연습"}</span>
              </button>

              {showPronunciationAnalysis && (
                <div className="bg-indigo-50 p-4 rounded-xl w-full text-left space-y-2 border border-indigo-100">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-indigo-900">발음 분석</span>
                    <span className="text-2xl font-bold text-indigo-600">85/100</span>
                  </div>
                  <div className="space-y-1">
                    <div className="text-xs text-indigo-700">
                      <Lightbulb className="w-3 h-3 inline mr-1" />
                      'v' 발음: 아랫입술을 윗니에 대고 소리내세요
                    </div>
                    <div className="text-xs text-indigo-700">
                      강세: in-no-<strong>VA</strong>-tion (3음절 강조)
                    </div>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      setShowPronunciationAnalysis(false)
                    }}
                    className="text-xs text-indigo-600 hover:underline"
                  >
                    닫기
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="bg-white p-4 pb-8 shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
        {!isFlipped ? (
          <Button className="w-full py-6 text-lg font-medium" onClick={handleFlip}>
            정답 확인하기
          </Button>
        ) : (
          <div className="grid grid-cols-4 gap-2">
            <div className="flex flex-col gap-1">
              <Button
                variant="danger"
                className="h-14 bg-red-100 text-red-600 hover:bg-red-200 hover:text-red-700 border-0"
                onClick={(e) => {
                  e.stopPropagation()
                  handleRate(FSRS_RATING.AGAIN)
                }}
              >
                Again
              </Button>
              <span className="text-[10px] text-center text-gray-400 font-medium">10분 후</span>
            </div>

            <div className="flex flex-col gap-1">
              <Button
                variant="secondary"
                className="h-14 bg-orange-100 text-orange-600 hover:bg-orange-200 hover:text-orange-700 border-0"
                onClick={(e) => {
                  e.stopPropagation()
                  handleRate(FSRS_RATING.HARD)
                }}
              >
                Hard
              </Button>
              <span className="text-[10px] text-center text-gray-400 font-medium">1시간 후</span>
            </div>

            <div className="flex flex-col gap-1">
              <Button
                variant="success"
                className="h-14 bg-green-100 text-green-600 hover:bg-green-200 hover:text-green-700 border-0"
                onClick={(e) => {
                  e.stopPropagation()
                  handleRate(FSRS_RATING.GOOD)
                }}
              >
                Good
              </Button>
              <span className="text-[10px] text-center text-gray-400 font-medium">1일 후</span>
            </div>

            <div className="flex flex-col gap-1">
              <Button
                variant="primary"
                className="h-14 bg-blue-100 text-blue-600 hover:bg-blue-200 hover:text-blue-700 border-0"
                onClick={(e) => {
                  e.stopPropagation()
                  handleRate(FSRS_RATING.EASY)
                }}
              >
                Easy
              </Button>
              <span className="text-[10px] text-center text-gray-400 font-medium">4일 후</span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
