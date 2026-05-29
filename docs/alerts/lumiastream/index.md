---
sidebar_position: 0
id: alerts-lumiastream-index
title: Lumia alerts
description: Every alert Lumia emits for Lumia.
---

# Lumia alerts

21 alerts available. Each page documents the message template, payload fields, and example scenarios.

| Alert | Description |
| --- | --- |
| [Donation](./donation.mdx) | tipped `{{currencySymbol}}``{{amount}}` "`{{message}}`" |
| [Lumia Closed](./lumia-closed.mdx) | - |
| [Lumia Opened](./lumia-opened.mdx) | - |
| [Poll Ended](./poll-ended.mdx) | Poll `{{poll_title}}` ended! The winning choice is: `{{poll_winning_title}}` with a total of `{{poll_winning_votes}}` votes |
| [Poll Progressed](./poll-progressed.mdx) | Poll `{{poll_title}}` updated and the current leader is `{{poll_winning_title}}` |
| [Poll Started](./poll-started.mdx) | Poll started `{{poll_title}}` with choices `{{poll_choices}}` |
| [Raffle Start](./raffle-start.mdx) | `{{raffle_title}}` started! Type `{{raffle_entry_command}}` to enter |
| [Raffle Stop](./raffle-stop.mdx) | `{{raffle_title}}` has stopped! Winners will be drawn soon |
| [Raffle Winner](./raffle-winner.mdx) | Congratulations `{{raffle_winner}}` for being selected in this raffle! |
| [Roulette Winner](./roulette-winner.mdx) | Congratulations `{{username}}`! The ball landed on `{{ball_position}}`. You win `{{outcome_amount}}` `{{loyalty_currency_name}}`! Well played! 🎉 |
| [Slots Winner](./slots-winner.mdx) | Congratulations `{{username}}`! you rolled `{{slots_combo}}` and won `{{outcome_amount}}` `{{loyalty_currency_name}}`. 🎉 |
| [Spinwheel Winner](./spinwheel-winner.mdx) | Congratulations `{{spinwheel_winner}}` for winning `{{spinwheel_item}}`! |
| [Streammode Off](./streammode-off.mdx) | - |
| [Streammode On](./streammode-on.mdx) | - |
| [Tournament End](./tournament-end.mdx) | `{{tournament_title}}` has ended! |
| [Tournament Start](./tournament-start.mdx) | `{{tournament_title}}` started! Type `{{tournament_entry_command}}` to join the tournament |
| [Tournament Winner](./tournament-winner.mdx) | Congratulations `{{tournament_winner}}` for winning `{{tournament_title}}`! |
| [Variable Changed](./variable-changed.mdx) | `{{variable_name}}` changed to `{{variable_value}}` |
| [Viewer Achievement](./viewer-achievement.mdx) | `{{username}}` unlocked the `{{achievement_name}}` achievement! |
| [Viewerqueue Ended](./viewerqueue-ended.mdx) | Viewer Queue `{{viewerqueue_title}}` Ended! |
| [Viewerqueue Started](./viewerqueue-started.mdx) | Viewer Queue `{{viewerqueue_title}}` Started! |
