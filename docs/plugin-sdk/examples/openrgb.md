---
sidebar_position: 8
title: "OpenRGB Example"
---

<!-- GENERATED: sdk-example-doc -->

Source: https://github.com/lumiastream/Plugin-SDK/tree/main/examples/openrgb

Control OpenRGB devices as Lumia lights and trigger OpenRGB profile actions (Corsair, Razer, ASUS, MSI, Gigabyte, ASRock, NZXT, SteelSeries, Logitech, HyperX, Cooler Master, and more).

## Quick Stats

| Key | Value |
| --- | --- |
| Folder | `examples/openrgb` |
| Plugin ID | `openrgb` |
| Category | `lights` |
| Lumia Version | `^9.0.0` |
| Settings | 2 |
| Actions | 2 |
| Variables | 0 |
| Alerts | 0 |

## Key Files

- `manifest.json`
- `main.js`
- `package.json`
- `README.md`
- `actions_tutorial.md`
- `settings_tutorial.md`

## README

Use OpenRGB devices as Lumia Stream lights through the OpenRGB SDK server.

## Features

- Discovers OpenRGB controllers and exposes them as selectable Lumia lights.
- Handles Lumia light updates (`onLightChange`) for real-time color/power/brightness control.
- Applies software fade transitions when Lumia sends a `transition` value.
- Exposes per-device OpenRGB modes as Studio Theme options.
- Provides actions for:
  - Loading/saving OpenRGB profiles

## Setup

1. Open OpenRGB and enable the SDK server.
2. In Lumia plugin settings, set host/port (default `127.0.0.1:6742`).
3. Activate plugin. The plugin always runs startup discovery automatically.
4. Optionally click **Discover OpenRGB Devices** in auth to refresh manually.
5. Select discovered devices in the light list.

## Notes

- This plugin writes per-LED colors through the OpenRGB SDK protocol.
- Live light color updates are sent fire-and-forget (no request timeout waiting).
- Discovery/auth calls use a fixed 4000ms timeout.
- SDK client name is fixed to `Lumia Stream`.
- Turning power off writes black to all LEDs for targeted devices.
- If discovery does not return a device, manual add accepts a controller ID.
- Controller ID is the zero-based index in OpenRGB's Devices list order (first device is `0`, second is `1`, etc.).
