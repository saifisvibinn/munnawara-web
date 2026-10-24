// One shared context: browsers (iOS above all) only let audio play once a context
// has been resumed inside a tap, so a fresh context per chime stays silent.
let ctx: AudioContext | null = null

const getContext = () => {
  if (ctx) return ctx
  const Ctx =
    window.AudioContext ||
    (window as unknown as { webkitAudioContext?: typeof AudioContext })
      .webkitAudioContext
  if (!Ctx) return null
  ctx = new Ctx()
  return ctx
}

/** Call from a tap (opening the chat, sending) so later chimes are allowed to play. */
export const unlockChatSound = () => {
  try {
    const audio = getContext()
    if (audio?.state === "suspended") void audio.resume().catch(() => {})
  } catch {
    /* unsupported */
  }
}

/** Soft chime for inbound chat messages (no audio asset required). */
export const playChatNotifySound = () => {
  try {
    const audio = getContext()
    if (!audio) return
    if (audio.state === "suspended") void audio.resume().catch(() => {})
    const now = audio.currentTime

    const tone = (freq: number, start: number, dur: number, gain = 0.045) => {
      const osc = audio.createOscillator()
      const g = audio.createGain()
      osc.type = "sine"
      osc.frequency.setValueAtTime(freq, start)
      g.gain.setValueAtTime(0.0001, start)
      g.gain.exponentialRampToValueAtTime(gain, start + 0.02)
      g.gain.exponentialRampToValueAtTime(0.0001, start + dur)
      osc.connect(g)
      g.connect(audio.destination)
      osc.start(start)
      osc.stop(start + dur + 0.02)
    }

    tone(880, now, 0.12, 0.05)
    tone(1174, now + 0.1, 0.16, 0.035)
  } catch {
    /* ignore autoplay / unsupported */
  }
}
