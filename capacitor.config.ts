import type { CapacitorConfig } from '@capacitor/cli';

// Capacitor packages the web assets from `webDir` into the native app.
// Our build.js writes the compiled index.html, app.js, sw.js, manifest.json, privacy.html
// and icons into ./www/ so Capacitor has a dedicated folder (Capacitor rejects "." as webDir).
// GitHub Pages continues to serve the same files from the repo root — this is strictly an
// extra output location for the native build.
const config: CapacitorConfig = {
  appId: 'com.pellas.ninetystrong',
  appName: '90Strong',
  webDir: 'www',
  android: {
    // Allow http for local dev reloads; production bundles file:// so this is harmless.
    allowMixedContent: false
  }
};

export default config;
