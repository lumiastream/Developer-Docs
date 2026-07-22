---
sidebar_position: 21
title: "X Example"
---

<!-- GENERATED: sdk-example-doc -->

Source: https://github.com/lumiastream/Plugin-SDK/tree/main/examples/x

Create and delete X posts with your own developer tokens, sync account variables, and trigger polling-based alerts for mentions and follower growth.

## Quick Stats

| Key | Value |
| --- | --- |
| Folder | `examples/x` |
| Plugin ID | `x` |
| Category | `platforms` |
| Lumia Version | `^9.0.0` |
| Settings | 11 |
| Actions | 6 |
| Variables | 21 |
| Alerts | 3 |

## Key Files

- `manifest.json`
- `main.js`
- `package.json`
- `README.md`
- `actions_tutorial.md`
- `settings_tutorial.md`

## README

This example plugin adds a token-based X integration to Lumia Stream.

## Included

- Create text, reply, quote, image, and video posts with one optional media attachment
- Delete a specific post or the most recent post created by the plugin
- Like, unlike, repost, undo repost, follow, and unfollow actions
- Polling-backed variables for account metrics, latest post, and latest mention
- Alerts for created posts, mentions, and follower growth

## Authentication

The plugin expects the classic four-token X app flow:

- Consumer Key
- Consumer Secret
- Access Token
- Access Token Secret

See [settings_tutorial.md](https://github.com/lumiastream/Plugin-SDK/tree/main/examples/x/settings_tutorial.md) for the setup steps.
