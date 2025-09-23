// -----------------------------------------------------------------------------
//  Lumia Stream - Custom Overlay typings
// -----------------------------------------------------------------------------

/**
 * Available tabs in the custom overlay editor interface
 */
export enum CustomTabs {
	/** HTML content tab */
	HTML = "html",
	/** JavaScript code tab */
	JS = "js",
	/** CSS styling tab */
	CSS = "css",
	/** Configuration settings tab */
	CONFIGS = "configs",
	/** Data storage tab */
	DATA = "data",
}

/**
 * Field types available for the overlay configuration tab.
 * These determine the UI controls shown for each config option.
 */
export enum ConfigsFieldType {
	/** Text input field */
	INPUT = "input",
	/** Numeric input field */
	NUMBER = "number",
	// IMAGE = 'image',
	/** Boolean checkbox */
	CHECKBOX = "checkbox",
	/** Single-select dropdown menu */
	DROPDOWN = "dropdown",
	/** Multi-select dropdown menu */
	MULTISELECT = "multiselect",
	/** Color picker widget */
	COLORPICKER = "colorpicker",
	/** Font selection widget */
	FONTPICKER = "fontpicker",
}

/**
 * Core event types that overlays can listen to.
 * Used as discriminants for the overlay event system.
 */
export type OverlayListener =
	| "chat"
	| "alert"
	| "hfx"
	| "virtuallight"
	| "overlaycontent";

/**
 * Chat message event data structure.
 * Fired when a chat message is received from any connected platform.
 */
export interface ChatEvent {
	/** Platform origin (e.g., "twitch", "kick", "youtube", "tiktok") */
	origin: string;
	/** Unique message identifier */
	id: string;
	/** User's account username */
	username: string;
	/** User's display name (may differ from username) */
	displayname: string;
	/** Channel name where the message was sent */
	channel: string;
	/** URL to the user's avatar image */
	avatar: string;
	/** The chat message content */
	message: string;
	/** User's chat color as hex code (e.g., "#00FF7F") */
	color: string;
	/** Array of badge image URLs */
	badges: string[];
	/** Raw badge data string (e.g., "broadcaster/1,sub/12,vip/1") */
	badgesRaw: string;
	/** Raw emotes data string */
	emotesRaw: string;
	/** Emote pack data structure */
	emotesPack: Record<string, unknown>;
	/** Reply data if this message is a reply to another */
	reply: unknown | null;
	/** Lumia-specific user level identifiers */
	lumiauserlevels: number[];
	/** User permission levels and roles */
	userLevels: {
		/** Whether this is the streamer's own message */
		isSelf: boolean;
		/** Whether the user is a moderator */
		mod: boolean;
		/** Whether the user is a VIP */
		vip: boolean;
		/** Whether the user is a tier 3 subscriber */
		tier3: boolean;
		/** Whether the user is a tier 2 subscriber */
		tier2: boolean;
		/** Whether the user is a subscriber (any tier) */
		subscriber: boolean;
		/** Whether the user is a regular viewer */
		regular: boolean;
		/** Whether the user is a follower */
		follower: boolean;
		/** Always true - indicates any user level */
		anyone: boolean;
	};
}

/**
 * Alert event data structure.
 * Fired when stream alerts occur (follows, subs, donations, etc).
 */
export interface AlertEvent {
	/** Type of alert from LumiaAlertValues enum */
	alert: LumiaAlertValues;
	/** Dynamic value associated with the alert (e.g., donation amount, sub months) */
	dynamic: { value: number | string };
	/** Additional metadata about the alert */
	extraSettings: {
		/** Username of the person triggering the alert */
		username: string;
		/** Display name of the person triggering the alert */
		displayname: string;
		/** User's unique identifier */
		userId: number;
		/** URL to the user's avatar image (if available) */
		avatar: string | null;
		/** ISO timestamp when the alert occurred */
		timestamp: string;
		/** Platform where the alert originated */
		site:
			| "twitch"
			| "kick"
			| "youtube"
			| "tiktok"
			| "facebook"
			| "trovo"
			| string;
		/** Whether timing type should be checked */
		checkTimingType: boolean;
		/** Type of timing for the alert */
		timingType: string;
		/** Alert display duration in milliseconds */
		duration: number;
	};
	/** Whether this alert was triggered from Lumia itself */
	fromLumia: boolean;
}

/**
 * HFX (Heads-up Effects) event data structure.
 * Fired when visual/audio effects are triggered.
 */
export interface HfxEvent {
	/** Effect layer identifier */
	layer: string;
	/** Asset UUID for the effect content */
	content: string;
	/** Command that triggered the effect */
	command: string;
	/** Origin of the effect (e.g., "hudfx", "command") */
	origin: string;
	/** Whether to play audio with the effect */
	playAudio: boolean;
	/** Audio volume (0-1 range) */
	volume: number;
	/** Effect duration in milliseconds */
	duration: number;
	/** Username of the person who triggered the effect */
	username: string;
	/** Associated message (if any) */
	message: string;
	/** URL to the user's avatar image */
	avatar: string;
	/** Command duration in milliseconds (usually same as duration) */
	commandDuration: number;
}

/**
 * Virtual light control event data structure.
 * Fired when smart lights are controlled through Lumia.
 */
export interface VirtualLightEvent {
	/** Unique identifier for the light */
	uuid: string;
	/** Brightness level (0-100) */
	brightness: number;
	/** RGB color values */
	color: {
		/** Red component (0-255) */
		r: number;
		/** Green component (0-255) */
		g: number;
		/** Blue component (0-255) */
		b: number;
	};
	/** Power state (true = on, false = off) */
	power?: boolean;
	/** Transition time in milliseconds */
	transition: number;
	/** Delay before applying changes in milliseconds */
	delay: number;
	/** How long to maintain the state in milliseconds */
	duration: number;
}

/**
 * Custom overlay content event data structure.
 * Used for sending custom data to specific overlays.
 */
export interface CustomOverlayContentEvent {
	/** Identifier for the target overlay */
	codeId: string;
	/** Arbitrary JSON/string payload for the overlay */
	content: string;
}

/**
 * Union type of all possible overlay events
 */
export type OverlayEvent =
	| ChatEvent
	| AlertEvent
	| HfxEvent
	| VirtualLightEvent
	| CustomOverlayContentEvent;

/**
 * Type definition for overlay event handlers.
 * @example
 * const handler: OverlayEventHandler = (ev) => {
 *   console.log('Event received:', ev.detail);
 * };
 */
export type OverlayEventHandler = (ev: CustomEvent<OverlayEvent>) => void;

/**
 * Main Overlay API interface.
 * Available globally as `window.Overlay` in custom overlays.
 */
export interface Overlay {
	/**
	 * Register an event listener for chat messages
	 * @param event - Event type "chat"
	 * @param handler - Callback function to handle chat events
	 * @example
	 * window.Overlay.on('chat', (data) => {
	 *   console.log(`${data.displayname}: ${data.message}`);
	 * });
	 */
	on(event: "chat", handler: (data: ChatEvent) => void): void;

	/**
	 * Register an event listener for alerts
	 * @param event - Event type "alert"
	 * @param handler - Callback function to handle alert events
	 * @example
	 * window.Overlay.on('alert', (data) => {
	 *   if (data.alert === LumiaAlertValues.TWITCH_FOLLOWER) {
	 *     console.log(`New follower: ${data.extraSettings.username}`);
	 *   }
	 * });
	 */
	on(event: "alert", handler: (data: AlertEvent) => void): void;

	/**
	 * Register an event listener for HFX effects
	 * @param event - Event type "hfx"
	 * @param handler - Callback function to handle HFX events
	 */
	on(event: "hfx", handler: (data: HfxEvent) => void): void;

	/**
	 * Register an event listener for virtual light controls
	 * @param event - Event type "virtuallight"
	 * @param handler - Callback function to handle virtual light events
	 */
	on(event: "virtuallight", handler: (data: VirtualLightEvent) => void): void;

	/**
	 * Register an event listener for custom overlay content
	 * @param event - Event type "overlaycontent"
	 * @param handler - Callback function to handle custom content events
	 */
	on(
		event: "overlaycontent",
		handler: (data: CustomOverlayContentEvent) => void
	): void;

	/**
	 * Execute a Lumia Stream command
	 * @param command - Name of the command to execute
	 * @param extraSettings - Optional parameters for the command
	 * @example
	 * window.Overlay.callCommand('lights-on', { brightness: 75 });
	 */
	callCommand(
		command: string,
		extraSettings?: Record<string, string | number>
	): void;

	/**
	 * Send a message to chat through the bot
	 * @param args - Chat message configuration
	 * @returns Promise that resolves when the message is sent
	 * @example
	 * await window.Overlay.chatbot({
	 *   message: 'Thanks for the follow!',
	 *   platform: 'twitch',
	 *   chatAsSelf: false
	 * });
	 */
	chatbot(args: {
		/** The message to send */
		message: string;
		/** Target platform (optional) */
		platform?: string;
		/** Whether to send as the streamer (true) or bot (false) */
		chatAsSelf?: boolean;
	}): Promise<void>;

	/**
	 * Add loyalty points to a user
	 * @param args - User and points configuration
	 * @returns Promise resolving to the user's new total points
	 * @example
	 * const newTotal = await window.Overlay.addLoyaltyPoints({
	 *   value: 100,
	 *   username: 'viewer123',
	 *   platform: 'twitch'
	 * });
	 */
	addLoyaltyPoints(args: {
		/** Number of points to add */
		value: number;
		/** Target username */
		username: string;
		/** User's platform */
		platform: string;
	}): Promise<number>;

	/**
	 * Get a user's current loyalty points balance
	 * @param args - User identification
	 * @returns Promise resolving to the user's current points
	 * @example
	 * const points = await window.Overlay.getLoyaltyPoints({
	 *   username: 'viewer123',
	 *   platform: 'twitch'
	 * });
	 */
	getLoyaltyPoints(args: {
		/** Target username */
		username: string;
		/** User's platform */
		platform: string;
	}): Promise<number>;

	/**
	 * Set a Lumia variable value
	 * @param variable - Variable name
	 * @param value - Value to set
	 * @example
	 * window.Overlay.setVariable('alertCount', 42);
	 */
	setVariable(variable: string, value: unknown): void;

	/**
	 * Get a Lumia variable value
	 * @param variable - Variable name
	 * @returns The variable value or undefined if not set
	 * @example
	 * const count = window.Overlay.getVariable('alertCount');
	 */
	getVariable(variable: string): unknown | undefined;

	/**
	 * Save data to browser local storage
	 * @param key - Storage key
	 * @param value - Value to store (will be stringified)
	 * @example
	 * window.Overlay.saveStorage('theme', 'dark');
	 */
	saveStorage(key: string, value: string): void;

	/**
	 * Retrieve data from browser local storage
	 * @param key - Storage key
	 * @returns The stored value or null if not found
	 * @example
	 * const theme = window.Overlay.getStorage('theme');
	 */
	getStorage(key: string): string | null;

	/**
	 * Remove data from browser local storage
	 * @param key - Storage key to remove
	 * @example
	 * window.Overlay.removeStorage('theme');
	 */
	removeStorage(key: string): void;
}

// -----------------------------------------------------------------------------
// Comprehensive enum of all Lumia alert types.
// Used to identify specific events in AlertEvent.alert field.
// -----------------------------------------------------------------------------

// <auto-generated-start name="LumiaAlertValues" />
export declare enum LumiaAlertValues {
	/** Lumia Stream donation received */
	LUMIASTREAM_DONATION = "lumiastream-donation",
	/** Lumia application opened */
	LUMIASTREAM_LUMIA_OPENED = "lumiastream-lumiaOpened",
	/** Lumia application closed */
	LUMIASTREAM_LUMIA_CLOSED = "lumiastream-lumiaClosed",
	/** Stream mode activated */
	LUMIASTREAM_STREAMMODE_ON = "lumiastream-streammodeOn",
	/** Stream mode deactivated */
	LUMIASTREAM_STREAMMODE_OFF = "lumiastream-streammodeOff",
	/** Raffle started */
	LUMIASTREAM_RAFFLE_START = "lumiastream-raffleStart",
	/** Raffle stopped */
	LUMIASTREAM_RAFFLE_STOP = "lumiastream-raffleStop",
	/** Raffle winner selected */
	LUMIASTREAM_RAFFLE_WINNER = "lumiastream-raffleWinner",
	/** Spin wheel winner selected */
	LUMIASTREAM_SPINWHEEL_WINNER = "lumiastream-spinwheelWinner",
	/** Poll started */
	LUMIASTREAM_POLL_STARTED = "lumiastream-pollStarted",
	/** Poll progress update */
	LUMIASTREAM_POLL_PROGRESSED = "lumiastream-pollProgressed",
	/** Poll ended */
	LUMIASTREAM_POLL_ENDED = "lumiastream-pollEnded",
	/** Viewer queue started */
	LUMIASTREAM_VIEWERQUEUE_STARTED = "lumiastream-viewerqueueStarted",
	/** Viewer queue ended */
	LUMIASTREAM_VIEWERQUEUE_ENDED = "lumiastream-viewerqueueEnded",
	/** Roulette winner selected */
	LUMIASTREAM_ROULETTE_WINNER = "lumiastream-rouletteWinner",
	/** Slots winner */
	LUMIASTREAM_SLOTS_WINNER = "lumiastream-slotsWinner",
	/** Twitch extension interaction */
	TWITCH_EXTENSION = "twitch-extension",
	/** Twitch channel points redemption */
	TWITCH_POINTS = "twitch-points",
	/** Twitch stream went live */
	TWITCH_STREAM_LIVE = "twitch-streamLive",
	/** Twitch stream went offline */
	TWITCH_STREAM_OFFLINE = "twitch-streamOffline",
	/** First chat message in stream */
	TWITCH_FIRST_CHATTER = "twitch-firstChatter",
	/** User entered the stream */
	TWITCH_ENTRANCE = "twitch-entrance",
	/** New follower */
	TWITCH_FOLLOWER = "twitch-follower",
	/** Total Session followers count */
	TWITCH_SESSION_FOLLOWERS = "twitch-sessionFollowers",
	/** New subscription */
	TWITCH_SUBSCRIBER = "twitch-subscriber",
	/** Total Session subs count */
	TWITCH_SESSION_SUBS = "twitch-sessionSubs",
	/** Gift subscription given */
	TWITCH_GIFT_SUBSCRIPTION = "twitch-giftSubscription",
	/** Total Session gifts count */
	TWITCH_SESSION_GIFT_SUBSCRIPTIONS = "twitch-sessionGiftSubscriptions",
	/** Incoming raid */
	TWITCH_RAID = "twitch-raid",
	/** Outgoing raid */
	TWITCH_RAID_OUT = "twitch-raidOut",
	/** Bits cheered */
	TWITCH_BITS = "twitch-bits",
	/** Total Session bits count */
	TWITCH_SESSION_BITS = "twitch-sessionBits",
	/** Channel points redemption */
	TWITCH_REDEMPTION = "twitch-redemption",
	/** Hype train started */
	TWITCH_HYPETRAIN_STARTED = "twitch-hypetrainStarted",
	/** Hype train progress */
	TWITCH_HYPETRAIN_PROGRESSED = "twitch-hypetrainProgressed",
	/** Hype train level increased */
	TWITCH_HYPETRAIN_LEVEL_PROGRESSED = "twitch-hypetrainLevelProgressed",
	/** Hype train ended */
	TWITCH_HYPETRAIN_ENDED = "twitch-hypetrainEnded",
	/** Poll started */
	TWITCH_POLL_STARTED = "twitch-pollStarted",
	/** Poll progress update */
	TWITCH_POLL_PROGRESSED = "twitch-pollProgressed",
	/** Poll ended */
	TWITCH_POLL_ENDED = "twitch-pollEnded",
	/** Prediction started */
	TWITCH_PREDICTION_STARTED = "twitch-predictionStarted",
	/** Prediction progress update */
	TWITCH_PREDICTION_PROGRESSED = "twitch-predictionProgressed",
	/** Prediction locked */
	TWITCH_PREDICTION_LOCKED = "twitch-predictionLocked",
	/** Prediction ended */
	TWITCH_PREDICTION_ENDED = "twitch-predictionEnded",
	/** Goal started */
	TWITCH_GOAL_STARTED = "twitch-goalStarted",
	/** Goal progress update */
	TWITCH_GOAL_PROGRESSED = "twitch-goalProgressed",
	/** Goal completed */
	TWITCH_GOAL_ENDED = "twitch-goalEnded",
	/** Charity donation */
	TWITCH_CHARITY_DONATION = "twitch-charityDonation",
	/** Charity campaign started */
	TWITCH_CHARITY_CAMPAIGN_STARTED = "twitch-charityCampaignStarted",
	/** Charity campaign progress */
	TWITCH_CHARITY_CAMPAIGN_PROGRESSED = "twitch-charityCampaignProgressed",
	/** Charity campaign stopped */
	TWITCH_CHARITY_CAMPAIGN_STOPPED = "twitch-charityCampaignStopped",
	/** Stream category changed */
	TWITCH_CATEGORY = "twitch-categoryChanged",
	/** Clip created */
	TWITCH_CLIP = "twitch-clip",
	/** User joined channel */
	TWITCH_CHANNEL_JOIN = "twitch-channelJoin",
	/** User left channel */
	TWITCH_CHANNEL_LEAVE = "twitch-channelLeave",
	/** User banned */
	TWITCH_BANNED = "twitch-banned",
	/** User timed out */
	TWITCH_TIMEOUT = "twitch-timeout",
	/** User timeout expired */
	TWITCH_TIMEOUT_OVER = "twitch-timeoutOver",
	/** Shoutout received */
	TWITCH_SHOUTOUT_RECEIVE = "twitch-shoutoutReceive",
	/** Ad break started */
	TWITCH_AD_STARTED = "twitch-adStarted",
	/** Ad break ended */
	TWITCH_AD_STOPPED = "twitch-adStopped",
	/** Power-ups used */
	TWITCH_POWERUPS = "twitch-powerups",
	/** Power-up points earned */
	TWITCH_POWERUPS_POINTS = "twitch-powerupsPoints",
	/** YouTube stream went live */
	YOUTUBE_STREAM_LIVE = "youtube-streamLive",
	/** YouTube stream went offline */
	YOUTUBE_STREAM_OFFLINE = "youtube-streamOffline",
	/** First YouTube chat message */
	YOUTUBE_FIRST_CHATTER = "youtube-firstChatter",
	/** YouTube user entrance */
	YOUTUBE_ENTRANCE = "youtube-entrance",
	/** YouTube channel membership */
	YOUTUBE_MEMBER = "youtube-member",
	/** YouTube new subscriber */
	YOUTUBE_SUBSCRIBER = "youtube-subscriber",
	/** YouTube Super Chat */
	YOUTUBE_SUPERCHAT = "youtube-superchat",
	/** YouTube Super Sticker */
	YOUTUBE_SUPERSTICKER = "youtube-supersticker",
	/** YouTube total likes */
	YOUTUBE_LIKE = "youtube-like",
	/** YouTube total views */
	YOUTUBE_VIEWERS = "youtube-viewers",
	/** Facebook stream went live */
	FACEBOOK_STREAM_LIVE = "facebook-streamLive",
	/** Facebook stream went offline */
	FACEBOOK_STREAM_OFFLINE = "facebook-streamOffline",
	/** First Facebook chat message */
	FACEBOOK_FIRST_CHATTER = "facebook-firstChatter",
	/** Facebook user entrance */
	FACEBOOK_ENTRANCE = "facebook-entrance",
	/** Facebook new follower */
	FACEBOOK_FOLLOWER = "facebook-follower",
	/** Facebook reaction */
	FACEBOOK_REACTION = "facebook-reaction",
	/** Facebook stars received */
	FACEBOOK_STAR = "facebook-star",
	/** Facebook support */
	FACEBOOK_SUPPORT = "facebook-support",
	/** Facebook gift subscription */
	FACEBOOK_GIFT_SUBSCRIPTION = "facebook-subscriptionGift",
	/** Facebook share */
	FACEBOOK_SHARE = "facebook-share",
	/** Facebook fan */
	FACEBOOK_FAN = "facebook-fan",
	/** Trovo stream went live */
	TROVO_STREAM_LIVE = "trovo-streamLive",
	/** Trovo stream went offline */
	TROVO_STREAM_OFFLINE = "trovo-streamOffline",
	/** First Trovo chat message */
	TROVO_FIRST_CHATTER = "trovo-firstChatter",
	/** Trovo user entrance */
	TROVO_ENTRANCE = "trovo-entrance",
	/** Trovo channel join */
	TROVO_CHANNEL_JOIN = "trovo-channelJoin",
	/** Trovo subscriber (potential, needs testing) */
	TROVO_SUBSCRIBER = "trovo-subscriber",
	/** Trovo follower (potential, needs testing) */
	TROVO_FOLLOWER = "trovo-follower",
	/** Trovo spell cast (potential, needs testing) */
	TROVO_SPELL = "trovo-spell",
	/** Trovo gift subscription */
	TROVO_GIFT_SUBSCRIPTION = "trovo-giftSubscription",
	/** Trovo raid */
	TROVO_RAID = "trovo-raid",
	/** First TikTok chat message */
	TIKTOK_FIRST_CHATTER = "tiktok-firstChatter",
	/** TikTok user entrance */
	TIKTOK_ENTRANCE = "tiktok-entrance",
	/** TikTok new follower */
	TIKTOK_FOLLOWER = "tiktok-follower",
	/** TikTok like received */
	TIKTOK_LIKE = "tiktok-like",
	/** TikTok total likes */
	TIKTOK_TOTAL_LIKES = "tiktok-totalLikes",
	/** TikTok gift received */
	TIKTOK_GIFT = "tiktok-gift",
	/** TikTok new subscriber */
	TIKTOK_SUBSCRIBER = "tiktok-subscriber",
	/** TikTok share */
	TIKTOK_SHARE = "tiktok-share",
	/** TikTok stream ended */
	TIKTOK_STREAM_END = "tiktok-streamEnd",
	/** New TikTok video posted */
	TIKTOK_NEW_VIDEO = "tiktok-newVideo",
	/** Kick points earned */
	KICK_POINTS = "kick-points",
	/** First Kick chat message */
	KICK_FIRST_CHATTER = "kick-firstChatter",
	/** Kick user entrance */
	KICK_ENTRANCE = "kick-entrance",
	/** Kick new follower */
	KICK_FOLLOWER = "kick-follower",
	/** Total Session followers count */
	KICK_SESSION_FOLLOWERS = "kick-sessionFollowers",
	/** Kick new subscriber */
	KICK_SUBSCRIBER = "kick-subscriber",
	/** Total Session subs count */
	KICK_SESSION_SUBS = "kick-sessionSubs",
	/** Kick gift subscription */
	KICK_GIFT_SUBSCRIPTION = "kick-subscriptionGift",
	/** Total Session gifts count */
	KICK_SESSION_GIFT_SUBSCRIPTIONS = "kick-sessionGiftSubscriptions",
	/** Kick kicks */
	KICK_KICKS = "kick-kicks",
	/** Kick Session kicks */
	KICK_SESSION_KICKS = "kick-sessionKicks",
	/** Kick host */
	KICK_HOST = "kick-host",
	/** Kick user banned */
	KICK_BANNED = "kick-banned",
	/** Kick user unbanned */
	KICK_UNBANNED = "kick-unbanned",
	/** First Discord message */
	DISCORD_FIRST_CHATTER = "discord-firstChatter",
	/** Discord user entrance */
	DISCORD_ENTRANCE = "discord-entrance",
	/** Streamlabs donation */
	STREAMLABS_DONATION = "streamlabs-donation",
	/** Streamlabs charity donation */
	STREAMLABS_CHARITY = "streamlabs-charity",
	/** Streamlabs merchandise purchase */
	STREAMLABS_MERCH = "streamlabs-merch",
	/** Streamlabs redemption */
	STREAMLABS_REDEMPTION = "streamlabs-redemption",
	/** Streamlabs Prime gift */
	STREAMLABS_PRIMEGIFT = "streamlabs-primegift",
	/** StreamElements donation */
	STREAMELEMENTS_DONATION = "streamelements-donation",
	/** Extra Life donation */
	EXTRALIFE_DONATION = "extralife-donation",
	/** DonorDrive donation */
	DONORDRIVE_DONATION = "donordrive-donation",
	/** Tiltify campaign donation */
	TILTIFY_DONATION = "tiltify-campaignDonation",
	/** TipeeeStream donation */
	TIPEEESTREAM_DONATION = "tipeeestream-donation",
	/** TreatStream treat */
	TREATSTREAM_TREAT = "treatstream-treat",
	/** Patreon pledge */
	PATREON_PLEDGE = "patreon-campaignPledge",
	/** Ko-fi donation */
	KOFI_DONATION = "kofi-donation",
	/** Ko-fi subscription */
	KOFI_SUBSCRIPTION = "kofi-subscription",
	/** Ko-fi commission */
	KOFI_COMMISSION = "kofi-commission",
	/** Ko-fi shop order */
	KOFI_SHOPORDER = "kofi-shopOrder",
	/** Fourthwall shop order */
	FOURTHWALL_SHOPORDER = "fourthwall-shopOrder",
	/** Fourthwall donation */
	FOURTHWALL_DONATION = "fourthwall-donation",
	/** Fourthwall subscription */
	FOURTHWALL_SUBSCRIPTION = "fourthwall-subscription",
	/** Fourthwall gift purchase */
	FOURTHWALL_GIFTPURCHASE = "fourthwall-giftpurchase",
	/** Fourthwall giveaway started */
	FOURTHWALL_GIVEAWAY_STARTED = "fourthwall-giveawayStarted",
	/** Fourthwall giveaway ended */
	FOURTHWALL_GIVEAWAY_ENDED = "fourthwall-giveawayEnded",
	/** Fourthwall thank you sent */
	FOURTHWALL_THANKYOU_SENT = "fourthwall-thankyouSent",
	/** OBS profile switched */
	OBS_SWITCH_PROFILE = "obs-switchProfile",
	/** OBS scene switched */
	OBS_SWITCH_SCENE = "obs-switchScene",
	/** OBS scene item visibility changed */
	OBS_SCENE_ITEM_VISIBILITY = "obs-sceneItemVisibility",
	/** OBS scene item hidden */
	OBS_SCENE_ITEM_HIDDEN = "obs-sceneItemHidden",
	/** OBS transition switched */
	OBS_SWITCH_TRANSITION = "obs-switchTransition",
	/** OBS transition started */
	OBS_TRANSITION_BEGIN = "obs-transitionBegin",
	/** OBS transition ended */
	OBS_TRANSITION_END = "obs-transitionEnd",
	/** OBS stream starting */
	OBS_STREAM_STARTING = "obs-streamStarting",
	/** OBS stream stopping */
	OBS_STREAM_STOPPING = "obs-streamStopping",
	/** OBS recording starting */
	OBS_RECORDING_STARTING = "obs-recordingStarting",
	/** OBS recording stopping */
	OBS_RECORDING_STOPPING = "obs-recordingStopping",
	/** OBS replay buffer saved */
	OBS_REPLAY_BUFFER_SAVED = "obs-replayBufferSaved",
	/** OBS vertical backtrack saved */
	OBS_VERTICAL_BACKTRACK_SAVED = "obs-verticalBacktrackSaved",
	/** OBS vendor-specific event */
	OBS_VENDOR_EVENT = "obs-vendorEvent",
	/** SLOBS scene collection switched */
	SLOBS_SWITCH_SCENE_COLLECTION = "slobs-switchSceneCollection",
	/** SLOBS scene switched */
	SLOBS_SWITCH_SCENE = "slobs-switchScene",
	/** SLOBS scene item visibility changed */
	SLOBS_SCENE_ITEM_VISIBILITY = "slobs-sceneItemVisibility",
	/** SLOBS scene item hidden */
	SLOBS_SCENE_ITEM_HIDDEN = "slobs-sceneItemHidden",
	/** Spotify song changed */
	SPOTIFY_SWITCH_SONG = "spotify-switchSong",
	/** Spotify song started playing */
	SPOTIFY_SONG_PLAYED = "spotify-songPlayed",
	/** Spotify song paused */
	SPOTIFY_SONG_PAUSED = "spotify-songPaused",
	/** YouTube Music song changed */
	YOUTUBEMUSIC_SWITCH_SONG = "youtubemusic-switchSong",
	/** YouTube Music song started playing */
	YOUTUBEMUSIC_SONG_PLAYED = "youtubemusic-songPlayed",
	/** YouTube Music song paused */
	YOUTUBEMUSIC_SONG_PAUSED = "youtubemusic-songPaused",
	/** Now Playing song changed */
	NOWPLAYING_SWITCH_SONG = "nowplaying-switchSong",
	/** Now Playing song started */
	NOWPLAYING_SONG_PLAYED = "nowplaying-songPlayed",
	/** Now Playing song paused */
	NOWPLAYING_SONG_PAUSED = "nowplaying-songPaused",
	/** VLC song changed */
	VLC_SWITCH_SONG = "vlc-switchSong",
	/** VLC song started playing */
	VLC_SONG_PLAYED = "vlc-songPlayed",
	/** VLC song paused */
	VLC_SONG_PAUSED = "vlc-songPaused",
	/** Heart rate update from Pulse */
	PULSE_HEARTRATE = "pulse-heartrate",
	/** Calories burned update from Pulse */
	PULSE_CALORIES = "pulse-calories",
	/** New Twitter/X follower */
	TWITTER_FOLLOWER = "twitter-follower",
	/** Twitter/X like received */
	TWITTER_LIKE = "twitter-like",
	/** Twitter/X retweet */
	TWITTER_RETWEET = "twitter-retweet",
	/** WooCommerce order received */
	WOOCOMMERCE_ORDER = "woocommerce-order",
	/** Streamer.bot action executed */
	STREAMERBOT_ACTION = "streamerbot-action",
	/** Crowd Control effect triggered */
	CROWDCONTROL_EFFECT = "crowdcontrol-effect",
	/** VTube Studio hotkey triggered */
	VTUBESTUDIO_HOTKEY_TRIGGERED = "vtubestudio-hotkeyTriggered",
	/** VTube Studio model loaded */
	VTUBESTUDIO_MODEL_LOADED = "vtubestudio-modelLoaded",
	/** VTube Studio animation started */
	VTUBESTUDIO_ANIMATION_START = "vtubestudio-animationStart",
	/** VTube Studio animation ended */
	VTUBESTUDIO_ANIMATION_END = "vtubestudio-animationEnd",
	/** VTube Studio item added */
	VTUBESTUDIO_ITEM_ADDED = "vtubestudio-itemAdded",
	/** VTube Studio item removed */
	VTUBESTUDIO_ITEM_REMOVED = "vtubestudio-itemRemoved",
	/** VTube Studio background changed */
	VTUBESTUDIO_BACKGROUND_CHANGED = "vtubestudio-backgroundChanged",
	/** Meld stream starting */
	MELD_STREAM_STARTING = "meld-streamStarting",
	/** Meld stream stopping */
	MELD_STREAM_STOPPING = "meld-streamStopping",
	/** Meld recording starting */
	MELD_RECORDING_STARTING = "meld-recordingStarting",
	/** Meld recording stopping */
	MELD_RECORDING_STOPPING = "meld-recordingStopping",
}

// <auto-generated-end name="LumiaAlertValues" />

// -----------------------------------------------------------------------------
// System Variables
// Use the **string values** of this enum inside overlays: e.g. {{twitch_total_subscriber_count}}, not {{TWITCH_TOTAL_SUBSCRIBER_COUNT}}.
// -----------------------------------------------------------------------------

// <auto-generated-start name="SystemVariables" />
export declare enum SystemVariables {
	/** Read from a local file. Example: {{read_file=C:\path\file.txt}}. Use in overlays as {{read_file}}. */
	READ_FILE = "read_file",
	/** Read from a simple GET URL (2s timeout). Example: {{read_url=https://api.example.com}}. Use as {{read_url}}. */
	READ_URL = "read_url",
	/** Selection helper for predefined options. Example: {{selection=first,second}}. Use as {{selection}}. */
	SELECTION = "selection",
	/** Random number between two values. Example: {{random=1,20}}. Use as {{random}}. */
	RANDOM = "random",
	/** Pick a random item from a comma list. Example: {{random_input=a,b,c}}. Use as {{random_input}}. */
	RANDOM_INPUT = "random_input",
	/** Sum multiple variables. Example: {{sum_variables=twitch_total_follower_count,kick_total_follower_count}}. Use as {{sum_variables}}. */
	SUM_VARIABLES = "sum_variables",
	/** Offset a variable by a number. Example: {{offset_count=twitch_total_follower_count,10}}. Use as {{offset_count}}. */
	OFFSET_COUNT = "offset_count",
	/** Get user-accessible commands. Use as {{get_commands}}. */
	GET_COMMANDS = "get_commands",
	/** Get all commands (full list). Use as {{get_all_commands}}. */
	GET_ALL_COMMANDS = "get_all_commands",
	/** Convert color names to hex; passes through hex. Example: {{convert_color_to_hex=green}}. Use as {{convert_color_to_hex}}. */
	CONVERT_COLOR_TO_HEX = "convert_color_to_hex",
	/** Latest file from a folder. Example: {{get_latest_file_from_folder=C:/Users/Desktop}}. Use as {{get_latest_file_from_folder}}. */
	GET_LATEST_FILE_FROM_FOLDER = "get_latest_file_from_folder",
	/** Random file from a folder. Example: {{get_random_file_from_folder=C:/Users/Desktop}}. Use as {{get_random_file_from_folder}}. */
	GET_RANDOM_FILE_FROM_FOLDER = "get_random_file_from_folder",
	/** Desktop screenshot (monitor selectable). Example: {{screenshot=2}}. Use as {{screenshot}}. */
	SCREENSHOT = "screenshot",
	/** OBS screenshot (scene selectable). Example: {{obs_screenshot=Scene 1}}. Use as {{obs_screenshot}}. */
	OBS_SCREENSHOT = "obs_screenshot",
	/** Save OBS replay buffer (optional delay). Example: {{obs_replay=5}}. Use as {{obs_replay}}. */
	OBS_REPLAY = "obs_replay",
	/** Save OBS vertical replay (optional delay). Example: {{obs_vertical_replay=5}}. Use as {{obs_vertical_replay}}. */
	OBS_VERTICAL_REPLAY = "obs_vertical_replay",
	/** Current queue count. Example: {{get_queue_count}}. Use as {{get_queue_count}}. */
	GET_QUEUE_COUNT = "get_queue_count",
	/** Extract variable(s) from a message. Example: {{get_var_from_msg=name}}. Use as {{get_var_from_msg}}. */
	GET_VAR_FROM_MSG = "get_var_from_msg",
	/** Get loyalty points for a user. Example: {{get_user_loyalty_points=username,twitch}}. Use as {{get_user_loyalty_points}}. */
	GET_USER_LOYALTY_POINTS = "get_user_loyalty_points",
	/** Translate text (Google). Example: {{translate={{message}}|es}}. Use as {{translate}}. */
	TRANSLATE = "translate",
	/** Get the ai response from ai integration. Example: {{ai_prompt={{message}}}}. Use as {{ai_prompt}}. */
	AI_PROMPT = "ai_prompt",
	/** Commands URL/page. Use in overlays as {{commands_url}}. */
	COMMANDS_URL = "commands_url",
	/** Session start time (ISO). Use as {{session_start_date}}. */
	SESSION_START_DATE = "session_start_date",
	/** Last player to trigger a game. Use as {{game_last_player}}. */
	GAME_LAST_PLAYER = "game_last_player",
	/** Lumia app uptime. Use as {{lumia_uptime}}. */
	LUMIA_UPTIME = "lumia_uptime",
	/** Twitch stream uptime. Use as {{twitch_uptime}}. */
	TWITCH_UPTIME = "twitch_uptime",
	/** YouTube stream uptime. Use as {{youtube_uptime}}. */
	YOUTUBE_UPTIME = "youtube_uptime",
	/** Facebook stream uptime. Use as {{facebook_uptime}}. */
	FACEBOOK_UPTIME = "facebook_uptime",
	/** Trovo stream uptime. Use as {{trovo_uptime}}. */
	TROVO_UPTIME = "trovo_uptime",
	/** Twitch live status (true/false). Use as {{twitch_live}}. */
	TWITCH_LIVE = "twitch_live",
	/** YouTube live status (true/false). Use as {{youtube_live}}. */
	YOUTUBE_LIVE = "youtube_live",
	/** TikTok live status (true/false). Use as {{tiktok_live}}. */
	TIKTOK_LIVE = "tiktok_live",
	/** Facebook live status (true/false). Use as {{facebook_live}}. */
	FACEBOOK_LIVE = "facebook_live",
	/** Kick live status (true/false). Use as {{kick_live}}. */
	KICK_LIVE = "kick_live",
	/** BRB clips list (comma-separated URLs). Use as {{overlays_brb_clips}}. */
	OVERLAYS_BRB_CLIPS = "overlays_brb_clips",
	/** Last donator name. Use as {{latest_donator}}. */
	LATEST_DONATOR = "latest_donator",
	/** Last donation amount. Use as {{latest_donator_amount}}. */
	LATEST_DONATOR_AMOUNT = "latest_donator_amount",
	/** Last donation currency code. Use as {{latest_donator_currency}}. */
	LATEST_DONATOR_CURRENCY = "latest_donator_currency",
	/** Last donation currency symbol. Use as {{latest_donator_currency_symbol}}. */
	LATEST_DONATOR_CURRENCY_SYMBOL = "latest_donator_currency_symbol",
	/** Top donator this session. Use as {{session_top_donator}}. */
	SESSION_TOP_DONATOR = "session_top_donator",
	/** Top donation amount this session. Use as {{session_top_donator_amount}}. */
	SESSION_TOP_DONATOR_AMOUNT = "session_top_donator_amount",
	/** Top donation currency this session. Use as {{session_top_donator_currency}}. */
	SESSION_TOP_DONATOR_CURRENCY = "session_top_donator_currency",
	/** Top donation currency symbol this session. Use as {{session_top_donator_currency_symbol}}. */
	SESSION_TOP_DONATOR_CURRENCY_SYMBOL = "session_top_donator_currency_symbol",
	/** All-time top donator. Use as {{top_donator}}. */
	TOP_DONATOR = "top_donator",
	/** All-time top donation amount. Use as {{top_donator_amount}}. */
	TOP_DONATOR_AMOUNT = "top_donator_amount",
	/** All-time top donation currency code. Use as {{top_donator_currency}}. */
	TOP_DONATOR_CURRENCY = "top_donator_currency",
	/** All-time top donation currency symbol. Use as {{top_donator_currency_symbol}}. */
	TOP_DONATOR_CURRENCY_SYMBOL = "top_donator_currency_symbol",
	/** Top donators list (last 10). Use as {{top_donator_list}}. */
	TOP_DONATOR_LIST = "top_donator_list",
	/** Amounts for TOP_DONATOR_LIST. Use as {{top_donator_list_amount}}. */
	TOP_DONATOR_LIST_AMOUNT = "top_donator_list_amount",
	/** Currency codes for TOP_DONATOR_LIST. Use as {{top_donator_list_currency}}. */
	TOP_DONATOR_LIST_CURRENCY = "top_donator_list_currency",
	/** Currency symbols for TOP_DONATOR_LIST. Use as {{top_donator_list_currency_symbol}}. */
	TOP_DONATOR_LIST_CURRENCY_SYMBOL = "top_donator_list_currency_symbol",
	/** All-time total donation amount (normalized). Use as {{total_donation_amount}}. */
	TOTAL_DONATION_AMOUNT = "total_donation_amount",
	/** Currency code for TOTAL_DONATION_AMOUNT. Use as {{total_donation_amount_currency}}. */
	TOTAL_DONATION_AMOUNT_CURRENCY = "total_donation_amount_currency",
	/** Currency symbol for TOTAL_DONATION_AMOUNT. Use as {{total_donation_amount_currency_symbol}}. */
	TOTAL_DONATION_AMOUNT_CURRENCY_SYMBOL = "total_donation_amount_currency_symbol",
	/** Session donation sum. Use as {{session_donation_amount}}. */
	SESSION_DONATION_AMOUNT = "session_donation_amount",
	/** Session donation currency code. Use as {{session_donation_amount_currency}}. */
	SESSION_DONATION_AMOUNT_CURRENCY = "session_donation_amount_currency",
	/** Session donation currency symbol. Use as {{session_donation_amount_currency_symbol}}. */
	SESSION_DONATION_AMOUNT_CURRENCY_SYMBOL = "session_donation_amount_currency_symbol",
	/** All-time donation count. Use as {{donation_count}}. */
	DONATION_COUNT = "donation_count",
	/** Session donation count. Use as {{session_donation_count}}. */
	SESSION_DONATION_COUNT = "session_donation_count",
	/** Session donators list. Use as {{session_donator_list}}. */
	SESSION_DONATOR_LIST = "session_donator_list",
	/** Session donators with amounts. Use as {{session_donator_list_with_amount}}. */
	SESSION_DONATOR_LIST_WITH_AMOUNT = "session_donator_list_with_amount",
	/** Raw donation total ignoring currency. Use as {{total_raw_donation_amount}}. */
	TOTAL_RAW_DONATION_AMOUNT = "total_raw_donation_amount",
	/** Raffle title. Use as {{raffle_title}}. */
	RAFFLE_TITLE = "raffle_title",
	/** Raffle description. Use as {{raffle_description}}. */
	RAFFLE_DESCRIPTION = "raffle_description",
	/** Raffle entries (comma-separated). Use as {{raffle_entries}}. */
	RAFFLE_ENTRIES = "raffle_entries",
	/** Raffle generated number. Use as {{raffle_generated_number}}. */
	RAFFLE_GENERATED_NUMBER = "raffle_generated_number",
	/** Raffle entries count. Use as {{raffle_entries_count}}. */
	RAFFLE_ENTRIES_COUNT = "raffle_entries_count",
	/** Raffle winners (comma-separated). Use as {{raffle_winners}}. */
	RAFFLE_WINNERS = "raffle_winners",
	/** Raffle type/mode. Use as {{raffle_type}}. */
	RAFFLE_TYPE = "raffle_type",
	/** Current/last raffle winner username. Use as {{raffle_winner}}. */
	RAFFLE_WINNER = "raffle_winner",
	/** Raffle winner avatar URL. Use as {{raffle_winner_avatar}}. */
	RAFFLE_WINNER_AVATAR = "raffle_winner_avatar",
	/** Command used to enter the raffle (e.g., !join). Use as {{raffle_entry_command}}. */
	RAFFLE_ENTRY_COMMAND = "raffle_entry_command",
	/** Viewer queue title. Use as {{viewerqueue_title}}. */
	VIEWERQUEUE_TITLE = "viewerqueue_title",
	/** Viewer queue entry command (e.g., !joinq). Use as {{viewerqueue_entry_command}}. */
	VIEWERQUEUE_ENTRY_COMMAND = "viewerqueue_entry_command",
	/** Viewer queue entries (comma-separated). Use as {{viewerqueue_entries}}. */
	VIEWERQUEUE_ENTRIES = "viewerqueue_entries",
	/** Viewer queue selected players (comma-separated). Use as {{viewerqueue_players}}. */
	VIEWERQUEUE_PLAYERS = "viewerqueue_players",
	/** Viewer queue entries count. Use as {{viewerqueue_entries_count}}. */
	VIEWERQUEUE_ENTRIES_COUNT = "viewerqueue_entries_count",
	/** Viewer queue max entries limit. Use as {{viewerqueue_queue_limit}}. */
	VIEWERQUEUE_QUEUE_LIMIT = "viewerqueue_queue_limit",
	/** Response from most recent API Action (JSON stringified). Use as {{api_action_global_response}}. */
	API_ACTION_GLOBAL_RESPONSE = "api_action_global_response",
	/** Last RANDOM_INPUT selection. Use as {{last_random_input}}. */
	LAST_RANDOM_INPUT = "last_random_input",
	/** Loyalty currency display name (e.g., Lumipoints). Use as {{loyalty_currency_name}}. */
	LOYALTY_CURRENCY_NAME = "loyalty_currency_name",
	/** Time a user has followed (followage). Use as {{twitch_followage}}. */
	TWITCH_FOLLOWAGE = "twitch_followage",
	/** Time until next ad. Use as {{twitch_next_ad}}. */
	TWITCH_NEXT_AD = "twitch_next_ad",
	/** Get avatar by username. Example: {{twitch_get_avatar={{message}}}}. Use as {{twitch_get_avatar}}. */
	TWITCH_GET_AVATAR = "twitch_get_avatar",
	/** Channel user ID. Use as {{twitch_user_id}}. */
	TWITCH_USER_ID = "twitch_user_id",
	/** Channel username. Use as {{twitch_username}}. */
	TWITCH_USERNAME = "twitch_username",
	/** Current viewer count. Use as {{twitch_current_viewer_count}}. */
	TWITCH_CURRENT_VIEWER_COUNT = "twitch_current_viewer_count",
	/** Current viewers (comma-separated). Use as {{twitch_current_viewers}}. */
	TWITCH_CURRENT_VIEWERS = "twitch_current_viewers",
	/** Lifetime follower count. Use as {{twitch_total_follower_count}}. */
	TWITCH_TOTAL_FOLLOWER_COUNT = "twitch_total_follower_count",
	/** Current followers (comma-separated). Use as {{twitch_current_followers}}. */
	TWITCH_CURRENT_FOLLOWERS = "twitch_current_followers",
	/** Session followers count. Use as {{twitch_session_follower_count}}. */
	TWITCH_SESSION_FOLLOWER_COUNT = "twitch_session_follower_count",
	/** Current subscribers (comma-separated). Use as {{twitch_current_subscribers}}. */
	TWITCH_CURRENT_SUBSCRIBERS = "twitch_current_subscribers",
	/** Lifetime total subs. Use as {{twitch_total_subscriber_count}}. */
	TWITCH_TOTAL_SUBSCRIBER_COUNT = "twitch_total_subscriber_count",
	/** Session subs count. Use as {{twitch_session_subscribers_count}}. */
	TWITCH_SESSION_SUBSCRIBERS_COUNT = "twitch_session_subscribers_count",
	/** Session gifts count. Use as {{twitch_session_gifts_count}}. */
	TWITCH_SESSION_GIFTS_COUNT = "twitch_session_gifts_count",
	/** Current moderators (comma-separated). Use as {{twitch_current_mods}}. */
	TWITCH_CURRENT_MODS = "twitch_current_mods",
	/** Last follower. Use as {{twitch_last_follower}}. */
	TWITCH_LAST_FOLLOWER = "twitch_last_follower",
	/** Session followers list. Use as {{twitch_session_follower}}. */
	TWITCH_SESSION_FOLLOWERS = "twitch_session_follower",
	/** Last subscriber. Use as {{twitch_last_subscriber}}. */
	TWITCH_LAST_SUBSCRIBER = "twitch_last_subscriber",
	/** Session subscribers list. Use as {{twitch_session_subscribers}}. */
	TWITCH_SESSION_SUBSCRIBERS = "twitch_session_subscribers",
	/** Session chat count. Use as {{twitch_session_chat_count}}. */
	TWITCH_SESSION_CHAT_COUNT = "twitch_session_chat_count",
	/** Current first chatter. Use as {{twitch_current_first_chatter}}. */
	TWITCH_CURRENT_FIRST_CHATTER = "twitch_current_first_chatter",
	/** Current first chatter count. Use as {{twitch_current_first_chatter_count}}. */
	TWITCH_CURRENT_FIRST_CHATTER_COUNT = "twitch_current_first_chatter_count",
	/** Previous first chatter. Use as {{twitch_previous_first_chatter}}. */
	TWITCH_PREVIOUS_FIRST_CHATTER = "twitch_previous_first_chatter",
	/** Previous first chatter count. Use as {{twitch_previous_first_chatter_count}}. */
	TWITCH_PREVIOUS_FIRST_CHATTER_COUNT = "twitch_previous_first_chatter_count",
	/** Last chatter. Use as {{twitch_last_chatter}}. */
	TWITCH_LAST_CHATTER = "twitch_last_chatter",
	/** Last raider. Use as {{twitch_last_raider}}. */
	TWITCH_LAST_RAIDER = "twitch_last_raider",
	/** Last raid amount. Use as {{twitch_last_raid_amount}}. */
	TWITCH_LAST_RAID_AMOUNT = "twitch_last_raid_amount",
	/** Session raiders list. Use as {{twitch_session_raiders}}. */
	TWITCH_SESSION_RAIDERS = "twitch_session_raiders",
	/** Lifetime bits total. Use as {{twitch_total_bits_count}}. */
	TWITCH_TOTAL_BITS_COUNT = "twitch_total_bits_count",
	/** Session bits count. Use as {{twitch_session_bits_count}}. */
	TWITCH_SESSION_BITS_COUNT = "twitch_session_bits_count",
	/** Last bit sender. Use as {{twitch_last_bit}}. */
	TWITCH_LAST_BIT = "twitch_last_bit",
	/** Last bit amount. Use as {{twitch_last_bit_amount}}. */
	TWITCH_LAST_BIT_AMOUNT = "twitch_last_bit_amount",
	/** Session bits list. Use as {{twitch_session_bits}}. */
	TWITCH_SESSION_BITS = "twitch_session_bits",
	/** Session bits with amounts list. Use as {{twitch_session_bits_with_amount}}. */
	TWITCH_SESSION_BITS_WITH_AMOUNT = "twitch_session_bits_with_amount",
	/** Last clip ID. Use as {{twitch_last_clip_id}}. */
	TWITCH_LAST_CLIP_ID = "twitch_last_clip_id",
	/** Last clip URL. Use as {{twitch_last_clip_url}}. */
	TWITCH_LAST_CLIP_URL = "twitch_last_clip_url",
	/** Last clip thumbnail URL. Use as {{twitch_last_clip_thumbnail_url}}. */
	TWITCH_LAST_CLIP_THUMBNAIL_URL = "twitch_last_clip_thumbnail_url",
	/** Channel title. Use as {{twitch_channel_title}}. */
	TWITCH_CHANNEL_TITLE = "twitch_channel_title",
	/** Channel description. Use as {{twitch_channel_description}}. */
	TWITCH_CHANNEL_DESCRIPTION = "twitch_channel_description",
	/** Channel avatar URL. Use as {{twitch_avatar}}. */
	TWITCH_AVATAR = "twitch_avatar",
	/** Offline image URL. Use as {{twitch_offline_image}}. */
	TWITCH_OFFLINE_IMAGE = "twitch_offline_image",
	/** Current category/game. Use as {{twitch_category}}. */
	TWITCH_CATEGORY = "twitch_category",
	/** Current category/game ID. Use as {{twitch_category_id}}. */
	TWITCH_CATEGORY_ID = "twitch_category_id",
	/** Current poll ID. Use as {{twitch_current_poll_id}}. */
	TWITCH_CURRENT_POLL_ID = "twitch_current_poll_id",
	/** Current prediction ID. Use as {{twitch_current_prediction_id}}. */
	TWITCH_CURRENT_PREDICTION_ID = "twitch_current_prediction_id",
	/** Current viewer count. Use as {{youtube_current_viewer_count}}. */
	YOUTUBE_CURRENT_VIEWER_COUNT = "youtube_current_viewer_count",
	/** Total viewer count (stream). Use as {{youtube_total_viewer_count}}. */
	YOUTUBE_TOTAL_VIEWER_COUNT = "youtube_total_viewer_count",
	/** Stream likes. Use as {{youtube_stream_likes}}. */
	YOUTUBE_STREAM_LIKES = "youtube_stream_likes",
	/** Stream dislikes. Use as {{youtube_stream_dislikes}}. */
	YOUTUBE_STREAM_DISLIKES = "youtube_stream_dislikes",
	/** Stream chat message count. Use as {{youtube_stream_chat_count}}. */
	YOUTUBE_STREAM_CHAT_COUNT = "youtube_stream_chat_count",
	/** Session chat count. Use as {{youtube_session_chat_count}}. */
	YOUTUBE_SESSION_CHAT_COUNT = "youtube_session_chat_count",
	/** Current first chatter. Use as {{youtube_current_first_chatter}}. */
	YOUTUBE_CURRENT_FIRST_CHATTER = "youtube_current_first_chatter",
	/** Current first chatter count. Use as {{youtube_current_first_chatter_count}}. */
	YOUTUBE_CURRENT_FIRST_CHATTER_COUNT = "youtube_current_first_chatter_count",
	/** Previous first chatter. Use as {{youtube_previous_first_chatter}}. */
	YOUTUBE_PREVIOUS_FIRST_CHATTER = "youtube_previous_first_chatter",
	/** Previous first chatter count. Use as {{youtube_previous_first_chatter_count}}. */
	YOUTUBE_PREVIOUS_FIRST_CHATTER_COUNT = "youtube_previous_first_chatter_count", // keep exact value
	/** Last chatter. Use as {{youtube_last_chatter}}. */
	YOUTUBE_LAST_CHATTER = "youtube_last_chatter",
	/** Session subscriber count. Use as {{youtube_session_subscriber_count}}. */
	YOUTUBE_SESSION_SUBSCRIBER_COUNT = "youtube_session_subscriber_count",
	/** Lifetime subscriber count. Use as {{youtube_total_subscriber_count}}. */
	YOUTUBE_TOTAL_SUBSCRIBER_COUNT = "youtube_total_subscriber_count",
	/** Session SuperChat count. Use as {{youtube_session_superchat_count}}. */
	YOUTUBE_SESSION_SUPERCHAT_COUNT = "youtube_session_superchat_count",
	/** Last SuperChatter. Use as {{youtube_last_superchatter}}. */
	YOUTUBE_LAST_SUPERCHATTER = "youtube_last_superchatter",
	/** Session SuperChatters (list). Use as {{youtube_session_superchatters}}. */
	YOUTUBE_SESSION_SUPERCHATTERS = "youtube_session_superchatters",
	/** Session SuperSticker count. Use as {{youtube_session_supersticker_count}}. */
	YOUTUBE_SESSION_SUPERSTICKER_COUNT = "youtube_session_supersticker_count",
	/** Last SuperSticker sender. Use as {{youtube_last_supersticker}}. */
	YOUTUBE_LAST_SUPERSTICKER = "youtube_last_supersticker",
	/** Session SuperStickers (list). Use as {{youtube_session_superstickers}}. */
	YOUTUBE_SESSION_SUPERSTICKERS = "youtube_session_superstickers",
	/** Lifetime member count. Use as {{youtube_total_member_count}}. */
	YOUTUBE_TOTAL_MEMBER_COUNT = "youtube_total_member_count",
	/** Session member count. Use as {{youtube_session_member_count}}. */
	YOUTUBE_SESSION_MEMBER_COUNT = "youtube_session_member_count",
	/** Last member. Use as {{youtube_last_member}}. */
	YOUTUBE_LAST_MEMBER = "youtube_last_member",
	/** Session members (list). Use as {{youtube_session_members}}. */
	YOUTUBE_SESSION_MEMBERS = "youtube_session_members",
	/** Last subscriber. Use as {{youtube_last_subscriber}}. */
	YOUTUBE_LAST_SUBSCRIBER = "youtube_last_subscriber",
	/** Total uploaded videos. Use as {{youtube_total_video_count}}. */
	YOUTUBE_TOTAL_VIDEO_COUNT = "youtube_total_video_count",
	/** Total channel views. Use as {{youtube_total_view_count}}. */
	YOUTUBE_TOTAL_VIEW_COUNT = "youtube_total_view_count",
	/** Session chat count. Use as {{facebook_session_chat_count}}. */
	FACEBOOK_SESSION_CHAT_COUNT = "facebook_session_chat_count",
	/** Current first chatter. Use as {{facebook_current_first_chatter}}. */
	FACEBOOK_CURRENT_FIRST_CHATTER = "facebook_current_first_chatter",
	/** Current first chatter count. Use as {{facebook_current_first_chatter_count}}. */
	FACEBOOK_CURRENT_FIRST_CHATTER_COUNT = "facebook_current_first_chatter_count",
	/** Previous first chatter. Use as {{facebook_previous_first_chatter}}. */
	FACEBOOK_PREVIOUS_FIRST_CHATTER = "facebook_previous_first_chatter",
	/** Previous first chatter count. Use as {{facebook_previous_first_chatter_count}}. */
	FACEBOOK_PREVIOUS_FIRST_CHATTER_COUNT = "facebook_previous_first_chatter_count", // keep exact value
	/** Last chatter. Use as {{facebook_last_chatter}}. */
	FACEBOOK_LAST_CHATTER = "facebook_last_chatter",
	/** Lifetime follower count. Use as {{facebook_total_follower_count}}. */
	FACEBOOK_TOTAL_FOLLOWER_COUNT = "facebook_total_follower_count",
	/** Session follower count. Use as {{facebook_session_follower_count}}. */
	FACEBOOK_SESSION_FOLLOWER_COUNT = "facebook_session_follower_count",
	/** Lifetime fan count. Use as {{facebook_total_fan_count}}. */
	FACEBOOK_TOTAL_FAN_COUNT = "facebook_total_fan_count",
	/** Session fan count. Use as {{facebook_session_fan_count}}. */
	FACEBOOK_SESSION_FAN_COUNT = "facebook_session_fan_count",
	/** Session reaction count. Use as {{facebook_reaction_count}}. */
	FACEBOOK_REACTION_COUNT = "facebook_reaction_count",
	/** Last Stars sender. Use as {{facebook_last_star}}. */
	FACEBOOK_LAST_STAR = "facebook_last_star",
	/** Last Stars amount. Use as {{facebook_last_star_amount}}. */
	FACEBOOK_LAST_STAR_AMOUNT = "facebook_last_star_amount",
	/** Session Stars list. Use as {{facebook_session_stars}}. */
	FACEBOOK_SESSION_STARS = "facebook_session_stars",
	/** Session Stars with amounts list. Use as {{facebook_session_stars_with_amount}}. */
	FACEBOOK_SESSION_STARS_WITH_AMOUNT = "facebook_session_stars_with_amount",
	/** Session chat count. Use as {{tiktok_session_chat_count}}. */
	TIKTOK_SESSION_CHAT_COUNT = "tiktok_session_chat_count",
	/** Current first chatter. Use as {{tiktok_current_first_chatter}}. */
	TIKTOK_CURRENT_FIRST_CHATTER = "tiktok_current_first_chatter",
	/** Current first chatter count. Use as {{tiktok_current_first_chatter_count}}. */
	TIKTOK_CURRENT_FIRST_CHATTER_COUNT = "tiktok_current_first_chatter_count",
	/** Previous first chatter. Use as {{tiktok_previous_first_chatter}}. */
	TIKTOK_PREVIOUS_FIRST_CHATTER = "tiktok_previous_first_chatter",
	/** Previous first chatter count. Use as {{tiktok_previous_first_chatter_count}}. */
	TIKTOK_PREVIOUS_FIRST_CHATTER_COUNT = "tiktok_previous_first_chatter_count", // keep exact value
	/** Last chatter. Use as {{tiktok_last_chatter}}. */
	TIKTOK_LAST_CHATTER = "tiktok_last_chatter",
	/** Current viewer count. Use as {{tiktok_current_viewer_count}}. */
	TIKTOK_CURRENT_VIEWER_COUNT = "tiktok_current_viewer_count",
	/** Lifetime follower count. Use as {{tiktok_total_follower_count}}. */
	TIKTOK_TOTAL_FOLLOWER_COUNT = "tiktok_total_follower_count",
	/** Session follower count. Use as {{tiktok_session_follower_count}}. */
	TIKTOK_SESSION_FOLLOWER_COUNT = "tiktok_session_follower_count",
	/** Session subscriber count. Use as {{tiktok_session_subscriber_count}}. */
	TIKTOK_SESSION_SUBSCRIBER_COUNT = "tiktok_session_subscriber_count",
	/** Session share count. Use as {{tiktok_session_share_count}}. */
	TIKTOK_SESSION_SHARE_COUNT = "tiktok_session_share_count",
	/** Last follower. Use as {{tiktok_last_follower}}. */
	TIKTOK_LAST_FOLLOWER = "tiktok_last_follower",
	/** Last subscriber. Use as {{tiktok_last_subscriber}}. */
	TIKTOK_LAST_SUBSCRIBER = "tiktok_last_subscriber",
	/** Last gifter. Use as {{tiktok_last_gifter}}. */
	TIKTOK_LAST_GIFTER = "tiktok_last_gifter",
	/** Session gifters (list). Use as {{tiktok_session_gifters}}. */
	TIKTOK_SESSION_GIFTERS = "tiktok_session_gifters",
	/** Session gifts (count/list). Use as {{tiktok_session_gifts}}. */
	TIKTOK_SESSION_GIFTS = "tiktok_session_gifts",
	/** Total gifts. Use as {{tiktok_total_gifts}}. */
	TIKTOK_TOTAL_GIFTS = "tiktok_total_gifts",
	/** Total likes. Use as {{tiktok_total_likes}}. */
	TIKTOK_TOTAL_LIKES = "tiktok_total_likes",
	/** Uploaded videos count. Use as {{tiktok_video_count}}. */
	TIKTOK_VIDEO_COUNT = "tiktok_video_count",
	/** Last video title. Use as {{tiktok_last_video_title}}. */
	TIKTOK_LAST_VIDEO_TITLE = "tiktok_last_video_title",
	/** Last video ID. Use as {{tiktok_last_video_id}}. */
	TIKTOK_LAST_VIDEO_ID = "tiktok_last_video_id",
	/** Last video link. Use as {{tiktok_last_video_link}}. */
	TIKTOK_LAST_VIDEO_LINK = "tiktok_last_video_link",
	/** Last video embed URL. Use as {{tiktok_last_video_embed}}. */
	TIKTOK_LAST_VIDEO_EMBED = "tiktok_last_video_embed",
	/** Channel user ID. Use as {{kick_user_id}}. */
	KICK_USER_ID = "kick_user_id",
	/** Channel username. Use as {{kick_username}}. */
	KICK_USERNAME = "kick_username",
	/** Channel title. Use as {{kick_channel_title}}. */
	KICK_CHANNEL_TITLE = "kick_channel_title",
	/** Channel description. Use as {{kick_channel_description}}. */
	KICK_CHANNEL_DESCRIPTION = "kick_channel_description",
	/** Channel avatar URL. Use as {{kick_avatar}}. */
	KICK_AVATAR = "kick_avatar",
	/** Current category. Use as {{kick_category}}. */
	KICK_CATEGORY = "kick_category",
	/** Current category ID. Use as {{kick_category_id}}. */
	KICK_CATEGORY_ID = "kick_category_id",
	/** Stream title. Use as {{kick_stream_title}}. */
	KICK_STREAM_TITLE = "kick_stream_title",
	/** Session chat count. Use as {{kick_session_chat_count}}. */
	KICK_SESSION_CHAT_COUNT = "kick_session_chat_count",
	/** Current first chatter. Use as {{kick_current_first_chatter}}. */
	KICK_CURRENT_FIRST_CHATTER = "kick_current_first_chatter",
	/** Current first chatter count. Use as {{kick_current_first_chatter_count}}. */
	KICK_CURRENT_FIRST_CHATTER_COUNT = "kick_current_first_chatter_count",
	/** Previous first chatter. Use as {{kick_previous_first_chatter}}. */
	KICK_PREVIOUS_FIRST_CHATTER = "kick_previous_first_chatter",
	/** Previous first chatter count. Use as {{kick_previous_first_chatter_count}}. */
	KICK_PREVIOUS_FIRST_CHATTER_COUNT = "kick_previous_first_chatter_count", // keep exact value
	/** Last chatter. Use as {{kick_last_chatter}}. */
	KICK_LAST_CHATTER = "kick_last_chatter",
	/** Current viewer count. Use as {{kick_current_viewer_count}}. */
	KICK_CURRENT_VIEWER_COUNT = "kick_current_viewer_count",
	/** Lifetime follower count. Use as {{kick_total_follower_count}}. */
	KICK_TOTAL_FOLLOWER_COUNT = "kick_total_follower_count",
	/** Session follower count. Use as {{kick_session_follower_count}}. */
	KICK_SESSION_FOLLOWER_COUNT = "kick_session_follower_count",
	/** Lifetime total subs. Use as {{kick_total_subscriber_count}}. */
	KICK_TOTAL_SUBSCRIBER_COUNT = "kick_total_subscriber_count",
	/** Session subs count. Use as {{kick_session_subscriber_count}}. */
	KICK_SESSION_SUBSCRIBER_COUNT = "kick_session_subscriber_count",
	/** Session gifts count. Use as {{kick_session_gifts_count}}. */
	KICK_SESSION_GIFTS_COUNT = "kick_session_gifts_count",
	/** Session subscribers list. Use as {{kick_session_subscribers}}. */
	KICK_SESSION_SUBSCRIBERS = "kick_session_subscribers",
	/** Last user to send a Kicks. Use as {{kick_last_kicks}}. */
	KICK_LAST_KICKS = "kick_last_kicks",
	/** Last amount of a Kicks sent. Use as {{kick_last_kicks_amount}}. */
	KICK_LAST_KICKS_AMOUNT = "kick_last_kicks_amount",
	/** Lifetime kicks count. Use as {{kick_total_kicks_count}}. */
	KICK_TOTAL_KICKS_COUNT = "kick_total_kicks_count",
	/** Session kicks count. Use as {{kick_session_kicks_count}}. */
	KICK_SESSION_KICKS_COUNT = "kick_session_kicks_count",
	/** Session kicks list. Use as {{kick_session_kicks}}. */
	KICK_SESSION_KICKS = "kick_session_kicks",
	/** Session kicks with amounts list. Use as {{kick_session_kicks_with_amount}}. */
	KICK_SESSION_KICKS_WITH_AMOUNT = "kick_session_kicks_with_amount",
	/** Last follower. Use as {{kick_last_follower}}. */
	KICK_LAST_FOLLOWER = "kick_last_follower",
	/** Last subscriber. Use as {{kick_last_subscriber}}. */
	KICK_LAST_SUBSCRIBER = "kick_last_subscriber",
	/** Get avatar by username. Use as {{kick_get_avatar}}. */
	KICK_GET_AVATAR = "kick_get_avatar",
	/** Live status (true/false). Use as {{trovo_live}}. */
	TROVO_LIVE = "trovo_live",
	/** Session chat count. Use as {{trovo_session_chat_count}}. */
	TROVO_SESSION_CHAT_COUNT = "trovo_session_chat_count",
	/** Last follower. Use as {{trovo_last_follower}}. */
	TROVO_LAST_FOLLOWER = "trovo_last_follower",
	/** Current first chatter. Use as {{trovo_current_first_chatter}}. */
	TROVO_CURRENT_FIRST_CHATTER = "trovo_current_first_chatter",
	/** Current first chatter count. Use as {{trovo_current_first_chatter_count}}. */
	TROVO_CURRENT_FIRST_CHATTER_COUNT = "trovo_current_first_chatter_count",
	/** Previous first chatter. Use as {{trovo_previous_first_chatter}}. */
	TROVO_PREVIOUS_FIRST_CHATTER = "trovo_previous_first_chatter",
	/** Previous first chatter count. Use as {{trovo_previous_first_chatter_count}}. */
	TROVO_PREVIOUS_FIRST_CHATTER_COUNT = "trovo_previous_first_chatter_count", // keep exact value
	/** Last chatter. Use as {{trovo_last_chatter}}. */
	TROVO_LAST_CHATTER = "trovo_last_chatter",
	/** Last raid amount. Use as {{trovo_last_raid_amount}}. */
	TROVO_LAST_RAID_AMOUNT = "trovo_last_raid_amount",
	/** Last raider. Use as {{trovo_last_raider}}. */
	TROVO_LAST_RAIDER = "trovo_last_raider",
	/** Session follower count. Use as {{trovo_session_follower_count}}. */
	TROVO_SESSION_FOLLOWER_COUNT = "trovo_session_follower_count",
	/** Session subscribers count. Use as {{trovo_session_subscribers_count}}. */
	TROVO_SESSION_SUBSCRIBERS_COUNT = "trovo_session_subscribers_count",
	/** Session raiders list. Use as {{trovo_session_raiders}}. */
	TROVO_SESSION_RAIDERS = "trovo_session_raiders",
	/** Last subscriber. Use as {{trovo_last_subscriber}}. */
	TROVO_LAST_SUBSCRIBER = "trovo_last_subscriber",
	/** Session subscribers list. Use as {{trovo_session_subscribers}}. */
	TROVO_SESSION_SUBSCRIBERS = "trovo_session_subscribers",
	/** Now playing song title. Use as {{spotify_now_playing_song}}. */
	SPOTIFY_NOW_PLAYING_SONG = "spotify_now_playing_song",
	/** Now playing artwork URL. Use as {{spotify_now_playing_image}}. */
	SPOTIFY_NOW_PLAYING_IMAGE = "spotify_now_playing_image",
	/** Now playing artist(s). Use as {{spotify_now_playing_artist}}. */
	SPOTIFY_NOW_PLAYING_ARTIST = "spotify_now_playing_artist",
	/** Now playing track ID. Use as {{spotify_now_playing_id}}. */
	SPOTIFY_NOW_PLAYING_ID = "spotify_now_playing_id",
	/** Now playing track URL. Use as {{spotify_now_playing_url}}. */
	SPOTIFY_NOW_PLAYING_URL = "spotify_now_playing_url",
	/** Now playing Spotify URI. Use as {{spotify_now_playing_uri}}. */
	SPOTIFY_NOW_PLAYING_URI = "spotify_now_playing_uri",
	/** Next song title. Use as {{spotify_next_song}}. */
	SPOTIFY_NEXT_SONG = "spotify_next_song",
	/** Next song artwork URL. Use as {{spotify_next_image}}. */
	SPOTIFY_NEXT_IMAGE = "spotify_next_image",
	/** Next song artist(s). Use as {{spotify_next_artist}}. */
	SPOTIFY_NEXT_ARTIST = "spotify_next_artist",
	/** Next song ID. Use as {{spotify_next_id}}. */
	SPOTIFY_NEXT_ID = "spotify_next_id",
	/** Next song URL. Use as {{spotify_next_url}}. */
	SPOTIFY_NEXT_URL = "spotify_next_url",
	/** Next song Spotify URI. Use as {{spotify_next_uri}}. */
	SPOTIFY_NEXT_URI = "spotify_next_uri",
	/** Current queue (comma-separated). Use as {{spotify_queue}}. */
	SPOTIFY_QUEUE = "spotify_queue",
	/** Now playing song title. Use as {{youtubemusic_now_playing_song}}. */
	YOUTUBEMUSIC_NOW_PLAYING_SONG = "youtubemusic_now_playing_song",
	/** Now playing artwork URL. Use as {{youtubemusic_now_playing_image}}. */
	YOUTUBEMUSIC_NOW_PLAYING_IMAGE = "youtubemusic_now_playing_image",
	/** Now playing artist(s). Use as {{youtubemusic_now_playing_artist}}. */
	YOUTUBEMUSIC_NOW_PLAYING_ARTIST = "youtubemusic_now_playing_artist",
	/** Now playing ID. Use as {{youtubemusic_now_playing_id}}. */
	YOUTUBEMUSIC_NOW_PLAYING_ID = "youtubemusic_now_playing_id",
	/** Now playing URL. Use as {{youtubemusic_now_playing_url}}. */
	YOUTUBEMUSIC_NOW_PLAYING_URL = "youtubemusic_now_playing_url",
	/** Next song title. Use as {{youtubemusic_next_song}}. */
	YOUTUBEMUSIC_NEXT_SONG = "youtubemusic_next_song",
	/** Next song artwork URL. Use as {{youtubemusic_next_image}}. */
	YOUTUBEMUSIC_NEXT_IMAGE = "youtubemusic_next_image",
	/** Next song artist(s). Use as {{youtubemusic_next_artist}}. */
	YOUTUBEMUSIC_NEXT_ARTIST = "youtubemusic_next_artist",
	/** Next song ID. Use as {{youtubemusic_next_id}}. */
	YOUTUBEMUSIC_NEXT_ID = "youtubemusic_next_id",
	/** Next song URL. Use as {{youtubemusic_next_url}}. */
	YOUTUBEMUSIC_NEXT_URL = "youtubemusic_next_url",
	/** Current queue (comma-separated). Use as {{youtubemusic_queue}}. */
	YOUTUBEMUSIC_QUEUE = "youtubemusic_queue",
	/** Track ID (computed). Use as {{now_playing_id}}. */
	NOW_PLAYING_ID = "now_playing_id",
	/** Track title. Use as {{now_playing_title}}. */
	NOW_PLAYING_TITLE = "now_playing_title",
	/** Artwork URL. Use as {{now_playing_artwork}}. */
	NOW_PLAYING_ARTWORK = "now_playing_artwork",
	/** Artist name(s). Use as {{now_playing_artist}}. */
	NOW_PLAYING_ARTIST = "now_playing_artist",
	/** Album name. Use as {{now_playing_album}}. */
	NOW_PLAYING_ALBUM = "now_playing_album",
	/** Label. Use as {{now_playing_label}}. */
	NOW_PLAYING_LABEL = "now_playing_label",
	/** BPM. Use as {{now_playing_bpm}}. */
	NOW_PLAYING_BPM = "now_playing_bpm",
	/** Rating. Use as {{now_playing_rating}}. */
	NOW_PLAYING_RATING = "now_playing_rating",
	/** Length (seconds). Use as {{now_playing_length}}. */
	NOW_PLAYING_LENGTH = "now_playing_length",
	/** Comment. Use as {{now_playing_comment}}. */
	NOW_PLAYING_COMMENT = "now_playing_comment",
	/** Musical key. Use as {{now_playing_key}}. */
	NOW_PLAYING_KEY = "now_playing_key",
	/** Generic URL. Use as {{now_playing_url}}. */
	NOW_PLAYING_URL = "now_playing_url",
	/** Spotify URL. Use as {{now_playing_spotify_url}}. */
	NOW_PLAYING_SPOTIFY_URL = "now_playing_spotify_url",
	/** Beatport URL. Use as {{now_playing_beatport_url}}. */
	NOW_PLAYING_BEATPORT_URL = "now_playing_beatport_url",
	/** Beatport ID. Use as {{now_playing_beatport_id}}. */
	NOW_PLAYING_BEATPORT_ID = "now_playing_beatport_id",
	/** File path to media. Use as {{now_playing_file_path}}. */
	NOW_PLAYING_FILE_PATH = "now_playing_file_path",
	/** Currently playing media title. Use as {{vlc_now_playing_media}}. */
	VLC_NOW_PLAYING_MEDIA = "vlc_now_playing_media",
	/** Artwork URL. Use as {{vlc_now_playing_image}}. */
	VLC_NOW_PLAYING_IMAGE = "vlc_now_playing_image",
	/** Artist(s). Use as {{vlc_now_playing_artist}}. */
	VLC_NOW_PLAYING_ARTIST = "vlc_now_playing_artist",
	/** Media ID. Use as {{vlc_now_playing_id}}. */
	VLC_NOW_PLAYING_ID = "vlc_now_playing_id",
	/** Media URL. Use as {{vlc_now_playing_url}}. */
	VLC_NOW_PLAYING_URL = "vlc_now_playing_url",
	/** Media URI. Use as {{vlc_now_playing_uri}}. */
	VLC_NOW_PLAYING_URI = "vlc_now_playing_uri",
	/** Voice changer on (true/false). Use as {{voicemod_voice_changer_on}}. */
	VOICEMOD_VOICE_CHANGER_ON = "voicemod_voice_changer_on",
	/** Previous voice. Use as {{voicemod_previous_voice}}. */
	VOICEMOD_PREVIOUS_VOICE = "voicemod_previous_voice",
	/** Current voice. Use as {{voicemod_current_voice}}. */
	VOICEMOD_CURRENT_VOICE = "voicemod_current_voice",
	/** Last order full name. Use as {{woocommerce_last_order_name}}. */
	WOOCOMMERCE_LAST_ORDER_NAME = "woocommerce_last_order_name",
	/** Last order first name. Use as {{woocommerce_last_order_first_name}}. */
	WOOCOMMERCE_LAST_ORDER_FIRST_NAME = "woocommerce_last_order_first_name",
	/** Last order last name. Use as {{woocommerce_last_order_last_name}}. */
	WOOCOMMERCE_LAST_ORDER_LAST_NAME = "woocommerce_last_order_last_name",
	/** Last ordered item (first). Use as {{woocommerce_last_order_item}}. */
	WOOCOMMERCE_LAST_ORDER_ITEM = "woocommerce_last_order_item",
	/** Last ordered items (list). Use as {{woocommerce_last_order_items}}. */
	WOOCOMMERCE_LAST_ORDER_ITEMS = "woocommerce_last_order_items",
	/** Last order amount. Use as {{woocommerce_last_order_amount}}. */
	WOOCOMMERCE_LAST_ORDER_AMOUNT = "woocommerce_last_order_amount",
	/** Last order amount currency code. Use as {{woocommerce_last_order_amount_currency}}. */
	WOOCOMMERCE_LAST_ORDER_AMOUNT_CURRENCY = "woocommerce_last_order_amount_currency",
	/** Is streaming (true/false). Use as {{obs_is_streaming}}. */
	OBS_IS_STREAMING = "obs_is_streaming",
	/** Is recording (true/false). Use as {{obs_is_recording}}. */
	OBS_IS_RECORDING = "obs_is_recording",
	/** Last recording path. Use as {{obs_last_recording_path}}. */
	OBS_LAST_RECORDING_PATH = "obs_last_recording_path",
	/** Studio mode on (true/false). Use as {{obs_studio_mode}}. */
	OBS_STUDIO_MODE = "obs_studio_mode",
	/** Current profile. Use as {{obs_current_profile}}. */
	OBS_CURRENT_PROFILE = "obs_current_profile",
	/** Current scene. Use as {{obs_current_scene}}. */
	OBS_CURRENT_SCENE = "obs_current_scene",
	/** Previous scene. Use as {{obs_previous_scene}}. */
	OBS_PREVIOUS_SCENE = "obs_previous_scene",
	/** Current transition (if transitioning). Use as {{obs_current_transition}}. */
	OBS_CURRENT_TRANSITION = "obs_current_transition",
	/** Last replay buffer save path. Use as {{obs_last_replay_buffer_path}}. */
	OBS_LAST_REPLAY_BUFFER_PATH = "obs_last_replay_buffer_path",
	/** Last vertical backtrack save path. Use as {{obs_last_vertical_backtrack_path}}. */
	OBS_LAST_VERTICAL_BACKTRACK_PATH = "obs_last_vertical_backtrack_path",
	/** Current scene. Use as {{slobs_current_scene}}. */
	SLOBS_CURRENT_SCENE = "slobs_current_scene",
	/** Previous scene. Use as {{slobs_previous_scene}}. */
	SLOBS_PREVIOUS_SCENE = "slobs_previous_scene",
	/** Current scene collection. Use as {{slobs_current_scene_collection}}. */
	SLOBS_CURRENT_SCENE_COLLECTION = "slobs_current_scene_collection",
	/** Last Streamer.bot action. Use as {{streamerbot_last_action}}. */
	STREAMERBOT_LAST_ACTION = "streamerbot_last_action",
	/** Current VTS model. Use as {{vtubestudio_current_model}}. */
	VTUBESTUDIO_CURRENT_MODEL = "vtubestudio_current_model",
	/** Current VTS background. Use as {{vtubestudio_current_background}}. */
	VTUBESTUDIO_CURRENT_BACKGROUND = "vtubestudio_current_background",
	/** Last VTS hotkey triggered. Use as {{vtubestudio_last_hotkey_triggered}}. */
	VTUBESTUDIO_LAST_HOTKEY_TRIGGERED = "vtubestudio_last_hotkey_triggered",
	/** Heart rate BPM (Pulsoid/Hyperate). Use as {{heartrate_bpm}}. */
	HEARTRATE_BPM = "heartrate_bpm",
}

// <auto-generated-end name="SystemVariables" />
