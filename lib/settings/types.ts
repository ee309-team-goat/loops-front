export interface Settings {
  // Audio settings
  playbackSpeed: number
  autoPlayAudio: boolean
  soundEffects: boolean

  // Notification settings
  notificationsEnabled: boolean
  notificationTime: string
  studyReport: boolean
  leagueAlerts: boolean

  // Vocabulary settings
  dailyGoal: number
  showMeaning: boolean

  // Quiz settings
  quizTypes: {
    meaning: boolean
    spelling: boolean
    listening: boolean
  }
}

export const DEFAULT_SETTINGS: Settings = {
  // Audio
  playbackSpeed: 1.0,
  autoPlayAudio: true,
  soundEffects: true,

  // Notifications
  notificationsEnabled: true,
  notificationTime: "09:00",
  studyReport: true,
  leagueAlerts: true,

  // Vocabulary
  dailyGoal: 20,
  showMeaning: true,

  // Quiz
  quizTypes: {
    meaning: true,
    spelling: true,
    listening: true,
  },
}

export function validateSettings(data: unknown): Settings {
  if (!data || typeof data !== "object") {
    return DEFAULT_SETTINGS
  }

  const obj = data as Record<string, unknown>

  try {
    return {
      playbackSpeed:
        typeof obj.playbackSpeed === "number" && obj.playbackSpeed >= 0.5 && obj.playbackSpeed <= 2.0
          ? obj.playbackSpeed
          : DEFAULT_SETTINGS.playbackSpeed,

      autoPlayAudio: typeof obj.autoPlayAudio === "boolean" ? obj.autoPlayAudio : DEFAULT_SETTINGS.autoPlayAudio,

      soundEffects: typeof obj.soundEffects === "boolean" ? obj.soundEffects : DEFAULT_SETTINGS.soundEffects,

      notificationsEnabled:
        typeof obj.notificationsEnabled === "boolean"
          ? obj.notificationsEnabled
          : DEFAULT_SETTINGS.notificationsEnabled,

      notificationTime:
        typeof obj.notificationTime === "string" && /^\d{2}:\d{2}$/.test(obj.notificationTime)
          ? obj.notificationTime
          : DEFAULT_SETTINGS.notificationTime,

      studyReport: typeof obj.studyReport === "boolean" ? obj.studyReport : DEFAULT_SETTINGS.studyReport,

      leagueAlerts: typeof obj.leagueAlerts === "boolean" ? obj.leagueAlerts : DEFAULT_SETTINGS.leagueAlerts,

      dailyGoal:
        typeof obj.dailyGoal === "number" && obj.dailyGoal >= 1 && obj.dailyGoal <= 100
          ? obj.dailyGoal
          : DEFAULT_SETTINGS.dailyGoal,

      showMeaning: typeof obj.showMeaning === "boolean" ? obj.showMeaning : DEFAULT_SETTINGS.showMeaning,

      quizTypes:
        obj.quizTypes &&
        typeof obj.quizTypes === "object" &&
        typeof (obj.quizTypes as Record<string, unknown>).meaning === "boolean" &&
        typeof (obj.quizTypes as Record<string, unknown>).spelling === "boolean" &&
        typeof (obj.quizTypes as Record<string, unknown>).listening === "boolean"
          ? (obj.quizTypes as Settings["quizTypes"])
          : DEFAULT_SETTINGS.quizTypes,
    }
  } catch {
    return DEFAULT_SETTINGS
  }
}
