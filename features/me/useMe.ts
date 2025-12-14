"use client"

import { useEffect } from "react"
import { create } from "zustand"
import { getAuthMe, getUserConfig, type MeProfile } from "@/lib/api/me"

type MeState = {
  profile: MeProfile | null
  loading: boolean
  error: unknown
  loaded: boolean
  load: () => Promise<void>
}

const useMeStore = create<MeState>((set, get) => ({
  profile: null,
  loading: false,
  error: null,
  loaded: false,
  load: async () => {
    if (get().loading || get().loaded) return
    set({ loading: true, error: null })
    try {
      let profile: MeProfile | null = null
      try {
        profile = await getUserConfig()
      } catch (err) {
        console.debug("[useMe] getUserConfig failed", err)
      }

      if (!profile) {
        try {
          profile = await getAuthMe()
        } catch (err) {
          console.debug("[useMe] getAuthMe failed", err)
        }
      }

      set({
        profile: profile ?? null,
        loaded: true,
      })
    } catch (err) {
      console.debug("[useMe] load failed", err)
      set({ error: err, profile: null, loaded: true })
    } finally {
      set({ loading: false })
    }
  },
}))

function deriveDisplayName(profile: MeProfile | null, fallback = "사용자") {
  if (!profile) return fallback
  const name = profile.name || profile.nickname || profile.username
  if (name && name.trim()) return name
  if (profile.email && profile.email.includes("@")) {
    return profile.email.split("@")[0] || fallback
  }
  return fallback
}

export function useMe() {
  const { profile, loading, load, error, loaded } = useMeStore()

  useEffect(() => {
    load()
  }, [load])

  const displayName = deriveDisplayName(profile)

  return {
    profile,
    loading,
    loaded,
    error,
    displayName,
    refresh: load,
  }
}
