/* -------------------------------------------------------------------------- */
/*  Utility + shared pieces                                                  */
/* -------------------------------------------------------------------------- */

type Timing = { checkTimingType: true; timingType: 'duration'; duration: number } | { checkTimingType: true; timingType: 'cycle'; cycles: number };

interface BaseAlert<T extends string, D extends object, E extends object> {
	alert: T;
	/** Becomes the correct shape once `alert` is narrowed. */
	dynamic: D;
	/** Common “timing” props plus the alert-specific extras. */
	extraSettings: E & Timing & { site: string; timestamp: string };
	fromLumia: true;
}

/* -------------------------------------------------------------------------- */
/*  Per-alert specialisations                                               */
/* -------------------------------------------------------------------------- */

type TwitchFollower = BaseAlert<
	'twitch-follower',
	Record<string, never>,
	{
		avatar: string;
		userId: string;
		username: string;
		displayname: string;
		channelViews: number;
		channelDescription: string;
	}
>;

type TwitchRaid = BaseAlert<
	'twitch-raid',
	{ value: number; username: string },
	{
		avatar: string;
		userId: string;
		username: string;
		displayname: string;
		channelViews: number;
		channelDescription: string | null;
		viewers: number;
		value: number;
	}
>;

type TwitchBits = BaseAlert<
	'twitch-bits',
	{ value: number; username: string },
	{
		bits: number;
		amount: number;
		value: number;
		avatar: string;
		userId: string;
		message: string | null;
		username: string;
		rawMessage: string;
		displayname: string;
		channelViews: number;
		full_message: string;
		channelDescription: string | null;
	}
>;

type TwitchSubscriber = BaseAlert<
	'twitch-subscriber',
	| {
			/** Normal / resub */
			value: '1000' | '2000' | '3000';
			username: string;
			subMonths: number;
			streakMonths: number;
			isPrime: boolean;
	  }
	| {
			/** Gift */
			value: '1000' | '2000' | '3000';
			username: string;
			subMonths: number;
			giftAmount: number;
			totalGifts: number;
			isGift: true;
			isAnon?: boolean;
			isPrime: boolean;
			isResub: boolean;
	  },
	{
		tier: string;
		value: '1000' | '2000' | '3000';
		avatar: string;
		gifter?: string;
		recipient?: string;
		recipients?: string;
		userId: string;
		message: string | null;
		subPlan: string;
		subPlanName: string;
		username: string;
		subMonths: number;
		streakMonths?: number;
		giftAmount?: number;
		totalGifts?: number;
		displayname: string;
		channelViews: number;
		channelDescription: string | null;
	}
>;

type TwitchPowerup = BaseAlert<
	'twitch-powerups',
	{ name: string; value: number; username: string },
	{
		bits: number;
		type: string;
		value: number;
		amount: number;
		avatar: string;
		userId: string;
		username: string;
		rawMessage: string | null;
		displayname: string;
		channelViews: number;
		full_message: string | null;
		channelDescription: string | null;
	}
>;

type TwitchExtension = BaseAlert<
	'twitch-extension',
	{ username: string; name: string; currency: 'points' | 'bits' },
	{
		bits: number;
		amount: number;
		avatar: string;
		origin: 'twitch-extension';
		userId: string;
		command: string;
		command_id: string;
		message: string;
		currency: 'points' | 'bits';
		amount_type: 'points' | 'bits';
		currencySymbol: string;
		platform: 'twitch';
		username: string;
		displayname: string;
		channelViews: string | number;
		full_message: string;
		channelDescription: string;
	}
>;

type TiltifyDonation = BaseAlert<
	'tiltify-campaignDonation',
	{ value: string; currency: string },
	{
		value: string;
		amount: string;
		message: string | null;
		currency: string;
		username: string;
		displayname: string;
	}
>;

type KickFollower = BaseAlert<
	'kick-follower',
	{ value: string },
	{
		avatar: string | null;
		userId: number;
		username: string;
		displayname: string;
	}
>;

type KickPoints = BaseAlert<
	'kick-points',
	{ value: number; name: string; currency: 'points' },
	{
		title: string;
		value: string;
		amount: number;
		origin: 'kick-points';
		points: number;
		prompt: string | null;
		userId: number;
		command: string;
		message: string | null;
		currency: 'points';
		platform: 'kick';
		username: string;
		rawMessage: string | null;
		amount_type: 'points';
		displayname: string;
		userLevelsRaw: {
			mod: boolean;
			vip: boolean;
			isSelf: boolean;
			follower: boolean;
			subscriber: boolean;
		};
		currencySymbol: string;
		lumiauserlevels: number[];
	}
>;

type TikTokGift = BaseAlert<
	'tiktok-gift',
	{ name: string; value: number },
	{
		coins: number;
		value: number;
		giftId: number;
		userId: string;
		describe: string;
		giftName: string;
		giftType: number;
		username: string;
		repeatEnd: boolean;
		repeatCount: number;
		diamondCount: number;
		giftPictureUrl: string;
		receiverUserId: string;
		profilePictureUrl: string;
		displayname: string;
		isNewGifter: boolean;
	}
>;

type YouTubeSubscriber = BaseAlert<
	'youtube-subscriber',
	{ value: string },
	{
		avatar: string;
		userId: string;
		username: string;
		displayname: string;
	}
>;

type YouTubeSuperSticker = BaseAlert<
	'youtube-supersticker',
	{ value: number },
	{
		amount: number;
		username: string;
		displayname: string;
	}
>;

type YouTubeSuperChat = BaseAlert<
	'youtube-superchat',
	{ value: number; currency: string; username: string },
	{
		value: number;
		amount: number;
		currency: string;
		username: string;
		displayname: string;
	}
>;

type YouTubeMember = BaseAlert<
	'youtube-member',
	{ value: string },
	{
		avatar: string;
		userId: string;
		username: string;
		displayname: string;
	}
>;

type CrowdControlEffect = BaseAlert<
	'crowdcontrol-effect',
	{ value: string },
	{
		game: string;
		value: string;
		avatar: string;
		effect: string;
		gameId: string;
		artwork: string;
		message: string;
		effectId: string;
		platform: 'twitch' | 'youtube' | 'kick';
		username: string;
		displayname: string;
		duration: number;
	}
>;

/* -------------------------------------------------------------------------- */
/*  All alerts together                                                     */
/* -------------------------------------------------------------------------- */

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

/* -------------------------------------------------------------------------- */
/*  Helpers – for dev ergonomics                                            */
/* -------------------------------------------------------------------------- */

export type AlertType = LumiaAlert['alert'];
export type AlertDynamic<T extends AlertType> = Extract<LumiaAlert, { alert: T }>['dynamic'];
export type AlertExtra<T extends AlertType> = Extract<LumiaAlert, { alert: T }>['extraSettings'];
