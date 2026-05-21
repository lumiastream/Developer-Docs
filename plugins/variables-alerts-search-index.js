const fs = require("fs");
const path = require("path");
const lunr = require("lunr");
const { AllVariables, LumiaAlertConfigs } = require("@lumiastream/lumia-types");
const enTrans = require("@lumiastream/lumia-translations/src/translations/en.translations.json");

const SOURCE = "variables-alerts-index";
const VARIABLES_DOC_URL = "/docs/variables";

const chatCommandTypes = [
  "command",
  "chatbotCommand",
  "twitchPoints",
  "kickPoints",
  "twitchExtensions",
  "chatmatch",
];

const toText = (value) =>
  value === undefined || value === null ? "" : String(value);

const titleCase = (value) =>
  toText(value)
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b\w/g, (char) => char.toUpperCase());

const getVariableName = (value) => {
  if (typeof value === "string") {
    return value;
  }

  if (value && typeof value === "object") {
    return typeof value.name === "string" ? value.name : "";
  }

  return "";
};

const getVariableList = (variables) =>
  Array.isArray(variables)
    ? variables.filter((value) => getVariableName(value))
    : [];

const getDescription = (value) => {
  const name = getVariableName(value);
  if (value && typeof value === "object" && typeof value.description === "string" && value.description) {
    return value.description;
  }

  return enTrans?.variables?.[name] || "No description available yet.";
};

const getTypeLabel = (type) => {
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

const getPlatformUrl = (platform, hash) => {
  const query = platform ? `?platform=${encodeURIComponent(platform)}` : "";
  return `${VARIABLES_DOC_URL}${query}${hash || ""}`;
};

const joinSearchText = (...values) =>
  values
    .flat(Infinity)
    .map(toText)
    .map((value) => value.trim())
    .filter(Boolean)
    .join(" ");

const getAlertKeyVariants = (alert) => {
  const value = toText(alert);
  return [value, value.replace(/-/g, "_"), titleCase(value)];
};

const addVariableDocument = ({ docs, seen, platform, variable, context, alert }) => {
  const name = getVariableName(variable);
  if (!name) {
    return;
  }

  const key = ["variable", platform, context, alert || "", name].join(":");
  if (seen.has(key)) {
    return;
  }
  seen.add(key);

  const platformLabel = titleCase(platform);
  const contextLabel = context || "Variable";
  const description = getDescription(variable);
  const url = getPlatformUrl(platform, alert ? "#alert-explorer" : "");

  docs.push({
    title: `${platformLabel} variable {{${name}}}`,
    type: 1,
    pageTitle: "Platform Variables",
    url,
    content: joinSearchText(
      `Template variable {{${name}}}`,
      `Overlay field data.extraSettings.${name}`,
      platformLabel,
      contextLabel,
      alert ? `Alert ${titleCase(alert)}` : "",
      description,
    ),
    keywords: joinSearchText(name, `{{${name}}}`, platform, context, alert ? titleCase(alert) : "", description),
    version: "Next",
    source: SOURCE,
  });
};

const buildSupplementalSearchDocs = () => {
  const docs = [];
  const seen = new Set();

  Object.entries(AllVariables || {}).forEach(([platform, cfg]) => {
    getVariableList(cfg?.variables).forEach((variable) => {
      addVariableDocument({
        docs,
        seen,
        platform,
        variable,
        context: "Available everywhere",
      });
    });

    Object.entries(cfg?.chat || {})
      .sort(([a], [b]) => {
        const aIs = chatCommandTypes.includes(a);
        const bIs = chatCommandTypes.includes(b);
        if (aIs !== bIs) {
          return aIs ? -1 : 1;
        }
        return a.localeCompare(b);
      })
      .forEach(([type, variables]) => {
        getVariableList(variables).forEach((variable) => {
          addVariableDocument({
            docs,
            seen,
            platform,
            variable,
            context: getTypeLabel(type),
          });
        });
      });
  });

  Object.entries(LumiaAlertConfigs || {})
    .sort(([a], [b]) => titleCase(a).localeCompare(titleCase(b)))
    .forEach(([alert, config]) => {
      const platform = config?.connection || alert.split("-")[0] || "";
      const platformLabel = titleCase(platform);
      const alertLabel = titleCase(alert);
      const acceptedVariables = getVariableList(config?.acceptedVariables);
      const quickActionLabels = Array.isArray(config?.quickActions)
        ? config.quickActions.map((quickAction) => quickAction?.label).filter(Boolean)
        : [];
      const inputFieldLabels = Array.isArray(config?.inputFields)
        ? config.inputFields.map((inputField) => inputField?.variableField || inputField?.dynamicField).filter(Boolean)
        : [];

      docs.push({
        title: `${platformLabel} alert ${alertLabel}`,
        type: 1,
        pageTitle: "Platform Variables",
        url: getPlatformUrl(platform, "#alert-explorer"),
        content: joinSearchText(
          `Alert ${alert}`,
          getAlertKeyVariants(alert),
          alertLabel,
          platformLabel,
          config?.message,
          quickActionLabels,
          inputFieldLabels,
          acceptedVariables.map((variable) => {
            const name = getVariableName(variable);
            return joinSearchText(`{{${name}}}`, `data.extraSettings.${name}`, getDescription(variable));
          }),
        ),
        keywords: joinSearchText(
          alert,
          getAlertKeyVariants(alert),
          alertLabel,
          platform,
          config?.message,
          quickActionLabels,
          inputFieldLabels,
          acceptedVariables.map(getVariableName),
        ),
        version: "Next",
        source: SOURCE,
      });

      acceptedVariables.forEach((variable) => {
        addVariableDocument({
          docs,
          seen,
          platform,
          variable,
          context: "Alert variable",
          alert,
        });
      });
    });

  return docs;
};

const rebuildLunrIndex = (searchDocs, options = {}) => {
  const fields = {
    title: { boost: 200, ...(options.fields?.title || {}) },
    content: { boost: 2, ...(options.fields?.content || {}) },
    keywords: { boost: 100, ...(options.fields?.keywords || {}) },
  };

  return lunr(function () {
    this.ref("id");
    Object.entries(fields).forEach(([key, value]) => this.field(key, value));
    this.metadataWhitelist = ["position"];

    if (options.stopWords) {
      const customStopWords = lunr.generateStopWordFilter(options.stopWords);
      this.pipeline.before(lunr.stopWordFilter, customStopWords);
      this.pipeline.remove(lunr.stopWordFilter);
    }

    searchDocs.forEach((doc, id) => {
      this.add({
        id,
        title: doc.title,
        content: doc.content,
        keywords: doc.keywords,
      });
    });
  });
};

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const getSearchFiles = (outDir, startedAt) => {
  const files = fs.existsSync(outDir) ? fs.readdirSync(outDir) : [];
  const isFresh = (file) => {
    try {
      return fs.statSync(path.join(outDir, file)).mtimeMs >= startedAt - 1000;
    } catch {
      return false;
    }
  };

  return {
    searchDocFiles: files.filter((file) => /^search-doc(?:-\d+)?\.json$/.test(file) && isFresh(file)),
    lunrIndexFiles: files.filter((file) => /^lunr-index(?:-\d+)?\.json$/.test(file) && isFresh(file)),
  };
};

const waitForLunrOutput = async (outDir, startedAt) => {
  for (let attempt = 0; attempt < 150; attempt += 1) {
    const files = getSearchFiles(outDir, startedAt);
    if (files.searchDocFiles.length && files.lunrIndexFiles.length) {
      await sleep(100);
      return getSearchFiles(outDir, startedAt);
    }
    await sleep(100);
  }

  return { searchDocFiles: [], lunrIndexFiles: [] };
};

module.exports = function variablesAlertsSearchIndexPlugin() {
  return {
    name: "variables-alerts-search-index",
    async postBuild({ outDir }) {
      const startedAt = Date.now();
      const { searchDocFiles, lunrIndexFiles } = await waitForLunrOutput(outDir, startedAt);

      if (!searchDocFiles.length || !lunrIndexFiles.length) {
        console.warn("variables-alerts-search-index:: skipped because Lunr output was not found");
        return;
      }

      const mainSearchDocPath = path.join(outDir, searchDocFiles.includes("search-doc.json") ? "search-doc.json" : searchDocFiles[0]);
      const searchDocFile = JSON.parse(fs.readFileSync(mainSearchDocPath, "utf8"));
      const baseSearchDocs = (searchDocFile.searchDocs || []).filter((doc) => doc?.source !== SOURCE);
      const supplementalDocs = buildSupplementalSearchDocs();
      const nextSearchDocFile = {
        ...searchDocFile,
        searchDocs: [...baseSearchDocs, ...supplementalDocs],
      };
      const nextSearchDocContents = JSON.stringify(nextSearchDocFile);
      const nextLunrIndexContents = JSON.stringify(rebuildLunrIndex(nextSearchDocFile.searchDocs, nextSearchDocFile.options));

      searchDocFiles.forEach((file) => {
        fs.writeFileSync(path.join(outDir, file), nextSearchDocContents);
      });
      lunrIndexFiles.forEach((file) => {
        fs.writeFileSync(path.join(outDir, file), nextLunrIndexContents);
      });

      console.log(`variables-alerts-search-index:: indexed ${supplementalDocs.length} variables and alerts`);
    },
  };
};
