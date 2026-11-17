# 90Strong Android build (GitHub Actions)

The whole native build runs in GitHub Actions. You never need Android Studio or a local JDK.

## One-time setup (do this first, in order)

### 1. Generate the upload keystore
1. GitHub.com → **Actions** → **Keystore (one-shot generator)** → **Run workflow** → **Run workflow** button.
2. Wait ~1 minute. Open the finished run.
3. Scroll down to **Artifacts** → download `keystore-bundle`. Unzip it.
4. Save the whole folder somewhere durable (password manager, encrypted drive, etc.).
   **If you lose this you can never update the app on Play after first upload.**

### 2. Add four repo secrets
Repo → **Settings** → **Secrets and variables** → **Actions** → **New repository secret**. Add:

| Name | Value (from the artifact) |
|---|---|
| `KEYSTORE_BASE64` | contents of `KEYSTORE_BASE64.txt` (one long line) |
| `KEYSTORE_PASSWORD` | `storePassword` line of `keystore.properties` |
| `KEY_PASSWORD` | `keyPassword` line of `keystore.properties` |
| `KEY_ALIAS` | `keyAlias` line of `keystore.properties` |

### 3. Delete the generator workflow
Running it again mints a new key and breaks every future update. In a terminal (or GitHub web UI):
```
git rm .github/workflows/keystore-gen.yml
git commit -m "Remove one-shot keystore generator"
git push
```

## Building an AAB for the Play Store

### Easy path (tag a release)
```
git tag v1.0.0
git push --tags
```
This fires **Android build**. ~5 minutes later a GitHub Release appears tagged `v1.0.0` with the signed `.aab` attached. Download it on your phone and upload to Play Console.

### Manual path (test build)
Actions → **Android build** → **Run workflow**. Optionally type a `versionName`. The AAB is attached as a workflow artifact (available 14 days). No Release is created.

## Updating later
Every new upload needs a higher `versionCode` than the previous one. The workflow uses `GITHUB_RUN_NUMBER` for that, so each run auto-increments. `versionName` comes from the tag (`v1.0.0` → `1.0.0`) or the dispatch input.

## Files involved
```
android/                       Capacitor-generated native project (committed)
capacitor.config.ts            App id, name, webDir → ./www/
.github/workflows/
  keystore-gen.yml             One-shot; delete after first use
  android-build.yml            Runs on tag push
ANDROID.md                     This file
```

## Troubleshooting
- **Build fails at "KEYSTORE_BASE64 secret is empty"** — you skipped the secrets setup. Add them, re-run.
- **Play Console says "You've used a signing key that is no longer valid"** — you re-ran the generator. Restore the original keystore from your backup; secrets were overwritten.
- **Gradle out-of-memory** — rare on GitHub's runners. Open an issue and rerun.
