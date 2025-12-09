"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ChevronLeft } from "lucide-react"
import { cn } from "@/lib/utils"
import { useSettings } from "@/components/settings-provider"

export default function VocabularySettingsPage() {
  const router = useRouter()
  const { settings, updateSetting } = useSettings()

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

          <div className="pt-2 border-t border-gray-100 space-y-2">
            <label className="block text-sm text-gray-700 font-medium">퀴즈 유형</label>
            <div className="space-y-3">
              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={settings.quizTypes.meaning}
                  onChange={(e) => updateSetting("quizTypes", { ...settings.quizTypes, meaning: e.target.checked })}
                  className={cn("w-5 h-5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500")}
                />
                <span className="text-gray-700">뜻 맞추기</span>
              </label>
              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={settings.quizTypes.spelling}
                  onChange={(e) => updateSetting("quizTypes", { ...settings.quizTypes, spelling: e.target.checked })}
                  className={cn("w-5 h-5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500")}
                />
                <span className="text-gray-700">철자 맞추기</span>
              </label>
              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={settings.quizTypes.listening}
                  onChange={(e) => updateSetting("quizTypes", { ...settings.quizTypes, listening: e.target.checked })}
                  className={cn("w-5 h-5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500")}
                />
                <span className="text-gray-700">듣기</span>
              </label>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-gray-100">
            <div>
              <div className="font-medium text-gray-900">뜻 표시</div>
              <div className="text-sm text-gray-500">학습 중 한글 뜻 표시</div>
            </div>
            <button
              onClick={() => updateSetting("showMeaning", !settings.showMeaning)}
              className={cn(
                "w-12 h-7 rounded-full transition-colors relative",
                settings.showMeaning ? "bg-indigo-600" : "bg-gray-300",
              )}
            >
              <div
                className={cn(
                  "absolute top-1 w-5 h-5 bg-white rounded-full transition-transform",
                  settings.showMeaning ? "translate-x-6" : "translate-x-1",
                )}
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
