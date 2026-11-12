# Mascot animation clips

All 9 required clips are in (10 Nov 2026); the optional paywall peek and tap
reactions are not made yet. Drop each finished animation here using the exact file name below. The app
picks it up on the next build; any clip not here yet falls back to the
neutral still with simple motion. Full spec: the "Animation files" section of
the Sherlock Bones character bible.

| File | Plays | Length | Loop |
|---|---|---|---|
| idle.webp | Home, waiting | 3.0 s | yes |
| sniff.webp | Check starts | 0.8 s (60 fps) | no, ends on investigate's first frame |
| investigate.webp | Detectors running | 4.0 s (60 fps) | yes |
| verdict_confirmed_ai.webp | Signed proof of AI | 1.2 s | no, holds last frame |
| verdict_likely_ai.webp | Detectors agree: AI | 4.08 s (60 fps, own "Likely AI!" bubble, no app burst) | no, holds last frame |
| verdict_cant_tell.webp | Not enough evidence | 1.98 s (60 fps) | no, holds last frame |
| verdict_likely_human.webp | Detectors say human | 1.2 s | no, holds last frame |
| verdict_verified_capture.webp | Signed camera photo | 1.2 s | no, holds last frame |
| confused.webp | Offline / error | 3.02 s (60 fps) | yes |
| paywall_peek.webp (optional) | Free checks used up | 1.0 s | no |
| tap_wag.webp, tap_sneeze.webp, tap_hat.webp (optional) | User taps the dog | 0.6 s | no, start and end on idle pose |

Format: transparent animated WebP, 512x512, 24 fps, character centered on
the same spot as `../reference/neutral.png`, no thought bubble or sparkle
(the app draws those).
