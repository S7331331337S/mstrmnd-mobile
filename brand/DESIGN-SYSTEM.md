# MSTRMND Design System

Version 1.0 — September 2026

MSTRMND is a restrained, monochrome interface system for a mobile-first AI platform. The visual language is precise, quiet, engineered, and premium.

## Non-negotiables

- Black, white, and grayscale are the only brand colors.
- Light mode and dark mode are first-class. Every component must have both intentional variants.
- Cards use subtle 1px borders with restrained shadow/glow.
- The metallic white-to-silver treatment is a surface treatment for hero moments, not a base UI color.
- No neon accents, colored gradients, cyberpunk styling, excessive glassmorphism, or decorative effects.
- Prefer negative space, hierarchy, typography, and geometry over ornament.
- Mobile is the reference environment; desktop scales from the same system.

## Brand mark

The triangular MSTRMND mark is the primary identity. Use the flat monochrome mark for everyday UI, small sizes, favicons, and utility contexts. Use the metallic treatment for app icons, splash screens, hero media, social artwork, and premium brand moments.

## Color

| Token | Light | Dark | Role |
|---|---|---|---|
| Background | #F7F7F5 | #050505 | page background |
| Surface | #FFFFFF | #0B0B0B | cards / panels |
| Surface Raised | #F1F1EF | #111111 | elevated surfaces |
| Foreground | #111111 | #F5F5F5 | primary text |
| Muted | #666666 | #A3A3A3 | secondary text |
| Subtle | #969696 | #707070 | tertiary text |
| Line | #D9D9D6 | #292929 | 1px borders |
| Line Strong | #BDBDBA | #444444 | emphasis |
| Black | #000000 | #000000 | absolute black |
| White | #FFFFFF | #FFFFFF | absolute white |

Status colors are semantic only and are not decorative brand accents: Warning #B7791F, Danger #B42318, Success #3F6B4A.

## Metallic logo treatment

Use a restrained neutral gradient: #FFFFFF → #BFC1C3 → #F4F4F4. Keep specular highlights soft and avoid a chrome-heavy appearance. Glow should be barely perceptible.

## Typography

Primary display and headings: Aeonik.
Body and UI: Inter Tight.

Display should be compact, confident, and editorial. Body copy should remain highly legible at mobile sizes. Avoid excessive tracking; use tracking primarily for labels, metadata, and all-caps utility text.

## Layout

Base spacing unit: 4px. Preferred rhythm: 4 / 8 / 12 / 16 / 20 / 24 / 32 / 40 / 48 / 64 / 80.

Mobile content padding: 16px. Comfortable content padding: 20px. Standard card padding: 16px. Section rhythm: 32–48px.

## Shape

Default card radius: 10px. Small controls: 8px. Large sheets/dialogs: 14px. Pills are reserved for status and compact filters, not primary layout.

## Borders, shadow, glow

Default border: 1px solid. Border opacity should remain quiet. Shadows are soft and close to the surface. Glow is reserved for the logo, focused controls, and selected premium media. Never make glow the primary visual signal.

## Motion

Motion is short, precise, and mechanical. Recommended durations: 90ms instant, 150ms fast, 220ms base, 340ms slow. Avoid bouncy consumer motion.

## Components

Core primitives: Text, Label, Button, IconButton, Card, Divider, Badge, Avatar, StatusDot, TextField, SegmentedControl, Sheet, PressableScale, EmptyState, Navigation, ListRow, Stat, Modal, Toast.

All primitives consume semantic tokens rather than hard-coded theme colors.

## Media system

Primary formats: 1:1, 4:5, 9:16, 16:9.

Social hierarchy: small mark → short statement → one supporting line → restrained footer/URL. Keep compositions sparse. Use monochrome photography, technical diagrams, architecture, systems imagery, and material close-ups rather than generic AI imagery.

## Accessibility

Maintain WCAG-conscious contrast, visible focus states, minimum 44px touch targets, reduced-motion support, and text that remains readable without relying on glow or grayscale contrast alone.
