import { apiFetch } from "@/lib/api/http"

export interface MeProfile {
  id?: string
  email?: string
  name?: string
  nickname?: string
  username?: string
}

export async function getUserConfig(): Promise<MeProfile> {
  return apiFetch<MeProfile>("/api/v1/users/me/config", { auth: true })
}

export async function getAuthMe(): Promise<MeProfile> {
  return apiFetch<MeProfile>("/api/v1/auth/me", { auth: true })
}
