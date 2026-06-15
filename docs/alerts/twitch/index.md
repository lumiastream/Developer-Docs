---
sidebar_position: 0
id: alerts-twitch-index
title: Twitch alerts
description: Every alert Lumia emits for Twitch.
---

# Twitch alerts

53 alerts available. Each page documents the message template, payload fields, and example scenarios.

| Alert | Description |
| --- | --- |
| [Ad Started](./ad-started.mdx) | ad started |
| [Ad Stopped](./ad-stopped.mdx) | ad stopped |
| [Banned](./banned.mdx) | banned |
| [Bits](./bits.mdx) | cheered `{{amount}}` bits |
| [Bits Combo](./bits-combo.mdx) | finished a bits combo with `{{amount}}` bits |
| [Category Changed](./category-changed.mdx) | Category changed to `{{category_name}}` |
| [Channel Join](./channel-join.mdx) | joined the channel |
| [Channel Leave](./channel-leave.mdx) | left the channel |
| [Charity Campaign Progressed](./charity-campaign-progressed.mdx) | Charity campaign `{{charity_name}}` progressed to `{{currencySymbol}}``{{charity_amount}}` with a target of `{{currencySymbol}}``{{charity_target_amount}}` |
| [Charity Campaign Started](./charity-campaign-started.mdx) | Charity campaign `{{charity_name}}` started with a target of `{{currencySymbol}}``{{charity_target_amount}}` |
| [Charity Campaign Stopped](./charity-campaign-stopped.mdx) | Charity campaign `{{charity_name}}` ended at amount `{{currencySymbol}}``{{charity_amount}}` with a target of `{{currencySymbol}}``{{charity_target_amount}}` |
| [Charity Donation](./charity-donation.mdx) | tipped `{{currencySymbol}}``{{amount}}` |
| [Clip](./clip.mdx) | created a clip |
| [Entrance](./entrance.mdx) | Entrance |
| [Extension](./extension.mdx) | redeemed `{{command}}` for `{{amount}}` `{{amount_type}}` |
| [First Chatter](./first-chatter.mdx) | was the first chatter |
| [Follower](./follower.mdx) | became a follower |
| [Gift Subscription](./gift-subscription.mdx) | gifted `{{giftAmount}}` `{{tier}}` subs to `{{recipients}}` |
| [Goal Ended](./goal-ended.mdx) | Goal `{{goal_description}}` ended at amount `{{goal_amount}}` with a target of `{{goal_target_amount}}` |
| [Goal Progressed](./goal-progressed.mdx) | Goal `{{goal_description}}` progressed to `{{goal_amount}}` with a target of `{{goal_target_amount}}` |
| [Goal Started](./goal-started.mdx) | Goal `{{goal_description}}` started with a target of `{{goal_target_amount}}` |
| [Hypetrain Ended](./hypetrain-ended.mdx) | Hype train ended on level `{{level}}` and reached a total of `{{total}}` |
| [Hypetrain Level Progressed](./hypetrain-level-progressed.mdx) | Hype train progressed to level `{{level}}` |
| [Hypetrain Progressed](./hypetrain-progressed.mdx) | Hype train progressed to `{{progress}}` |
| [Hypetrain Started](./hypetrain-started.mdx) | Hype train started |
| [Modiversary](./modiversary.mdx) | celebrated their `{{months}}` month modiversary |
| [Points](./points.mdx) | redeemed `{{command}}` for `{{amount}}` points |
| [Poll Ended](./poll-ended.mdx) | Poll `{{poll_title}}` ended! The winning choice is: `{{poll_winning_title}}` with a total of `{{poll_winning_votes}}` votes |
| [Poll Progressed](./poll-progressed.mdx) | Poll `{{poll_title}}` updated and the current leader is `{{poll_winning_title}}` |
| [Poll Started](./poll-started.mdx) | Poll started `{{poll_title}}` with choices `{{poll_choices}}` |
| [Powerups](./powerups.mdx) | redeemed `{{type}}` for `{{amount}}` bits |
| [Prediction Ended](./prediction-ended.mdx) | Prediction `{{prediction_title}}` ended. The current leader is `{{prediction_winning_outcome_title}}` with `{{prediction_winning_outcome_points}}` points |
| [Prediction Locked](./prediction-locked.mdx) | Prediction `{{prediction_title}}` locked. The current leader is `{{prediction_winning_outcome_title}}` with `{{prediction_winning_outcome_points}}` points |
| [Prediction Progressed](./prediction-progressed.mdx) | Prediction `{{prediction_title}}` progressed. The current leader is `{{prediction_winning_outcome_title}}` with `{{prediction_winning_outcome_points}}` points |
| [Prediction Started](./prediction-started.mdx) | Prediction started with the title `{{prediction_title}}`! Choices are `{{prediction_outcome1_title}}` or `{{prediction_outcome2_title}}` |
| [Raid](./raid.mdx) | raided with `{{viewers}}` viewers |
| [Raid Out](./raid-out.mdx) | raided out `{{username}}` with `{{viewers}}` viewers |
| [Session Bits](./session-bits.mdx) | reached `{{total}}` bits |
| [Session Followers](./session-followers.mdx) | reached `{{total}}` followers |
| [Session Gift Subscriptions](./session-gift-subscriptions.mdx) | reached `{{total}}` gift subscriptions |
| [Session Subs](./session-subs.mdx) | reached `{{total}}` subscribers |
| [Shield Mode Ended](./shield-mode-ended.mdx) | Shield mode ended by `{{username}}` |
| [Shield Mode Started](./shield-mode-started.mdx) | Shield mode started by `{{username}}` |
| [Shoutout Receive](./shoutout-receive.mdx) | shoutout |
| [Stream Live](./stream-live.mdx) | - |
| [Stream Offline](./stream-offline.mdx) | - |
| [Subscriber](./subscriber.mdx) | subscribed with a `{{tier}}` sub |
| [Suspicious User Message](./suspicious-user-message.mdx) | `{{username}}` (`{{low_trust_status}}`) sent a message |
| [Suspicious User Updated](./suspicious-user-updated.mdx) | `{{username}}` updated to `{{low_trust_status}}` by `{{moderator}}` |
| [Timeout](./timeout.mdx) | timed out |
| [Timeout Over](./timeout-over.mdx) | time out over |
| [Warned](./warned.mdx) | `{{username}}` was warned for `{{reason}}` |
| [Watch Streak](./watch-streak.mdx) | reached a watch streak of `{{streak_count}}` and earned `{{amount}}` points |
