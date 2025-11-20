import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-white">
      <div className="max-w-md w-full text-center space-y-8">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold tracking-tight text-indigo-600">Loops</h1>
          <p className="text-gray-500 text-lg">
            과학적인 반복 학습으로
            <br />
            영단어를 영구적으로 기억하세요.
          </p>
        </div>

        <div className="space-y-4 pt-8">
          <Link href="/signup" className="block w-full">
            <Button size="lg" className="w-full text-lg">
              이메일로 시작하기
            </Button>
          </Link>

          <Link href="/login" className="block w-full">
            <Button variant="outline" size="lg" className="w-full text-lg bg-transparent">
              이미 계정이 있나요? 로그인
            </Button>
          </Link>
        </div>

        <div className="pt-8 text-sm text-gray-400">
          <p>FSRS 알고리즘 기반 학습 시스템</p>
        </div>
      </div>
    </div>
  )
}
