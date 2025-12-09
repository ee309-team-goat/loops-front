"use client"

import type React from "react"

import { useState, useEffect, useRef, useMemo } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { MOCK_CARDS } from "@/lib/api/client"
import { FSRS_RATING } from "@/lib/types/api"
import { useSettings } from "@/components/settings-provider"
import { Volume2, X, Mic, Lightbulb, Repeat, Check, XIcon } from "lucide-react"
import { cn } from "@/lib/utils"

type Card = (typeof MOCK_CARDS)[number]

interface ModeProps {
  card: Card
  cards: Card[]
  currentIndex: number
  onRate: (rating: number) => void
  playbackSpeed: number
}

function RatingButtons({ onRate }: { onRate: (rating: number) => void }) {
  return (
    <div className="grid grid-cols-4 gap-2">
      <div className="flex flex-col gap-1">
        <Button
          variant="danger"
          className="h-14 bg-red-100 text-red-600 hover:bg-red-200 hover:text-red-700 border-0"
          onClick={() => onRate(FSRS_RATING.AGAIN)}
        >
          Again
        </Button>
        <span className="text-[10px] text-center text-gray-400 font-medium">10분 후</span>
      </div>
      <div className="flex flex-col gap-1">
        <Button
          variant="secondary"
          className="h-14 bg-orange-100 text-orange-600 hover:bg-orange-200 hover:text-orange-700 border-0"
          onClick={() => onRate(FSRS_RATING.HARD)}
        >
          Hard
        </Button>
        <span className="text-[10px] text-center text-gray-400 font-medium">1시간 후</span>
      </div>
      <div className="flex flex-col gap-1">
        <Button
          variant="success"
          className="h-14 bg-green-100 text-green-600 hover:bg-green-200 hover:text-green-700 border-0"
          onClick={() => onRate(FSRS_RATING.GOOD)}
        >
          Good
        </Button>
        <span className="text-[10px] text-center text-gray-400 font-medium">1일 후</span>
      </div>
      <div className="flex flex-col gap-1">
        <Button
          variant="primary"
          className="h-14 bg-blue-100 text-blue-600 hover:bg-blue-200 hover:text-blue-700 border-0"
          onClick={() => onRate(FSRS_RATING.EASY)}
        >
          Easy
        </Button>
        <span className="text-[10px] text-center text-gray-400 font-medium">4일 후</span>
      </div>
    </div>
  )
}

function FlashcardMode({ card, onRate, playbackSpeed }: ModeProps) {
  const { settings } = useSettings()
  const [isFlipped, setIsFlipped] = useState(false)
  const [showTutorial, setShowTutorial] = useState(true)
  const [currentExampleIndex, setCurrentExampleIndex] = useState(0)
  const [isGeneratingExample, setIsGeneratingExample] = useState(false)
  const [isRecording, setIsRecording] = useState(false)
  const [showPronunciationAnalysis, setShowPronunciationAnalysis] = useState(false)
  const prevIsFlipped = useRef(false)

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
      playAudioWithSettings()
    }
    prevIsFlipped.current = isFlipped
  }, [isFlipped, settings.autoPlayAudio])

  // Reset state when card changes
  useEffect(() => {
    setIsFlipped(false)
    setCurrentExampleIndex(0)
    setShowPronunciationAnalysis(false)
  }, [card])

  const handleFlip = () => {
    setIsFlipped(!isFlipped)
    if (showTutorial) setShowTutorial(false)
  }

  const playAudioWithSettings = () => {
    if ("speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(card.word)
      utterance.lang = "en-US"
      utterance.rate = playbackSpeed
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
    <>
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
            <span className="text-4xl font-bold text-gray-900 mb-8">{card.word}</span>
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
                  <h2 className="text-3xl font-bold text-gray-900">{card.word}</h2>
                  <button
                    onClick={playAudio}
                    className="p-2 rounded-full bg-indigo-50 text-indigo-600 hover:bg-indigo-100 transition-colors"
                  >
                    <Volume2 className="w-5 h-5" />
                  </button>
                </div>
                <p className="text-gray-500 font-mono text-sm">{card.pronunciation}</p>
              </div>
              <div className="flex gap-1 text-xs">
                <span className="px-3 py-1 rounded-full bg-indigo-100 text-indigo-600 font-medium">
                  {playbackSpeed}x
                </span>
              </div>
              <div className="w-12 h-1 bg-gray-100 rounded-full" />
              <div className="space-y-1">
                <p className="text-2xl font-bold text-indigo-600">{card.definition}</p>
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
          <RatingButtons onRate={onRate} />
        )}
      </div>
    </>
  )
}

function MultipleChoiceMode({ card, cards, currentIndex, onRate }: ModeProps) {
  const [selectedChoice, setSelectedChoice] = useState<string | null>(null)
  const [isRevealed, setIsRevealed] = useState(false)

  // Reset state when card changes
  useEffect(() => {
    setSelectedChoice(null)
    setIsRevealed(false)
  }, [card, currentIndex])

  const choices = useMemo(() => {
    const correctAnswer = card.definition
    const otherDefinitions = cards
      .filter((_, i) => i !== currentIndex)
      .map((c) => c.definition)
      .filter((def) => def !== correctAnswer) // exclude correct answer
      .filter((def, idx, arr) => arr.indexOf(def) === idx) // Remove duplicates

    // Shuffle and take up to 3 incorrect answers
    const shuffledIncorrect = [...otherDefinitions].sort(() => Math.random() - 0.5)
    const incorrectAnswers = shuffledIncorrect.slice(0, Math.min(3, shuffledIncorrect.length))

    // Combine and shuffle all choices
    const allChoices = [correctAnswer, ...incorrectAnswers]
    return allChoices.sort(() => Math.random() - 0.5)
  }, [card, cards, currentIndex])

  const isCorrect = selectedChoice === card.definition

  const handleReveal = () => {
    setIsRevealed(true)
  }

  return (
    <>
      {/* Card Area */}
      <div className="flex-1 flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-sm space-y-6">
          {/* Prompt */}
          <div className="bg-white rounded-3xl shadow-xl p-8 text-center border border-gray-100">
            <span className="text-xs text-gray-400 mb-2 block">다음 단어의 뜻은?</span>
            <span className="text-4xl font-bold text-gray-900">{card.word}</span>
          </div>

          {/* Choices - Use choices from useMemo instead of memoizedChoices */}
          <div className="space-y-3">
            {choices.map((choice, idx) => {
              const isSelected = selectedChoice === choice
              const isCorrectChoice = choice === card.definition

              let buttonClass = "bg-white border-gray-200 text-gray-700 hover:border-indigo-300"
              if (isRevealed) {
                if (isCorrectChoice) {
                  buttonClass = "bg-green-50 border-green-500 text-green-700"
                } else if (isSelected && !isCorrectChoice) {
                  buttonClass = "bg-red-50 border-red-500 text-red-700"
                }
              } else if (isSelected) {
                buttonClass = "bg-indigo-50 border-indigo-500 text-indigo-700"
              }

              return (
                <button
                  key={idx}
                  onClick={() => !isRevealed && setSelectedChoice(choice)}
                  disabled={isRevealed}
                  className={cn(
                    "w-full p-4 rounded-xl border-2 text-left font-medium transition-all flex items-center justify-between",
                    buttonClass,
                  )}
                >
                  <span>{choice}</span>
                  {isRevealed && isCorrectChoice && <Check className="w-5 h-5 text-green-600" />}
                  {isRevealed && isSelected && !isCorrectChoice && <XIcon className="w-5 h-5 text-red-600" />}
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="bg-white p-4 pb-8 shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
        {!isRevealed ? (
          <Button className="w-full py-6 text-lg font-medium" onClick={handleReveal} disabled={!selectedChoice}>
            정답 확인
          </Button>
        ) : (
          <div className="space-y-4">
            <div
              className={cn(
                "text-center py-2 rounded-lg font-medium",
                isCorrect ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700",
              )}
            >
              {isCorrect ? "정답입니다!" : `오답! 정답: ${card.definition}`}
            </div>
            <RatingButtons onRate={onRate} />
          </div>
        )}
      </div>
    </>
  )
}

function TypingMode({ card, onRate }: ModeProps) {
  const [userInput, setUserInput] = useState("")
  const [isRevealed, setIsRevealed] = useState(false)

  // Reset state when card changes
  useEffect(() => {
    setUserInput("")
    setIsRevealed(false)
  }, [card])

  const normalizedInput = userInput.trim().toLowerCase()
  const normalizedAnswer = card.word.trim().toLowerCase()
  const isCorrect = normalizedInput === normalizedAnswer

  const submitAnswer = () => {
    if (userInput.trim()) {
      setIsRevealed(true)
    }
  }

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    submitAnswer()
  }

  return (
    <>
      {/* Card Area */}
      <div className="flex-1 flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-sm space-y-6">
          {/* Prompt */}
          <div className="bg-white rounded-3xl shadow-xl p-8 text-center border border-gray-100">
            <span className="text-xs text-gray-400 mb-2 block">다음 뜻에 해당하는 영단어는?</span>
            <span className="text-2xl font-bold text-indigo-600">{card.definition}</span>
          </div>

          {/* Input - Use handleFormSubmit for form onSubmit */}
          <form onSubmit={handleFormSubmit} className="space-y-4">
            <input
              type="text"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              disabled={isRevealed}
              placeholder="영단어를 입력하세요"
              className={cn(
                "w-full p-4 rounded-xl border-2 text-center text-xl font-medium transition-all outline-none",
                isRevealed
                  ? isCorrect
                    ? "bg-green-50 border-green-500 text-green-700"
                    : "bg-red-50 border-red-500 text-red-700"
                  : "bg-white border-gray-200 focus:border-indigo-500",
              )}
              autoFocus
            />
          </form>

          {/* Result */}
          {isRevealed && (
            <div
              className={cn(
                "text-center py-3 rounded-xl font-medium",
                isCorrect ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700",
              )}
            >
              {isCorrect ? (
                <div className="flex items-center justify-center gap-2">
                  <Check className="w-5 h-5" />
                  <span>정답입니다!</span>
                </div>
              ) : (
                <div className="space-y-1">
                  <div className="flex items-center justify-center gap-2">
                    <XIcon className="w-5 h-5" />
                    <span>오답!</span>
                  </div>
                  <div className="text-sm">
                    정답: <strong>{card.word}</strong>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Controls - Use submitAnswer for onClick instead of handleSubmit */}
      <div className="bg-white p-4 pb-8 shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
        {!isRevealed ? (
          <Button className="w-full py-6 text-lg font-medium" onClick={submitAnswer} disabled={!userInput.trim()}>
            정답 확인
          </Button>
        ) : (
          <RatingButtons onRate={onRate} />
        )}
      </div>
    </>
  )
}

export default function LearnPage() {
  const router = useRouter()
  const { settings } = useSettings()

  const [currentIndex, setCurrentIndex] = useState(0)
  const [cards, setCards] = useState(MOCK_CARDS)
  const [completedCount, setCompletedCount] = useState(0)

  const currentCard = cards[currentIndex]
  const progress = (currentIndex / cards.length) * 100

  const handleRate = (rating: number) => {
    if (currentIndex < cards.length - 1) {
      setTimeout(() => {
        setCurrentIndex((prev) => prev + 1)
      }, 300)
      setCompletedCount((prev) => prev + 1)
    } else {
      router.push("/dashboard")
    }
  }

  const modeProps: ModeProps = {
    card: currentCard,
    cards,
    currentIndex,
    onRate: handleRate,
    playbackSpeed: settings.playbackSpeed,
  }

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

      {settings.quizMode === "flashcard" && <FlashcardMode {...modeProps} />}
      {settings.quizMode === "multiple-choice" && <MultipleChoiceMode {...modeProps} />}
      {settings.quizMode === "typing" && <TypingMode {...modeProps} />}
    </div>
  )
}
