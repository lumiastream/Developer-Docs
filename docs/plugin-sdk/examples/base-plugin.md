---
sidebar_position: 1
title: Showcase Plugin Template
---

Source: https://github.com/lumiastream/Plugin-SDK/tree/main/examples/base_plugin

This template demonstrates a handful of common Lumia Stream plugin capabilities:

- Logs lifecycle events and recent actions
- Stores and updates variables that other Lumia features can consume
- Responds to custom actions for logging, variable updates, and alert triggering
- Triggers a sample alert effect using configurable colors and duration
- Shows how to react to setting changes inside `onsettingsupdate`

Use the CLI to copy and customise the template:

```
npx lumia-plugin create my_plugin
```

After scaffolding you can tailor the manifest, code, and README to match your idea.
