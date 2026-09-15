# Run MSTRMND on a phone

All commands run from this standalone project's root.

## Expo Go

```bash
npm ci
npm start
```

Use a version of Expo Go compatible with SDK 57 and scan the QR code. Keep your computer and phone on a network that allows them to reach each other.

## An installable preview build

Link the app to your Expo account, then request a build:

```bash
npx eas-cli@latest login
npx eas-cli@latest init
npx eas-cli@latest build --profile preview --platform android
```

The preview profile produces an Android APK. For iOS, register the device with Expo and use your Apple signing credentials:

```bash
npx eas-cli@latest device:create
npx eas-cli@latest build --profile preview --platform ios
```

Choose the final app identifier before creating store records. The existing identifiers are `ai.mstrmnd.board` for both platforms. The project intentionally does not invent an Expo project ID or account owner.

## Development client

Install the compatible development client package before building this profile:

```bash
npx expo install expo-dev-client
npx eas-cli@latest build --profile development --platform ios
npx expo start --dev-client
```

The supplied iOS development profile targets a simulator. Use the preview profile for a physical-device installation.

## Web

```bash
npm run export:web
npx serve -s dist
```

Serve the export through HTTP with an SPA fallback to `index.html`. Expo Router needs that fallback for links such as `/sessions` and `/room/<id>`.

## Before wider distribution

This build is a personal app using each user's own Claude key. A managed MSTRMND service would need a server-held provider key, authenticated requests, usage limits, and account/history synchronization. Confirm behavior on real iOS and Android devices, including safe areas, keyboard, haptics, secure storage, accessibility text sizes, and the streamed session lifecycle.

An EAS build, TestFlight upload, App Store submission, or Play release has not been run as part of this delivery.
