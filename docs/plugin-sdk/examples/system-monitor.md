---
sidebar_position: 17
title: "System Monitor Example"
---

<!-- GENERATED: sdk-example-doc -->

Source: https://github.com/lumiastream/Plugin-SDK/tree/main/examples/system_monitor

Monitor CPU, RAM, and GPU usage with variables and alerts.

## Quick Stats

| Key | Value |
| --- | --- |
| Folder | `examples/system_monitor` |
| Plugin ID | `system_monitor` |
| Category | `utilities` |
| Lumia Version | `^9.0.0` |
| Settings | 7 |
| Actions | 0 |
| Variables | 9 |
| Alerts | 3 |

## Key Files

- `manifest.json`
- `main.js`
- `package.json`
- `README.md`

## README

Monitors CPU, RAM, and GPU usage (when available) and exposes variables and alerts.

## Variables
- `cpu_usage`, `cpu_bucket`
- `ram_usage`, `ram_bucket`, `ram_used_mb`, `ram_total_mb`
- `gpu_available`, `gpu_usage`, `gpu_bucket`

## Alerts
- `cpu_alert` (warning/critical variations)
- `ram_alert` (warning/critical variations)
- `gpu_alert` (warning/critical variations)

Alerts only fire when entering a new bucket (normal -> warning -> critical).

## Notes
- GPU usage depends on OS and driver support. If not available, `gpu_available` is false and no GPU alert fires.
