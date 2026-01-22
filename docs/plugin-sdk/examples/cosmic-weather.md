---
sidebar_position: 4
title: Weather
---

Source: https://github.com/lumiastream/Plugin-SDK/tree/main/examples/cosmic_weather

A sample Lumia Stream plugin bundled with the SDK examples. It demonstrates how to require multiple npm packages from inside a plugin:

- [`axios`](https://www.npmjs.com/package/axios) for HTTP requests
- [`luxon`](https://www.npmjs.com/package/luxon) for time formatting
- [`color`](https://www.npmjs.com/package/color) for palette generation
- [`unique-names-generator`](https://www.npmjs.com/package/unique-names-generator) for playful AI-like verbiage

The plugin fetches live weather data from the free [Open-Meteo](https://open-meteo.com/) APIs, remixes the response with synthwave-inspired copy, and emits a Lumia alert packed with neon-friendly metadata.

## Getting Started

```bash
cd examples/cosmic_weather
npm install
zip -r weather.lumiaplugin .
```

Install the resulting `weather.lumiaplugin` with the Lumia Stream plugin manager. After installation, open the **Weather** connection, enter a city, optionally add the state/region to disambiguate, and enable the recurring interval if you want automatic updates.

Trigger the included "Trigger Forecast" action to broadcast a fresh neon forecast on demand. The action accepts both city and state inputs as well.

## Notes

- The example intentionally keeps dependencies unbundled so the runtime can exercise nested `node_modules/` lookups.
- No API key is required. The sample uses the open endpoints for geocoding and current conditions.
- Feel free to swap dependencies or enhance the visuals to experiment with the plugin sandbox.
