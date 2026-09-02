# MSTRMND Mobile

The MSTRMND Agent Alliance, in your pocket. A React Native + Expo client for the personal intelligence layer.

## Stack

- Expo Router
- React Native + NativeWind / Tailwind
- Reanimated + Gesture Handler
- Vercel AI SDK

## Design system

MSTRMND v1 is **monochrome, restrained, mobile-first, and light/dark by design**. The source of truth lives in `brand/`, `src/theme/`, and `src/components/ui/`.

### Hard rules

- Black, white, and grayscale only.
- Light mode and dark mode are first-class across every screen and component.
- 1px borders, restrained shadows, subtle glow.
- Metallic white → silver → white is reserved for premium logo/media treatments.
- No neon, colored gradients, cyberpunk styling, or decorative glassmorphism.
- Mobile is the reference environment; desktop scales from the same system.

### Source of truth

- `brand/DESIGN-SYSTEM.md` — complete visual specification.
- `brand/BRAND-KIT.md` — logo and export guidance.
- `brand/MEDIA-SYSTEM.md` — social and marketing media rules.
- `brand/tokens.json` — portable design tokens.
- `brand/assets/` — vector identity assets.
- `src/theme/tokens.ts` — runtime TypeScript tokens.
- `src/global.css` — semantic light/dark CSS variables.

### Theme architecture

The authoritative color scheme is resolved in JS so users can explicitly choose light or dark even when the OS uses the opposite scheme. CSS variables provide semantic tokens and pre-hydration fallback. Components should consume semantic tokens rather than hard-coded colors.

## Project layout

```text
brand/
  assets/               identity vectors
  DESIGN-SYSTEM.md      visual system
  BRAND-KIT.md          brand assets + usage
  MEDIA-SYSTEM.md       media rules
  tokens.json           portable tokens
src/
  app/                  Expo Router screens + API routes
  components/ui/        design-system primitives
  components/           feature components
  theme/                runtime tokens and theme
  lib/                  agents, memory, identity, AI wiring
```

## Getting started

```bash
pnpm install
pnpm dev
```

Press `w` for web, `i` for iOS simulator, or scan the QR code with Expo Go / a dev client.
