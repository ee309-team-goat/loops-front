"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Loader2 } from "lucide-react"
import { register } from "@/lib/api/auth"

export default function SignupPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    if (password.length < 8) {
      setError("비밀번호는 최소 8자 이상이어야 합니다.")
      setIsLoading(false)
      return
    }

    if (username.length < 3) {
      setError("이름은 최소 3자 이상이어야 합니다.")
      setIsLoading(false)
      return
    }

    try {
      await register({ email, password, username })
      router.push("/onboarding")
    } catch (err) {
      setError(err instanceof Error ? err.message : "회원가입에 실패했습니다.")
    } finally {
      setIsLoading(false)
    }
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

        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 px-4 py-3 rounded-xl text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">이름</label>
            <input
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              minLength={3}
              maxLength={100}
              className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 dark:focus:ring-indigo-800 outline-none transition-all"
              placeholder="홍길동"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">이메일</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 dark:focus:ring-indigo-800 outline-none transition-all"
              placeholder="hello@example.com"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">비밀번호</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              minLength={8}
              className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 dark:focus:ring-indigo-800 outline-none transition-all"
              placeholder="••••••••"
            />
            <p className="text-xs text-muted-foreground">최소 8자 이상</p>
          </div>

          <Button type="submit" className="w-full py-6 text-lg" disabled={isLoading}>
            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "무료로 시작하기"}
          </Button>
        </form>
      </div>
    </div>
  )
}
