import type { FleetCategoryId } from "./types"

/**
 * Short looping "bus in motion" clip per class. Drop the file in
 * public/fleet/<id>/ and register it here — the carousel shows the cover image
 * until a clip exists. Keep clips muted, ~5–8s, under ~3 MB, H.264 mp4.
 */
export const fleetVideos: Partial<Record<FleetCategoryId, string>> = {
  // "premium-vip-2026": "/fleet/premium-vip-2026/loop.mp4",
}
