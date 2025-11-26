"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ArrowLeft, TrendingUp, AlertCircle, ChevronLeft, ChevronRight } from "lucide-react"
import { BottomTabNav } from "@/components/bottom-tab-nav"

export default function StatisticsPage() {
  const router = useRouter()
  const [selectedDayIndex, setSelectedDayIndex] = useState<number | null>(null) // Default to null instead of 6

  const weeklyData = [
    { day: "월", count: 18, date: "2025.11.24" },
    { day: "화", count: 22, date: "2025.11.25" },
    { day: "수", count: 15, date: "2025.11.26" },
    { day: "목", count: 25, date: "2025.11.27" },
    { day: "금", count: 20, date: "2025.11.28" },
    { day: "토", count: 12, date: "2025.11.29" },
    { day: "일", count: 8, date: "2025.11.30" },
  ]

  const weakWords = [
    { word: "accommodate", wrongCount: 5, accuracy: 40 },
    { word: "bureaucracy", wrongCount: 4, accuracy: 45 },
    { word: "conscientious", wrongCount: 4, accuracy: 50 },
    { word: "entrepreneur", wrongCount: 3, accuracy: 55 },
    { word: "magnificent", wrongCount: 3, accuracy: 60 },
  ]

  const months = ["DEC", "JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV"]
  const daysOfWeek = ["월", "화", "수", "목", "금", "토", "일"]

  // Generate mock heatmap data - 52 weeks x 7 days
  const generateHeatmapData = () => {
    const data: number[][] = []
    for (let week = 0; week < 26; week++) {
      const weekData: number[] = []
      for (let day = 0; day < 7; day++) {
        weekData.push(Math.floor(Math.random() * 5)) // 0-4 intensity
      }
      data.push(weekData)
    }
    return data
  }

  const heatmapData = generateHeatmapData()
  const heatmapColors = [
    "bg-gray-100", // 0 - no activity
    "bg-indigo-100", // 1
    "bg-indigo-200", // 2
    "bg-indigo-400", // 3
    "bg-indigo-600", // 4 - high activity
  ]

  const maxCount = Math.max(...weeklyData.map((d) => d.count))

  const handleDayClick = (index: number) => {
    if (selectedDayIndex === index) {
      setSelectedDayIndex(null)
    } else {
      setSelectedDayIndex(index)
    }
  }

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

          <div className="relative">
            {/* Tooltip */}
            {selectedDayIndex !== null && (
              <div
                className="absolute -top-2 transform -translate-y-full bg-white border border-gray-200 rounded-xl px-4 py-2 shadow-lg z-10"
                style={{
                  left: `${(selectedDayIndex / 6) * 85 + 7}%`,
                  transform: "translateX(-50%) translateY(-100%)",
                }}
              >
                <div className="text-sm font-bold text-gray-900">{weeklyData[selectedDayIndex].date}</div>
                <div className="text-sm text-gray-600">{weeklyData[selectedDayIndex].count}문제</div>
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-full">
                  <div className="w-3 h-3 bg-white border-r border-b border-gray-200 transform rotate-45 -translate-y-1.5" />
                </div>
              </div>
            )}

            <div className="flex items-end justify-between h-40 gap-2 pt-8">
              {weeklyData.map((data, index) => (
                <div
                  key={data.day}
                  className="flex-1 flex flex-col items-center gap-2 cursor-pointer"
                  onClick={() => handleDayClick(index)} // Use toggle handler
                >
                  <div className="w-full bg-gray-100 rounded-t-lg relative flex-1 flex items-end min-h-[100px]">
                    <div
                      className={`w-full rounded-t-lg transition-all ${
                        selectedDayIndex === index ? "bg-indigo-600" : "bg-indigo-400"
                      }`}
                      style={{ height: `${(data.count / maxCount) * 100}%` }}
                    />
                  </div>
                  <span
                    className={`text-xs font-medium ${
                      selectedDayIndex === index ? "text-indigo-600" : "text-gray-600"
                    }`}
                  >
                    {data.day}
                  </span>
                  <span className="text-xs text-gray-400">{data.count}</span>
                </div>
              ))}
            </div>
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

          {/* Color Legend */}
          <div className="flex items-center gap-1 text-[9px] text-gray-500">
            <span>Less</span>
            {heatmapColors.map((color, i) => (
              <div key={i} className={`w-2 h-2 rounded-[2px] ${color}`} />
            ))}
            <span>More</span>
          </div>

          {/* Yearly Heatmap - First 6 months */}
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

          {/* Yearly Heatmap - Second 6 months */}
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

        {/* Weak Words - unchanged */}
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

      {/* Bottom Tab Navigation */}
      <BottomTabNav />
    </div>
  )
}
