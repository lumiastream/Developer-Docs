---
sidebar_position: 6
title: Lumia Plugin GPT
description: Use the Lumia Plugin GPT to plan, build, and validate Lumia Stream plugins.
---

# Lumia Plugin GPT

Use the official Lumia Plugin GPT to plan, build, and validate Lumia Stream plugins directly in ChatGPT:

https://chatgpt.com/g/g-6908e861c7f88191819187b9f5fbcfd7-lumia-plugin-gpt

## What it is

The Lumia Plugin GPT is a guided assistant that helps you:

- Brainstorm plugin ideas and requirements.
- Design `manifest.json` files that match the SDK schema.
- Generate TypeScript or JavaScript plugin code.
- Validate your plugin structure and common pitfalls.

## How to use it

1. Open the GPT link above.
2. Start with a short description of your plugin idea and target platform.
3. Share any constraints (Lumia version, auth method, APIs you need).
4. Ask it to produce a manifest and a starter `src/main.ts` file.
5. Iterate by pasting your work back for review and validation.

## Tips

- Include real API responses or sample payloads when you have them.
- Ask for both a minimal version and a production-ready version.
- Validate your finished plugin with `npx lumia-plugin validate`.
