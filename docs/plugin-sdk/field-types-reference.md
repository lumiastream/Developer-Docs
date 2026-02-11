---
sidebar_position: 5
---

# Plugin Field Types Reference

This document provides a quick reference for all available field types that can be used in plugin settings and action definitions.

## Overview

Both `settings` and `actions` in your plugin manifest support various field types for collecting user input.

Property support is not identical between settings and actions:
- Settings support `disabled` and richer string-length validation (`minLength`/`maxLength`).
- Action fields support runtime-oriented options such as `allowVariables`, `dynamicOptions`, and multi-select via `multiple`.

## Supported Field Types

### Text Input Types

#### `text`
Single-line text input with optional variable support (set `allowVariables: true`).

```json
{
  "key": "username",
  "label": "Username",
  "type": "text",
  "placeholder": "Enter username",
  "helperText": "Supports variables like {{username}}"
}
```

**Properties:**
- `placeholder` - Placeholder text
- `validation.pattern` - Regex pattern for validation
- `validation.minLength` - Minimum character length (settings)
- `validation.maxLength` - Maximum character length (settings)
- `allowVariables` - Enable template variables for action fields

---

#### `email`
Email address input with built-in validation and optional variable support (set `allowVariables: true`).

```json
{
  "key": "userEmail",
  "label": "Email Address",
  "type": "email",
  "placeholder": "user@example.com",
  "required": true
}
```

**Properties:**
- Same as `text` with automatic email input validation

---

#### `url`
URL input with built-in validation and optional variable support (set `allowVariables: true`).

```json
{
  "key": "webhookUrl",
  "label": "Webhook URL",
  "type": "url",
  "placeholder": "https://example.com/webhook",
  "required": true
}
```

**Properties:**
- Same as `text` with automatic URL input validation

---

#### `password`
Password input with hidden characters.

```json
{
  "key": "apiKey",
  "label": "API Key",
  "type": "password",
  "placeholder": "Enter your API key",
  "helperText": "Get this from your service dashboard",
  "required": true
}
```

**Properties:**
- Same as `text` but displays hidden characters
- Actions do not currently expose `password` fields

---

#### `textarea`
Multi-line text input with optional variable support (set `allowVariables: true`) and configurable rows.

```json
{
  "key": "message",
  "label": "Message",
  "type": "textarea",
  "placeholder": "Enter your message",
  "rows": 6,
  "helperText": "Multi-line text with variable support"
}
```

**Properties:**
- `rows` - Number of visible text rows (default: 4)
- `placeholder` - Placeholder text
- `validation.pattern` - Regex pattern for validation
- `validation.minLength` - Minimum character length (settings)
- `validation.maxLength` - Maximum character length (settings)
- `allowVariables` - Enable template variables for action fields

---

#### `text_list`
Multi-value text input that stores an array of strings. Settings only.

```json
{
  "key": "lightIds",
  "label": "Light IDs",
  "type": "text_list",
  "helperText": "Add one or more light identifiers",
  "defaultValue": ["keylight-1", "keylight-2"]
}
```

**Properties:**
- Outputs an array of strings (e.g., `["one", "two"]`)
- `defaultValue` should be an array of strings

---

### Numeric Input Types

#### `number`
Numeric input with optional constraints.

```json
{
  "key": "volume",
  "label": "Volume",
  "type": "number",
  "defaultValue": 50,
  "validation": {
    "min": 0,
    "max": 100
  }
}
```

**Properties:**
- `validation.min` - Minimum value (settings and actions)
- `validation.max` - Maximum value (settings and actions)
- `min` - Minimum value (action fields)
- `max` - Maximum value (action fields)
- `allowVariables` - Enable template variables for action fields

---

#### `slider`
Numeric slider input with visual feedback.

```json
{
  "key": "brightness",
  "label": "Brightness",
  "type": "slider",
  "defaultValue": 100,
  "min": 0,
  "max": 255,
  "step": 5
}
```

**Properties:**
- `min` - Minimum value (action fields)
- `max` - Maximum value (action fields)
- `step` - Increment step (action fields)
- `validation.min` - Minimum value (settings and actions)
- `validation.max` - Maximum value (settings and actions)

---

### Selection Types

#### `select`
Dropdown selection from predefined options.

```json
{
  "key": "mode",
  "label": "Mode",
  "type": "select",
  "defaultValue": "normal",
  "options": [
    { "label": "Normal", "value": "normal" },
    { "label": "Fast", "value": "fast" },
    { "label": "Slow", "value": "slow" }
  ]
}
```

**Properties:**
- `options` - Array of objects with `label` and `value` properties (required)
- `allowTyping` - Allow typing a custom value in addition to dropdown options (settings and actions)
- `multiple` - Allow selecting multiple options; value becomes an array (action fields)
- `allowVariables` - Enable template variable insertion (action fields)
- `dynamicOptions` - Allow runtime option updates from plugin code (action fields)

---

#### `multiselect`
Multi-value dropdown selection for **settings** fields.

```json
{
  "key": "enabledGames",
  "label": "Enabled Games",
  "type": "multiselect",
  "defaultValue": ["valorant", "rocket_league"],
  "options": [
    { "label": "Valorant", "value": "valorant" },
    { "label": "Rocket League", "value": "rocket_league" },
    { "label": "Overwatch", "value": "overwatch" }
  ]
}
```

**Properties:**
- `options` - Array of objects with `label` and `value` properties (required)
- Stored value is always an array of selected option values

---

### Boolean Types

#### `checkbox`
Boolean checkbox input.

```json
{
  "key": "enableNotifications",
  "label": "Enable Notifications",
  "type": "checkbox",
  "defaultValue": true
}
```

**Properties:**
- Accepts boolean values (`true`/`false`)

---

#### `switch` / `toggle`
Toggle switch for boolean values (`toggle` in settings, `switch` in actions).

```json
{
  "key": "autoStart",
  "label": "Auto Start",
  "type": "switch",
  "defaultValue": false,
  "helperText": "Automatically start on load"
}
```

**Properties:**
- Accepts boolean values (`true`/`false`)
- Use `toggle` for settings and `switch` for actions

---

### Special Input Types

#### `color`
Color picker that outputs hex color values.

```json
{
  "key": "backgroundColor",
  "label": "Background Color",
  "type": "color",
  "defaultValue": "#000000",
  "helperText": "Choose a background color"
}
```

**Properties:**
- Outputs hex color strings (e.g., `#FF0000`)
- Default value should be in hex format

---

#### `file`
File path input with file browser dialog.

```json
{
  "key": "audioFile",
  "label": "Audio File",
  "type": "file",
  "helperText": "Select an audio file to play"
}
```

**Properties:**
- Opens native file picker dialog
- Returns absolute file path as string
- `allowVariables` - Enable template variable insertion for action fields

---

#### `json`
Structured JSON input stored as an object/array value.

```json
{
  "key": "detectionRegion",
  "label": "Detection Region",
  "type": "json",
  "defaultValue": {
    "x": 0.72,
    "y": 0.02,
    "width": 0.27,
    "height": 0.45,
    "unit": "ratio"
  },
  "helperText": "Enter valid JSON."
}
```

**Properties:**
- Renders as a multiline editor in auth/settings UIs
- Accepts JSON object/array input
- Stored value is parsed JSON (not raw text)

---

#### `roi`
Structured region-of-interest editor for screen detection coordinates.

```json
{
  "key": "killFeedRoi",
  "label": "Kill Feed ROI",
  "type": "roi",
  "defaultValue": {
    "x": 0.72,
    "y": 0.02,
    "width": 0.27,
    "height": 0.45,
    "unit": "ratio"
  },
  "helperText": "Use ratio (0-1) or pixels for the detection region."
}
```

**Properties:**
- Renders dedicated `x`/`y`/`width`/`height` controls plus unit (`ratio` or `pixels`)
- Stored value is an object with `{ x, y, width, height, unit }`
- `ratio` values are constrained to `0..1`; `pixels` values are absolute coordinates

---

## Field Type Matrix

| Type | Settings | Actions | Variables | Validation | Notes |
|------|----------|---------|-----------|------------|-------|
| `text` | ✅ | ✅ | With `allowVariables` | pattern, length | Single-line input |
| `email` | ✅ | ✅ | With `allowVariables` | auto | Email validation |
| `url` | ✅ | ✅ | With `allowVariables` | auto | URL validation |
| `password` | ✅ | ❌ | ❌ | pattern, length (settings) | Hidden characters |
| `textarea` | ✅ | ✅ | With `allowVariables` | pattern, length (settings) | Multi-line, rows configurable |
| `text_list` | ✅ | ❌ | ❌ | - | Array of strings |
| `number` | ✅ | ✅ | With `allowVariables` | min, max | Numeric input (`min`/`max` top-level on actions) |
| `slider` | ✅ | ✅ | ❌ | min, max | Visual slider (`min`/`max`/`step` top-level on actions) |
| `select` | ✅ | ✅ | With `allowVariables` | - | Dropdown, supports `allowTyping`; `multiple`/`dynamicOptions` on actions |
| `multiselect` | ✅ | ❌ | ❌ | - | Multi-value dropdown for settings |
| `checkbox` | ✅ | ✅ | ❌ | - | Boolean checkbox |
| `switch`/`toggle` | ✅ | ✅ | ❌ | - | `toggle` in settings, `switch` in actions |
| `color` | ✅ | ✅ | ❌ | - | Color picker |
| `file` | ✅ | ✅ | With `allowVariables` | - | File browser |
| `json` | ✅ | ❌ | ❌ | JSON parse | Structured object/array editor |
| `roi` | ✅ | ❌ | ❌ | ROI shape + numeric bounds | Region-of-interest editor |

## Common Properties

### Setting Fields (`config.settings`)

```json
{
  "key": "fieldKey",           // Required: Unique identifier for the field
  "label": "Field Label",       // Required: Display label
  "type": "text",              // Required: Field type
  "placeholder": "...",        // Optional: Placeholder text
  "helperText": "...",         // Optional: Help text below field
  "defaultValue": null,        // Optional: Default value (string, number, boolean, string[], or JSON object/array)
  "required": false,           // Optional: Whether field is required
  "disabled": false,           // Optional: Render read-only in UI
  "hidden": false,             // Optional: Do not render this field in UI
  "visibleIf": {               // Optional: Conditional visibility
    "key": "captureMode",
    "equals": "custom"
  },
  "section": "Detection",      // Optional: Top-level settings tab name
  "sectionOrder": 1,           // Optional: Section/tab sort order (ascending)
  "group": {                   // Optional: In-section grouped container
    "key": "valorant",
    "label": "Valorant Detection",
    "helperText": "Character-specific rules",
    "visibleIf": {
      "key": "enabledGames",
      "equals": "valorant"
    }
  },
  "allowTyping": false,        // Optional: Select fields only
  "rows": 4,                   // Optional: Textarea only
  "options": [],               // Optional: Select fields
  "validation": {              // Optional
    "pattern": "^[a-z]+$",
    "min": 0,
    "max": 100,
    "minLength": 1,
    "maxLength": 100
  }
}
```

`visibleIf` follows overlay syntax:
- `visibleIf.key`: another field key to check
- `visibleIf.equals`: expected value (scalar or array)
- Match behavior:
  - If current value is array and `equals` is array: visible if any overlap
  - If current value is array and `equals` is scalar: visible if array includes scalar
  - If current value is scalar and `equals` is array: visible if array includes scalar
  - If both scalar: strict equality

`group.visibleIf` uses the exact same syntax and behavior as `visibleIf`.

#### Sections vs Groups (How Layout Works)

Use both together, but for different jobs:

- `section`: creates top-level tabs in plugin settings (`Basics`, `Detection`, `Advanced`, etc.)
- `sectionOrder`: controls tab ordering (lower numbers appear first)
- `group`: creates a visual container inside a section so related fields are shown together
- `group.visibleIf`: hides/shows the entire group container at once
- field-level `visibleIf`: still applies per field even when the field is inside a group

Resolution rules used by Lumia:

- Section label priority: `field.section` -> `group.section` -> `General`
- Group shorthand is allowed: `"group": "my_group"` (uses key as label)
- Group metadata form is allowed: `"group": { "key": "my_group", ... }`
- If the same group key is reused, define label/helper text once in the first object-form declaration

UI rendering shape:

```text
Plugin Settings
├─ Tab: Connection            (section="Connection")
│  ├─ Field: API Key
│  └─ Field: Poll Interval
└─ Tab: Detection             (section="Detection")
   ├─ Group: Valorant Rules   (group="valorant_rules")
   │  ├─ Field: Kill Template
   │  └─ Field: ROI
   └─ Group: Rocket Rules     (group="rocket_rules")
      ├─ Field: Goal Template
      └─ Field: ROI
```

#### Example A: Sections Only

Use this when you only need tabs and no inner container.

```json
{
  "config": {
    "settings": [
      {
        "key": "apiKey",
        "label": "API Key",
        "type": "password",
        "section": "Connection",
        "sectionOrder": 1
      },
      {
        "key": "enabledGames",
        "label": "Enabled Games",
        "type": "multiselect",
        "section": "Detection",
        "sectionOrder": 2,
        "options": [
          { "label": "Valorant", "value": "valorant" },
          { "label": "Overwatch", "value": "overwatch" }
        ]
      },
      {
        "key": "cooldownMs",
        "label": "Cooldown (ms)",
        "type": "number",
        "section": "Detection",
        "sectionOrder": 2,
        "defaultValue": 1200
      }
    ]
  }
}
```

#### Example B: Sections + Groups

Use this when one section has multiple sub-areas that should be visually separated.

```json
{
  "config": {
    "settings": [
      {
        "key": "enabledGames",
        "label": "Enabled Games",
        "type": "multiselect",
        "section": "Detection",
        "sectionOrder": 2,
        "options": [
          { "label": "Valorant", "value": "valorant" },
          { "label": "Rocket League", "value": "rocket_league" }
        ]
      },
      {
        "key": "valorantTemplate",
        "label": "Kill Icon Template",
        "type": "file",
        "section": "Detection",
        "group": {
          "key": "valorant_rules",
          "label": "Valorant Rules",
          "helperText": "Templates and ROI for Valorant events.",
          "order": 1,
          "visibleIf": {
            "key": "enabledGames",
            "equals": "valorant"
          }
        }
      },
      {
        "key": "valorantRoi",
        "label": "Valorant ROI",
        "type": "roi",
        "section": "Detection",
        "group": "valorant_rules"
      },
      {
        "key": "rocketLeagueTemplate",
        "label": "Goal Template",
        "type": "file",
        "section": "Detection",
        "group": {
          "key": "rocket_league_rules",
          "label": "Rocket League Rules",
          "order": 2
        },
        "visibleIf": {
          "key": "enabledGames",
          "equals": "rocket_league"
        }
      }
    ]
  }
}
```

In this example:

- `Detection` is one tab (`section`)
- `valorant_rules` and `rocket_league_rules` are two separate containers (`group`) inside that tab
- Valorant container visibility is controlled by `group.visibleIf`
- Rocket League field visibility is controlled by field-level `visibleIf`

### Action Fields (`config.actions[].fields`)

```json
{
  "key": "fieldKey",           // Required: Unique identifier for the field
  "label": "Field Label",       // Required: Display label
  "type": "text",              // Required: Field type
  "placeholder": "...",        // Optional: Placeholder text
  "helperText": "...",         // Optional: Help text below field
  "defaultValue": null,        // Optional: Any JSON value
  "required": false,           // Optional: Whether field is required
  "allowVariables": false,     // Optional: Enable {{variable}} insertion
  "dynamicOptions": false,     // Optional: Select fields that receive runtime options
  "allowTyping": false,        // Optional: Select fields
  "multiple": false,           // Optional: Select fields
  "rows": 4,                   // Optional: Textarea only
  "min": 0,                    // Optional: Numeric and slider style fields
  "max": 100,                  // Optional: Numeric and slider style fields
  "step": 1,                   // Optional: Slider/number increment
  "options": [],               // Optional: Select fields
  "validation": {              // Optional
    "pattern": "^[a-z]+$",
    "min": 0,
    "max": 100
  }
}
```

## Validation Options

Validation shape differs between settings and action fields.

### Settings Validation (`config.settings[].validation`)
```json
{
  "validation": {
    "pattern": "^[a-zA-Z0-9]+$",  // Regex pattern
    "min": 0,                      // Numeric minimum
    "max": 100,                    // Numeric maximum
    "minLength": 5,                // Minimum character length
    "maxLength": 50                // Maximum character length
  }
}
```

### Action Validation (`config.actions[].fields[].validation`)
```json
{
  "validation": {
    "pattern": "^[a-zA-Z0-9]+$",  // Regex pattern
    "min": 0,                      // Numeric minimum
    "max": 100                     // Numeric maximum
  }
}
```

## Variable Support

Variable support for **action fields** is controlled by `allowVariables`.
- Set `allowVariables: true` to enable variables for any field.
- When omitted, variables are not enabled (including `select` fields with `allowTyping`).

Settings fields do not expose variable insertion in the UI.

## Example: Complete Action with Multiple Field Types

```json
{
  "type": "send_notification",
  "label": "Send Custom Notification",
  "description": "Send a customizable notification with various options",
  "fields": [
    {
      "key": "title",
      "label": "Title",
      "type": "text",
      "required": true,
      "placeholder": "Notification title"
    },
    {
      "key": "message",
      "label": "Message",
      "type": "textarea",
      "required": true,
      "rows": 4,
      "placeholder": "Enter your message here..."
    },
    {
      "key": "priority",
      "label": "Priority",
      "type": "select",
      "defaultValue": "normal",
      "options": [
        { "label": "Low", "value": "low" },
        { "label": "Normal", "value": "normal" },
        { "label": "High", "value": "high" }
      ]
    },
    {
      "key": "backgroundColor",
      "label": "Background Color",
      "type": "color",
      "defaultValue": "#000000"
    },
    {
      "key": "volume",
      "label": "Sound Volume",
      "type": "slider",
      "defaultValue": 50,
      "min": 0,
      "max": 100,
      "step": 5
    },
    {
      "key": "playSound",
      "label": "Play Sound",
      "type": "switch",
      "defaultValue": true
    },
    {
      "key": "soundFile",
      "label": "Custom Sound File",
      "type": "file",
      "helperText": "Optional: Select a custom sound file"
    }
  ]
}
```

## Best Practices

1. **Use appropriate types**: Choose the most specific field type for your data (e.g., `email` instead of `text` for email addresses).

2. **Provide defaults**: Set sensible `defaultValue` properties to improve user experience.

3. **Add validation**: Use validation rules to prevent user errors early.

4. **Write helpful text**: Use `helperText` to guide users on what to enter.

5. **Consider UX**: Use `slider` for ranges, `select` for limited choices, and `textarea` for long text.

6. **Variable support**: Leverage variable substitution in text fields for dynamic content.

7. **Consistent naming**: Use clear, descriptive `key` names (e.g., `apiKey`, `webhookUrl`, `backgroundColor`).

## See Also

- [Manifest Guide](./manifest-guide) - Complete manifest documentation
- [API Reference](./api-reference) - Plugin API methods
- [Getting Started](./getting-started) - Plugin development guide
