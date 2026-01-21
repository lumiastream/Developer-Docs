---
sidebar_position: 5
---

# Plugin Field Types Reference

This document provides a quick reference for all available field types that can be used in plugin settings and action definitions.

## Overview

Both `settings` and `actions` in your plugin manifest support various field types for collecting user input. All types support common properties like `key`, `label`, `placeholder`, `helperText`, `defaultValue`, and `required`.

## Supported Field Types

### Text Input Types

#### `text`
Single-line text input with variable support.

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
- `validation.minLength` - Minimum character length
- `validation.maxLength` - Maximum character length

---

#### `email`
Email address input with built-in validation and variable support.

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
- Same as `text` with automatic email validation

---

#### `url`
URL input with built-in validation and variable support.

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
- Same as `text` with automatic URL validation

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

---

#### `textarea`
Multi-line text input with variable support and configurable rows.

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
- `validation.minLength` - Minimum character length
- `validation.maxLength` - Maximum character length

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
- `validation.min` - Minimum value
- `validation.max` - Maximum value

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
- `min` - Minimum value (default: 0)
- `max` - Maximum value (default: 100)
- `step` - Increment step (default: 1)

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
Toggle switch for boolean values.

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
- `switch` and `toggle` are interchangeable

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

---

## Field Type Matrix

| Type | Settings | Actions | Variables | Validation | Notes |
|------|----------|---------|-----------|------------|-------|
| `text` | yes | yes | yes | pattern, length | Single-line input |
| `email` | yes | yes | yes | auto | Email validation |
| `url` | yes | yes | yes | auto | URL validation |
| `password` | yes | no | no | pattern, length | Hidden characters |
| `textarea` | yes | yes | yes | length | Multi-line, rows configurable |
| `number` | yes | yes | no | min, max | Numeric input |
| `slider` | yes | yes | no | min, max, step | Visual slider |
| `select` | yes | yes | no | - | Dropdown menu |
| `checkbox` | yes | yes | no | - | Boolean checkbox |
| `switch`/`toggle` | yes | yes | no | - | Toggle switch |
| `color` | yes | yes | no | - | Color picker |
| `file` | yes | yes | no | - | File browser |

## Common Properties

All field types support these common properties:

```json
{
  "key": "fieldKey",           // Required: Unique identifier for the field
  "label": "Field Label",       // Required: Display label
  "type": "text",              // Required: Field type
  "placeholder": "...",        // Optional: Placeholder text
  "helperText": "...",         // Optional: Help text below field
  "defaultValue": null,        // Optional: Default value
  "required": false            // Optional: Whether field is required
}
```

## Validation Options

Different field types support different validation options:

### Text-based Fields (text, email, url, password, textarea)
```json
{
  "validation": {
    "pattern": "^[a-zA-Z0-9]+$",  // Regex pattern
    "minLength": 5,                // Minimum character length
    "maxLength": 50                // Maximum character length
  }
}
```

### Numeric Fields (number, slider)
```json
{
  "validation": {
    "min": 0,      // Minimum value
    "max": 100     // Maximum value
  }
}
```

## Variable Support

The following field types support Lumia variable substitution (e.g., `{{username}}`):
- `text`
- `email`
- `url`
- `textarea`

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

- [Manifest Guide](./manifest-guide.md) - Complete manifest documentation
- [API Reference](./api-reference.md) - Plugin API methods
- [Getting Started](./getting-started.md) - Plugin development guide
