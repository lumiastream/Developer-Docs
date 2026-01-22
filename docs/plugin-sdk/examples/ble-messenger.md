---
sidebar_position: 5
title: BLE Messenger Plugin
---

Source: https://github.com/lumiastream/Plugin-SDK/tree/main/examples/ble_messenger

A Lumia Stream plugin that connects to a Bluetooth Low Energy (BLE) peripheral and writes payloads to a configurable characteristic.

## Requirements

- Node.js 18+
- [`@abandonware/noble`](https://www.npmjs.com/package/@abandonware/noble) installed locally (native drivers/services for your platform may also be required)
- The BLE peripheral must expose a writable characteristic

Install dependencies inside the plugin folder:

```bash
npm install
```

On macOS you may also need to grant Bluetooth permissions to the Lumia Stream app.

## Configuration

1. Enter the **Service UUID** and **Characteristic UUID** that should be used when connecting.
2. Provide either the **Device Name** or **Device Address (MAC)** so the plugin can match the correct peripheral.
3. Choose the default payload encoding (`UTF-8`, `Hex`, or `Base64`) and optional line ending handling.
4. Enable **Auto Connect** / **Auto Reconnect** if you want the plugin to maintain the connection automatically.
5. Adjust scan timeout, retry delay, and queue size to fit your setup.

The plugin keeps two Lumia variables updated:

- `ble_status` - text description of the current connection state.
- `ble_last_message` - the last successfully transmitted message (raw text before encoding).

## Available Actions

- **Connect** - start scanning using the configured filters.
- **Disconnect** - stop scanning and close the active connection.
- **Send Message** - transmit a payload to the BLE characteristic. The action fields can override encoding, apply a specific line ending, and choose whether to queue the payload when the device is offline.

Queued payloads are flushed automatically once the BLE device reconnects. Set the queue size to `0` if you prefer actions to fail immediately when the device is offline.

## Notes

- The plugin falls back to write-without-response when the target characteristic does not support the requested write mode.
- Scanning and reconnect attempts automatically stop when the plugin is disabled.
- For debugging, enable **Verbose Logging** in the settings to print additional adapter state transitions.

