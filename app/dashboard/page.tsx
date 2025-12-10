import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Flame, BookOpen, Clock, Bell, BarChart3 } from "lucide-react"
import { BottomTabNav } from "@/components/bottom-tab-nav"

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-background pb-20 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
      {/* Header */}
      <div className="bg-card p-6 pb-8 rounded-b-3xl shadow-sm space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-foreground">안녕하세요, 준호님! 👋</h1>
            <p className="text-muted-foreground">오늘도 목표를 향해 달려볼까요?</p>
          </div>
          <Link href="/notifications">
            <Button variant="ghost" size="icon">
              <Bell className="w-5 h-5 text-muted-foreground" />
            </Button>
          </Link>
        </div>

        {/* Streak Card */}
        <div className="bg-orange-50 dark:bg-orange-950 border border-orange-100 dark:border-orange-900 p-4 rounded-2xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-100 dark:bg-orange-900 rounded-full text-orange-500">
              <Flame className="w-5 h-5 fill-current" />
            </div>
            <div>
              <div className="font-bold text-orange-900 dark:text-orange-100">7일 연속 학습 중</div>
              <div className="text-xs text-orange-600 dark:text-orange-400">이대로 계속 가보자구요! 🔥</div>
            </div>
          </div>
        </div>

        {/* Main Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-card border border-border p-4 rounded-2xl shadow-sm">
            <div className="text-muted-foreground text-xs mb-1">새로 학습</div>
            <div className="text-2xl font-bold text-foreground">
              5<span className="text-sm font-normal text-muted-foreground ml-1">개</span>
            </div>
          </div>
          <div className="bg-card border border-border p-4 rounded-2xl shadow-sm">
            <div className="text-muted-foreground text-xs mb-1">복습 완료</div>
            <div className="text-2xl font-bold text-foreground">
              15<span className="text-sm font-normal text-muted-foreground ml-1">개</span>
            </div>
          </div>
        </div>
      </div>

      {/* Today's Review Section */}
      <div className="p-6 space-y-4">
        <h2 className="font-bold text-lg text-foreground">오늘의 학습</h2>

        <div className="bg-card p-6 rounded-3xl shadow-sm border border-border space-y-6">
          <div className="flex justify-between items-end">
            <div>
              <div className="text-3xl font-bold text-indigo-600">
                15<span className="text-lg text-muted-foreground font-normal">/20</span>
              </div>
              <div className="text-sm text-muted-foreground mt-1">오늘의 목표 달성까지</div>
            </div>
            <div className="text-right">
              <div className="text-sm font-medium text-foreground">약 8분</div>
              <div className="text-xs text-muted-foreground">예상 소요 시간</div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="h-3 bg-muted rounded-full overflow-hidden">
            <div className="h-full bg-indigo-500 w-[75%] rounded-full" />
          </div>

          <Link href="/learn" className="block">
            <Button className="w-full py-6 text-lg shadow-indigo-200 shadow-lg">학습 계속하기</Button>
          </Link>
        </div>
      </div>

      {/* Weekly Stats Preview */}
      <div className="px-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-bold text-lg text-foreground">주간 리포트</h2>
          <Link href="/statistics">
            <Button variant="ghost" size="sm" className="text-indigo-600">
              <BarChart3 className="w-4 h-4 mr-1" />
              자세히
            </Button>
          </Link>
        </div>
        <div className="bg-card p-4 rounded-2xl border border-border shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">총 학습 시간</span>
            </div>
            <span className="font-bold text-foreground">2시간 15분</span>
          </div>
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">암기한 단어</span>
            </div>
            <span className="font-bold text-foreground">42개</span>
          </div>
        </div>
      </div>

      {/* Bottom Tab Navigation */}
      <BottomTabNav />
    </div>
  )
}
