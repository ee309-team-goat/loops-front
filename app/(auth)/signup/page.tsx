"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Loader2 } from "lucide-react"

export default function SignupPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    setTimeout(() => {
      setIsLoading(false)
      router.push("/onboarding")
    }, 1000)
  }

  return (
    <div className="min-h-screen bg-background p-6 flex flex-col">
      <Link href="/" className="inline-flex items-center text-muted-foreground mb-8">
        <ArrowLeft className="w-4 h-4 mr-2" />
        돌아가기
      </Link>

      <div className="flex-1 flex flex-col justify-center max-w-md mx-auto w-full space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold text-foreground">환영합니다! 🎉</h1>
          <p className="text-muted-foreground">30초만에 가입하고 바로 시작하세요.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">이름</label>
            <input
              type="text"
              required
              className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 dark:focus:ring-indigo-800 outline-none transition-all"
              placeholder="홍길동"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">이메일</label>
            <input
              type="email"
              required
              className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 dark:focus:ring-indigo-800 outline-none transition-all"
              placeholder="hello@example.com"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">비밀번호</label>
            <input
              type="password"
              required
              className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 dark:focus:ring-indigo-800 outline-none transition-all"
              placeholder="••••••••"
            />
          </div>

          <Button type="submit" className="w-full py-6 text-lg" disabled={isLoading}>
            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "무료로 시작하기"}
          </Button>
        </form>
      </div>
    </div>
  )
}
