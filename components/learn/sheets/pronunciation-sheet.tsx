"use client"

import { useState, useEffect, useRef } from "react"
import { Mic, Volume2, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"

interface PronunciationSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  targetWord?: string
}

type PermissionState = "unknown" | "granted" | "denied"
type RecordState = "idle" | "recording" | "recorded"

// Mock phoneme breakdown for demonstration
function getPhonemes(word: string): string[] {
  const phonemeMap: Record<string, string[]> = {
    back: ["b", "æ", "k"],
    suspect: ["s", "ʌ", "s", "p", "ɛ", "k", "t"],
    innovation: ["ɪ", "n", "ə", "v", "eɪ", "ʃ", "ə", "n"],
    resilience: ["r", "ɪ", "z", "ɪ", "l", "i", "ə", "n", "s"],
  }
  return phonemeMap[word.toLowerCase()] || word.split("")
}

// Mock IPA for word
function getIPA(word: string): string {
  const ipaMap: Record<string, string> = {
    back: "'bæk",
    suspect: "sə'spɛkt",
    innovation: "ˌɪnəˈveɪʃən",
    resilience: "rɪˈzɪliəns",
  }
  return ipaMap[word.toLowerCase()] || `/${word}/`
}

export function PronunciationSheet({ open, onOpenChange, targetWord }: PronunciationSheetProps) {
  const [permission, setPermission] = useState<PermissionState>("unknown")
  const [recordState, setRecordState] = useState<RecordState>("idle")
  const [audioUrl, setAudioUrl] = useState<string | null>(null)
  const [score, setScore] = useState<number | null>(null)
  const [phonemeScores, setPhonemeScores] = useState<number[]>([])
  const [isPlaying, setIsPlaying] = useState(false)
  const [isPlayingNative, setIsPlayingNative] = useState(false)

  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const chunksRef = useRef<BlobPart[]>([])
  const streamRef = useRef<MediaStream | null>(null)

  const phonemes = targetWord ? getPhonemes(targetWord) : []
  const ipa = targetWord ? getIPA(targetWord) : ""

  // Cleanup on close
  useEffect(() => {
    if (!open) {
      setRecordState("idle")
      setScore(null)
      setPhonemeScores([])
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl)
        setAudioUrl(null)
      }
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop())
        streamRef.current = null
      }
      mediaRecorderRef.current = null
      chunksRef.current = []
    }
  }, [open, audioUrl])

  const requestPermission = async () => {
    if (typeof navigator === "undefined" || !navigator.mediaDevices?.getUserMedia) {
      setPermission("denied")
      return false
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      streamRef.current = stream
      setPermission("granted")
      return true
    } catch (err) {
      console.error("Microphone permission denied:", err)
      setPermission("denied")
      return false
    }
  }

  const startRecording = async () => {
    if (permission !== "granted") {
      const granted = await requestPermission()
      if (!granted) return
    }

    if (!streamRef.current) {
      const granted = await requestPermission()
      if (!granted) return
    }

    try {
      chunksRef.current = []
      const recorder = new MediaRecorder(streamRef.current!)

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data)
        }
      }

      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: "audio/webm" })
        if (audioUrl) {
          URL.revokeObjectURL(audioUrl)
        }
        const url = URL.createObjectURL(blob)
        setAudioUrl(url)

        // Mock score and phoneme scores
        const mockScore = 70 + Math.round(Math.random() * 25)
        setScore(mockScore)
        setPhonemeScores(phonemes.map(() => 60 + Math.round(Math.random() * 40)))
        setRecordState("recorded")
      }

      mediaRecorderRef.current = recorder
      recorder.start()
      setRecordState("recording")
    } catch (err) {
      console.error("Failed to start recording:", err)
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && recordState === "recording") {
      mediaRecorderRef.current.stop()
    }
  }

  const handlePlayMine = () => {
    if (!audioUrl) return
    const audio = new Audio(audioUrl)
    setIsPlaying(true)
    audio.onended = () => setIsPlaying(false)
    audio.onerror = () => setIsPlaying(false)
    audio.play().catch(() => setIsPlaying(false))
  }

  const handlePlayNative = () => {
    // Mock native pronunciation playback
    setIsPlayingNative(true)
    console.log("Playing native pronunciation for:", targetWord)
    setTimeout(() => setIsPlayingNative(false), 1000)
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="h-[70vh] max-h-[600px] rounded-t-2xl">
        <SheetHeader className="flex flex-row items-center justify-between pb-4 border-b">
          <div className="flex items-center gap-2">
            <SheetTitle className="text-lg font-bold">발음 정밀 진단</SheetTitle>
            <span className="px-2 py-0.5 text-xs font-medium bg-purple-100 text-purple-600 rounded-full">beta</span>
          </div>
          <Button variant="ghost" size="icon" onClick={() => onOpenChange(false)}>
            <X className="w-5 h-5" />
          </Button>
        </SheetHeader>

        <div className="flex flex-col h-[calc(100%-60px)] overflow-y-auto">
          {/* Permission denied state */}
          {permission === "denied" && (
            <div className="flex-1 flex flex-col items-center justify-center gap-3 text-center px-6">
              <p className="text-sm text-gray-600">
                마이크 권한이 필요해요. 브라우저 설정에서 권한을 허용한 뒤 다시 시도해 주세요.
              </p>
              <Button
                variant="outline"
                className="mt-2 bg-transparent"
                onClick={() => {
                  setPermission("unknown")
                  requestPermission()
                }}
              >
                권한 다시 시도
              </Button>
            </div>
          )}

          {/* Main content when permission is not denied */}
          {permission !== "denied" && (
            <>
              {/* Target word display */}
              {targetWord && (
                <div className="text-center py-4 border-b">
                  <p className="text-2xl font-bold text-gray-900">{targetWord}</p>
                  <p className="text-sm text-gray-400 mt-1">{ipa}</p>
                </div>
              )}

              {/* Score section */}
              <div className="py-4 border-b">
                <div className="text-center">
                  <p className="text-sm text-gray-500 mb-1">정확도 총점</p>
                  <p className="text-3xl font-bold text-indigo-600">{score !== null ? score : "-"}</p>
                </div>
              </div>

              {/* Phoneme breakdown table */}
              {phonemes.length > 0 && (
                <div className="py-4 border-b">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-gray-500">
                        <th className="text-left py-2 font-medium">발음</th>
                        <th className="text-center py-2 font-medium">정확도</th>
                        <th className="text-right py-2 font-medium">강의</th>
                      </tr>
                    </thead>
                    <tbody>
                      {phonemes.map((phoneme, idx) => (
                        <tr key={idx} className="border-t border-gray-100">
                          <td className="py-3 text-lg font-medium">{phoneme}</td>
                          <td className="py-3 text-center">
                            {phonemeScores[idx] !== undefined && (
                              <div className="flex items-center justify-center gap-2">
                                <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                                  <div
                                    className="h-full bg-indigo-500 transition-all"
                                    style={{ width: `${phonemeScores[idx]}%` }}
                                  />
                                </div>
                                <span className="text-xs text-gray-500">{phonemeScores[idx]}%</span>
                              </div>
                            )}
                          </td>
                          <td className="py-3 text-right">
                            <Button variant="ghost" size="sm" className="text-indigo-500 text-xs">
                              학습
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Recording controls */}
              <div className="flex-1 flex flex-col items-center justify-center py-6 gap-4">
                {/* Main record button */}
                <button
                  onClick={recordState === "recording" ? stopRecording : startRecording}
                  className={`w-20 h-20 rounded-full flex items-center justify-center shadow-lg transition-all active:scale-95 ${
                    recordState === "recording" ? "bg-red-500 animate-pulse" : "bg-indigo-500 hover:bg-indigo-600"
                  }`}
                >
                  <Mic className="w-8 h-8 text-white" />
                </button>
                <p className="text-sm text-gray-500">
                  {recordState === "recording" ? "녹음 중... 탭하여 중지" : "여기를 누르고 발음해 보세요"}
                </p>

                {/* Playback buttons */}
                <div className="flex items-center justify-center gap-8 mt-4">
                  <button
                    onClick={handlePlayNative}
                    disabled={isPlayingNative}
                    className="flex flex-col items-center gap-1 text-indigo-500 disabled:opacity-50"
                  >
                    <Volume2 className="w-6 h-6" />
                    <span className="text-xs">성우 발음 듣기</span>
                  </button>

                  <button
                    onClick={handlePlayMine}
                    disabled={!audioUrl || isPlaying}
                    className="flex flex-col items-center gap-1 text-indigo-500 disabled:opacity-50 disabled:text-gray-300"
                  >
                    <Volume2 className="w-6 h-6" />
                    <span className="text-xs">나의 발음 듣기</span>
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}
