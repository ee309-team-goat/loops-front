const DEFAULT_BASE_URL = "https://loops-api-273611200488.asia-northeast3.run.app"

export function getApiBaseUrl(): string {
  return process.env.NEXT_PUBLIC_LOOPS_API_BASE_URL || DEFAULT_BASE_URL
}
