---
sidebar_position: 10
title: "Showcase Plugin Example"
---

<!-- GENERATED: sdk-example-doc -->

Source: https://github.com/lumiastream/Plugin-SDK/tree/main/examples/base_plugin

Starter template that demonstrates settings, actions, variables, and alerts with a minimal code path.

## Quick Stats

| Key | Value |
| --- | --- |
| Folder | `examples/base_plugin` |
| Plugin ID | `showcase_plugin` |
| Category | `apps` |
| Lumia Version | `^9.0.0` |
| Settings | 3 |
| Actions | 1 |
| Variables | 4 |
| Alerts | 1 |

## Key Files

- `manifest.json`
- `main.js`
- `package.json`
- `README.md`

## README

This template demonstrates a minimal, production-friendly Lumia Stream plugin workflow:

- Defines a small set of settings with a short setup tutorial
- Exposes a single action that triggers an alert
- Updates a few variables that alerts and other Lumia features can use
- Keeps logging to errors only

Use the CLI to copy and customize the template:

```
npx lumia-plugin create my_plugin
```

After scaffolding you can tailor the manifest, code, and README to match your idea.
