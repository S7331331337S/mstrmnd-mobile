# MSTRMND — Personal AI

A React Native + Expo app for thinking through work and life with your own AI mastermind board. Built from the existing MSTRMND board app, with a personal home screen, context, action checklists, and monochrome dark/light/system themes.

## Run it

Use Node 22.13 or newer, then run these commands from this folder:

```bash
npm ci
npm start
```

Scan the QR code with an Expo Go version that supports SDK 57. Press `i` for an installed iOS simulator, `a` for Android, or `w` for the web app. If your Expo Go version does not support this SDK, use the development-build instructions in [SHIPPING.md](SHIPPING.md).

For a browser preview:

```bash
npm run web
```

## The experience

| Screen | What you can do |
| --- | --- |
| Today | Ask a question, add session context, choose a quick round or full debate, change your board, and review next moves. |
| Sessions | Search saved sessions, reopen decisions, share transcripts, or remove a session after confirmation. |
| Board | Explore seven specialists and the Chair, including each member's lens. |
| My context | Save your name, current focus, ambition, background, and constraints. Control whether new sessions include that context. |
| Settings | Choose light, dark, or system appearance; add/remove your Claude key; choose a model; change format and haptics; clear history. |

The **Personal clarity** preset seats the Visionary, Contrarian, and Operator. Other presets cover building, growth, positioning, or the full board. The Chair is always included.

A full session runs **openings → crossfire → the Chair's ruling**. A quick round skips crossfire. The ruling names the decision, its reasoning, the real disagreement, and next steps. Next steps become checkboxes, saved with that session and surfaced on Today.

## Demo and live intelligence

The app works immediately in **Demo** mode. Its responses are scripted examples, visibly labelled in the app; they do not reason about your question or personal context.

For live AI, add your Anthropic API key in Settings. Requests stream directly from Anthropic with `expo/fetch`. API usage is charged to that account. A multi-member session makes multiple model requests.

- On iOS/Android, the key uses `expo-secure-store`.
- On web, the key remains in memory for the current tab and is cleared on reload.
- Sessions, actions, profile, and appearance preferences persist locally with AsyncStorage.
- When live AI is used, the question, enabled context, and current debate transcript are sent to Anthropic. There is no cloud history sync.
- This is a personal bring-your-own-key app. It does not include accounts, subscription payments, or a managed AI backend.

## Stack and structure

Expo SDK 57 · React Native 0.86 · React 19 · Expo Router · TypeScript · Zustand · Reanimated.

- `src/app/`: Expo Router routes.
- `src/screens/`: Today, room, history, board, personal context, and settings screens.
- `src/components/`: shared native UI primitives and action checklist.
- `src/theme/`: typography, motion, spacing, and paired monochrome palettes.
- `src/agents/`: personas, debate orchestration, live and demo providers.
- `src/lib/`: persistent settings/profile/session state, IDs, and action parsing.
- `assets/`: existing app icon and splash assets carried over from the source project.

The UI uses a text-only MSTRMND wordmark. No replacement for the locked brand icon was invented.

## Checks

```bash
npm run typecheck
npm test
npx expo export --platform all
```

The tests cover turn order, cancellation, isolation of specialist errors, personal-context inclusion, action extraction, and streamed responses split across network frames.

## Verification for this delivery

See [VALIDATION.md](VALIDATION.md) for the exact checks completed and the remaining device checks. Bundle export is not a signed `.ipa` or `.apk` and does not replace running the app on a device.

## Source continuity

Adapted from `S7331331337S/skills`, `apps/mstrmnd`, commit `4a2b5952ccbfe637b886c89c52a0d101a6bdef5a`. This folder is standalone and has no dependency on that repository's Expo skills plugin. Saved under `apps/personal-ai` on branch `feat/personal-ai-mastermind` of `S7331331337S/mstrmnd-mobile`. Run all app commands from `apps/personal-ai`.

Reference documentation: [Expo Router](https://docs.expo.dev/router/introduction/), [Expo builds](https://docs.expo.dev/build/setup/), [Claude model IDs](https://platform.claude.com/docs/en/models/overview).
