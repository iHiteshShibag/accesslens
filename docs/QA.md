# Judging-day QA and fallback runbook

## Verified build status

Validated on September 29, 2026:

- `npm test`: **3/3 passing**;
- `npm run build`: **passing**;
- API health route: returns `ok`, Gemini mode, and database mode;
- desktop dashboard: visually inspected;
- exact sample analysis: passed in a real browser;
- action completion: score changed **42 → 50** and completed count **0/4 → 1/4**;
- mobile results: inspected at **390×844**;
- browser console: no errors or warnings.

## Exact 90-second live flow

### Preflight — 15 minutes before

1. Run `npm run build && npm start`.
2. Open `http://localhost:8787/api/health`.
3. Confirm one of:
   - `gemini: true` for the live route;
   - `gemini: false` for the deterministic judging route.
4. Open the app in the presentation browser.
5. Set browser zoom to 100%, close unrelated tabs, disable notifications.
6. Run the entire flow once, then return to the workspace.
7. Keep this runbook and the Devpost draft open locally.

### Demo — 90 seconds

| Time | Action | Line |
| --- | --- | --- |
| 0:00 | Show hero photo | “An ordinary entrance can hide several different barriers.” |
| 0:10 | Click **Audit a space** | “One photo plus lightweight venue context.” |
| 0:18 | Point to synthetic label | “This judging fixture is synthetic and clearly labeled.” |
| 0:25 | Click **Analyze with Gemini** | “Gemini performs multimodal evidence extraction and prioritization.” |
| 0:35 | Show score and marker 1 | “Every finding links back to visible evidence and confidence.” |
| 0:52 | Scroll to actions | “The owner sees cost, effort, priority, and expected score gain.” |
| 1:04 | Complete action 1 | “A zero-cost fix moves the score from 42 to 50.” |
| 1:15 | Toggle Hindi / show method | “Multilingual, measurable, and honest about estimates.” |
| 1:25 | Point to model-mode badge | “Live when available; explicitly labeled offline fallback when it isn’t.” |

## Failure matrix

| Failure | Detection | Recovery | What to say |
| --- | --- | --- | --- |
| Venue Wi-Fi down | Health route/browser fails | Use localhost production build and server fixture | “The product is intentionally offline-demoable; this result is labeled deterministic.” |
| Gemini key missing/expired | `/api/health` shows `gemini: false` or analysis error | Continue with built-in sample; no code change needed | “We never fake a live call. The interface identifies the fallback mode.” |
| Gemini slow/rate-limited | Error state after request | Click **Use offline judging demo** | “The fallback preserves the demo while keeping provenance explicit.” |
| MongoDB unavailable | Server warning; health says `memory` | Continue; in-memory store is automatic | “Persistence is optional for the prototype, not for the core AI flow.” |
| Image upload rejected | Inline JPG/PNG/WebP/10 MB error | Select bundled sample | “Input validation prevents oversized or unsupported files.” |
| Browser tab crashes | Page unavailable | Reopen localhost; seeded audit is present | Keep terminal server running. |
| Local server stops | Health route fails | Run `npm start` again | Use the already-built `dist` output. |
| Projector resolution poor | Text too small | Browser zoom 110–125%; use sample flow only | Avoid opening developer tools during pitch. |

## Offline kit

The repository already contains:

- production `dist/` after `npm run build`;
- local synthetic PNG under `public/samples/`;
- server fallback response under `shared/demoData.js`;
- client fallback if the server request itself fails;
- print-friendly result view;
- this runbook and the complete pitch text.

No internet, database, or API key is required for the judging fixture.

## Manual regression checklist

### Workspace

- [x] Synthetic source label visible.
- [x] Metrics load from API.
- [x] Loading skeleton exists.
- [x] Empty-state branch exists.
- [x] Recent audit opens.

### Setup

- [x] Synthetic sample selected by default.
- [x] File chooser accepts JPG/PNG/WebP.
- [x] Invalid type/oversize copy is clear.
- [x] Venue name/type are required.
- [x] Visitor count is labeled as estimate input.
- [x] Privacy guidance is visible.

### Analysis/error

- [x] Three progress stages.
- [x] Server error copy is sanitized.
- [x] Retry action exists.
- [x] Offline fallback is one click.

### Results

- [x] Source provenance visible.
- [x] Current/projected score visible.
- [x] Evidence regions are keyboard-focusable buttons.
- [x] Evidence, affected user, severity, and confidence render.
- [x] Hindi summary toggles.
- [x] Recommendation completion persists through API.
- [x] Score recalculates.
- [x] Reach method expands.
- [x] Model mode and disclaimer visible.
- [x] Print layout exists.

### Responsive/accessibility

- [x] 390×844 layout checked.
- [x] Native buttons/inputs/selects used.
- [x] Visible keyboard focus styles.
- [x] High-contrast text and controls.
- [x] Images have contextual alt text or decorative empty alt.
- [x] Content remains available without image-marker interaction.

## Known limitations to disclose

- Live Gemini behavior was smoke-tested against the deployed production API; automated tests intentionally omit the API key and exercise the deterministic fallback.
- The scoring rubric is a prototype and not expert-calibrated.
- Cost bands are illustrative.
- Uploaded images are stored as data URLs in the prototype process/database; production needs object storage and deletion.
- Hindi is fixture/live-model output; Marathi is future work.
- No authentication or multi-tenant access control in the hackathon build.

## Five-minute post-deploy smoke test

1. `GET /api/health` returns 200.
2. Landing page image loads over HTTPS.
3. Start audit and submit the sample.
4. Results show exactly four fixture findings in demo mode.
5. Complete the first action; score becomes 50.
6. Reload the page and open the most recent audit.
7. Check mobile width in browser responsive mode.
8. Confirm no secret appears in client network responses or JavaScript bundle.
