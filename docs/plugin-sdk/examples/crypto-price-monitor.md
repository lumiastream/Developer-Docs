---
sidebar_position: 2
title: "Crypto Price Monitor Example"
---

<!-- GENERATED: sdk-example-doc -->

Source: https://github.com/lumiastream/Plugin-SDK/tree/main/examples/crypto_price_monitor

Monitor CoinGecko cryptocurrency prices and trigger Lumia alerts when prices change or configured target rules are met.

## Quick Stats

| Key | Value |
| --- | --- |
| Folder | `examples/crypto_price_monitor` |
| Plugin ID | `crypto_price_monitor` |
| Category | `utilities` |
| Lumia Version | `^9.0.0` |
| Settings | 5 |
| Actions | 0 |
| Variables | 11 |
| Alerts | 2 |

## Key Files

- `manifest.json`
- `main.js`
- `package.json`
- `README.md`

## README

Monitor CoinGecko prices from a Lumia Stream plugin.

The plugin polls configured CoinGecko coin IDs, stores the latest price values as Lumia variables, and triggers alerts when prices change or when optional target rules are met.

## Settings

- `coins`: CoinGecko coin IDs to monitor, for example `bitcoin` or `ethereum`.
- `currency`: CoinGecko `vs_currency`, for example `usd`.
- `pollIntervalSec`: Polling interval in seconds.
- `triggerOnInitialPrice`: Whether the first successful price read should emit alerts.
- `targetRules`: Optional JSON threshold rules.

## Target Rules

Rules are configured as JSON:

```json
[
  {
    "name": "Bitcoin above 100000 USD",
    "coin": "bitcoin",
    "condition": "greaterThanOrEqualTo",
    "target": 100000,
    "occurrence": "repeat",
    "enabled": true
  }
]
```

Supported `condition` values are `greaterThanOrEqualTo` and `lessThanOrEqualTo`.
Supported `occurrence` values are `once`, `repeat`, and `always`.
