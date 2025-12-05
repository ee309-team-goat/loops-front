"use client"

import type React from "react"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { MOCK_CARDS, FSRS_RATING } from "@/lib/api/client"
import { Volume2, X, Mic, Lightbulb, Repeat } from "lucide-react"
import { cn } from "@/lib/utils"

type AudioSettings = {
  autoPlayAudio: boolean
  playbackSpeed: number
  soundEffects: boolean
}

export default function LearnPage() {
  const router = useRouter()
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isFlipped, setIsFlipped] = useState(false)
  const [cards, setCards] = useState(MOCK_CARDS)
  const [completedCount, setCompletedCount] = useState(0)
  const [showTutorial, setShowTutorial] = useState(true)
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1)
  const [currentExampleIndex, setCurrentExampleIndex] = useState(0)
  const [isGeneratingExample, setIsGeneratingExample] = useState(false)
  const [isRecording, setIsRecording] = useState(false)
  const [showPronunciationAnalysis, setShowPronunciationAnalysis] = useState(false)

  const [audioSettings, setAudioSettings] = useState<AudioSettings>({
    autoPlayAudio: false,
    playbackSpeed: 1,
    soundEffects: true,
  })

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
    const saved = localStorage.getItem("audioSettings")
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        setAudioSettings(parsed)
        setPlaybackSpeed(parsed.playbackSpeed || 1)
      } catch (e) {
        console.error("Failed to parse audio settings")
      }
    }
  }, [])

  const playAudioForWord = useCallback(
    (word: string, speed?: number) => {
      if ("speechSynthesis" in window) {
        window.speechSynthesis.cancel()
        const utterance = new SpeechSynthesisUtterance(word)
        utterance.lang = "en-US"
        utterance.rate = speed ?? playbackSpeed
        window.speechSynthesis.speak(utterance)
      }
    },
    [playbackSpeed],
  )

  useEffect(() => {
    if (isFlipped && audioSettings.autoPlayAudio && currentCard) {
      playAudioForWord(currentCard.word)
    }
  }, [isFlipped, audioSettings.autoPlayAudio, currentCard, playAudioForWord])

  const handleFlip = () => {
    setIsFlipped(!isFlipped)
    if (showTutorial) setShowTutorial(false)
  }

  const handleRate = (rating: number) => {
    console.log(`[v0] Rated card ${currentCard.id} as ${rating}`)

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

  const playAudio = (e: React.MouseEvent) => {
    e.stopPropagation()
    playAudioForWord(currentCard.word)
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
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <div className="bg-card px-4 py-3 flex items-center justify-between shadow-sm z-10">
        <Button variant="ghost" size="icon" onClick={() => router.push("/dashboard")}>
          <X className="w-5 h-5 text-muted-foreground" />
        </Button>
        <div className="flex-1 mx-4">
          <div className="flex justify-between text-xs text-muted-foreground mb-1">
            <span>오늘의 학습</span>
            <span>
              {currentIndex + 1} / {cards.length}
            </span>
          </div>
          <div className="h-2 bg-muted rounded-full overflow-hidden">
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
          <div className="absolute inset-0 bg-card rounded-3xl shadow-xl flex flex-col items-center justify-center p-8 backface-hidden border border-border">
            <span className="text-4xl font-bold text-foreground mb-8">{currentCard.word}</span>

            {showTutorial && (
              <div className="absolute bottom-8 animate-bounce text-muted-foreground text-sm flex flex-col items-center">
                <span>👆</span>
                <span>탭해서 뒤집기</span>
              </div>
            )}
          </div>

          {/* Back */}
          <div className="absolute inset-0 bg-card rounded-3xl shadow-xl flex flex-col p-6 backface-hidden rotate-y-180 border border-border overflow-y-auto">
            <div className="flex-1 flex flex-col items-center justify-center text-center space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-center gap-2">
                  <h2 className="text-3xl font-bold text-foreground">{currentCard.word}</h2>
                  <button
                    onClick={playAudio}
                    className="p-2 rounded-full bg-indigo-50 dark:bg-indigo-950 text-indigo-600 hover:bg-indigo-100 dark:hover:bg-indigo-900 transition-colors"
                  >
                    <Volume2 className="w-5 h-5" />
                  </button>
                </div>
                <p className="text-muted-foreground font-mono text-sm">{currentCard.pronunciation}</p>
              </div>

              <div className="flex gap-1 text-xs">
                {([0.75, 1, 1.25] as const).map((speed) => (
                  <button
                    key={speed}
                    onClick={(e) => {
                      e.stopPropagation()
                      setPlaybackSpeed(speed)
                    }}
                    className={cn(
                      "px-3 py-1 rounded-full transition-colors",
                      playbackSpeed === speed
                        ? "bg-indigo-100 dark:bg-indigo-900 text-indigo-600 font-medium"
                        : "bg-muted text-muted-foreground hover:bg-muted/80",
                    )}
                  >
                    {speed}x
                  </button>
                ))}
              </div>

              <div className="w-12 h-1 bg-muted rounded-full" />

              <div className="space-y-1">
                <p className="text-2xl font-bold text-indigo-600">{currentCard.definition}</p>
              </div>

              <div className="bg-muted p-4 rounded-xl w-full text-left space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground font-medium">예문 {currentExampleIndex + 1}</span>
                  <button
                    onClick={regenerateExample}
                    disabled={isGeneratingExample}
                    className="flex items-center gap-1 text-xs text-indigo-600 hover:text-indigo-700 disabled:opacity-50"
                  >
                    <Repeat className={cn("w-3 h-3", isGeneratingExample && "animate-spin")} />
                    {isGeneratingExample ? "생성 중..." : "새 예문"}
                  </button>
                </div>
                <p className="text-foreground font-medium">"{currentExample.sentence}"</p>
                <p className="text-muted-foreground text-sm">{currentExample.translation}</p>
              </div>

              <button
                onClick={toggleRecording}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-full transition-all",
                  isRecording
                    ? "bg-red-100 dark:bg-red-900 text-red-600 animate-pulse"
                    : "bg-muted text-muted-foreground hover:bg-muted/80",
                )}
              >
                <Mic className="w-4 h-4" />
                <span className="text-sm font-medium">{isRecording ? "녹음 중..." : "발음 연습"}</span>
              </button>

              {showPronunciationAnalysis && (
                <div className="bg-indigo-50 dark:bg-indigo-950 p-4 rounded-xl w-full text-left space-y-2 border border-indigo-100 dark:border-indigo-800">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-indigo-900 dark:text-indigo-100">발음 분석</span>
                    <span className="text-2xl font-bold text-indigo-600">85/100</span>
                  </div>
                  <div className="space-y-1">
                    <div className="text-xs text-indigo-700 dark:text-indigo-300">
                      <Lightbulb className="w-3 h-3 inline mr-1" />
                      'v' 발음: 아랫입술을 윗니에 대고 소리내세요
                    </div>
                    <div className="text-xs text-indigo-700 dark:text-indigo-300">
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
      <div className="bg-card p-4 pb-8 shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
        {!isFlipped ? (
          <Button className="w-full py-6 text-lg font-medium" onClick={handleFlip}>
            정답 확인하기
          </Button>
        ) : (
          <div className="grid grid-cols-4 gap-2">
            <div className="flex flex-col gap-1">
              <Button
                variant="danger"
                className="h-14 bg-red-100 dark:bg-red-900 text-red-600 hover:bg-red-200 dark:hover:bg-red-800 hover:text-red-700 border-0"
                onClick={(e) => {
                  e.stopPropagation()
                  handleRate(FSRS_RATING.AGAIN)
                }}
              >
                Again
              </Button>
              <span className="text-[10px] text-center text-muted-foreground font-medium">10분 후</span>
            </div>

            <div className="flex flex-col gap-1">
              <Button
                variant="secondary"
                className="h-14 bg-orange-100 dark:bg-orange-900 text-orange-600 hover:bg-orange-200 dark:hover:bg-orange-800 hover:text-orange-700 border-0"
                onClick={(e) => {
                  e.stopPropagation()
                  handleRate(FSRS_RATING.HARD)
                }}
              >
                Hard
              </Button>
              <span className="text-[10px] text-center text-muted-foreground font-medium">1시간 후</span>
            </div>

            <div className="flex flex-col gap-1">
              <Button
                variant="success"
                className="h-14 bg-green-100 dark:bg-green-900 text-green-600 hover:bg-green-200 dark:hover:bg-green-800 hover:text-green-700 border-0"
                onClick={(e) => {
                  e.stopPropagation()
                  handleRate(FSRS_RATING.GOOD)
                }}
              >
                Good
              </Button>
              <span className="text-[10px] text-center text-muted-foreground font-medium">1일 후</span>
            </div>

            <div className="flex flex-col gap-1">
              <Button
                variant="primary"
                className="h-14 bg-blue-100 dark:bg-blue-900 text-blue-600 hover:bg-blue-200 dark:hover:bg-blue-800 hover:text-blue-700 border-0"
                onClick={(e) => {
                  e.stopPropagation()
                  handleRate(FSRS_RATING.EASY)
                }}
              >
                Easy
              </Button>
              <span className="text-[10px] text-center text-muted-foreground font-medium">4일 후</span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
