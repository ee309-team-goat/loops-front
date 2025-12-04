"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ChevronLeft, Pencil, Clock, Flame, Calendar, Check, X } from "lucide-react"
import { useRouter } from "next/navigation"

export default function ProfilePage() {
  const router = useRouter()
  const [nickname, setNickname] = useState("me")
  const [isEditing, setIsEditing] = useState(false)
  const [editValue, setEditValue] = useState("")

  useEffect(() => {
    const savedNickname = localStorage.getItem("userNickname")
    if (savedNickname) {
      setNickname(savedNickname)
    }
  }, [])

  const handleEdit = () => {
    setEditValue(nickname)
    setIsEditing(true)
  }

  const handleSave = () => {
    if (editValue.trim()) {
      setNickname(editValue.trim())
      localStorage.setItem("userNickname", editValue.trim())
    }
    setIsEditing(false)
  }

  const handleCancel = () => {
    setIsEditing(false)
    setEditValue("")
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-100 via-purple-50 to-white">
      {/* Header */}
      <div className="bg-white px-4 py-4 flex items-center gap-3 border-b border-gray-200">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ChevronLeft className="w-6 h-6" />
        </Button>
        <h1 className="text-lg font-semibold text-gray-900">프로필 정보</h1>
      </div>

      {/* Profile Content */}
      <div className="px-6 pt-12 pb-8">
        {/* Speech Bubble */}
        <div className="relative mb-12">
          <div className="bg-white rounded-3xl px-6 py-4 shadow-sm inline-block">
            <p className="text-gray-800 text-base">영어 좌우명이 있나요?</p>
          </div>
          <div className="absolute left-8 -bottom-2 w-0 h-0 border-l-[12px] border-l-transparent border-r-[12px] border-r-transparent border-t-[12px] border-t-white"></div>
        </div>

        {/* Gift Box Illustration */}
        <div className="flex justify-center mb-12">
          <div className="relative w-48 h-48">
            {/* Gift Box SVG */}
            <svg viewBox="0 0 200 200" className="w-full h-full">
              {/* Box body */}
              <rect x="40" y="80" width="120" height="100" fill="#C7B3E5" rx="4" />

              {/* Box lid */}
              <rect x="35" y="60" width="130" height="30" fill="#9B7FD4" rx="4" />

              {/* Vertical ribbon */}
              <rect x="90" y="60" width="20" height="120" fill="#7C5FB8" />

              {/* Bow left */}
              <ellipse cx="70" cy="50" rx="35" ry="25" fill="#8B6FC9" />

              {/* Bow right */}
              <ellipse cx="130" cy="50" rx="35" ry="25" fill="#8B6FC9" />

              {/* Bow center */}
              <circle cx="100" cy="50" r="12" fill="#7C5FB8" />
            </svg>
          </div>
        </div>

        <div className="flex items-center justify-center gap-3 mb-16">
          {isEditing ? (
            <div className="flex items-center gap-2">
              <Input
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                className="text-2xl font-bold text-center w-40"
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSave()
                  if (e.key === "Escape") handleCancel()
                }}
              />
              <button
                onClick={handleSave}
                className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center hover:bg-green-200 transition-colors"
              >
                <Check className="w-5 h-5 text-green-600" />
              </button>
              <button
                onClick={handleCancel}
                className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center hover:bg-red-200 transition-colors"
              >
                <X className="w-5 h-5 text-red-600" />
              </button>
            </div>
          ) : (
            <>
              <h2 className="text-3xl font-bold text-gray-800">{nickname}</h2>
              <button
                onClick={handleEdit}
                className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300 transition-colors"
              >
                <Pencil className="w-5 h-5 text-gray-600" />
              </button>
            </>
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          {/* Total Study Time */}
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center mb-3">
              <Clock className="w-6 h-6 text-indigo-600" />
            </div>
            <p className="text-xs text-gray-600 mb-1 text-center">총 학습 시간</p>
            <p className="text-2xl font-bold text-gray-900">--</p>
          </div>

          {/* Consecutive Days */}
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center mb-3">
              <Flame className="w-6 h-6 text-orange-600" />
            </div>
            <p className="text-xs text-gray-600 mb-1 text-center">연속 학습일</p>
            <p className="text-2xl font-bold text-gray-900">0d</p>
          </div>

          {/* Accumulated Days */}
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mb-3">
              <Calendar className="w-6 h-6 text-blue-600" />
            </div>
            <p className="text-xs text-gray-600 mb-1 text-center">누적 학습일</p>
            <p className="text-2xl font-bold text-gray-900">0d</p>
          </div>
        </div>
      </div>
    </div>
  )
}
