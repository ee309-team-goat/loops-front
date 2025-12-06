// 문제 보고 카테고리 정의
export const REPORT_CATEGORIES = [
  { id: "all", label: "전체" },
  { id: "bug", label: "버그" },
  { id: "content", label: "콘텐츠 오류" },
  { id: "payment", label: "결제 문제" },
  { id: "account", label: "계정 문제" },
  { id: "suggestion", label: "개선 제안" },
  { id: "other", label: "기타" },
]

export interface ReportItem {
  id: string
  category: string
  title: string
  description: string
  status: "pending" | "in-progress" | "resolved" | "closed"
  createdAt: string
  updatedAt?: string
  response?: string
}

// 샘플 데이터 (나중에 백엔드 연동 시 API로 대체)
export const SAMPLE_REPORTS: ReportItem[] = [
  {
    id: "1",
    category: "bug",
    title: "학습 화면에서 카드가 넘어가지 않아요",
    description: "플래시카드 학습 중 '다음' 버튼을 눌러도 카드가 넘어가지 않는 현상이 발생합니다.",
    status: "resolved",
    createdAt: "2024-12-01T10:00:00Z",
    updatedAt: "2024-12-03T14:00:00Z",
    response: "해당 버그를 수정하여 배포 완료했습니다. 앱을 새로고침 해주세요. 불편을 드려 죄송합니다.",
  },
  {
    id: "2",
    category: "content",
    title: "단어 발음이 잘못된 것 같아요",
    description: "'schedule' 단어의 발음이 영국식/미국식 모두 이상하게 들립니다.",
    status: "in-progress",
    createdAt: "2024-12-04T09:00:00Z",
    updatedAt: "2024-12-05T11:00:00Z",
  },
]
