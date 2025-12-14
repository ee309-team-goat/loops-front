"use client"

import { useEffect } from "react"
import { create } from "zustand"
import { getMeProfile, type MeProfile } from "@/lib/api/me"

const LOCAL_NICKNAME_KEY = "signupNickname"

type LoadOptions = { force?: boolean }

type MeState = {
  profile: MeProfile | null
  loading: boolean
  error: unknown
  loaded: boolean
  load: (options?: LoadOptions) => Promise<void>
}

const useMeStore = create<MeState>((set, get) => ({
  profile: null,
  loading: false,
  error: null,
  loaded: false,
  load: async (options?: LoadOptions) => {
    const force = options?.force ?? false
    if (get().loading) return
    if (get().loaded && !force) return

    if (force) {
      set({ loaded: false, profile: null, error: null })
    }

    set({ loading: true, error: null })
    try {
      const profile = await getMeProfile()

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

function getLocalNickname() {
  if (typeof window === "undefined") return null
  return localStorage.getItem(LOCAL_NICKNAME_KEY)
}

function deriveDisplayName(profile: MeProfile | null, fallback = "사용자") {
  const localNick = getLocalNickname()
  if (profile) {
    const name = profile.name || profile.nickname || profile.username
    if (name && name.trim()) return name
  }
  if (localNick && localNick.trim()) return localNick
  if (profile?.email && profile.email.includes("@")) {
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

  const refresh = () => load({ force: true })

  return {
    profile,
    loading,
    loaded,
    error,
    displayName,
    refresh,
  }
}
