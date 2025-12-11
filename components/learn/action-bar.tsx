"use client"

import { MessageCircleQuestion, BookOpen, Mic, FileText, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ActionBarProps {
  onOtherExample: () => void
  onWrongNotes: () => void
  onAiQuestion: () => void
  onWordInfo: () => void
  onPronunciation: () => void
}

export function ActionBar({ onOtherExample, onWrongNotes, onAiQuestion, onWordInfo, onPronunciation }: ActionBarProps) {
  const actions = [
    { icon: RefreshCw, label: "다른 예문", onClick: onOtherExample },
    { icon: BookOpen, label: "오답 노트", onClick: onWrongNotes },
    { icon: MessageCircleQuestion, label: "AI 질문", onClick: onAiQuestion },
    { icon: FileText, label: "단어 정보", onClick: onWordInfo },
    { icon: Mic, label: "발음 진단", onClick: onPronunciation },
  ]

  return (
    <div className="flex justify-around py-3 border-t border-gray-100">
      {actions.map(({ icon: Icon, label, onClick }) => (
        <Button
          key={label}
          variant="ghost"
          className="flex flex-col items-center gap-1 h-auto py-2 px-2 text-gray-600 hover:text-indigo-600 hover:bg-indigo-50"
          onClick={onClick}
        >
          <Icon className="w-5 h-5" />
          <span className="text-[10px]">{label}</span>
        </Button>
      ))}
    </div>
  )
}
