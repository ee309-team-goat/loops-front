"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { ChevronLeft, Check, AlertCircle, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { getDecks, getSelectedDecks, updateSelectedDecks, type Deck } from "@/lib/api/decks"

interface SelectionState {
  selectAll: boolean
  selectedIds: Set<number>
}

export default function CategoryListPage() {
  const router = useRouter()

  const [decks, setDecks] = useState<Deck[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [selection, setSelection] = useState<SelectionState>({
    selectAll: false,
    selectedIds: new Set(),
  })

  // Derived state
  const allIds = decks.map((d) => d.id)
  const isAllChecked = selection.selectAll || (decks.length > 0 && selection.selectedIds.size === decks.length)

  const effectiveChecked = useCallback(
    (id: number) => {
      return selection.selectAll ? true : selection.selectedIds.has(id)
    },
    [selection.selectAll, selection.selectedIds],
  )

  const loadData = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const [loadedDecks, selectedState] = await Promise.all([getDecks(), getSelectedDecks()])

      setDecks(loadedDecks)

      const initialSelection: SelectionState = {
        selectAll: selectedState.select_all,
        selectedIds: new Set(selectedState.deck_ids),
      }
      setSelection(initialSelection)
    } catch {
      setError("서버 연결에 실패했습니다. 다시 시도해주세요.")
      setDecks([])
      setSelection({ selectAll: false, selectedIds: new Set() })
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadData()
  }, [loadData])

  const handleSelectAllChange = () => {
    if (isAllChecked) {
      setSelection({ selectAll: false, selectedIds: new Set() })
    } else {
      setSelection({ selectAll: true, selectedIds: new Set() })
    }
  }

  const handleDeckToggle = (id: number) => {
    if (selection.selectAll) {
      const newIds = new Set(allIds.filter((deckId) => deckId !== id))
      setSelection({ selectAll: false, selectedIds: newIds })
    } else {
      const newIds = new Set(selection.selectedIds)
      if (newIds.has(id)) {
        newIds.delete(id)
      } else {
        newIds.add(id)
      }
      setSelection({ selectAll: false, selectedIds: newIds })
    }
  }

  const handleBack = () => {
    router.back()
  }

  const handleComplete = async () => {
    setSaving(true)
    setError(null)

    try {
      const isAll = selection.selectAll || (decks.length > 0 && selection.selectedIds.size === decks.length)

      if (isAll) {
        await updateSelectedDecks({ select_all: true })
      } else {
        await updateSelectedDecks({ select_all: false, deck_ids: Array.from(selection.selectedIds) })
      }

      router.push("/course/change")
    } catch (err) {
      setError(err instanceof Error ? err.message : "저장에 실패했습니다.")
    } finally {
      setSaving(false)
    }
  }

  const getDeckName = (deck: Deck) => deck.name || deck.title || `Deck ${deck.id}`

  const totalSelected = selection.selectAll ? decks.length : selection.selectedIds.size
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

      {/* Error Message */}
      {error && (
        <div className="mx-4 mt-4 bg-red-50 border border-red-200 rounded-lg p-3">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
            <span className="text-sm text-red-700">{error}</span>
          </div>
          {decks.length === 0 && !loading && (
            <Button variant="outline" size="sm" onClick={loadData} className="mt-2 w-full bg-transparent">
              <RefreshCw className="w-4 h-4 mr-2" />
              다시 시도
            </Button>
          )}
        </div>
      )}

      {/* Select All */}
      <div className="bg-white mx-4 mt-4 rounded-xl overflow-hidden">
        <div className="px-4 py-3 border-b border-gray-100">
          <label className="flex items-center gap-3 cursor-pointer">
            <button
              onClick={handleSelectAllChange}
              disabled={loading || decks.length === 0}
              className={`w-6 h-6 rounded border-2 flex items-center justify-center transition-colors ${
                isAllChecked ? "bg-indigo-500 border-indigo-500" : "border-gray-300 bg-white"
              } disabled:opacity-50`}
            >
              {isAllChecked && <Check className="w-4 h-4 text-white" />}
            </button>
            <span className="font-medium text-gray-900">전체 선택</span>
          </label>
        </div>
      </div>

      {/* Deck List */}
      <div className="flex-1 overflow-y-auto px-4 mt-2">
        {loading && (
          <div className="bg-white rounded-xl overflow-hidden divide-y divide-gray-100">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="px-4 py-4 flex items-center gap-3">
                <div className="w-6 h-6 bg-gray-200 rounded animate-pulse" />
                <div className="h-4 bg-gray-200 rounded w-40 animate-pulse" />
              </div>
            ))}
          </div>
        )}

        {!loading && decks.length === 0 && !error && (
          <div className="bg-white rounded-xl px-4 py-8 text-center text-gray-500">덱이 없습니다.</div>
        )}

        {!loading && decks.length > 0 && (
          <div className="bg-white rounded-xl overflow-hidden divide-y divide-gray-100">
            {decks.map((deck) => {
              const isChecked = effectiveChecked(deck.id)

              return (
                <div key={deck.id} className="bg-white">
                  <div className="flex items-center px-4 py-4">
                    {/* Checkbox Area */}
                    <button
                      onClick={() => handleDeckToggle(deck.id)}
                      className={`w-6 h-6 rounded border-2 flex items-center justify-center mr-3 transition-colors ${
                        isChecked ? "bg-indigo-500 border-indigo-500" : "border-gray-300 bg-white"
                      }`}
                    >
                      {isChecked && <Check className="w-4 h-4 text-white" />}
                    </button>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <span className="font-medium text-gray-900">{getDeckName(deck)}</span>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Bottom CTA */}
      <div className="p-4 bg-white border-t border-gray-100">
        <div className="text-center text-sm text-gray-500 mb-3">{totalSelected}개 선택됨</div>
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
            disabled={!isCompleteEnabled || saving}
          >
            {saving ? "저장 중..." : "선택 완료"}
          </Button>
        </div>
      </div>
    </div>
  )
}
