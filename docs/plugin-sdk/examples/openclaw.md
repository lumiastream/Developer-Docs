---
sidebar_position: 7
title: "OpenClaw Example"
---

<!-- GENERATED: sdk-example-doc -->

Source: https://github.com/lumiastream/Plugin-SDK/tree/main/examples/openclaw

Send prompts to an OpenClaw Gateway and use responses in Lumia templates via {{openclaw_prompt}} and related helpers.

## Quick Stats

| Key | Value |
| --- | --- |
| Folder | `examples/openclaw` |
| Plugin ID | `openclaw` |
| Category | `apps` |
| Lumia Version | `^9.0.0` |
| Settings | 4 |
| Actions | 0 |
| Variables | 0 |
| Alerts | 0 |

## Key Files

- `manifest.json`
- `main.js`
- `package.json`
- `README.md`
- `settings_tutorial.md`

## README

This plugin is agent-first.

## How Routing Works

- The plugin sends OpenClaw requests using an agent route in the request `model` field:
  - `openclaw:<agentId>`
- The plugin can also send `x-openclaw-agent-id` header from `Default Agent ID`.
- OpenClaw resolves the actual provider model through that agent's config.

## Agent vs Model Correlation

- In this plugin:
  - `agent` (or route) is what you pick in Lumia.
  - `model` in the API payload is the agent route (for OpenClaw routing).
- In OpenClaw config:
  - agents map to real LLM models (for example `openai/gpt-5-mini`).
  - changing an agent's model changes what that route uses.

### Example Mapping

- Lumia `Default Agent ID`: `main`
- OpenClaw agent `main` -> provider model `openai/gpt-5-mini`
- Result: prompts route to `main`, and `main` decides the real model.

## What To Change When You Want A Different LLM

- If you want a different LLM for the same route:
  - change the model behind that agent in OpenClaw config.
- If you want quick switching:
  - create multiple agents in OpenClaw (for example `main`, `research`, `fast`)
  - set `Known Agent IDs` in the plugin (comma-separated).
  - pick route per prompt: `{{openclaw_prompt=hello|thread|research}}`

## Prompt Override Syntax

- `{{openclaw_prompt=message|thread|agent}}`
- Third argument can be:
  - `main` (agent id)
  - `openclaw:main` (full route)

Both normalize to the same route for requests.
