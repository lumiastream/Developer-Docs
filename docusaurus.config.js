const { themes } = require("prism-react-renderer");
const variablesAlertsSearchIndexPlugin = require("./plugins/variables-alerts-search-index");
const lightCodeTheme = themes.github;
const darkCodeTheme = themes.dracula;

// With JSDoc @type annotations, IDEs can provide config autocompletion
/** @type {import('@docusaurus/types').DocusaurusConfig} */
(
  module.exports = {
    title: "Lumia Stream Developer Documentation",
    staticDirectories: ["static"],
    tagline: "Connect your app to your stream exactly how you want",
    url: "https://dev.lumiastream.com",
    baseUrl: "/",
    onBrokenLinks: "throw",
    onBrokenMarkdownLinks: "warn",
    favicon: "img/favicon.ico",
    organizationName: "lumiastream", // Usually your GitHub org/user name.
    projectName: "lumiastream", // Usually your repo name.
    markdown: {
      format: "detect",
    },
    plugins: [
      [
        "@docusaurus/plugin-client-redirects",
        {
          redirects: [
            {
              to: "/docs/variables",
              from: ["/variables"],
            },
            {
              to: "/docs/custom-code/what-is-custom-javascript",
              from: ["/custom-code", "/docs/custom-code"],
            },
            {
              to: "/docs/custom-overlays/custom-overlays-documentation",
              from: ["/custom-overlays", "/docs/custom-overlays"],
            },
            {
              to: "/docs/mcp/setup",
              from: ["/mcp", "/docs/mcp"],
            },
          ],
        },
      ],
      [
        require.resolve("docusaurus-lunr-search"),
        {
          highlightResult: true,
        },
      ],
      variablesAlertsSearchIndexPlugin,
    ],

    presets: [
      [
        "@docusaurus/preset-classic",
        /** @type {import('@docusaurus/preset-classic').Options} */
        ({
          docs: {
            sidebarPath: require.resolve("./sidebars.js"),
            editUrl: "https://github.com/lumiastream/Developer-Docs",
          },
          theme: {
            customCss: require.resolve("./src/css/custom.css"),
          },
        }),
      ],
    ],

    themeConfig:
      /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
      ({
        image: "https://storage.lumiastream.com/lumia-stream-banner-website-seo.png",
        metadata: [
          { name: "twitter:site", content: "@lumiastream" },

          // Open Graph
          { property: "og:type", content: "website" },
          { property: "og:site_name", content: "Lumia Stream Developer Documentation" },
        ],
        navbar: {
          title: "Lumia Stream Developers",
          logo: {
            alt: "Lumia Stream Logo",
            src: "img/logo.svg",
          },
          items: [
            {
              to: "/docs/intro",
              position: "left",
              label: "API Docs",
              activeBaseRegex: "docs/(intro)?$",
            },
            {
              to: "/docs/mcp/setup",
              position: "left",
              label: "MCP",
              activeBasePath: "docs/mcp",
            },
            {
              to: "/docs/variables",
              position: "left",
              label: "Variables",
              activeBaseRegex: "docs/(variables)?$",
            },
            {
              to: "/docs/chatbot",
              label: "Chatbot Commands",
              position: "left",
              activeBasePath: "docs/chatbot",
            },
            {
              to: "/docs/alerts",
              label: "Alerts",
              position: "left",
              activeBasePath: "docs/alerts",
            },
            {
              to: "/docs/tts",
              label: "TTS",
              position: "left",
              activeBasePath: "docs/tts",
            },
            {
              to: "/docs/custom-code/what-is-custom-javascript",
              label: "Custom code",
              position: "left",
              activeBasePath: "docs/custom-code",
            },
            {
              to: "/docs/custom-overlays/custom-overlays-documentation",
              label: "Custom overlays",
              position: "left",
              activeBasePath: "docs/custom-overlays",
            },
            {
              to: "/docs/plugin-sdk/overview",
              label: "Plugin SDK",
              position: "left",
              activeBasePath: "docs/plugin-sdk",
            },
            {
              href: "https://github.com/lumiastream/Developer-Docs",
              label: "GitHub",
              position: "right",
            },
          ],
        },
        footer: {
          style: "dark",
          links: [
            {
              title: "API",
              items: [
                {
                  label: "Intro",
                  to: "/docs/intro",
                },
                {
                  label: "Rest",
                  to: "/docs/rest/clone-the-repo",
                },
                {
                  label: "Websockets",
                  to: "/docs/websockets/clone-the-repo",
                },
                {
                  label: "MCP",
                  to: "/docs/mcp/setup",
                },
              ],
            },
            {
              title: "Community",
              items: [
                {
                  label: "Discord",
                  href: "https://discord.gg/R8rCaKb",
                },
                {
                  label: "Twitter",
                  href: "https://twitter.com/lumiastream",
                },
                {
                  label: "Youtube",
                  href: "https://youtube.com/lumiastream",
                },
                {
                  label: "Instagram",
                  href: "https://instagram.com/lumiastream",
                },
              ],
            },
            {
              title: "More",
              items: [
                {
                  label: "Main Website",
                  href: "https://lumiastream.com",
                },
                {
                  label: "Forum",
                  href: "https://forum.lumiastream.com",
                },
                {
                  label: "GitHub",
                  href: "https://github.com/lumiastream/Developer-Docs",
                },
              ],
            },
          ],
          copyright: `Copyright © ${new Date().getFullYear()} Lumia Stream, LLC. Built with lots of Lights.`,
        },
        prism: {
          theme: lightCodeTheme,
          darkTheme: darkCodeTheme,
        },
      }),
  }
);
