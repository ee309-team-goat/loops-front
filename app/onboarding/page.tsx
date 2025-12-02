"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"

type Step = 1 | 2 | 3

export default function OnboardingPage() {
  const router = useRouter()
  const [step, setStep] = useState<Step>(1)
  const [answers, setAnswers] = useState({
    goal: "",
    level: "",
    time: "",
  })

  const handleNext = () => {
    if (step < 3) {
      setStep((prev) => (prev + 1) as Step)
    } else {
      console.log("[v0] Profile data:", answers)
      router.push("/onboarding/deck-selection")
    }
  }

  const selectOption = (key: string, value: string) => {
    setAnswers((prev) => ({ ...prev, [key]: value }))
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Progress Bar */}
      <div className="h-1 bg-muted w-full">
        <div
          className="h-full bg-indigo-600 transition-all duration-500 ease-out"
          style={{ width: `${(step / 3) * 100}%` }}
        />
      </div>

      <div className="flex-1 flex flex-col max-w-md mx-auto w-full p-6">
        <div className="flex-1 flex flex-col justify-center space-y-8">
          {/* Step 1: Goal */}
          {step === 1 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="space-y-2">
                <h2 className="text-2xl font-bold text-foreground">영어를 왜 배우시나요?</h2>
                <p className="text-muted-foreground">가장 중요한 목표 하나만 알려주세요.</p>
              </div>
              <div className="space-y-3">
                {[
                  { id: "job", label: "💼 취업/시험 준비", desc: "토익, 오픽, 면접 등" },
                  { id: "work", label: "🏢 업무/실무 활용", desc: "이메일, 회의, 비즈니스" },
                  { id: "travel", label: "✈️ 여행/취미", desc: "해외여행, 미드 시청" },
                ].map((option) => (
                  <button
                    key={option.id}
                    onClick={() => selectOption("goal", option.id)}
                    className={cn(
                      "w-full p-4 rounded-xl border-2 text-left transition-all",
                      answers.goal === option.id
                        ? "border-indigo-600 bg-indigo-50 dark:bg-indigo-950"
                        : "border-border bg-card hover:border-indigo-200 dark:hover:border-indigo-800",
                    )}
                  >
                    <div className="font-bold text-lg text-foreground">{option.label}</div>
                    <div className="text-sm text-muted-foreground">{option.desc}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 2: Level */}
          {step === 2 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="space-y-2">
                <h2 className="text-2xl font-bold text-foreground">현재 영어 실력은?</h2>
                <p className="text-muted-foreground">딱 맞는 단어를 추천해드릴게요.</p>
              </div>
              <div className="space-y-3">
                {[
                  { id: "beginner", label: "🌱 초급", desc: "기초 단어부터 차근차근 (TOEIC 400↓)" },
                  { id: "intermediate", label: "🌿 중급", desc: "일상 대화는 가능해요 (TOEIC 400-700)" },
                  { id: "advanced", label: "🌳 고급", desc: "비즈니스 영어도 문제없어요 (TOEIC 700+)" },
                ].map((option) => (
                  <button
                    key={option.id}
                    onClick={() => selectOption("level", option.id)}
                    className={cn(
                      "w-full p-4 rounded-xl border-2 text-left transition-all",
                      answers.level === option.id
                        ? "border-indigo-600 bg-indigo-50 dark:bg-indigo-950"
                        : "border-border bg-card hover:border-indigo-200 dark:hover:border-indigo-800",
                    )}
                  >
                    <div className="font-bold text-lg text-foreground">{option.label}</div>
                    <div className="text-sm text-muted-foreground">{option.desc}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 3: Time */}
          {step === 3 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="space-y-2">
                <h2 className="text-2xl font-bold text-foreground">하루 몇 분 공부하실래요?</h2>
                <p className="text-muted-foreground">꾸준히 할 수 있는 만큼만 선택하세요.</p>
              </div>
              <div className="space-y-3">
                {[
                  { id: "10", label: "⚡️ 10분 (가볍게)", desc: "바쁜 출퇴근길에 딱!" },
                  { id: "20", label: "⚖️ 20분 (적당히)", desc: "가장 추천하는 학습량이에요" },
                  { id: "30", label: "🔥 30분 이상 (집중)", desc: "빠르게 실력을 올리고 싶다면" },
                ].map((option) => (
                  <button
                    key={option.id}
                    onClick={() => selectOption("time", option.id)}
                    className={cn(
                      "w-full p-4 rounded-xl border-2 text-left transition-all",
                      answers.time === option.id
                        ? "border-indigo-600 bg-indigo-50 dark:bg-indigo-950"
                        : "border-border bg-card hover:border-indigo-200 dark:hover:border-indigo-800",
                    )}
                  >
                    <div className="font-bold text-lg text-foreground">{option.label}</div>
                    <div className="text-sm text-muted-foreground">{option.desc}</div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="pt-8">
          <Button
            onClick={handleNext}
            className="w-full py-6 text-lg"
            disabled={(step === 1 && !answers.goal) || (step === 2 && !answers.level) || (step === 3 && !answers.time)}
          >
            {step === 3 ? "학습 시작하기" : "다음"}
            {step !== 3 && <ChevronRight className="w-5 h-5 ml-2" />}
          </Button>
        </div>
      </div>
    </div>
  )
}
