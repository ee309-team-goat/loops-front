"use client"

import { useState, useMemo } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ArrowLeft, TrendingUp, AlertCircle, ChevronLeft, ChevronRight } from "lucide-react"
import { BottomTabNav } from "@/components/bottom-tab-nav"
import { AuthRequired } from "@/components/auth-required"

export default function StatisticsPage() {
  const router = useRouter()
  const [selectedDayIndex, setSelectedDayIndex] = useState<number | null>(null)

  const weeklyData = useMemo(() => {
    const today = new Date()
    const dayNames = ["일", "월", "화", "수", "목", "금", "토"]
    const data = []

    for (let i = 6; i >= 0; i--) {
      const date = new Date(today)
      date.setDate(today.getDate() - i)
      const dayOfWeek = date.getDay()
      const dateStr = `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, "0")}.${String(date.getDate()).padStart(2, "0")}`

      data.push({
        day: i === 0 ? "오늘" : dayNames[dayOfWeek],
        count: Math.floor(Math.random() * 30) + 5,
        date: dateStr,
      })
    }
    return data
  }, [])

  const weakWords = [
    { word: "accommodate", wrongCount: 5, accuracy: 40 },
    { word: "bureaucracy", wrongCount: 4, accuracy: 45 },
    { word: "conscientious", wrongCount: 4, accuracy: 50 },
    { word: "entrepreneur", wrongCount: 3, accuracy: 55 },
    { word: "magnificent", wrongCount: 3, accuracy: 60 },
  ]

  const months = ["DEC", "JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV"]
  const daysOfWeek = ["월", "화", "수", "목", "금", "토", "일"]

  const generateHeatmapData = () => {
    const data: number[][] = []
    for (let week = 0; week < 26; week++) {
      const weekData: number[] = []
      for (let day = 0; day < 7; day++) {
        weekData.push(Math.floor(Math.random() * 5))
      }
      data.push(weekData)
    }
    return data
  }

  const heatmapData = generateHeatmapData()
  const heatmapColors = ["bg-gray-100", "bg-indigo-100", "bg-indigo-200", "bg-indigo-400", "bg-indigo-600"]

  const maxCount = Math.max(...weeklyData.map((d) => d.count))

  const handleDayClick = (index: number) => {
    if (selectedDayIndex === index) {
      setSelectedDayIndex(null)
    } else {
      setSelectedDayIndex(index)
    }
  }

  return (
    <AuthRequired>
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

            <div className="flex items-end justify-between h-48 gap-3">
              {weeklyData.map((data, index) => (
                <div
                  key={index}
                  className="flex-1 flex flex-col items-center cursor-pointer"
                  onClick={() => handleDayClick(index)}
                >
                  <div className="relative flex-1 w-full flex flex-col items-center justify-end">
                    {selectedDayIndex === index && (
                      <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 -translate-y-full bg-white border border-gray-200 rounded-lg px-2 py-1 shadow-md z-10 whitespace-nowrap">
                        <div className="text-[11px] font-bold text-gray-900">{data.date}</div>
                        <div className="text-[10px] text-gray-600">{data.count}문제</div>
                        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-full">
                          <div className="w-2 h-2 bg-white border-r border-b border-gray-200 transform rotate-45 -translate-y-1" />
                        </div>
                      </div>
                    )}
                    <div className="w-full bg-gray-100 rounded-t-lg relative h-[100px] flex items-end">
                      <div
                        className={`w-full rounded-t-lg transition-all ${
                          selectedDayIndex === index ? "bg-indigo-600" : "bg-indigo-400"
                        }`}
                        style={{ height: `${(data.count / maxCount) * 100}%` }}
                      />
                    </div>
                  </div>
                  <span
                    className={`text-xs font-medium mt-2 ${
                      selectedDayIndex === index ? "text-indigo-600" : "text-gray-600"
                    }`}
                  >
                    {data.day}
                  </span>
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

          <div className="bg-white rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-bold text-lg text-gray-900">연간 학습</h2>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <ChevronLeft className="w-4 h-4 text-gray-400" />
                </Button>
                <span className="text-sm text-gray-600">최근</span>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                </Button>
              </div>
            </div>

            <div className="flex items-center gap-1 text-[9px] text-gray-500">
              <span>Less</span>
              {heatmapColors.map((color, i) => (
                <div key={i} className={`w-2 h-2 rounded-[2px] ${color}`} />
              ))}
              <span>More</span>
            </div>

            <div>
              <div className="flex text-[10px] text-gray-400 ml-8">
                {months.slice(0, 6).map((month) => (
                  <div key={month} className="flex-1 text-center">
                    {month}
                  </div>
                ))}
              </div>

              <div className="mt-1 space-y-[2px]">
                {daysOfWeek.map((day, dayIndex) => (
                  <div key={day} className="flex items-center gap-2">
                    <span className="text-[10px] leading-none text-gray-400 w-6 flex-shrink-0">{day}</span>

                    <div className="flex gap-[2px] flex-1">
                      {heatmapData.map((week, weekIndex) => (
                        <div
                          key={weekIndex}
                          className={`flex-1 aspect-square rounded-[3px] ${heatmapColors[week[dayIndex]]}`}
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <div className="flex text-[10px] text-gray-400 ml-8">
                {months.slice(6, 12).map((month) => (
                  <div key={month} className="flex-1 text-center">
                    {month}
                  </div>
                ))}
              </div>

              <div className="mt-1 space-y-[2px]">
                {daysOfWeek.map((day, dayIndex) => (
                  <div key={day} className="flex items-center gap-2">
                    <span className="text-[10px] leading-none text-gray-400 w-6 flex-shrink-0">{day}</span>

                    <div className="flex gap-[2px] flex-1">
                      {heatmapData.map((week, weekIndex) => (
                        <div
                          key={weekIndex}
                          className={`flex-1 aspect-square rounded-[3px] ${heatmapColors[week[dayIndex]]}`}
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

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

        <BottomTabNav />
      </div>
    </AuthRequired>
  )
}
