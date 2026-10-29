# Introduce a swappable cyberpunk AI Colony theme

Bot Crossing's colony now defaults to a dark cyberpunk presentation while retaining the
same session data, status precedence, movement and integrations. Repo zones become neon-lit
tech districts and agents become metallic service robots with expressive screen faces.
The work is split into commits for atmosphere, districts, agents, and HUD, followed by
status isolation and validation.

## Changes

- Centralize theme palettes, material settings, atmospheric overrides, status lamps and badge
  colors in `src/themes/index.js`; keep HUD overrides in scoped `cyberpunk.css`.
- Add neon district edges, glowing building trim and cool metallic robot shells.
- Keep readable hammer, question, check and alert badges; add a pause badge for idle agents.
  Match robot lamps, HUD text and help legend colors. Keep status classification unchanged:
  completed still means a merged PR, and stale errors still expire after three days.
- Extract the existing classification functions unchanged into `session-status.js`, with
  `statusFor` re-exported from `colony.js` for compatibility.
- Preserve original visual tokens via `?theme=classic`; invalid theme names use cyberpunk.
  Saved settings take precedence over the new default blue-hour time.
- Retain Codespaces browser startup, simulated-agent mode, real harness adapters, and existing
  Host/Origin protections. This branch includes the preceding Codespaces/demo commits if
  they have not yet been merged into main.

## Validation

- `npm test`: 163 passed, zero failed or skipped, including theme contract, status precedence,
  demo mode, adapter, state and preview security tests.
- `npm run build`: passed with the existing large JavaScript bundle advisory.
- Headless Chromium with WebGL2/SwiftShader: cyberpunk and classic demo pages loaded with no
  browser or shader errors; both titles and theme selection checked. Cyberpunk HUD displayed
  working, waiting, error, completed and idle counts for 12 simulated sessions.
- No actual GitHub Codespaces authentication check in this runtime. SwiftShader checks do
  not measure real-device GPU performance or replace review on the target display.

## Browser review

1. Start `npm run dev:browser` in Codespaces; keep port 5274 Private.
2. Compare `/?theme=cyberpunk` and `/?theme=classic`.
3. Let demo agents arrive from the ship. Inspect three districts and all five active statuses.
4. Hide the HUD with H and verify world icons; check text labels and the help legend.
5. Toggle bloom off and check status readability, then test a narrow viewport.
6. Reload to check saved colony state. Run `BOT_CROSSING_DEMO=0 npm run dev` on a machine
   with local harness files to use the unchanged real integrations.
