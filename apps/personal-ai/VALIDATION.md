# Verification — 15 September 2026

| Check | Result |
| --- | --- |
| Install from npm lockfile | Passed |
| TypeScript strict checking | Passed |
| Core behavior tests | 10 passed |
| Expo web JavaScript export | Passed |
| Expo iOS Hermes bundle export | Passed |
| Expo Android Hermes bundle export | Passed |
| Installed Expo dependency comparison | Passed in offline mode; online dependency service timed out |
| Browser visual and interaction check | Not completed: the browser URL policy blocked local previews |
| Live Claude requests | Not exercised; no user API key supplied |
| Native device, simulator, signing, and store builds | Not run |

The tests cover ordered deliberation, reverse-order crossfire, cancellation, partial provider failure, inclusion of personal context, Markdown action parsing, CRLF stream separators, partial SSE frames, and provider error propagation.

Exports prove the platform bundles compile, not that a signed installable app was produced. Before distribution, run the app on iOS and Android and check layout, keyboard behavior, larger accessibility text sizes, haptics, device keychain, and the live Claude flow.

To reproduce:

```bash
npm ci
npm run typecheck
npm test
npx expo export --platform all
```
