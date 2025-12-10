"use client"

import type React from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "./auth-provider"
import { Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"

interface AuthRequiredProps {
  children: React.ReactNode
}

export function AuthRequired({ children }: AuthRequiredProps) {
  const router = useRouter()
  const { isAuthed, isLoading, devSkip } = useAuth()

  console.log("[v0] AuthRequired - isLoading:", isLoading, "isAuthed:", isAuthed)

  // useEffect에서 리다이렉트하지 않음

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    )
  }

  if (!isAuthed) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 gap-4">
        <p className="text-gray-600">로그인이 필요합니다</p>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => router.push("/login")}>
            로그인 페이지로 이동
          </Button>
          <Button
            variant="default"
            onClick={() => {
              console.log("[v0] DEV Skip button clicked")
              devSkip()
            }}
            className="bg-orange-500 hover:bg-orange-600"
          >
            [DEV] Skip
          </Button>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
