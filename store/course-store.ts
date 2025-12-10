import { create } from "zustand"
import { persist } from "zustand/middleware"

export type CourseType = "integrated" | "custom"
export type ReviewScope = "selected_decks" | "all_learned"

interface CourseState {
  // Core course type
  courseType: CourseType
  // Custom course: selected deck IDs
  customSelectedDeckIds: string[]
  // Review scope for Issue 7
  reviewScope: ReviewScope
  // Target word count for Issue 3/4
  targetWordCount: number
  // Review ratio settings for Issue 4
  reviewRatioMode: "normal" | "custom"
  customReviewRatioPercent: number

  // Actions
  setCourseType: (type: CourseType) => void
  setSelectedDeckIds: (ids: string[]) => void
  setReviewScope: (scope: ReviewScope) => void
  setTargetWordCount: (count: number) => void
  resetCustomSelection: () => void
}

export const useCourseStore = create<CourseState>()(
  persist(
    (set) => ({
      // Default state
      courseType: "integrated",
      customSelectedDeckIds: [],
      reviewScope: "selected_decks",
      targetWordCount: 20,
      reviewRatioMode: "normal",
      customReviewRatioPercent: 70,

      // Actions
      setCourseType: (type) => set({ courseType: type }),
      setSelectedDeckIds: (ids) => set({ customSelectedDeckIds: ids }),
      setReviewScope: (scope) => set({ reviewScope: scope }),
      setTargetWordCount: (count) => set({ targetWordCount: count }),
      resetCustomSelection: () =>
        set({
          customSelectedDeckIds: [],
          reviewScope: "selected_decks",
        }),
    }),
    {
      name: "loops:course",
    },
  ),
)
