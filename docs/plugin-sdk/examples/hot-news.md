---
sidebar_position: 3
title: Hot News Plugin
---

Source: https://github.com/lumiastream/Plugin-SDK/tree/main/examples/hot_news

Example Lumia Stream plugin that taps into [NewsAPI.org](https://newsapi.org/) to surface breaking headlines. It keeps Lumia variables in sync with the freshest story, pushes a compact JSON payload of recent results, and triggers an alert whenever a brand-new headline lands for your selected topic.

## Features

- Polls NewsAPI for top headlines using optional country, category, and keyword filters.
- Stores the latest headline details (title, summary, URL, image, published time) in Lumia variables.
- Persists a JSON bundle (`hotnews_recent_articles`) with up to 20 stories for overlays or chat commands.
- Detects unseen headlines and fires a configurable Lumia alert.
- Manual actions let you refresh immediately or run an on-demand topic search.

## Requirements

1. Create a free NewsAPI account and generate an API key: https://newsapi.org/register.
2. Enter the key in the **NewsAPI Key** setting (stored client-side only).
3. Adjust country/category/keyword filters to match the coverage you want.

Warning: NewsAPI free tiers enforce daily request limits (currently 100 requests/day) and block commercial usage. Increase the poll interval if you are close to the limit.

## Settings

| Setting | Default | Description |
| ------- | ------- | ----------- |
| `apiKey` | - | Your NewsAPI key (required). |
| `country` | `us` | Country code to localise headlines (set blank to disable). |
| `category` | `""` | Optional NewsAPI category filter (business, sports, etc.). |
| `query` | `""` | Keyword/phrase filter to focus on a specific topic. |
| `pollInterval` | 300s | How often to refresh headlines (clamped 60-1800s). |
| `resultsLimit` | 5 | Number of articles to pull per refresh (1-20). |
| `enableAlerts` | true | Toggle alerts when a headline appears that has not been seen before. |

## Actions

- `hotnews_manual_refresh` - Fetch headlines immediately using the saved settings.
- `hotnews_search_topic` - Run a one-off search with a custom keyword/limit (does not fire alerts).

## Alerts

| Alert Key | Default Message | Trigger |
| --------- | --------------- | ------- |
| `hotnews_new_headline` | `HOT {{hotnews_latest_title}} ({{hotnews_latest_source}})` | Fired when a new headline is detected and alerts are enabled. |

## Variables

- `hotnews_latest_title`
- `hotnews_latest_description`
- `hotnews_latest_url`
- `hotnews_latest_source`
- `hotnews_latest_image`
- `hotnews_latest_published`
- `hotnews_article_count`
- `hotnews_recent_articles` - JSON payload with `keyword`, `count`, and `articles[]` (title, source, url, image, description, publishedAt).
- `hotnews_keyword`
- `hotnews_last_updated`

## Extending The Plugin

- Add additional alert types keyed on source names or categories (for example, "Tech Update" when `source` matches your favourite publication).
- Store the full `payload.totalResults` in another variable to track overall volume for a topic.
- Layer in NewsAPI's `/everything` endpoint for deeper historical searches (watch the request quota).
- Use the `hotnews_recent_articles` JSON inside a custom Lumia overlay to render a scrolling news ticker.
