import React from "react";
import Link from "@docusaurus/Link";
import { LumiaAlertConfigs } from "@lumiastream/lumia-types";
import { enTrans } from "@lumiastream/lumia-translations";

export const chatCommandTypes = [
  "command",
  "chatbotCommand",
  "twitchPoints",
  "kickPoints",
  "twitchExtensions",
  "chatmatch",
];

export const toText = (value) =>
  value === undefined || value === null ? "" : String(value);

export const titleCase = (value) =>
  toText(value)
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .replace(/_/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());

export const getVariableName = (value) => {
  if (typeof value === "string") return value;
  if (value && typeof value === "object") return typeof value.name === "string" ? value.name : "";
  return "";
};

export const getVariableList = (variables) =>
  Array.isArray(variables) ? variables.filter((value) => getVariableName(value)) : [];

export const formatVariable = (value) => `{{${getVariableName(value)}}}`;

export const getDescription = (value) => {
  const name = getVariableName(value);
  if (value && typeof value === "object" && typeof value.description === "string" && value.description) {
    return value.description;
  }
  return enTrans?.variables?.[name] || "No description available yet.";
};

export const getTypeLabel = (type) => {
  const labels = {
    command: "Chat command",
    chatbotCommand: "Chatbot command",
    twitchPoints: "Twitch channel points",
    kickPoints: "Kick points",
    twitchExtensions: "Twitch extension redeem",
    chatmatch: "Chat match",
  };
  return labels[type] || titleCase(type);
};

export const tableStyles = {
  width: "100%",
  borderCollapse: "collapse",
  marginBottom: "1rem",
  fontSize: "0.95rem",
  minWidth: "780px",
};

export const tableWrapperStyles = { width: "100%", overflowX: "auto" };

export const thStyles = {
  textAlign: "left",
  padding: "0.75rem",
  borderBottom: "1px solid var(--ifm-toc-border-color)",
  background: "rgba(112, 28, 52, 0.06)",
};

export const tdStyles = {
  padding: "0.75rem",
  borderBottom: "1px solid var(--ifm-toc-border-color)",
  verticalAlign: "top",
};

export const boxStyles = {
  border: "1px solid var(--ifm-toc-border-color)",
  borderRadius: "12px",
  padding: "1rem 1.25rem",
  marginBottom: "1rem",
  background: "linear-gradient(180deg, rgba(112, 28, 52, 0.04), rgba(112, 28, 52, 0.01))",
};

export const chipStyles = {
  display: "inline-block",
  padding: "0.2rem 0.55rem",
  borderRadius: "999px",
  background: "rgba(112, 28, 52, 0.08)",
  color: "#701c34",
  fontSize: "0.8rem",
  fontWeight: 600,
  marginBottom: "0.5rem",
};

export const exampleChipStyles = {
  display: "inline-block",
  padding: "0.2rem 0.45rem",
  borderRadius: "8px",
  background: "var(--ifm-code-background)",
  marginRight: "0.4rem",
  marginBottom: "0.4rem",
};

export const optionButtonStyles = {
  display: "inline-block",
  padding: "0.45rem 0.75rem",
  borderRadius: "999px",
  border: "1px solid var(--ifm-toc-border-color)",
  background: "var(--ifm-background-surface-color)",
  cursor: "pointer",
  marginRight: "0.5rem",
  marginBottom: "0.5rem",
};

export const activeOptionButtonStyles = {
  ...optionButtonStyles,
  background: "rgba(112, 28, 52, 0.10)",
  borderColor: "#701c34",
  color: "#701c34",
  fontWeight: 700,
};

export const filterVariables = (variables, query) => {
  const variableList = getVariableList(variables);
  if (!query) return variableList;
  const normalizedQuery = toText(query).toLowerCase();
  return variableList.filter((value) => {
    const name = getVariableName(value).toLowerCase();
    const description = getDescription(value).toLowerCase();
    return name.includes(normalizedQuery) || description.includes(normalizedQuery);
  });
};

export const getAlertEntriesForPlatform = (platform) =>
  Object.entries(LumiaAlertConfigs)
    .filter(([, config]) => config?.connection === platform)
    .sort((a, b) => titleCase(a[0]).localeCompare(titleCase(b[0])));

export const getAlertSearchText = (alert, config) =>
  [
    alert,
    titleCase(alert),
    config?.message,
    ...getVariableList(config?.acceptedVariables).map(getVariableName),
    ...(Array.isArray(config?.quickActions) ? config.quickActions : []).map((qa) => qa?.label),
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

export const globalVariableExamples = {
  read_file: ["Hello from notes.txt"],
  read_url: ["OK"],
  selection: ["Option A"],
  random: ["7"],
  random_input: ["Blue"],
  math: ["42"],
  compare: ["true"],
  round: ["4"],
  if: ["Online"],
  coalesce: ["Fallback value"],
  between: ["15"],
  min: ["3"],
  max: ["9"],
  regex_extract: ["12345"],
  replace: ["Hello Lumia"],
  format_date: ["Mar 15, 2026 9:00 AM"],
  time_since: ["5 minutes ago"],
  sum_variables: ["42"],
  offset_count: ["3"],
  get_commands: ["!lights,!brb,!discord"],
  get_all_commands: ["!lights,!brb,!discord,!song"],
  convert_color_to_hex: ["#FF4076"],
  get_latest_file_from_folder: ["/Users/name/Videos/latest.mp4"],
  get_random_file_from_folder: ["/Users/name/Videos/random.mp4"],
  screenshot: ["https://cdn.example.com/screenshot.png"],
  get_queue_count: ["5"],
  get_var_from_msg: ["lumiastream"],
  get_user_loyalty_points: ["1250"],
  translate: ["Hello world"],
};

export const serializeExampleValue = (value) => {
  if (value === null) return "null";
  if (Array.isArray(value) || typeof value === "object") return JSON.stringify(value);
  return String(value);
};

export const getVariableExamples = (platform, value) => {
  if (value && typeof value === "object" && value.example !== undefined) {
    return [serializeExampleValue(value.example)];
  }
  const name = getVariableName(value);
  if (globalVariableExamples[name]) return globalVariableExamples[name];
  const normalized = name.toLowerCase();
  if (normalized === "username") return ["lumiastream"];
  if (normalized === "displayname") return ["LumiaStream"];
  if (normalized === "message") return ["Great stream"];
  if (normalized === "amount") return ["25.00"];
  if (normalized === "currency") return ["USD"];
  if (normalized === "currencysymbol") return ["$"];
  if (normalized === "viewers") return ["42"];
  if (normalized === "title") return [`${titleCase(platform)} Stream Live`];
  if (normalized === "game") return ["Just Chatting"];
  if (normalized === "avatar") return ["https://cdn.example.com/avatar.png"];
  if (normalized === "userid") return ["123456789"];
  if (normalized === "stickerid") return ["pearfect_hey_you_ja_v2"];
  if (normalized === "stickername") return ["Pear character turning around waving his hand, saying 'Hey you' while lowering his glasses"];
  if (normalized === "total") return ["42"];
  if (normalized === "previoustotal") return ["35"];
  if (normalized === "bits") return ["500"];
  if (normalized === "command") return ["!lights"];
  if (normalized === "recipient") return ["rgblumia"];
  if (normalized === "recipients") return ["rgblumia,lumiatwitch"];
  if (normalized === "giftamount") return ["5"];
  if (normalized === "submonths") return ["12"];
  if (normalized.includes("currency_symbol")) return ["$"];
  if (normalized.includes("currency")) return ["USD"];
  if (normalized.includes("amount")) return ["25.00"];
  if (normalized.endsWith("_live")) return ["true"];
  if (normalized.includes("uptime")) return ["2h 14m"];
  if (normalized.includes("followage")) return ["2 years, 3 months"];
  if (normalized.includes("avatar") || normalized.includes("image") || normalized.includes("artwork") || normalized.includes("thumbnail")) return ["https://cdn.example.com/image.png"];
  if (normalized.includes("spotify_url")) return ["https://open.spotify.com/track/abc123"];
  if (normalized.includes("beatport_url")) return ["https://www.beatport.com/track/example/123456"];
  if (normalized.includes("url")) return ["https://example.com"];
  if (normalized.includes("date") || normalized.includes("timestamp")) return ["2026-03-15T09:00:00Z"];
  if (normalized.includes("title")) return [`${titleCase(platform)} Stream Live`];
  if (normalized.includes("description")) return ["Going live with alerts and lights"];
  if (normalized.includes("category") || normalized.includes("game")) return ["Just Chatting"];
  if (normalized.includes("entries_count") || normalized.includes("queue_limit") || normalized.includes("count") || normalized.includes("views")) return ["42"];
  if (normalized.includes("list") || normalized.includes("entries") || normalized.includes("players") || normalized.includes("members") || normalized.includes("subscribers") || normalized.includes("viewers")) return ["lumiastream,rgblumia"];
  if (normalized.includes("username") || normalized.includes("donator") || normalized.includes("subscriber") || normalized.includes("member") || normalized.includes("chatter") || normalized.includes("follower") || normalized.includes("raider") || normalized.includes("winner") || normalized.includes("player")) return ["lumiastream"];
  if (normalized.includes("id")) return ["abc123"];
  if (normalized.includes("color")) return ["#FF4076"];
  if (normalized.includes("bpm")) return ["128"];
  if (normalized.includes("rating")) return ["5"];
  if (normalized.includes("length")) return ["03:45"];
  if (normalized.includes("comment")) return ["Now playing"];
  if (normalized.includes("key")) return ["C#m"];
  if (normalized.includes("file_path")) return ["/Users/name/Music/song.mp3"];
  return [];
};

export const getAlertFieldExamples = (config, field) => {
  const examples = [];
  const seen = new Set();
  const fieldName = getVariableName(field);
  const addExample = (value) => {
    if (value === undefined || value === null || value === "") return;
    const serialized = serializeExampleValue(value);
    if (seen.has(serialized)) return;
    seen.add(serialized);
    examples.push(serialized);
  };
  if (field && typeof field === "object" && field.example !== undefined) addExample(field.example);
  (Array.isArray(config?.quickActions) ? config.quickActions : []).forEach((qa) => addExample(qa?.extraSettings?.[fieldName]));
  (Array.isArray(config?.inputFields) ? config.inputFields : []).forEach((inputField) => {
    if (!inputField || inputField.variableField !== fieldName) return;
    addExample(inputField.default);
  });
  return examples.slice(0, 6);
};

export const getAlertExamplePayload = (alert, config, exampleIndex = 0) => {
  const quickActions = Array.isArray(config?.quickActions) ? config.quickActions : [];
  const inputFields = Array.isArray(config?.inputFields) ? config.inputFields : [];
  const exampleAction = quickActions[exampleIndex] || quickActions[0];
  const extraSettings = {};
  const dynamic = {};
  inputFields.forEach((inputField) => {
    if (!inputField) return;
    if (inputField.variableField && inputField.default !== undefined && inputField.default !== null && inputField.default !== "") {
      extraSettings[inputField.variableField] = inputField.default;
    }
    if (inputField.dynamicField && inputField.default !== undefined && inputField.default !== null && inputField.default !== "") {
      dynamic[inputField.dynamicField] = inputField.default;
    }
  });
  if (exampleAction?.extraSettings) Object.assign(extraSettings, exampleAction.extraSettings);
  if (exampleAction?.dynamic) Object.assign(dynamic, exampleAction.dynamic);
  const payload = { alert, extraSettings, fromLumia: true };
  if (Object.keys(dynamic).length > 0) payload.dynamic = dynamic;
  return payload;
};

export const formatPayloadValue = (value) => {
  if (typeof value === "string") return `"${value}"`;
  if (value === null) return "null";
  if (typeof value === "undefined") return "undefined";
  return String(value);
};

export const PayloadTreeNode = ({ name, value, depth = 0 }) => {
  const isObject = value && typeof value === "object" && !Array.isArray(value);
  const isArray = Array.isArray(value);
  if (!isObject && !isArray) {
    return (
      <div style={{ marginLeft: `${depth * 1.1}rem`, marginBottom: "0.35rem" }}>
        <code>{name}</code>: <code>{formatPayloadValue(value)}</code>
      </div>
    );
  }
  const entries = isArray ? value.map((item, index) => [index, item]) : Object.entries(value);
  return (
    <details open={depth < 2} style={{ marginLeft: `${depth * 1.1}rem`, marginBottom: "0.5rem" }}>
      <summary style={{ cursor: "pointer" }}>
        <code>{name}</code>{" "}
        <span style={{ color: "var(--ifm-color-emphasis-700)" }}>
          {isArray ? `[${entries.length}]` : `{${entries.length}}`}
        </span>
      </summary>
      <div style={{ marginTop: "0.5rem", paddingLeft: "0.85rem", borderLeft: "1px solid var(--ifm-toc-border-color)" }}>
        {entries.map(([key, childValue]) => (
          <PayloadTreeNode key={String(key)} name={String(key)} value={childValue} depth={depth + 1} />
        ))}
      </div>
    </details>
  );
};

export const VariableTable = ({ variables, emptyLabel = "No variables in this section.", getExamples }) => {
  if (!variables.length) return <p><em>{emptyLabel}</em></p>;
  return (
    <div style={tableWrapperStyles}>
      <table style={tableStyles}>
        <thead>
          <tr>
            <th style={thStyles}>Variable</th>
            <th style={thStyles}>Meaning</th>
            <th style={thStyles}>Use it like</th>
            {getExamples && <th style={thStyles}>Example values</th>}
          </tr>
        </thead>
        <tbody>
          {variables.map((value) => {
            const name = getVariableName(value);
            const examples = getExamples ? getExamples(value) : [];
            return (
              <tr key={name}>
                <td style={tdStyles}><code>{formatVariable(value)}</code></td>
                <td style={tdStyles}>{getDescription(value)}</td>
                <td style={tdStyles}><code>{formatVariable(value)}</code></td>
                {getExamples && (
                  <td style={tdStyles}>
                    {examples.length > 0
                      ? examples.map((example) => <code key={example} style={exampleChipStyles}>{example}</code>)
                      : <em>No example yet</em>}
                  </td>
                )}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export const AlertVariableTable = ({ config, variables, emptyLabel = "No alert fields in this section." }) => {
  if (!variables.length) return <p><em>{emptyLabel}</em></p>;
  return (
    <div style={tableWrapperStyles}>
      <table style={tableStyles}>
        <thead>
          <tr>
            <th style={thStyles}>Template variable</th>
            <th style={thStyles}>Overlay path</th>
            <th style={thStyles}>Meaning</th>
            <th style={thStyles}>Example values</th>
          </tr>
        </thead>
        <tbody>
          {variables.map((value) => {
            const name = getVariableName(value);
            const examples = getAlertFieldExamples(config, value);
            return (
              <tr key={name}>
                <td style={tdStyles}><code>{formatVariable(value)}</code></td>
                <td style={tdStyles}><code>data.extraSettings.{name}</code></td>
                <td style={tdStyles}>{getDescription(value)}</td>
                <td style={tdStyles}>
                  {examples.length > 0
                    ? examples.map((example) => <code key={example} style={exampleChipStyles}>{example}</code>)
                    : <em>No example yet</em>}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export const AlertExplorer = ({ platform, alerts }) => {
  const [alertQuery, setAlertQuery] = React.useState("");
  const [selectedAlert, setSelectedAlert] = React.useState(alerts[0]?.[0] || "");
  const [selectedExampleIndex, setSelectedExampleIndex] = React.useState(0);

  const filteredAlerts = alerts.filter(([alert, config]) => {
    if (!alertQuery) return true;
    return getAlertSearchText(alert, config).includes(alertQuery.toLowerCase());
  });

  React.useEffect(() => {
    if (!filteredAlerts.some(([alert]) => alert === selectedAlert)) {
      setSelectedAlert(filteredAlerts[0]?.[0] || "");
      setSelectedExampleIndex(0);
    }
  }, [filteredAlerts, selectedAlert]);

  const activeEntry = filteredAlerts.find(([alert]) => alert === selectedAlert) || filteredAlerts[0];

  if (!alerts.length) return null;

  return (
    <section id="alert-explorer" style={boxStyles}>
      <div style={chipStyles}>Alerts and events</div>
      <p style={{ marginTop: 0 }}>
        Search an alert and inspect a live example of what{" "}
        <code>Overlay.on('alert')</code> receives. Template alert variables map to the same keys inside{" "}
        <code>data.extraSettings</code>.{" "}
        For the full alert event type, see{" "}
        <Link to="/docs/custom-overlays/types#alertevent">Overlay Type Definitions</Link>.
      </p>
      <label style={{ display: "block", fontWeight: 600, marginBottom: "0.5rem" }}>
        Search alerts on {titleCase(platform)}
      </label>
      <input
        type="search"
        value={alertQuery}
        onChange={(event) => setAlertQuery(event.target.value)}
        placeholder="Search by alert name, message, or field"
        style={{
          width: "100%",
          maxWidth: "520px",
          padding: "0.75rem 0.9rem",
          borderRadius: "10px",
          border: "1px solid var(--ifm-toc-border-color)",
          background: "var(--ifm-background-surface-color)",
          marginBottom: "1rem",
        }}
      />
      {filteredAlerts.length > 0 ? (
        <>
          <div style={{ marginBottom: "1rem" }}>
            {filteredAlerts.map(([alert]) => (
              <button
                key={alert}
                type="button"
                onClick={() => { setSelectedAlert(alert); setSelectedExampleIndex(0); }}
                style={selectedAlert === alert ? activeOptionButtonStyles : optionButtonStyles}
              >
                {titleCase(alert)}
              </button>
            ))}
          </div>
          {activeEntry && (() => {
            const [alert, config] = activeEntry;
            const payload = getAlertExamplePayload(alert, config, selectedExampleIndex);
            const quickActions = config.quickActions || [];
            return (
              <>
                <div style={boxStyles}>
                  <div style={chipStyles}>Live preview</div>
                  <p style={{ marginTop: 0 }}>
                    <strong>Alert:</strong> <code>{alert}</code>
                  </p>
                  <p style={{ marginTop: 0 }}>
                    <strong>Message template:</strong> <code>{toText(config.message)}</code>
                  </p>
                  {quickActions.length > 0 && (
                    <>
                      <label style={{ display: "block", fontWeight: 600, marginBottom: "0.5rem" }}>
                        Example scenario
                      </label>
                      <div style={{ marginBottom: "1rem" }}>
                        {quickActions.map((quickAction, index) => (
                          <button
                            key={`${quickAction.label}-${index}`}
                            type="button"
                            onClick={() => setSelectedExampleIndex(index)}
                            style={selectedExampleIndex === index ? activeOptionButtonStyles : optionButtonStyles}
                          >
                            {quickAction.label}
                          </button>
                        ))}
                      </div>
                    </>
                  )}
                  <div style={{ border: "1px solid var(--ifm-toc-border-color)", borderRadius: "10px", padding: "0.85rem 1rem", background: "var(--ifm-code-background)" }}>
                    <div style={{ marginBottom: "0.5rem", fontWeight: 700 }}>Overlay payload explorer</div>
                    <PayloadTreeNode name="data" value={payload} />
                  </div>
                </div>
                <AlertVariableTable
                  config={config}
                  variables={getVariableList(config.acceptedVariables)}
                  emptyLabel={`No fields available for ${titleCase(alert)}.`}
                />
              </>
            );
          })()}
        </>
      ) : (
        <div style={boxStyles}>
          <div style={chipStyles}>No alert matches</div>
          <p style={{ margin: 0 }}>No alerts matched "{alertQuery}" on {titleCase(platform)}.</p>
        </div>
      )}
    </section>
  );
};

export const AllPlatformsAlertExplorer = () => {
  const platforms = [...new Set(Object.values(LumiaAlertConfigs).map((c) => c?.connection).filter(Boolean))].sort();
  const [selectedPlatform, setSelectedPlatform] = React.useState(platforms[0] || "");
  const alerts = getAlertEntriesForPlatform(selectedPlatform);
  return (
    <div>
      <div style={{ marginBottom: "1rem" }}>
        {platforms.map((platform) => (
          <button
            key={platform}
            type="button"
            onClick={() => setSelectedPlatform(platform)}
            style={selectedPlatform === platform ? activeOptionButtonStyles : optionButtonStyles}
          >
            {titleCase(platform)}
          </button>
        ))}
      </div>
      <AlertExplorer platform={selectedPlatform} alerts={alerts} />
    </div>
  );
};
