// -----------------------------------------------------------------------------
//  Lumia Stream - Custom Overlay typings
// -----------------------------------------------------------------------------

export enum CustomTabs {
	HTML = "html",
	JS = "js",
	CSS = "css",
	CONFIGS = "configs",
	DATA = "data",
}

// Configs field types for the configs tab
export enum ConfigsFieldType {
	INPUT = "input",
	NUMBER = "number",
	// IMAGE = 'image',
	CHECKBOX = "checkbox",
	DROPDOWN = "dropdown",
	MULTISELECT = "multiselect",
	COLORPICKER = "colorpicker",
}

// Core discriminant for overlay events
export type OverlayListener =
	| "chat"
	| "alert"
	| "hfx"
	| "virtuallight"
	| "overlaycontent";

// chat
export interface ChatEvent {
	origin: string; // "twitch" | "kick" | youtube | tiktok | etc.
	id: string;
	username: string;
	displayname: string;
	channel: string; // "channel"
	avatar: string; // URL
	message: string;
	color: string; // hex, e.g. "#00FF7F"
	badges: string[]; // badge image URLs
	badgesRaw: string; // "broadcaster/1,sub/12,vip/1"
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
	alert: LumiaAlertValues;
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
	layer: string;
	content: string; // asset UUID
	command: string;
	origin: string; // "hudfx" | "command"
	playAudio: boolean;
	volume: number; // 0-1
	duration: number; // ms
	username: string;
	message: string;
	avatar: string; // URL
	commandDuration: number; // ms, usually same as duration
}

// virtuallight
export interface VirtualLightEvent {
	uuid: string;
	brightness: number; // 0-100
	color: { r: number; g: number; b: number };
	power?: boolean; // true if the light is on, false if it's off
	transition: number; // ms
	delay: number; // ms
	duration: number; // ms
}

// overlaycontent
export interface CustomOverlayContentEvent {
	codeId: string;
	content: string; // arbitrary JSON/string payload intended for this overlay
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
	callCommand: (
		command: string,
		extraSettings?: Record<string, string | number>
	) => void;
	setVariable: (variable: string, value: unknown) => void;
	getVariable: (variable: string) => unknown;
	saveStorage: (key: string, value: string) => void;
	getStorage: (key: string) => string;
	removeStorage: (key: string) => void;
}

// AlertEvent data.alert values
export enum LumiaAlertValues {
	LUMIASTREAM_DONATION = "lumiastream-donation",
	LUMIASTREAM_LUMIA_OPENED = "lumiastream-lumiaOpened",
	LUMIASTREAM_LUMIA_CLOSED = "lumiastream-lumiaClosed",
	LUMIASTREAM_STREAMMODE_ON = "lumiastream-streammodeOn",
	LUMIASTREAM_STREAMMODE_OFF = "lumiastream-streammodeOff",
	LUMIASTREAM_RAFFLE_START = "lumiastream-raffleStart",
	LUMIASTREAM_RAFFLE_STOP = "lumiastream-raffleStop",
	LUMIASTREAM_RAFFLE_WINNER = "lumiastream-raffleWinner",
	LUMIASTREAM_SPINWHEEL_WINNER = "lumiastream-spinwheelWinner",
	LUMIASTREAM_POLL_STARTED = "lumiastream-pollStarted",
	LUMIASTREAM_POLL_PROGRESSED = "lumiastream-pollProgressed",
	LUMIASTREAM_POLL_ENDED = "lumiastream-pollEnded",
	LUMIASTREAM_VIEWERQUEUE_STARTED = "lumiastream-viewerqueueStarted",
	LUMIASTREAM_VIEWERQUEUE_ENDED = "lumiastream-viewerqueueEnded",
	LUMIASTREAM_ROULETTE_WINNER = "lumiastream-rouletteWinner",
	LUMIASTREAM_SLOTS_WINNER = "lumiastream-slotsWinner",
	TWITCH_EXTENSION = "twitch-extension",
	TWITCH_POINTS = "twitch-points",
	TWITCH_STREAM_LIVE = "twitch-streamLive",
	TWITCH_STREAM_OFFLINE = "twitch-streamOffline",
	TWITCH_FIRST_CHATTER = "twitch-firstChatter",
	TWITCH_ENTRANCE = "twitch-entrance",
	TWITCH_FOLLOWER = "twitch-follower",
	TWITCH_SUBSCRIBER = "twitch-subscriber",
	TWITCH_GIFT_SUBSCRIPTION = "twitch-giftSubscription",
	TWITCH_RAID = "twitch-raid",
	TWITCH_BITS = "twitch-bits",
	TWITCH_REDEMPTION = "twitch-redemption",
	TWITCH_HYPETRAIN_STARTED = "twitch-hypetrainStarted",
	TWITCH_HYPETRAIN_PROGRESSED = "twitch-hypetrainProgressed",
	TWITCH_HYPETRAIN_LEVEL_PROGRESSED = "twitch-hypetrainLevelProgressed",
	TWITCH_HYPETRAIN_ENDED = "twitch-hypetrainEnded",
	TWITCH_POLL_STARTED = "twitch-pollStarted",
	TWITCH_POLL_PROGRESSED = "twitch-pollProgressed",
	TWITCH_POLL_ENDED = "twitch-pollEnded",
	TWITCH_PREDICTION_STARTED = "twitch-predictionStarted",
	TWITCH_PREDICTION_PROGRESSED = "twitch-predictionProgressed",
	TWITCH_PREDICTION_LOCKED = "twitch-predictionLocked",
	TWITCH_PREDICTION_ENDED = "twitch-predictionEnded",
	TWITCH_GOAL_STARTED = "twitch-goalStarted",
	TWITCH_GOAL_PROGRESSED = "twitch-goalProgressed",
	TWITCH_GOAL_ENDED = "twitch-goalEnded",
	TWITCH_CHARITY_DONATION = "twitch-charityDonation",
	TWITCH_CHARITY_CAMPAIGN_STARTED = "twitch-charityCampaignStarted",
	TWITCH_CHARITY_CAMPAIGN_PROGRESSED = "twitch-charityCampaignProgressed",
	TWITCH_CHARITY_CAMPAIGN_STOPPED = "twitch-charityCampaignStopped",
	TWITCH_CATEGORY = "twitch-categoryChanged",
	TWITCH_CLIP = "twitch-clip",
	TWITCH_CHANNEL_JOIN = "twitch-channelJoin",
	TWITCH_CHANNEL_LEAVE = "twitch-channelLeave",
	TWITCH_BANNED = "twitch-banned",
	TWITCH_TIMEOUT = "twitch-timeout",
	TWITCH_TIMEOUT_OVER = "twitch-timeoutOver",
	TWITCH_SHOUTOUT_RECEIVE = "twitch-shoutoutReceive",
	TWITCH_AD_STARTED = "twitch-adStarted",
	TWITCH_AD_STOPPED = "twitch-adStopped",
	TWITCH_POWERUPS = "twitch-powerups",
	TWITCH_POWERUPS_POINTS = "twitch-powerups-points",
	YOUTUBE_STREAM_LIVE = "youtube-streamLive",
	YOUTUBE_STREAM_OFFLINE = "youtube-streamOffline",
	YOUTUBE_FIRST_CHATTER = "youtube-firstChatter",
	YOUTUBE_ENTRANCE = "youtube-entrance",
	YOUTUBE_MEMBER = "youtube-member",
	YOUTUBE_SUBSCRIBER = "youtube-subscriber",
	YOUTUBE_SUPERCHAT = "youtube-superchat",
	YOUTUBE_SUPERSTICKER = "youtube-supersticker",
	FACEBOOK_STREAM_LIVE = "facebook-streamLive",
	FACEBOOK_STREAM_OFFLINE = "facebook-streamOffline",
	FACEBOOK_FIRST_CHATTER = "facebook-firstChatter",
	FACEBOOK_ENTRANCE = "facebook-entrance",
	FACEBOOK_FOLLOWER = "facebook-follower",
	FACEBOOK_REACTION = "facebook-reaction",
	FACEBOOK_STAR = "facebook-star",
	FACEBOOK_SUPPORT = "facebook-support",
	FACEBOOK_GIFT_SUBSCRIPTION = "facebook-subscriptionGift",
	FACEBOOK_SHARE = "facebook-share",
	FACEBOOK_FAN = "facebook-fan",
	TROVO_STREAM_LIVE = "trovo-streamLive",
	TROVO_STREAM_OFFLINE = "trovo-streamOffline",
	TROVO_FIRST_CHATTER = "trovo-firstChatter",
	TROVO_ENTRANCE = "trovo-entrance",
	TROVO_CHANNEL_JOIN = "trovo-channelJoin",
	TROVO_SUBSCRIBER = "trovo-subscriber", // potential for Trovo, needs testing in POC
	TROVO_FOLLOWER = "trovo-follower", // potential for Trovo, needs testing in POC
	TROVO_SPELL = "trovo-spell", // potential for Trovo, needs testing in POC
	TROVO_GIFT_SUBSCRIPTION = "trovo-giftSubscription",
	TROVO_RAID = "trovo-raid",
	TIKTOK_FIRST_CHATTER = "tiktok-firstChatter",
	TIKTOK_ENTRANCE = "tiktok-entrance",
	TIKTOK_FOLLOWER = "tiktok-follower",
	TIKTOK_LIKE = "tiktok-like",
	TIKTOK_GIFT = "tiktok-gift",
	TIKTOK_SUBSCRIBER = "tiktok-subscriber",
	TIKTOK_SHARE = "tiktok-share",
	TIKTOK_STREAM_END = "tiktok-streamEnd",
	TIKTOK_NEW_VIDEO = "tiktok-newVideo",
	KICK_POINTS = "kick-points",
	KICK_FIRST_CHATTER = "kick-firstChatter",
	KICK_ENTRANCE = "kick-entrance",
	KICK_FOLLOWER = "kick-follower",
	KICK_SUBSCRIBER = "kick-subscriber",
	KICK_GIFT_SUBSCRIPTION = "kick-subscriptionGift",
	KICK_HOST = "kick-host",
	KICK_BANNED = "kick-banned",
	KICK_UNBANNED = "kick-unbanned",
	DISCORD_FIRST_CHATTER = "discord-firstChatter",
	DISCORD_ENTRANCE = "discord-entrance",
	STREAMLABS_DONATION = "streamlabs-donation",
	STREAMLABS_CHARITY = "streamlabs-charity",
	STREAMLABS_MERCH = "streamlabs-merch",
	STREAMLABS_REDEMPTION = "streamlabs-redemption",
	STREAMLABS_PRIMEGIFT = "streamlabs-primegift",
	STREAMELEMENTS_DONATION = "streamelements-donation",
	EXTRALIFE_DONATION = "extralife-donation",
	DONORDRIVE_DONATION = "donordrive-donation",
	TILTIFY_DONATION = "tiltify-campaignDonation",
	// PAYPAL_PAYMENT_COMPLETE = "paypal-paymentComplete",
	// PAYPAL_PAYMENT_DENIED = "paypal-paymentDenied",
	TIPEEESTREAM_DONATION = "tipeeestream-donation",
	TREATSTREAM_TREAT = "treatstream-treat",
	PATREON_PLEDGE = "patreon-campaignPledge",
	OBS_SWITCH_PROFILE = "obs-switchProfile",
	OBS_SWITCH_SCENE = "obs-switchScene",
	OBS_SCENE_ITEM_VISIBILITY = "obs-sceneItemVisibility",
	OBS_SCENE_ITEM_HIDDEN = "obs-sceneItemHidden",
	OBS_SWITCH_TRANSITION = "obs-switch-transition",
	OBS_TRANSITION_BEGIN = "obs-transitionBegin",
	OBS_TRANSITION_END = "obs-transitionEnd",
	OBS_STREAM_STARTING = "obs-streamStarting",
	OBS_STREAM_STOPPING = "obs-streamStopping",
	OBS_RECORDING_STARTING = "obs-recordingStarting",
	OBS_RECORDING_STOPPING = "obs-recordingStopping",
	OBS_REPLAY_BUFFER_SAVED = "obs-replayBufferSaved",
	OBS_VERTICAL_BACKTRACK_SAVED = "obs-verticalBacktrackSaved",
	OBS_VENDOR_EVENT = "obs-vendorEvent",
	SLOBS_SWITCH_SCENE_COLLECTION = "slobs-switchSceneCollection",
	SLOBS_SWITCH_SCENE = "slobs-switchScene",
	SLOBS_SCENE_ITEM_VISIBILITY = "slobs-sceneItemVisibility",
	SLOBS_SCENE_ITEM_HIDDEN = "slobs-sceneItemHidden",
	SPOTIFY_SWITCH_SONG = "spotify-switchSong",
	SPOTIFY_SONG_PLAYED = "spotify-songPlayed",
	SPOTIFY_SONG_PAUSED = "spotify-songPaused",
	YOUTUBEMUSIC_SWITCH_SONG = "youtubemusic-switchSong",
	YOUTUBEMUSIC_SONG_PLAYED = "youtubemusic-songPlayed",
	YOUTUBEMUSIC_SONG_PAUSED = "youtubemusic-songPaused",
	NOWPLAYING_SWITCH_SONG = "nowplaying-switchSong",
	NOWPLAYING_SONG_PLAYED = "nowplaying-songPlayed",
	NOWPLAYING_SONG_PAUSED = "nowplaying-songPaused",
	VLC_SWITCH_SONG = "vlc-switchSong",
	VLC_SONG_PLAYED = "vlc-songPlayed",
	VLC_SONG_PAUSED = "vlc-songPaused",
	PULSE_HEARTRATE = "pulse-heartrate",
	PULSE_CALORIES = "pulse-calories",
	TWITTER_FOLLOWER = "twitter-follower",
	TWITTER_LIKE = "twitter-like",
	TWITTER_RETWEET = "twitter-retweet",
	WOOCOMMERCE_ORDER = "woocommerce-order",
	KOFI_DONATION = "kofi-donation",
	KOFI_SUBSCRIPTION = "kofi-subscription",
	KOFI_COMMISSION = "kofi-commission",
	KOFI_SHOPORDER = "kofi-shopOrder",
	STREAMERBOT_ACTION = "streamerbot-action",
	FOURTHWALL_SHOPORDER = "fourthwall-shopOrder",
	FOURTHWALL_DONATION = "fourthwall-donation",
	FOURTHWALL_SUBSCRIPTION = "fourthwall-subscription",
	FOURTHWALL_GIFTPURCHASE = "fourthwall-giftpurchase",
	CROWDCONTROL_EFFECT = "crowdcontrol-effect",
	VTUBESTUDIO_HOTKEY_TRIGGERED = "vtubestudio-hotkeyTriggered",
	VTUBESTUDIO_MODEL_LOADED = "vtubestudio-modelLoaded",
	VTUBESTUDIO_ANIMATION_START = "vtubestudio-animationStart",
	VTUBESTUDIO_ANIMATION_END = "vtubestudio-animationEnd",
	VTUBESTUDIO_ITEM_ADDED = "vtubestudio-itemAdded",
	VTUBESTUDIO_ITEM_REMOVED = "vtubestudio-itemRemoved",
	VTUBESTUDIO_BACKGROUND_CHANGED = "vtubestudio-backgroundChanged",
	MELD_STREAM_STARTING = "meld-streamStarting",
	MELD_STREAM_STOPPING = "meld-streamStopping",
	MELD_RECORDING_STARTING = "meld-recordingStarting",
	MELD_RECORDING_STOPPING = "meld-recordingStopping",
}
