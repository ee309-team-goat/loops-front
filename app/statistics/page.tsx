"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ArrowLeft, TrendingUp, Calendar, AlertCircle } from "lucide-react"

export default function StatisticsPage() {
  const router = useRouter()

  // Mock data (would come from API)
  const weeklyData = [
    { day: "월", count: 18 },
    { day: "화", count: 22 },
    { day: "수", count: 15 },
    { day: "목", count: 25 },
    { day: "금", count: 20 },
    { day: "토", count: 12 },
    { day: "일", count: 8 },
  ]

  const weakWords = [
    { word: "accommodate", wrongCount: 5, accuracy: 40 },
    { word: "bureaucracy", wrongCount: 4, accuracy: 45 },
    { word: "conscientious", wrongCount: 4, accuracy: 50 },
    { word: "entrepreneur", wrongCount: 3, accuracy: 55 },
    { word: "magnificent", wrongCount: 3, accuracy: 60 },
  ]

  const maxCount = Math.max(...weeklyData.map((d) => d.count))

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-4 flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => router.push("/dashboard")}>
          <ArrowLeft className="w-5 h-5 text-gray-700" />
        </Button>
        <h1 className="text-xl font-bold text-gray-900">학습 통계</h1>
      </div>

      <div className="p-4 space-y-6">
        {/* Weekly Stats */}
        <div className="bg-white rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-indigo-600" />
              <h2 className="font-bold text-lg text-gray-900">주간 학습량</h2>
            </div>
            <span className="text-sm text-gray-500">이번 주</span>
          </div>

          {/* Bar Chart */}
          <div className="flex items-end justify-between h-40 gap-2">
            {weeklyData.map((data) => (
              <div key={data.day} className="flex-1 flex flex-col items-center gap-2">
                <div className="w-full bg-gray-100 rounded-t-lg relative flex-1 flex items-end">
                  <div
                    className="w-full bg-indigo-500 rounded-t-lg transition-all"
                    style={{ height: `${(data.count / maxCount) * 100}%` }}
                  />
                </div>
                <span className="text-xs font-medium text-gray-600">{data.day}</span>
                <span className="text-xs text-gray-400">{data.count}</span>
              </div>
            ))}
          </div>

          <div className="pt-4 border-t border-gray-100 grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">120</div>
              <div className="text-xs text-gray-500">총 단어</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-indigo-600">85%</div>
              <div className="text-xs text-gray-500">정답률</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">2.5h</div>
              <div className="text-xs text-gray-500">학습 시간</div>
            </div>
          </div>
        </div>

        {/* Streak Calendar */}
        <div className="bg-white rounded-2xl p-6 space-y-4">
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-orange-600" />
            <h2 className="font-bold text-lg text-gray-900">학습 스트릭</h2>
          </div>

          <div className="grid grid-cols-7 gap-2">
            {Array.from({ length: 28 }, (_, i) => {
              const hasStudy = Math.random() > 0.3
              return (
                <div
                  key={i}
                  className={`aspect-square rounded-lg ${
                    hasStudy ? "bg-indigo-500" : "bg-gray-100"
                  } flex items-center justify-center`}
                >
                  {hasStudy && <div className="w-2 h-2 bg-white rounded-full" />}
                </div>
              )
            })}
          </div>

          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-500">지난 4주</span>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-gray-100 rounded" />
                <span className="text-xs text-gray-400">안 함</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-indigo-500 rounded" />
                <span className="text-xs text-gray-400">완료</span>
              </div>
            </div>
          </div>
        </div>

        {/* Weak Words */}
        <div className="bg-white rounded-2xl p-6 space-y-4">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-orange-600" />
            <h2 className="font-bold text-lg text-gray-900">취약 단어 TOP 5</h2>
          </div>

          <div className="space-y-3">
            {weakWords.map((word, index) => (
              <div key={word.word} className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center text-xs font-bold">
                  {index + 1}
                </div>
                <div className="flex-1">
                  <div className="font-medium text-gray-900">{word.word}</div>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full bg-orange-500" style={{ width: `${word.accuracy}%` }} />
                    </div>
                    <span className="text-xs text-gray-500 w-10 text-right">{word.accuracy}%</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <Button variant="outline" className="w-full bg-transparent">
            취약 단어만 집중 복습
          </Button>
        </div>
      </div>
    </div>
  )
}
