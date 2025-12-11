"use client"

import type React from "react"
import { useState, useEffect, useRef, useMemo } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { MOCK_CARDS } from "@/lib/api/client"
import { FSRS_RATING } from "@/lib/types/api"
import { useSettings } from "@/components/settings-provider"
import { AuthRequired } from "@/components/auth-required"
import { useCourseStore } from "@/store/course-store"
import { Volume2, X, Mic, Lightbulb, Repeat, Check, XIcon, HelpCircle, Eye } from "lucide-react"
import { cn } from "@/lib/utils"
import { ActionBar } from "@/components/learn/action-bar"
import { WrongNotesSheet } from "@/components/learn/sheets/wrong-notes-sheet"
import { PlaceholderSheet } from "@/components/learn/sheets/placeholder-sheet"
import { saveWrongNote } from "@/lib/wrong-notes"

type Card = (typeof MOCK_CARDS)[number]

interface TypingCard extends Card {
  koSentence: string
  enSentenceWithBlank: string
  explanation?: string
  exampleCandidates?: Array<{ koSentence: string; enSentenceWithBlank: string }>
}

interface ModeProps {
  card: Card
  cards: Card[]
  currentIndex: number
  onRate: (rating: number) => void
  playbackSpeed: number
}

interface TypingModeProps extends ModeProps {
  typingCard: TypingCard
}

function RatingButtons({ onRate }: { onRate: (rating: number) => void }) {
  return (
    <div className="grid grid-cols-4 gap-2">
      <div className="flex flex-col gap-1">
        <Button
          variant="destructive"
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
          variant="secondary"
          className="h-14 bg-green-100 text-green-600 hover:bg-green-200 hover:text-green-700 border-0"
          onClick={() => onRate(FSRS_RATING.GOOD)}
        >
          Good
        </Button>
        <span className="text-[10px] text-center text-gray-400 font-medium">1일 후</span>
      </div>
      <div className="flex flex-col gap-1">
        <Button
          variant="default"
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

  // Sheet states
  const [wrongNotesOpen, setWrongNotesOpen] = useState(false)
  const [aiQuestionOpen, setAiQuestionOpen] = useState(false)
  const [wordInfoOpen, setWordInfoOpen] = useState(false)
  const [pronunciationOpen, setPronunciationOpen] = useState(false)

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
  const hasOtherExamples = mockExamples.length > 1

  const handleOtherExample = () => {
    if (hasOtherExamples) {
      setCurrentExampleIndex((prev) => (prev + 1) % mockExamples.length)
    }
  }

  return (
    <>
      <div className="flex-1 flex items-center justify-center p-4">
        <div
          className={cn(
            "relative w-full max-w-sm aspect-[3/4] transition-all duration-500 transform-style-3d cursor-pointer",
            isFlipped ? "rotate-y-180" : "",
          )}
          onClick={handleFlip}
        >
          {/* Front of card */}
          <div className="absolute inset-0 bg-white rounded-3xl shadow-xl flex flex-col items-center justify-center p-8 backface-hidden border border-gray-100">
            <span className="text-4xl font-bold text-gray-900 mb-8">{card.word}</span>
            {showTutorial && (
              <div className="absolute bottom-8 animate-bounce text-gray-400 text-sm flex flex-col items-center">
                <span>👆</span>
                <span>탭해서 뒤집기</span>
              </div>
            )}
          </div>

          {/* Back of card */}
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
                <p className="text-gray-800 font-medium">&quot;{currentExample.sentence}&quot;</p>
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
                      &apos;v&apos; 발음: 아랫입술을 윗니에 대고 소리내세요
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

      {/* ActionBar shown after flip */}
      {isFlipped && (
        <ActionBar
          onOtherExample={handleOtherExample}
          onWrongNotes={() => setWrongNotesOpen(true)}
          onAiQuestion={() => setAiQuestionOpen(true)}
          onWordInfo={() => setWordInfoOpen(true)}
          onPronunciation={() => setPronunciationOpen(true)}
          otherExampleEnabled={hasOtherExamples}
        />
      )}

      {/* RatingButtons shown after card is flipped */}
      {isFlipped && (
        <div className="shrink-0 p-4 pb-8 bg-white shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
          <RatingButtons onRate={onRate} />
        </div>
      )}

      <WrongNotesSheet open={wrongNotesOpen} onOpenChange={setWrongNotesOpen} />
      <PlaceholderSheet open={aiQuestionOpen} onOpenChange={setAiQuestionOpen} title="AI 질문 답변" />
      <PlaceholderSheet open={wordInfoOpen} onOpenChange={setWordInfoOpen} title="단어 정보" />
      <PlaceholderSheet open={pronunciationOpen} onOpenChange={setPronunciationOpen} title="발음 진단" />
    </>
  )
}

function MultipleChoiceMode({ card, cards, currentIndex, onRate }: ModeProps) {
  const [selectedChoice, setSelectedChoice] = useState<string | null>(null)
  const [isRevealed, setIsRevealed] = useState(false)
  const [wasIncorrectSaved, setWasIncorrectSaved] = useState(false)
  const [exampleIndex, setExampleIndex] = useState(0)

  // Sheet states
  const [wrongNotesOpen, setWrongNotesOpen] = useState(false)
  const [aiQuestionOpen, setAiQuestionOpen] = useState(false)
  const [wordInfoOpen, setWordInfoOpen] = useState(false)
  const [pronunciationOpen, setPronunciationOpen] = useState(false)

  useEffect(() => {
    setSelectedChoice(null)
    setIsRevealed(false)
    setWasIncorrectSaved(false)
    setExampleIndex(0)
  }, [card, currentIndex])

  const choices = useMemo(() => {
    const correctAnswer = card.definition
    const otherDefinitions = cards
      .filter((_, i) => i !== currentIndex)
      .map((c) => c.definition)
      .filter((def) => def !== correctAnswer)
      .filter((def, idx, arr) => arr.indexOf(def) === idx)

    const shuffledIncorrect = [...otherDefinitions].sort(() => Math.random() - 0.5)
    const incorrectAnswers = shuffledIncorrect.slice(0, Math.min(3, shuffledIncorrect.length))

    const allChoices = [correctAnswer, ...incorrectAnswers]
    return allChoices.sort(() => Math.random() - 0.5)
  }, [card, cards, currentIndex])

  const mockExamples = useMemo(
    () => [
      { sentence: `The word "${card.word}" means ${card.definition}.` },
      { sentence: `${card.word}: commonly used in academic contexts.` },
      { sentence: `Example: This demonstrates the meaning of ${card.word}.` },
    ],
    [card],
  )

  const currentExample = mockExamples[exampleIndex]
  const hasOtherExamples = mockExamples.length > 1

  const handleReveal = () => {
    setIsRevealed(true)
    // Save to wrong notes on incorrect answer
    if (selectedChoice && selectedChoice !== card.definition && !wasIncorrectSaved) {
      setWasIncorrectSaved(true)
      saveWrongNote({
        word: card.word,
        userAnswer: selectedChoice,
        correctAnswer: card.definition,
        koSentence: "",
        enSentenceWithBlank: "",
      })
    }
  }

  const handleOtherExample = () => {
    if (hasOtherExamples) {
      setExampleIndex((prev) => (prev + 1) % mockExamples.length)
    }
  }

  const isCorrect = selectedChoice === card.definition
  const isAnswered = isRevealed

  return (
    <>
      <div className="flex-1 flex flex-col items-center justify-center p-4 overflow-y-auto">
        <div className="w-full max-w-sm space-y-6">
          <div className="bg-white rounded-3xl shadow-xl p-8 text-center border border-gray-100">
            <span className="text-xs text-gray-400 mb-2 block">다음 단어의 뜻은?</span>
            <span className="text-4xl font-bold text-gray-900">{card.word}</span>
          </div>

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

      {/* ActionBar shown after answer */}
      {isAnswered && (
        <ActionBar
          onOtherExample={handleOtherExample}
          onWrongNotes={() => setWrongNotesOpen(true)}
          onAiQuestion={() => setAiQuestionOpen(true)}
          onWordInfo={() => setWordInfoOpen(true)}
          onPronunciation={() => setPronunciationOpen(true)}
          otherExampleEnabled={hasOtherExamples}
        />
      )}

      <div className="shrink-0 p-4 pb-8 bg-white shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
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

      <WrongNotesSheet open={wrongNotesOpen} onOpenChange={setWrongNotesOpen} />
      <PlaceholderSheet open={aiQuestionOpen} onOpenChange={setAiQuestionOpen} title="AI 질문 답변" />
      <PlaceholderSheet open={wordInfoOpen} onOpenChange={setWordInfoOpen} title="단어 정보" />
      <PlaceholderSheet open={pronunciationOpen} onOpenChange={setPronunciationOpen} title="발음 진단" />
    </>
  )
}

function SentenceTypingMode({ typingCard, onRate }: TypingModeProps) {
  const [userInput, setUserInput] = useState("")
  const [status, setStatus] = useState<"idle" | "correct" | "incorrect">("idle")
  const [revealedCount, setRevealedCount] = useState(0)
  const [usedHint, setUsedHint] = useState(false)
  const [showAnswer, setShowAnswer] = useState(false)
  const [wasIncorrect, setWasIncorrect] = useState(false)
  const [exampleIndex, setExampleIndex] = useState(0)
  const [showError, setShowError] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  // Sheet states
  const [wrongNotesOpen, setWrongNotesOpen] = useState(false)
  const [aiQuestionOpen, setAiQuestionOpen] = useState(false)
  const [wordInfoOpen, setWordInfoOpen] = useState(false)
  const [pronunciationOpen, setPronunciationOpen] = useState(false)

  const answer = typingCard.word

  // Get current example (either from candidates or default)
  const currentExample = useMemo(() => {
    if (typingCard.exampleCandidates && typingCard.exampleCandidates.length > 0) {
      const idx = exampleIndex % typingCard.exampleCandidates.length
      return typingCard.exampleCandidates[idx]
    }
    return { koSentence: typingCard.koSentence, enSentenceWithBlank: typingCard.enSentenceWithBlank }
  }, [typingCard, exampleIndex])

  useEffect(() => {
    setUserInput("")
    setStatus("idle")
    setRevealedCount(0)
    setUsedHint(false)
    setShowAnswer(false)
    setWasIncorrect(false)
    setExampleIndex(0)
    setShowError(false)
    inputRef.current?.focus()
  }, [typingCard])

  const normalizedInput = userInput.trim().toLowerCase()
  const normalizedAnswer = answer.trim().toLowerCase()

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault()
    if (!userInput.trim()) return

    if (normalizedInput === normalizedAnswer) {
      setStatus("correct")
      setShowError(false)
    } else {
      setStatus("incorrect")
      setShowError(true)
      if (!wasIncorrect) {
        setWasIncorrect(true)
        saveWrongNote({
          word: typingCard.word,
          userAnswer: userInput.trim(),
          correctAnswer: answer,
          koSentence: currentExample.koSentence,
          enSentenceWithBlank: currentExample.enSentenceWithBlank,
        })
      }
    }
  }

  const handleInputChange = (value: string) => {
    setUserInput(value)
    setShowError(false)
  }

  const handleHint = () => {
    if (revealedCount < answer.length) {
      setRevealedCount((prev) => prev + 1)
      setUsedHint(true)
    }
  }

  const handleShowAnswer = () => {
    setShowAnswer(true)
  }

  const handleOtherExample = () => {
    if (typingCard.exampleCandidates && typingCard.exampleCandidates.length > 1) {
      setExampleIndex((prev) => prev + 1)
    }
  }

  const hintDisplay = answer
    .split("")
    .map((char, i) => (i < revealedCount ? char : "_"))
    .join("")

  const renderSentence = () => {
    const parts = currentExample.enSentenceWithBlank.split("____")
    if (parts.length !== 2) {
      return <span>{currentExample.enSentenceWithBlank}</span>
    }

    return (
      <span className="text-xl leading-relaxed">
        {parts[0]}
        {showAnswer || status === "correct" ? (
          <span
            className={cn(
              "font-bold border-b-2 px-1",
              status === "correct" ? "text-green-600 border-green-500" : "text-indigo-600 border-indigo-500",
            )}
          >
            {answer}
          </span>
        ) : (
          <span className="inline-block min-w-[80px] border-b-2 border-indigo-300 bg-indigo-50 px-2 py-1 mx-1 font-mono">
            {userInput || hintDisplay}
          </span>
        )}
        {parts[1]}
      </span>
    )
  }

  const hasOtherExamples = typingCard.exampleCandidates && typingCard.exampleCandidates.length > 1

  const showInputUI = status !== "correct" && !showAnswer
  const showActionBar = status === "correct" || showAnswer

  return (
    <>
      <div className="flex-1 flex flex-col overflow-y-auto p-4 bg-sky-50">
        <div className="bg-sky-100 rounded-2xl p-4 mb-4">
          <p className="text-lg text-gray-800 leading-relaxed">
            {currentExample.koSentence.split(typingCard.definition).map((part, i, arr) => (
              <span key={i}>
                {part}
                {i < arr.length - 1 && <span className="text-indigo-600 font-bold">{typingCard.definition}</span>}
              </span>
            ))}
          </p>
        </div>

        {showError && (
          <div className="bg-red-100 text-red-700 rounded-xl p-3 mb-4 text-center font-medium">
            정답을 확인하고, 다시 입력해 보세요.
          </div>
        )}

        <div className="bg-white rounded-2xl p-6 shadow-sm mb-4">{renderSentence()}</div>

        <p className="text-xs text-gray-400 text-center mb-4">[어휘 출처] 능률 VOCA 어원편, DAY 17</p>
      </div>

      <div className="shrink-0 bg-white shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
        {showInputUI ? (
          <div className="p-4 pb-8 space-y-4">
            <input
              ref={inputRef}
              type="text"
              value={userInput}
              onChange={(e) => handleInputChange(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
              placeholder="영단어를 입력하세요"
              className="w-full p-4 rounded-xl border-2 border-gray-200 text-center text-xl font-medium focus:border-indigo-500 outline-none"
              autoFocus
            />

            <div className="flex flex-wrap gap-2">
              {revealedCount < answer.length && (
                <Button
                  variant="outline"
                  className="min-w-0 flex-1 basis-[calc(50%-0.25rem)] py-3 text-sm text-indigo-600 border-indigo-200 bg-transparent"
                  onClick={handleHint}
                >
                  <HelpCircle className="w-4 h-4 mr-1 shrink-0" />
                  <span className="truncate">
                    힌트 ({revealedCount}/{answer.length})
                  </span>
                </Button>
              )}

              {usedHint && (
                <Button
                  variant="outline"
                  className="min-w-0 flex-1 basis-[calc(50%-0.25rem)] py-3 text-sm text-orange-600 border-orange-200 bg-transparent"
                  onClick={handleShowAnswer}
                >
                  <Eye className="w-4 h-4 mr-1 shrink-0" />
                  <span className="truncate">정답 보기</span>
                </Button>
              )}

              <Button
                className="min-w-0 flex-1 basis-full py-3 text-sm bg-indigo-600 hover:bg-indigo-700"
                onClick={() => handleSubmit()}
                disabled={!userInput.trim()}
              >
                <Check className="w-4 h-4 mr-1 shrink-0" />
                확인
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-0">
            <div className="p-4">
              {status === "correct" && (
                <div className="bg-green-100 text-green-700 rounded-xl p-3 text-center font-medium flex items-center justify-center gap-2">
                  <Check className="w-5 h-5" />
                  정답입니다!
                </div>
              )}
              {showAnswer && status !== "correct" && (
                <div className="bg-gray-100 rounded-xl p-4 text-center">
                  <p className="text-sm text-gray-500 mb-1">정답</p>
                  <p className="text-2xl font-bold text-indigo-600">{answer}</p>
                  {typingCard.explanation && <p className="text-sm text-gray-600 mt-2">{typingCard.explanation}</p>}
                </div>
              )}
            </div>

            {showActionBar && (
              <ActionBar
                onOtherExample={handleOtherExample}
                onWrongNotes={() => setWrongNotesOpen(true)}
                onAiQuestion={() => setAiQuestionOpen(true)}
                onWordInfo={() => setWordInfoOpen(true)}
                onPronunciation={() => setPronunciationOpen(true)}
                otherExampleEnabled={hasOtherExamples ?? false}
              />
            )}

            <div className="p-4 pt-0 pb-8">
              <RatingButtons onRate={onRate} />
            </div>
          </div>
        )}
      </div>

      <WrongNotesSheet open={wrongNotesOpen} onOpenChange={setWrongNotesOpen} />
      <PlaceholderSheet open={aiQuestionOpen} onOpenChange={setAiQuestionOpen} title="AI 질문 답변" />
      <PlaceholderSheet open={wordInfoOpen} onOpenChange={setWordInfoOpen} title="단어 정보" />
      <PlaceholderSheet open={pronunciationOpen} onOpenChange={setPronunciationOpen} title="발음 진단" />
    </>
  )
}

const MOCK_TYPING_CARDS: TypingCard[] = [
  {
    id: "1",
    word: "concentrate",
    pronunciation: "/ˈkɒnsəntreɪt/",
    definition: "집중",
    koSentence: "네가 쉴 새 없이 질문해대니까 내가 집중을 할 수가 없잖아.",
    enSentenceWithBlank: "It's hard to ____ when you keep asking me all these questions.",
    explanation: "concentrate = 집중하다",
    exampleCandidates: [
      {
        koSentence: "네가 쉴 새 없이 질문해대니까 내가 집중을 할 수가 없잖아.",
        enSentenceWithBlank: "It's hard to ____ when you keep asking me all these questions.",
      },
      {
        koSentence: "시끄러운 환경에서는 집중하기 어렵다.",
        enSentenceWithBlank: "It is difficult to ____ in a noisy environment.",
      },
      {
        koSentence: "그녀는 공부에 집중하려고 노력했다.",
        enSentenceWithBlank: "She tried to ____ on her studies.",
      },
    ],
  },
  {
    id: "2",
    word: "suspect",
    pronunciation: "/səˈspekt/",
    definition: "용의자",
    koSentence: "경찰이 범죄 현장 가까이에서 주요 용의자를 체포했습니다.",
    enSentenceWithBlank: "Police arrested the main ____ near the scene of the crime.",
    explanation: "suspect = 용의자, 혐의자",
    exampleCandidates: [
      {
        koSentence: "경찰이 범죄 현장 가까이에서 주요 용의자를 체포했습니다.",
        enSentenceWithBlank: "Police arrested the main ____ near the scene of the crime.",
      },
      {
        koSentence: "용의자는 범행을 부인하고 있다.",
        enSentenceWithBlank: "The ____ is denying the crime.",
      },
    ],
  },
  {
    id: "3",
    word: "innovation",
    pronunciation: "/ˌɪnəˈveɪʃn/",
    definition: "혁신",
    koSentence: "그 회사는 AI 분야의 혁신으로 알려져 있다.",
    enSentenceWithBlank: "The company is known for its ____ in AI.",
    explanation: "innovation = 혁신",
    exampleCandidates: [
      {
        koSentence: "그 회사는 AI 분야의 혁신으로 알려져 있다.",
        enSentenceWithBlank: "The company is known for its ____ in AI.",
      },
      {
        koSentence: "기술 혁신이 우리 삶을 바꾸고 있다.",
        enSentenceWithBlank: "Technological ____ is changing our lives.",
      },
    ],
  },
  {
    id: "4",
    word: "resilience",
    pronunciation: "/rɪˈzɪliəns/",
    definition: "회복력, 탄력",
    koSentence: "이 연구는 아이들의 정신적 회복력에 관한 것이다.",
    enSentenceWithBlank: "This study is about children's mental ____.",
    explanation: "resilience = 회복력, 탄성",
    exampleCandidates: [
      {
        koSentence: "이 연구는 아이들의 정신적 회복력에 관한 것이다.",
        enSentenceWithBlank: "This study is about children's mental ____.",
      },
    ],
  },
  {
    id: "5",
    word: "sustainable",
    pronunciation: "/səˈsteɪnəbl/",
    definition: "지속 가능한",
    koSentence: "우리는 지속 가능한 에너지원을 찾아야 합니다.",
    enSentenceWithBlank: "We need to find ____ energy sources.",
    explanation: "sustainable = 지속 가능한",
    exampleCandidates: [
      {
        koSentence: "우리는 지속 가능한 에너지원을 찾아야 합니다.",
        enSentenceWithBlank: "We need to find ____ energy sources.",
      },
      {
        koSentence: "지속 가능한 발전이 중요하다.",
        enSentenceWithBlank: "____ development is important.",
      },
      {
        koSentence: "환경을 위해 지속 가능한 선택을 해야 한다.",
        enSentenceWithBlank: "We should make ____ choices for the environment.",
      },
    ],
  },
]

export default function LearnPage() {
  const router = useRouter()
  const { settings } = useSettings()
  const { studyMode } = useCourseStore()

  const [currentIndex, setCurrentIndex] = useState(0)

  const session = useMemo(() => {
    if (studyMode === "typing") {
      return { type: "typing" as const, cards: MOCK_TYPING_CARDS }
    }
    return { type: "standard" as const, cards: MOCK_CARDS }
  }, [studyMode])

  const total = session.cards.length
  const progress = (currentIndex / total) * 100

  const currentCard = session.type === "standard" ? session.cards[currentIndex] : MOCK_CARDS[0]
  const currentTypingCard = session.type === "typing" ? session.cards[currentIndex] : MOCK_TYPING_CARDS[0]

  const handleRate = (rating: number) => {
    void rating

    if (currentIndex < total - 1) {
      setTimeout(() => {
        setCurrentIndex((prev) => prev + 1)
      }, 300)
    } else {
      router.push("/dashboard")
    }
  }

  const modeProps: ModeProps = {
    card: currentCard,
    cards: session.type === "standard" ? session.cards : MOCK_CARDS,
    currentIndex,
    onRate: handleRate,
    playbackSpeed: settings.playbackSpeed,
  }

  return (
    <AuthRequired>
      <div className="h-screen bg-gray-100 flex flex-col overflow-hidden">
        <div className="bg-white px-4 py-3 flex items-center justify-between shadow-sm z-10 shrink-0">
          <Button variant="ghost" size="icon" onClick={() => router.push("/dashboard")}>
            <X className="w-5 h-5 text-gray-500" />
          </Button>
          <div className="flex-1 mx-4">
            <div className="flex justify-between text-xs text-gray-500 mb-1">
              <span>오늘의 학습</span>
              <span>
                {currentIndex + 1} / {total}
              </span>
            </div>
            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full bg-indigo-500 transition-all duration-300" style={{ width: `${progress}%` }} />
            </div>
          </div>
          <div className="w-10" />
        </div>

        {studyMode === "flip" && <FlashcardMode {...modeProps} />}
        {studyMode === "mcq" && <MultipleChoiceMode {...modeProps} />}
        {studyMode === "typing" && <SentenceTypingMode {...modeProps} typingCard={currentTypingCard} />}
      </div>
    </AuthRequired>
  )
}
