// -----------------------------------------------------------------------------
//  Lumia Stream - Custom Overlay typings
// -----------------------------------------------------------------------------

export enum CustomTabs {
	HTML = 'html',
	JS = 'js',
	CSS = 'css',
	CONFIGS = 'configs',
	DATA = 'data',
}

// Configs field types for the configs tab
export enum ConfigsFieldType {
	INPUT = 'input',
	NUMBER = 'number',
	// IMAGE = 'image',
	CHECKBOX = 'checkbox',
	DROPDOWN = 'dropdown',
	MULTISELECT = 'multiselect',
	COLORPICKER = 'colorpicker',
}

// Core discriminant for overlay events
export type OverlayListener =
	| 'chat'
	| 'alert'
	| 'hfx'
	| 'virtuallight'
	| 'overlaycontent';

// chat
export interface ChatEvent {
	origin: string; // "twitch" | "kick" | youtube | tiktok | etc.
	id: string;
	username: string;
	displayname: string;
	channel: string; // "channel"
	avatar: string;  // URL
	message: string;
	color: string;   // hex, e.g. "#00FF7F"
	badges: string[];        // badge image URLs
	badgesRaw: string;       // "broadcaster/1,sub/12,vip/1"
	emotesRaw: string;
	emotesPack: Record<string, unknown>;
	reply: unknown | null;
	lumiauserlevels: number[];
	userLevels: {
		isSelf: boolean;
		mod: boolean;
		vip: boolean;
		tier3: boolean;
		tier2: boolean;
		subscriber: boolean;
		regular: boolean;
		follower: boolean;
		anyone: boolean;
	};
}

// alert
export interface AlertEvent {
	alert: string;
	dynamic: { value: number | string };
	extraSettings: {
		username: string;
		displayname: string;
		userId: number;
		avatar: string | null;
		timestamp: string;
		site: string; // "kick" | "twitch" | "youtube" | "tiktok" | etc.
		checkTimingType: boolean;
		timingType: string;
		duration: number;
	};
	fromLumia: boolean;
}

// hfx
export interface HfxEvent {
	listener: 'hfx';
	data: {
		layer: string;
		content: string;   // asset UUID
		command: string;
		origin: string;    // "hudfx" | "command"
		playAudio: boolean;
		volume: number;    // 0-1
		duration: number;  // ms
		username: string;
		message: string;
		avatar: string;    // URL
		commandDuration: number; // ms, usually same as duration
	};
}

// virtuallight
export interface VirtualLightEvent {
	uuid: string;
	brightness: number;                 // 0-100
	color: { r: number; g: number; b: number };
	transition: number;                 // ms
	delay: number;                      // ms
	duration: number;                   // ms
}

// overlaycontent
export interface CustomOverlayContentEvent {
	codeId: string;
	content: string;        // arbitrary JSON/string payload intended for this overlay
}

// Union & helpers
export type OverlayEvent =
	| ChatEvent
	| AlertEvent
	| HfxEvent
	| VirtualLightEvent
	| CustomOverlayContentEvent;

// Convenience alias for a fully-typed event listener.
export type OverlayEventHandler = (ev: CustomEvent<OverlayEvent>) => void;

// Overlay Typings for custom overlays (window.Overlay)
export interface Overlay {
	on: (event: OverlayListener, handler: OverlayEventHandler) => void;
	callCommand: (command: string, extraSettings?: Record<string, string | number>) => void;
	setVariable: (variable: string, value: string) => void;
	saveStorage: (key: string, value: string) => void;
	getStorage: (key: string) => string;
	removeStorage: (key: string) => void;
}
