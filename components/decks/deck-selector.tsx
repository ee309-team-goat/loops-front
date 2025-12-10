"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { getDecks, getSelectedDecks, updateSelectedDecks, type Deck, type SelectedDecksState } from "@/lib/api/decks"
import { Button } from "@/components/ui/button"
import { Check, AlertCircle, X } from "lucide-react"

const SAMPLE_DECKS: Deck[] = [
  { id: 1, name: "기본 단어장" },
  { id: 2, name: "TOEIC" },
  { id: 3, name: "CS 영어" },
]

const DEMO_STORAGE_KEY = "loops:demo:selected-decks"

interface SelectionState {
  selectAll: boolean
  selectedIds: Set<number>
}

export function DeckSelector() {
  const [decks, setDecks] = useState<Deck[]>([])
  const [loading, setLoading] = useState(true)
  const [demoMode, setDemoMode] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  // Current selection state
  const [selection, setSelection] = useState<SelectionState>({
    selectAll: false,
    selectedIds: new Set(),
  })

  // Last saved state (for rollback)
  const [lastSaved, setLastSaved] = useState<SelectionState>({
    selectAll: false,
    selectedIds: new Set(),
  })

  const selectAllRef = useRef<HTMLInputElement>(null)

  // Derived state
  const allIds = decks.map((d) => d.id)
  const isIndeterminate =
    !selection.selectAll && selection.selectedIds.size > 0 && selection.selectedIds.size < decks.length
  const isAllChecked = selection.selectAll || (decks.length > 0 && selection.selectedIds.size === decks.length)

  const effectiveChecked = useCallback(
    (id: number) => {
      return selection.selectAll ? true : selection.selectedIds.has(id)
    },
    [selection.selectAll, selection.selectedIds],
  )

  // Set indeterminate state on checkbox
  useEffect(() => {
    if (selectAllRef.current) {
      selectAllRef.current.indeterminate = isIndeterminate
    }
  }, [isIndeterminate])

  // Load decks and selection
  useEffect(() => {
    async function loadData() {
      setLoading(true)
      setError(null)

      try {
        // Try live API first
        const [loadedDecks, selectedState] = await Promise.all([getDecks(), getSelectedDecks()])

        setDecks(loadedDecks)
        setDemoMode(false)

        const initialSelection: SelectionState = {
          selectAll: selectedState.select_all,
          selectedIds: new Set(selectedState.deck_ids),
        }
        setSelection(initialSelection)
        setLastSaved(initialSelection)
      } catch {
        // Enter demo mode on any failure
        setDemoMode(true)
        setDecks(SAMPLE_DECKS)

        // Load from localStorage
        try {
          const stored = localStorage.getItem(DEMO_STORAGE_KEY)
          if (stored) {
            const parsed = JSON.parse(stored) as SelectedDecksState
            const demoSelection: SelectionState = {
              selectAll: parsed.select_all ?? false,
              selectedIds: new Set(parsed.deck_ids ?? []),
            }
            setSelection(demoSelection)
            setLastSaved(demoSelection)
          }
        } catch {
          // Ignore localStorage errors
        }
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  // Handle "전체 선택" toggle
  const handleSelectAllChange = () => {
    if (isAllChecked) {
      // Uncheck all
      setSelection({ selectAll: false, selectedIds: new Set() })
    } else {
      // Check all
      setSelection({ selectAll: true, selectedIds: new Set() })
    }
  }

  // Handle individual deck toggle
  const handleDeckToggle = (id: number) => {
    if (selection.selectAll) {
      // Switch to partial mode: all except this one
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

  // Save selection
  const handleSave = async () => {
    setSaving(true)
    setError(null)
    setSuccess(false)

    try {
      if (demoMode) {
        // Save to localStorage
        const payload: SelectedDecksState = selection.selectAll
          ? { select_all: true, deck_ids: [] }
          : { select_all: false, deck_ids: Array.from(selection.selectedIds) }
        localStorage.setItem(DEMO_STORAGE_KEY, JSON.stringify(payload))
      } else {
        // Save to API
        await updateSelectedDecks(
          selection.selectAll
            ? { select_all: true }
            : { select_all: false, deck_ids: Array.from(selection.selectedIds) },
        )
      }

      // Update lastSaved
      setLastSaved({ ...selection, selectedIds: new Set(selection.selectedIds) })
      setSuccess(true)

      // Clear success after 2s
      setTimeout(() => setSuccess(false), 2000)
    } catch (err) {
      // Rollback to lastSaved
      setSelection({ ...lastSaved, selectedIds: new Set(lastSaved.selectedIds) })
      setError(err instanceof Error ? err.message : "저장에 실패했습니다.")
    } finally {
      setSaving(false)
    }
  }

  const getDeckName = (deck: Deck) => deck.name || deck.title || `Deck ${deck.id}`

  return (
    <div className="space-y-4">
      {/* Demo mode banner */}
      {demoMode && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 flex items-start gap-2">
          <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-yellow-700">데모 모드: 서버 연결 실패로 샘플 덱을 표시합니다.</div>
        </div>
      )}

      {/* Error banner */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
            <span className="text-sm text-red-700">{error}</span>
          </div>
          <button onClick={() => setError(null)}>
            <X className="w-4 h-4 text-red-600" />
          </button>
        </div>
      )}

      {/* Success banner */}
      {success && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-3 flex items-center gap-2">
          <Check className="w-5 h-5 text-green-600 flex-shrink-0" />
          <span className="text-sm text-green-700">저장되었습니다.</span>
        </div>
      )}

      <div className="bg-white rounded-2xl overflow-hidden">
        {/* Header with select all */}
        <div className="px-4 py-3 border-b border-gray-100">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              ref={selectAllRef}
              type="checkbox"
              checked={isAllChecked}
              onChange={handleSelectAllChange}
              className="w-5 h-5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
            />
            <div className="flex-1">
              <span className="font-medium text-gray-900">전체 선택</span>
              {isIndeterminate && <span className="ml-2 text-xs text-gray-500">일부 선택됨</span>}
            </div>
          </label>
        </div>

        {/* Loading state */}
        {loading && (
          <div className="divide-y divide-gray-100">
            {[1, 2, 3].map((i) => (
              <div key={i} className="px-4 py-3 flex items-center gap-3">
                <div className="w-5 h-5 bg-gray-200 rounded animate-pulse" />
                <div className="h-4 bg-gray-200 rounded w-32 animate-pulse" />
              </div>
            ))}
          </div>
        )}

        {/* Empty state */}
        {!loading && decks.length === 0 && <div className="px-4 py-8 text-center text-gray-500">덱이 없습니다.</div>}

        {/* Deck list */}
        {!loading && decks.length > 0 && (
          <div className="divide-y divide-gray-100">
            {decks.map((deck) => (
              <label key={deck.id} className="flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-gray-50">
                <input
                  type="checkbox"
                  checked={effectiveChecked(deck.id)}
                  onChange={() => handleDeckToggle(deck.id)}
                  className="w-5 h-5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
                <span className="text-gray-900">{getDeckName(deck)}</span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Save button */}
      <Button
        onClick={handleSave}
        disabled={saving || loading}
        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white"
      >
        {saving ? "저장 중..." : "저장"}
      </Button>
    </div>
  )
}
