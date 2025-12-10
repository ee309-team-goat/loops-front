"use client"

import { useRouter } from "next/navigation"
import { ChevronLeft, ChevronRight, Check, Minus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useCourseStore } from "@/store/course-store"
import { MOCK_CATEGORIES, type Category } from "@/lib/mock-decks"

type SelectionStatus = "unchecked" | "checked" | "indeterminate"

function getSelectionStatus(category: Category, selectedIds: string[]): SelectionStatus {
  const deckIds = category.decks.map((d) => d.id)
  const selectedCount = deckIds.filter((id) => selectedIds.includes(id)).length
  if (selectedCount === 0) return "unchecked"
  if (selectedCount === deckIds.length) return "checked"
  return "indeterminate"
}

function getSelectedCount(category: Category, selectedIds: string[]): number {
  const deckIds = category.decks.map((d) => d.id)
  return deckIds.filter((id) => selectedIds.includes(id)).length
}

export default function CategoryListPage() {
  const router = useRouter()
  const { customSelectedDeckIds, setSelectedDeckIds } = useCourseStore()

  const handleCategoryToggle = (category: Category) => {
    const deckIds = category.decks.map((d) => d.id)
    const status = getSelectionStatus(category, customSelectedDeckIds)

    if (status === "checked") {
      // Remove all decks from this category
      setSelectedDeckIds(customSelectedDeckIds.filter((id) => !deckIds.includes(id)))
    } else {
      // Add all decks from this category (avoiding duplicates)
      const newIds = [...new Set([...customSelectedDeckIds, ...deckIds])]
      setSelectedDeckIds(newIds)
    }
  }

  const handleCategoryDetail = (categoryId: string) => {
    router.push(`/course/decks/${categoryId}`)
  }

  const handleBack = () => {
    router.back()
  }

  const handleComplete = () => {
    router.push("/course/change")
  }

  const totalSelected = customSelectedDeckIds.length
  const isCompleteEnabled = totalSelected > 0

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 px-4 py-3 flex items-center">
        <button onClick={handleBack} className="p-2 -ml-2 text-gray-500">
          <ChevronLeft className="w-6 h-6" />
        </button>
        <span className="text-sm text-gray-500 ml-1">커스텀 코스</span>
      </div>

      {/* Title */}
      <div className="px-6 py-6 bg-white border-b border-gray-100">
        <h1 className="text-lg font-medium text-gray-900 text-center">단어장을 선택하세요.</h1>
      </div>

      {/* Category List */}
      <div className="flex-1 overflow-y-auto">
        <div className="divide-y divide-gray-100">
          {MOCK_CATEGORIES.map((category) => {
            const status = getSelectionStatus(category, customSelectedDeckIds)
            const selectedCount = getSelectedCount(category, customSelectedDeckIds)
            const totalCount = category.decks.length

            return (
              <div key={category.id} className="bg-white">
                <div className="flex items-center px-4 py-4">
                  {/* Checkbox Area */}
                  <button
                    onClick={() => handleCategoryToggle(category)}
                    className={`w-6 h-6 rounded border-2 flex items-center justify-center mr-3 transition-colors ${
                      status === "checked"
                        ? "bg-indigo-500 border-indigo-500"
                        : status === "indeterminate"
                          ? "bg-indigo-500 border-indigo-500"
                          : "border-gray-300 bg-white"
                    }`}
                  >
                    {status === "checked" && <Check className="w-4 h-4 text-white" />}
                    {status === "indeterminate" && <Minus className="w-4 h-4 text-white" />}
                  </button>

                  {/* Icon */}
                  <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center mr-3 text-xl">
                    {category.icon}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-gray-900">{category.title}</span>
                    </div>
                    <p className="text-sm text-gray-500 truncate">{category.description}</p>
                    {status === "indeterminate" && (
                      <p className="text-xs text-indigo-600 mt-1">
                        일부 선택됨 {selectedCount}/{totalCount}
                      </p>
                    )}
                  </div>

                  {/* Action Area */}
                  <div className="flex items-center gap-2 ml-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        handleCategoryDetail(category.id)
                      }}
                      className="p-2 text-gray-400 hover:text-gray-600"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                {/* Action Text */}
                <div className="px-4 pb-3 -mt-1">
                  <button
                    onClick={() => handleCategoryToggle(category)}
                    className={`text-sm font-medium ml-auto block text-right ${
                      status === "unchecked" ? "text-indigo-600" : "text-red-500"
                    }`}
                  >
                    {status === "unchecked" ? "+ 코스에 추가" : "- 코스에서 제외"}
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="p-4 bg-white border-t border-gray-100">
        <div className="flex gap-3">
          <Button
            variant="secondary"
            className="flex-1 py-6 bg-gray-200 hover:bg-gray-300 text-gray-700"
            onClick={handleBack}
          >
            나가기
          </Button>
          <Button
            className="flex-1 py-6 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-300 disabled:text-gray-500"
            onClick={handleComplete}
            disabled={!isCompleteEnabled}
          >
            선택 완료
          </Button>
        </div>
      </div>
    </div>
  )
}
