---
sidebar_position: 14
title: "Sound Match Trigger Example"
---

<!-- GENERATED: sdk-example-doc -->

Source: https://github.com/lumiastream/Plugin-SDK/tree/main/examples/sound_match_trigger

Upload a reference sound, listen to live audio, and trigger Lumia alerts when that sound is detected.

## Quick Stats

| Key | Value |
| --- | --- |
| Folder | `examples/sound_match_trigger` |
| Plugin ID | `sound_match_trigger` |
| Category | `audio` |
| Lumia Version | `^9.0.0` |
| Settings | 12 |
| Actions | 4 |
| Variables | 6 |
| Alerts | 1 |

## Key Files

- `manifest.json`
- `main.js`
- `package.json`
- `README.md`
- `actions_tutorial.md`
- `settings_tutorial.md`

## README

This plugin lets users upload a reference sound and trigger a Lumia alert when live audio matches it.

## Requirements

- FFmpeg installed and reachable by `ffmpeg` (or provide a full path in settings).
- A short reference audio clip (distinctive clips produce better matching).

## Recommended workflow

1. Run **List Capture Devices** and copy a device name/index if needed.
2. Set **Reference Audio File**.
3. Start with threshold `0.82` and cooldown `3000 ms`.
4. Enable **Log Similarity Scores** briefly while tuning.

## Notes

- Windows is the primary target:
  - mic/input uses `dshow`
  - output/loopback uses `wasapi`
- macOS/Linux are supported with FFmpeg backends (`avfoundation` / `pulse`) but may require device-specific setup.
