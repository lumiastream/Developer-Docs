#!/usr/bin/env node
import { writeFileSync, mkdirSync, rmSync, existsSync, readFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const projectRoot = resolve(__dirname, '..');
const alertsDir = resolve(projectRoot, 'docs/alerts');

const lumiaTypesEntry = resolve(projectRoot, 'node_modules/@lumiastream/lumia-types/dist/esm/index.js');
const { LumiaAlertConfigs } = await import(pathToFileURL(lumiaTypesEntry).href);

const enTransPath = resolve(projectRoot, 'node_modules/@lumiapriv/lumia-translations/src/translations/en.translations.json');
const enTrans = JSON.parse(readFileSync(enTransPath, 'utf8'));

const PLATFORM_LABELS = {
	lumiastream: 'Lumia',
	twitch: 'Twitch',
	youtube: 'YouTube',
	kick: 'Kick',
	facebook: 'Facebook',
	tiktok: 'TikTok',
	streamlabs: 'Streamlabs',
	streamelements: 'StreamElements',
	extralife: 'Extra Life',
	donordrive: 'DonorDrive',
	tiltify: 'Tiltify',
	throne: 'Throne',
	patreon: 'Patreon',
	woocommerce: 'WooCommerce',
	kofi: 'Ko-fi',
	tipeeestream: 'TipeeeStream',
	treatstream: 'TreatStream',
	discord: 'Discord',
	obs: 'OBS',
	slobs: 'Streamlabs Desktop',
	pulse: 'Pulse',
	pulsoid: 'Pulsoid',
	hyperate: 'HypeRate',
	paypal: 'PayPal',
	twitter: 'Twitter',
	spotify: 'Spotify',
	nowplaying: 'NowPlaying',
	vlc: 'VLC',
	streamerbot: 'Streamer.bot',
	youtubemusic: 'YouTube Music',
	fourthwall: 'Fourthwall',
	crowdcontrol: 'Crowd Control',
};

const PLATFORM_POSITIONS = {
	twitch: 1,
	youtube: 2,
	kick: 3,
	facebook: 4,
	tiktok: 5,
	lumiastream: 6,
	streamlabs: 7,
	streamelements: 8,
	kofi: 9,
	patreon: 10,
	tiltify: 11,
	extralife: 12,
	donordrive: 13,
	tipeeestream: 14,
	treatstream: 15,
	throne: 16,
	paypal: 17,
	fourthwall: 18,
	woocommerce: 19,
	discord: 20,
	spotify: 21,
	youtubemusic: 22,
	nowplaying: 23,
	vlc: 24,
	streamerbot: 25,
	obs: 26,
	slobs: 27,
	hyperate: 28,
	pulse: 29,
	pulsoid: 30,
	crowdcontrol: 31,
	twitter: 32,
};

function titleCase(value) {
	return String(value ?? '')
		.replace(/([a-z0-9])([A-Z])/g, '$1 $2')
		.replace(/[-_]+/g, ' ')
		.replace(/\s+/g, ' ')
		.trim()
		.replace(/\b\w/g, (c) => c.toUpperCase());
}

function platformLabel(platform) {
	return PLATFORM_LABELS[platform] ?? titleCase(platform);
}

function platformPosition(platform) {
	return PLATFORM_POSITIONS[platform] ?? 99;
}

function stripConnectionPrefix(key, connection) {
	const dash = `${connection}-`;
	if (key.startsWith(dash)) return key.slice(dash.length);
	const camel = connection.charAt(0).toUpperCase() + connection.slice(1);
	const camelPrefix = `${connection}${camel}`;
	if (key.startsWith(camelPrefix)) return key.slice(camelPrefix.length);
	return key;
}

function slugify(value) {
	return String(value)
		.replace(/([a-z0-9])([A-Z])/g, '$1-$2')
		.replace(/_/g, '-')
		.toLowerCase()
		.replace(/[^a-z0-9-]+/g, '-')
		.replace(/-+/g, '-')
		.replace(/^-|-$/g, '');
}

function escapeYamlScalar(value) {
	const str = String(value ?? '');
	if (/[:\-#&*!|>'"%@`{}\[\],?]|^\s|\s$/.test(str)) {
		return `"${str.replace(/\\/g, '\\\\').replace(/"/g, '\\"')}"`;
	}
	return str;
}

function variableName(entry) {
	if (typeof entry === 'string') return entry;
	if (entry && typeof entry === 'object' && typeof entry.name === 'string') return entry.name;
	return '';
}

function variableDescription(entry) {
	const name = variableName(entry);
	if (entry && typeof entry === 'object' && entry.description) return entry.description;
	return enTrans?.variables?.[name] || '';
}

function escapeMdxTokens(value) {
	return String(value ?? '').replace(/\{\{([^}]+)\}\}/g, '`{{$1}}`');
}

function escapeTableCell(value) {
	return escapeMdxTokens(String(value ?? '').replace(/\|/g, '\\|').replace(/\r?\n/g, ' '));
}

function renderVariableTable(variables) {
	const rows = variables
		.map((entry) => {
			const name = variableName(entry);
			if (!name) return null;
			const desc = variableDescription(entry).trim() || 'No description available yet.';
			return `| \`{{${name}}}\` | \`data.extraSettings.${name}\` | ${escapeTableCell(desc)} |`;
		})
		.filter(Boolean);
	if (!rows.length) return '';
	return ['| Template variable | Overlay payload field | Description |', '| --- | --- | --- |', ...rows].join('\n');
}

function buildExamplePayload(alertKey, config, quickAction) {
	const base = {
		alert: alertKey,
		dynamic: { value: quickAction?.dynamic?.value ?? null, ...(quickAction?.dynamic ?? {}) },
		extraSettings: { ...(quickAction?.extraSettings ?? {}) },
	};
	const accepted = Array.isArray(config.acceptedVariables) ? config.acceptedVariables : [];
	for (const entry of accepted) {
		const name = variableName(entry);
		if (!name) continue;
		if (base.extraSettings[name] !== undefined) continue;
		base.extraSettings[name] = '';
	}
	return base;
}

function renderAlertPage({ alertKey, config, platform, sidebarPosition }) {
	const shortName = stripConnectionPrefix(alertKey, platform);
	const title = titleCase(shortName);
	const description =
		(config.eventlistDetailedMessage || config.eventlistMessage || `${platformLabel(platform)} ${title} alert payload reference.`)
			.replace(/[\r\n]+/g, ' ')
			.trim();
	const quickActions = Array.isArray(config.quickActions) ? config.quickActions : [];
	const acceptedVariables = Array.isArray(config.acceptedVariables) ? config.acceptedVariables : [];
	const variationConditions = Array.isArray(config.LumiaVariationConditions) ? config.LumiaVariationConditions : [];

	const id = `alert-${platform}-${slugify(shortName)}`;

	const frontmatter = [
		'---',
		`sidebar_position: ${sidebarPosition}`,
		`id: ${id}`,
		`title: ${escapeYamlScalar(title)}`,
		`description: ${escapeYamlScalar(description)}`,
		'---',
	].join('\n');

	const sections = [];
	sections.push(`# ${title}`);

	const metaLines = [
		`- **Alert key:** \`${alertKey}\``,
		`- **Source:** ${platformLabel(platform)}`,
	];
	if (config.eventlistMessage) metaLines.push(`- **Event list label:** ${escapeMdxTokens(config.eventlistMessage)}`);
	if (config.hasAlertImage) metaLines.push('- **Carries alert image:** yes (`extraSettings.contentImage`)');
	sections.push(metaLines.join('\n'));

	if (config.message) {
		sections.push(['## Default message template', '', '```text', config.message, '```'].join('\n'));
	}

	if (acceptedVariables.length) {
		const table = renderVariableTable(acceptedVariables);
		if (table) {
			sections.push(
				[
					'## Template variables',
					'',
					'Use any of these in alert text, TTS, or chat templates. The same names appear under `data.extraSettings.*` when you subscribe via `Overlay.on(\'alert\')`.',
					'',
					table,
				].join('\n'),
			);
		}
	}

	if (quickActions.length) {
		const blocks = ['## Example payloads', '', 'Each scenario below mirrors what Lumia emits in `Overlay.on(\'alert\', (data) => …)`.'];
		quickActions.forEach((qa, idx) => {
			const label = qa.label || `Example ${idx + 1}`;
			blocks.push('');
			blocks.push(`### ${label}`);
			blocks.push('');
			blocks.push('```json');
			blocks.push(JSON.stringify(buildExamplePayload(alertKey, config, qa), null, 2));
			blocks.push('```');
		});
		sections.push(blocks.join('\n'));
	}

	if (variationConditions.length) {
		const items = variationConditions
			.map((cond) => {
				if (!cond?.type) return null;
				const desc = cond.description ? ` - ${escapeMdxTokens(cond.description)}` : '';
				return `- \`${cond.type}\`${desc}`;
			})
			.filter(Boolean);
		if (items.length) {
			sections.push(['## Variation conditions', '', 'Dimensions you can branch on when configuring alert variations:', '', items.join('\n')].join('\n'));
		}
	}

	sections.push(
		[
			'## Related',
			'',
			'- [Alert Explorer](/docs/display-variables#alert-explorer) - live preview of every alert',
			'- [Overlay Type Definitions](/docs/custom-overlays/types#alertevent) - full `AlertEvent` TypeScript type',
		].join('\n'),
	);

	return `${frontmatter}\n\n${sections.join('\n\n')}\n`;
}

function writeCategory(path, contents) {
	writeFileSync(path, JSON.stringify(contents, null, '\t') + '\n');
}

function renderPlatformIndex(platform, alerts) {
	const lines = [
		'---',
		'sidebar_position: 0',
		`id: alerts-${platform}-index`,
		`title: ${escapeYamlScalar(`${platformLabel(platform)} alerts`)}`,
		`description: ${escapeYamlScalar(`Every alert Lumia emits for ${platformLabel(platform)}.`)}`,
		'---',
		'',
		`# ${platformLabel(platform)} alerts`,
		'',
		`${alerts.length} alert${alerts.length === 1 ? '' : 's'} available. Each page documents the message template, payload fields, and example scenarios.`,
		'',
		'| Alert | Description |',
		'| --- | --- |',
	];
	alerts.forEach(([key, config]) => {
		const short = stripConnectionPrefix(key, platform);
		const title = titleCase(short);
		const desc = (config.eventlistDetailedMessage || config.eventlistMessage || '').replace(/[\r\n]+/g, ' ').trim() || '-';
		lines.push(`| [${title}](./${slugify(short)}.mdx) | ${escapeTableCell(desc)} |`);
	});
	lines.push('');
	return lines.join('\n');
}

function renderRootIndex(platformGroups) {
	const lines = [
		'---',
		'sidebar_position: 0',
		'id: alerts-index',
		'title: Alerts',
		'description: Every alert Lumia emits, grouped by platform. Each alert has its own page with payload examples and template variables.',
		'---',
		'',
		'# Alerts',
		'',
		'Lumia emits one alert per recognised event from every connected integration. Each alert carries a default message template, a typed payload, and a list of template variables you can use in alert text or read directly from `Overlay.on(\'alert\', (data) => …)`.',
		'',
		'Browse by platform below, or open the [Alert Explorer](/docs/display-variables#alert-explorer) for a live, searchable preview.',
		'',
		'| Platform | Alerts |',
		'| --- | --- |',
	];
	const sorted = [...platformGroups.entries()].sort((a, b) => platformPosition(a[0]) - platformPosition(b[0]));
	for (const [platform, alerts] of sorted) {
		lines.push(`| [${platformLabel(platform)}](./${platform}/index.md) | ${alerts.length} |`);
	}
	lines.push('');
	return lines.join('\n');
}

function renderExplorerPage() {
	return [
		'---',
		'sidebar_position: -1',
		'id: alert-explorer',
		'title: Alert Explorer',
		'description: Live, searchable preview of every alert payload Lumia emits. Pick a platform, pick an alert, inspect the exact fields your overlay receives.',
		'---',
		'',
		'import { AllPlatformsAlertExplorer } from "@site/src/components/AlertExplorer";',
		'',
		'# Alert Explorer',
		'',
		"Pick a platform, search for an alert, and inspect the exact payload your overlay receives in `Overlay.on('alert', (data) => …)`. Template variables like `{{username}}` and `{{amount}}` map to the same keys under `data.extraSettings`.",
		'',
		'<AllPlatformsAlertExplorer />',
		'',
	].join('\n');
}

function generate() {
	if (existsSync(alertsDir)) rmSync(alertsDir, { recursive: true });
	mkdirSync(alertsDir, { recursive: true });

	const byPlatform = new Map();
	for (const [key, config] of Object.entries(LumiaAlertConfigs)) {
		if (!config?.connection) continue;
		if (!byPlatform.has(config.connection)) byPlatform.set(config.connection, []);
		byPlatform.get(config.connection).push([key, config]);
	}

	for (const alerts of byPlatform.values()) {
		alerts.sort(([a], [b]) => stripConnectionPrefix(a, '').localeCompare(stripConnectionPrefix(b, '')));
	}

	writeCategory(resolve(alertsDir, '_category_.json'), {
		label: 'Alerts',
		position: 5,
		link: { type: 'doc', id: 'alerts-index' },
	});

	writeFileSync(resolve(alertsDir, 'index.md'), renderRootIndex(byPlatform));
	writeFileSync(resolve(alertsDir, 'explorer.mdx'), renderExplorerPage());

	let alertCount = 0;
	for (const [platform, alerts] of byPlatform) {
		const platformDir = resolve(alertsDir, platform);
		mkdirSync(platformDir, { recursive: true });

		writeCategory(resolve(platformDir, '_category_.json'), {
			label: platformLabel(platform),
			position: platformPosition(platform),
			link: { type: 'doc', id: `alerts-${platform}-index` },
		});

		writeFileSync(resolve(platformDir, 'index.md'), renderPlatformIndex(platform, alerts));

		alerts.forEach(([alertKey, config], idx) => {
			const short = stripConnectionPrefix(alertKey, platform);
			const fileName = `${slugify(short)}.mdx`;
			writeFileSync(
				resolve(platformDir, fileName),
				renderAlertPage({ alertKey, config, platform, sidebarPosition: idx + 1 }),
			);
			alertCount += 1;
		});
	}

	console.log(`generate-alert-pages: wrote ${alertCount} alert page${alertCount === 1 ? '' : 's'} across ${byPlatform.size} platform${byPlatform.size === 1 ? '' : 's'} to ${alertsDir}`);
}

generate();
