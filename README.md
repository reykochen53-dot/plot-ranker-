# PlotRanker — clean macOS build

This project uses Electron instead of Tauri. That removes Rust, Cargo, icons, and native compilation from the build. GitHub builds a universal macOS DMG for Intel and Apple Silicon.

## What this stable milestone does

- Opens PDF, PNG, JPEG and WebP planning files.
- Treats PDF as professional planning input.
- Searches the locality entered by the user.
- Shows satellite imagery and mapped roundabout candidates.
- Uses two user-confirmed matching points to place, rotate and scale the plan over the map.
- Requires the user to mark actual plot IDs; it never invents IDs or a grid.
- Ranks plots with transparent circulation-based rules.
- Includes procedural music.

## Free GitHub build

1. Create a new **public** GitHub repository.
2. Unzip this project.
3. Open the unzipped folder and upload the items inside it to the repository root.
4. Ensure the repository home directly shows `.github`, `src`, `main.js`, `preload.js`, `package.json`, and `package-lock.json`.
5. Open **Actions**.
6. Open **Build PlotRanker for macOS**.
7. Click **Run workflow**, then the green **Run workflow** button.
8. Wait for the green check.
9. Open the completed run and download **PlotRanker-macOS** under **Artifacts**.
10. Unzip the artifact, open the DMG, and drag PlotRanker to Applications.

The free app is unsigned. On first open, right-click PlotRanker in Applications, choose **Open**, and confirm. If macOS blocks it, use System Settings → Privacy & Security → Open Anyway.
