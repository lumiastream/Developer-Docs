---
sidebar_position: 2
title: Rumble Livestream Plugin (Example)
---

Source: https://github.com/lumiastream/Plugin-SDK/tree/main/examples/rumble

An opinionated Lumia Stream plugin that polls the Rumble livestream API and surfaces live viewers, chat activity, rumbles, rants, followers, likes, dislikes, subs, and stream metadata directly into Lumia variables and alerts.

The example is written in plain JavaScript so you can copy the files directly into `~/Documents/LumiaStream/Plugins/<your_plugin_id>` (or use **Load from Directory** inside Lumia Stream) without running a build step.

## Files

```
examples/rumble/
|-- assets/                 # Icon and screenshot assets referenced by the manifest
|-- main.js                 # Plugin implementation (CommonJS module)
|-- manifest.json           # Plugin metadata and configuration definition
|-- package.json            # Optional: declares the SDK dependency when you `npm install`
`-- README.md
```

## Quick Copy/Paste Instructions

1. Create a new folder for your plugin (for example `~/Documents/LumiaStream/Plugins/rumble`).
2. Copy `manifest.json`, `main.js`, and the `assets/` directory from this example into that folder.
3. (Optional) copy `package.json` if you want to track dependencies - then run `npm install` to pull in `@lumiastream/plugin`.
4. Launch Lumia Stream and load the plugin from the directory (or restart if you copied into the plugins folder).
5. Open the plugin settings and paste your Rumble livestream API key. A valid key looks like `https://rumble.com/-livestream-api/get-data?key=YOUR_KEY` (copy the value after `key=`).

The plugin will begin polling every 30 seconds by default and will log activity in the Lumia console.

## Highlights

- Built with the `@lumiastream/plugin` runtime `Plugin` base class
- Tracks a rich set of variables including viewers, chat members, followers, likes, dislikes, subs, rumbles, rants, thumbnails, URLs, and timestamps
- Raises alerts for stream lifecycle events plus follower, rant, like/dislike, sub, and sub gift changes
- Demonstrates manual actions (`manual_poll`, `manual_alert`) that can be triggered from the Lumia UI

## Variables at a Glance

The plugin keeps the following Lumia variables updated (see `manifest.json` for full descriptions):

- `live`, `viewers`, `joined`
- `rumbles`, `rants`, `rant_amount`
- `chat_members`, `followers`, `likes`, `dislikes`, `subs`, `sub_gifts`
- `title`, `thumbnail`, `stream_url`, `video_id`
- `channel_name`, `channel_image`, `category`, `language`
- `started_at`, `scheduled_start`, `last_polled`

## Alert Triggers

Alerts fire automatically for:

- Stream start / end (`rumble-streamStarted`, `rumble-streamEnded`)
- Follower gains (`rumble-follower`)
- Rants (with amount raised) (`rumble-rant`)
- Likes (`rumble-like`) and dislikes (`rumble-dislike`)
- New subs (`rumble-sub`) and gifted subs (`rumble-subGift`)

## Customising

- Tweak the polling cadence via the `pollInterval` setting (10-300 seconds). The plugin normalises milliseconds as well.
- Adjust detection details (for example `RANT_AMOUNT_EPSILON`) or extend alert payloads by editing `check*` helpers in `main.js`.
- Add more custom variables or alerts to match your channel's workflow - the code is intentionally straightforward to modify.

## TypeScript Version?

If you prefer TypeScript, start from this JavaScript version and rename `main.js` to `main.ts`. Add a local `tsconfig.json` such as:

```json
{
	"compilerOptions": {
		"target": "ES2020",
		"module": "CommonJS",
		"strict": true,
		"esModuleInterop": true,
		"skipLibCheck": true,
		"outDir": "dist",
		"rootDir": "."
	},
	"include": ["main.ts"]
}
```

Compile with `npx tsc` and point `manifest.json` at the emitted `dist/main.js` file (or copy the compiled file into the plugin root). Keeping the TypeScript config beside the file avoids any `../../tsconfig.json` references, so the project still copies cleanly.

MIT License
