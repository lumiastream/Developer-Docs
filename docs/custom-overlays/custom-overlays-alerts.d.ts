/// <reference path="./custom-overlays.d.ts" />

/* -------------------------------------------------------------------------- */
/*  Utility + shared pieces                                                  */
/* -------------------------------------------------------------------------- */

/** Known platforms (extendable). */
type Platform =
	| "twitch"
	| "youtube"
	| "kick"
	| "tiktok"
	| "facebook"
	| "trovo"
	| string;

/** ISO-8601 timestamp branding for better editor hints. */
type ISODateString = string & { __iso8601: true };

/**
 * Timing metadata for alerts.
 * - `checkTimingType: false` → no timing info
 * - `timingType: "duration"` → show for a number of milliseconds
 * - `timingType: "cycle"` → show for a number of cycles (app-defined)
 */
type Timing =
	| { checkTimingType: false }
	| { checkTimingType: true; timingType: "duration"; duration: number }
	| { checkTimingType: true; timingType: "cycle"; cycles: number };

/**
 * Common fields many alerts include.
 * These are merged into each alert’s `extraSettings`.
 */
interface CommonExtras {
	/** Origin site/platform for this alert (e.g., "twitch"). */
	site: Platform;
	/** ISO-8601 timestamp when the alert originated. */
	timestamp: ISODateString;

	/** Username on the origin platform (if available). */
	username?: string;
	/** Display name on the origin platform (if available). */
	displayname?: string;
	/** User ID on the origin platform (string or number). */
	userId?: string | number;
	/** Avatar URL (nullable if not provided). */
	avatar?: string | null;
}

/**
 * Canonical base alert shape used by all specific alerts.
 * `dynamic` is narrowed automatically when `alert` is a specific discriminator.
 */
interface BaseAlert<
	T extends LumiaAlertValues,
	D extends object,
	E extends object
> {
	/** Discriminant – use values from LumiaAlertValues (e.g., "twitch-subscriber"). */
	alert: T;
	/** Alert payload that varies by alert type (narrowed via `alert`). */
	dynamic: D;
	/**
	 * Extra settings – alert-specific fields merged with shared `CommonExtras` and `Timing`.
	 * Do NOT duplicate CommonExtras fields in specialisations unless they truly differ.
	 */
	extraSettings: E & CommonExtras & Timing;
	/**
	 * Whether this alert originated from Lumia’s internal pipeline.
	 * Kept as boolean to make testing/mocking easier.
	 */
	fromLumia: boolean;
}

/* -------------------------------------------------------------------------- */
/*  Per-alert specialisations                                                */
/* -------------------------------------------------------------------------- */

/** New follower on Twitch. */
type TwitchFollower = BaseAlert<
	LumiaAlertValues.TWITCH_FOLLOWER,
	Record<string, never>,
	{
		/** Channel view count (at time of alert). */
		channelViews: number;
		/** Channel description text. */
		channelDescription: string;
	}
>;

/** Incoming raid on Twitch. */
type TwitchRaid = BaseAlert<
	LumiaAlertValues.TWITCH_RAID,
	{
		/** Raid size / viewer count. */
		value: number;
		/** Raider username (convenience duplicate). */
		username: string;
	},
	{
		/** Viewers included in the raid (vendor field). */
		viewers: number;
		/** Optional expanded channel description. */
		channelDescription: string | null;
		/** Avatar URL for raider. */
		avatar: string;
		/** Channel views for raider. */
		channelViews: number;
		/** Optional display message from the raider. */
		message?: string | null;
	}
>;

/** Cheer/Bits on Twitch (including PowerUps also modeled separately). */
type TwitchBits = BaseAlert<
	LumiaAlertValues.TWITCH_BITS,
	{
		/** Canonical numeric value of the contribution. */
		value: number;
		/** Cheer username. */
		username: string;
	},
	{
		/** Bits reported by vendor. */
		bits: number;
		/** Amount reported by vendor (kept for parity). */
		amount: number;
		/** Optional message accompanying the cheer. */
		message: string | null;
		/** Raw message string from the platform. */
		rawMessage: string;
		/** Full message (Lumia-computed, if present). */
		full_message: string;
		/** Channel views at time of alert. */
		channelViews: number;
		/** Channel description text. */
		channelDescription: string | null;
	}
>;

/** Subscription event on Twitch (sub, resub, gift). */
type TwitchSubscriber = BaseAlert<
	LumiaAlertValues.TWITCH_SUBSCRIBER,
	| {
			/** Tier value for sub/resub ("1000" | "2000" | "3000"). */
			value: "1000" | "2000" | "3000";
			/** Subscriber username. */
			username: string;
			/** Total months subbed. */
			subMonths: number;
			/** Current streak months. */
			streakMonths: number;
			/** Whether this is a Prime sub. */
			isPrime: boolean;
	  }
	| {
			/** Tier value for gifted sub. */
			value: "1000" | "2000" | "3000";
			/** Gifter username. */
			username: string;
			/** Recipient months (vendor value; may be present). */
			subMonths: number;
			/** Number of subs gifted in this event. */
			giftAmount: number;
			/** Cumulative gifted subs by this gifter. */
			totalGifts: number;
			/** Gift indicator. */
			isGift: true;
			/** Whether the gifter is anonymous. */
			isAnon?: boolean;
			/** Whether this event is Prime (rare for gifts). */
			isPrime: boolean;
			/** Whether this is a resub gift. */
			isResub: boolean;
	  },
	{
		/** Tier name ("Tier 1", "Tier 2", "Tier 3"). */
		subPlanName: string;
		/** Tier code ("1000" | "2000" | "3000"). */
		subPlan: string;
		/** Tier value duplicate for convenience. */
		value: "1000" | "2000" | "3000";
		/** Optional display/sticker message. */
		message: string | null;
		/** Gifter username, if applicable. */
		gifter?: string;
		/** Recipient username, if applicable. */
		recipient?: string;
		/** Comma-separated recipients (mass gift). */
		recipients?: string;
		/** Streak months (duplicated in dynamic for normal/resub). */
		streakMonths?: number;
		/** Gift bundle size (duplicated) */
		giftAmount?: number;
		/** Cumulative gift count by gifter. */
		totalGifts?: number;
		/** String tier (e.g., "Prime", "1000"). */
		tier: string;
	}
>;

/** Twitch PowerUps (bits-based effects). */
type TwitchPowerup = BaseAlert<
	LumiaAlertValues.TWITCH_POWERUPS,
	{
		/** Human-friendly name of the PowerUp. */
		name: string;
		/** Canonical numeric value (e.g., bits). */
		value: number;
		/** Username who triggered the PowerUp. */
		username: string;
	},
	{
		/** Bits reported by vendor. */
		bits: number;
		/** Vendor-provided type string. */
		type: string;
		/** Vendor amount (mirrors value). */
		amount: number;
		/** Raw chat message, if present. */
		rawMessage: string | null;
		/** Full message (Lumia-computed), if present. */
		full_message: string | null;
		/** Channel views at time of alert. */
		channelViews: number;
		/** Channel description text. */
		channelDescription: string | null;
	}
>;

/** Twitch Extension monetization / points. */
type TwitchExtension = BaseAlert<
	LumiaAlertValues.TWITCH_EXTENSION,
	{
		/** Redeemer username. */
		username: string;
		/** Item/extension name. */
		name: string;
		/** Currency type for the extension. */
		currency: "points" | "bits";
	},
	{
		/** Bits-based amount (when applicable). */
		bits: number;
		/** Numeric amount (points or bits). */
		amount: number;
		/** Origin tag for the event. */
		origin: "twitch-extension";
		/** Command invoked within the extension. */
		command: string;
		/** Command identifier. */
		command_id: string;
		/** Message text (extension-defined). */
		message: string;
		/** Currency string echo. */
		currency: "points" | "bits";
		/** Amount type echo. */
		amount_type: "points" | "bits";
		/** Currency symbol (if applicable). */
		currencySymbol: string;
		/** Platform is always "twitch" for this alert. */
		platform: "twitch";
		/** Channel views at time of alert (string|number to match vendor inconsistencies). */
		channelViews: string | number;
		/** Full message (Lumia-computed), if present. */
		full_message: string;
		/** Channel description text. */
		channelDescription: string;
	}
>;

/** Tiltify campaign donation. */
type TiltifyDonation = BaseAlert<
	LumiaAlertValues.TILTIFY_DONATION,
	{
		/** Canonical numeric donation amount. */
		value: number;
		/** ISO currency code (e.g., "USD"). */
		currency: string;
	},
	{
		/** Raw amount string as provided by vendor. */
		amount: string;
		/** Optional donor message. */
		message: string | null;
	}
>;

/** New follower on Kick. */
type KickFollower = BaseAlert<
	LumiaAlertValues.KICK_FOLLOWER,
	{
		/** Usually an empty string; keep for parity. */
		value: string;
	},
	{
		/** Nullable avatar URL. */
		avatar: string | null;
	}
>;

/** Kick channel “Points” (custom loyalty on Kick). */
type KickPoints = BaseAlert<
	LumiaAlertValues.KICK_POINTS,
	{
		/** Numeric points value used for this redemption. */
		value: number;
		/** Command/name of the points trigger. */
		name: string;
		/** Currency discriminator for points. */
		currency: "points";
	},
	{
		/** Display title for the points command. */
		title: string;
		/** Echo of numeric value as string. */
		value: string;
		/** Amount as number (same as numeric value). */
		amount: number;
		/** Origin tag for the event. */
		origin: "kick-points";
		/** Points value (duplicate). */
		points: number;
		/** Optional prompt text associated with the command. */
		prompt: string | null;
		/** The Kick command triggered. */
		command: string;
		/** Raw chat message (if present). */
		message: string | null;
		/** Platform discriminator. */
		platform: "kick";
		/** Raw message (not parsed). */
		rawMessage: string | null;
		/** Amount type echo. */
		amount_type: "points";
		/** Currency symbol (if set). */
		currencySymbol: string;
		/** Raw user levels map. */
		userLevelsRaw: {
			mod: boolean;
			vip: boolean;
			isSelf: boolean;
			follower: boolean;
			subscriber: boolean;
		};
		/** Lumia internal user levels. */
		lumiauserlevels: number[];
	}
>;

/** TikTok gift (coins/diamonds). */
type TikTokGift = BaseAlert<
	LumiaAlertValues.TIKTOK_GIFT,
	{
		/** Gift display name. */
		name: string;
		/** Canonical numeric value for this gift event. */
		value: number;
	},
	{
		/** TikTok coins value. */
		coins: number;
		/** Same as value (vendor echo). */
		value: number;
		/** Gift numeric ID. */
		giftId: number;
		/** Sender user ID. */
		userId: string;
		/** Gift description. */
		describe: string;
		/** Gift name (echo). */
		giftName: string;
		/** TikTok gift type code. */
		giftType: number;
		/** Sender username. */
		username: string;
		/** Whether repeat animation ended. */
		repeatEnd: boolean;
		/** Repeat count. */
		repeatCount: number;
		/** Diamonds for the gift. */
		diamondCount: number;
		/** URL of the gift picture. */
		giftPictureUrl: string;
		/** Receiver user ID, if applicable. */
		receiverUserId: string;
		/** Sender avatar URL. */
		profilePictureUrl: string;
		/** Sender display name. */
		displayname: string;
		/** Whether this is a new gifter. */
		isNewGifter: boolean;
	}
>;

/** New subscriber on YouTube. */
type YouTubeSubscriber = BaseAlert<
	LumiaAlertValues.YOUTUBE_SUBSCRIBER,
	{
		/** Usually an empty string; keep for parity. */
		value: string;
	},
	Record<string, never>
>;

/** YouTube SuperSticker. */
type YouTubeSuperSticker = BaseAlert<
	LumiaAlertValues.YOUTUBE_SUPERSTICKER,
	{
		/** Canonical numeric value of the sticker purchase. */
		value: number;
	},
	{
		/** Amount numeric (duplicate). */
		amount: number;
	}
>;

/** YouTube SuperChat. */
type YouTubeSuperChat = BaseAlert<
	LumiaAlertValues.YOUTUBE_SUPERCHAT,
	{
		/** Canonical numeric value for the SuperChat. */
		value: number;
		/** ISO currency code (e.g., "USD"). */
		currency: string;
		/** SuperChatter username. */
		username: string;
	},
	{
		/** Numeric amount (duplicate). */
		amount: number;
		/** Currency code (duplicate). */
		currency: string;
		/** Convenience duplicate of value for some toolchains. */
		value: number;
	}
>;

/** YouTube channel membership (join/renew). */
type YouTubeMember = BaseAlert<
	LumiaAlertValues.YOUTUBE_MEMBER,
	{
		/** Usually an empty string; keep for parity. */
		value: string;
	},
	Record<string, never>
>;

/** Crowd Control effect fired (for supported platforms). */
type CrowdControlEffect = BaseAlert<
	LumiaAlertValues.CROWDCONTROL_EFFECT,
	{
		/** Raw value (effect identifier or label). */
		value: string;
	},
	{
		/** Game name. */
		game: string;
		/** Effect label. */
		effect: string;
		/** Game ID (vendor). */
		gameId: string;
		/** Artwork URL for game/effect. */
		artwork: string;
		/** Optional message. */
		message: string;
		/** Effect ID. */
		effectId: string;
		/** Platform running the effect. */
		platform: "twitch" | "youtube" | "kick";
		/** Duration in milliseconds. */
		duration: number;
	}
>;

/* -------------------------------------------------------------------------- */
/*  All alerts together                                                      */
/* -------------------------------------------------------------------------- */

/** Discriminated union of all supported alerts. */
export type LumiaAlert =
	| TwitchFollower
	| TwitchRaid
	| TwitchBits
	| TwitchSubscriber
	| TwitchPowerup
	| TwitchExtension
	| TiltifyDonation
	| KickFollower
	| KickPoints
	| TikTokGift
	| YouTubeSubscriber
	| YouTubeSuperSticker
	| YouTubeSuperChat
	| YouTubeMember
	| CrowdControlEffect;

/**
 * Map from alert discriminator to its concrete alert type.
 * Useful for generic helpers and editor navigation.
 */
export interface AlertMap {
	[LumiaAlertValues.TWITCH_FOLLOWER]: TwitchFollower;
	[LumiaAlertValues.TWITCH_RAID]: TwitchRaid;
	[LumiaAlertValues.TWITCH_BITS]: TwitchBits;
	[LumiaAlertValues.TWITCH_SUBSCRIBER]: TwitchSubscriber;
	[LumiaAlertValues.TWITCH_POWERUPS]: TwitchPowerup;
	[LumiaAlertValues.TWITCH_EXTENSION]: TwitchExtension;
	[LumiaAlertValues.TILTIFY_DONATION]: TiltifyDonation;
	[LumiaAlertValues.KICK_FOLLOWER]: KickFollower;
	[LumiaAlertValues.KICK_POINTS]: KickPoints;
	[LumiaAlertValues.TIKTOK_GIFT]: TikTokGift;
	[LumiaAlertValues.YOUTUBE_SUBSCRIBER]: YouTubeSubscriber;
	[LumiaAlertValues.YOUTUBE_SUPERSTICKER]: YouTubeSuperSticker;
	[LumiaAlertValues.YOUTUBE_SUPERCHAT]: YouTubeSuperChat;
	[LumiaAlertValues.YOUTUBE_MEMBER]: YouTubeMember;
	[LumiaAlertValues.CROWDCONTROL_EFFECT]: CrowdControlEffect;
}

/* -------------------------------------------------------------------------- */
/*  Helpers – for dev ergonomics                                             */
/* -------------------------------------------------------------------------- */

/** "twitch-subscriber" | "kick-points" | ... (all alert discriminants). */
export type AlertType = LumiaAlert["alert"];

/** Dynamic payload for a specific alert type. */
export type AlertDynamic<T extends AlertType> = AlertMap[T]["dynamic"];

/** Extra settings (merged with CommonExtras & Timing) for a specific alert type. */
export type AlertExtra<T extends AlertType> = AlertMap[T]["extraSettings"];
