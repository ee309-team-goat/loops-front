"use client"

import { useState, useMemo } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ChevronLeft, Search, HelpCircle, ChevronDown, ChevronUp } from "lucide-react"
import { FAQ_DATA, FAQ_CATEGORIES, SUGGESTED_QUESTIONS, type FAQItem } from "@/lib/data/faq-data"

export default function FAQPage() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [expandedId, setExpandedId] = useState<string | null>(null)

  // 검색 및 카테고리 필터링
  const filteredFAQs = useMemo(() => {
    return FAQ_DATA.filter((faq) => {
      const matchesSearch =
        searchQuery === "" ||
        faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        faq.answer.toLowerCase().includes(searchQuery.toLowerCase())

      const matchesCategory = selectedCategory === "all" || faq.category === selectedCategory

      return matchesSearch && matchesCategory
    })
  }, [searchQuery, selectedCategory])

  const handleQuestionClick = (id: string) => {
    setExpandedId(expandedId === id ? null : id)
  }

  const handleSuggestedClick = (question: string) => {
    setSearchQuery(question)
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="border-b border-gray-200 px-4 py-4 flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ChevronLeft className="w-5 h-5 text-gray-700" />
        </Button>
        <h1 className="text-lg font-medium text-gray-900">Loops FAQ</h1>
      </div>

      {/* Hero Section */}
      <div className="bg-gradient-to-b from-gray-50 to-white px-4 py-8 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Loops FAQ</h2>
        <p className="text-gray-600">Loops FAQ로 궁금증을 해결해 보세요!</p>
      </div>

      {/* Search Section */}
      <div className="bg-gray-100 px-4 py-6">
        <div className="relative">
          <Input
            type="text"
            placeholder="무엇이든 물어보세요"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-4 pr-12 py-3 rounded-full bg-white border-0 shadow-sm"
          />
          <Button variant="ghost" size="icon" className="absolute right-2 top-1/2 -translate-y-1/2">
            <Search className="w-5 h-5 text-gray-500" />
          </Button>
        </div>
      </div>

      {/* Category Filter */}
      <div className="px-4 py-3 flex gap-2 overflow-x-auto scrollbar-hide">
        {FAQ_CATEGORIES.map((category) => (
          <button
            key={category.id}
            onClick={() => setSelectedCategory(category.id)}
            className={`px-4 py-2 rounded-full text-sm whitespace-nowrap transition-colors ${
              selectedCategory === category.id
                ? "bg-violet-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            {category.label}
          </button>
        ))}
      </div>

      {/* Suggested Questions - 검색어가 없을 때만 표시 */}
      {searchQuery === "" && selectedCategory === "all" && (
        <div className="px-4 py-4">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-7 h-7 rounded-full bg-violet-100 flex items-center justify-center">
              <HelpCircle className="w-4 h-4 text-violet-600" />
            </div>
            <span className="font-medium text-gray-900">이렇게 질문해 보세요!</span>
          </div>

          <div className="space-y-3">
            {SUGGESTED_QUESTIONS.map((faq) => (
              <button
                key={faq.id}
                onClick={() => handleSuggestedClick(faq.question)}
                className="w-full bg-gray-50 rounded-xl p-4 text-left hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <HelpCircle className="w-3.5 h-3.5 text-gray-500" />
                  </div>
                  <p className="text-gray-700 text-sm leading-relaxed">{faq.question}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* FAQ List */}
      <div className="px-4 py-4">
        {searchQuery !== "" || selectedCategory !== "all" ? (
          <>
            <p className="text-sm text-gray-500 mb-4">{filteredFAQs.length}개의 결과</p>
            <div className="space-y-2">
              {filteredFAQs.map((faq) => (
                <FAQAccordionItem
                  key={faq.id}
                  faq={faq}
                  isExpanded={expandedId === faq.id}
                  onToggle={() => handleQuestionClick(faq.id)}
                />
              ))}
              {filteredFAQs.length === 0 && <div className="text-center py-8 text-gray-500">검색 결과가 없습니다.</div>}
            </div>
          </>
        ) : null}
      </div>

      {/* All FAQs - 검색어가 없고 카테고리도 전체일 때 */}
      {searchQuery === "" && selectedCategory === "all" && (
        <div className="px-4 py-4 border-t border-gray-100">
          <h3 className="font-medium text-gray-900 mb-4">자주 묻는 질문</h3>
          <div className="space-y-2">
            {FAQ_DATA.map((faq) => (
              <FAQAccordionItem
                key={faq.id}
                faq={faq}
                isExpanded={expandedId === faq.id}
                onToggle={() => handleQuestionClick(faq.id)}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

function FAQAccordionItem({
  faq,
  isExpanded,
  onToggle,
}: {
  faq: FAQItem
  isExpanded: boolean
  onToggle: () => void
}) {
  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 transition-colors"
      >
        <span className="text-sm text-gray-900 pr-4">{faq.question}</span>
        {isExpanded ? (
          <ChevronUp className="w-5 h-5 text-gray-400 flex-shrink-0" />
        ) : (
          <ChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0" />
        )}
      </button>
      {isExpanded && (
        <div className="px-4 pb-4 pt-0">
          <p className="text-sm text-gray-600 leading-relaxed bg-gray-50 p-3 rounded-lg">{faq.answer}</p>
        </div>
      )}
    </div>
  )
}
