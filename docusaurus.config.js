const { themes } = require("prism-react-renderer");
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
              from: ["/variables", "/docs/variables"],
            },
            {
              to: "/docs/custom-code/what-is-custom-javascript",
              from: ["/custom-code", "/docs/custom-code"],
            },
            {
              to: "/docs/custom-overlays/custom-overlays-documentation",
              from: ["/custom-overlays", "/docs/custom-overlays"],
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
        metadata: [
          // Twitter Card
          { name: "twitter:card", content: "summary_large_image" },
          { name: "twitter:site", content: "@lumiastream" },
          {
            name: "twitter:title",
            content: "Lumia Stream Developer Documentation",
          },
          {
            name: "twitter:description",
            content:
              "Official developer documentation for Lumia Stream. Build powerful integrations and custom experiences with our API, WebSocket, and overlay tools.",
          },
          {
            name: "twitter:image",
            content:
              "https://storage.lumiastream.com/lumia-stream-banner-website-seo.png",
          },

          // Open Graph
          { property: "og:type", content: "website" },
          {
            property: "og:title",
            content: "Lumia Stream Developer Documentation",
          },
          {
            property: "og:description",
            content:
              "Official developer documentation for Lumia Stream. Build powerful integrations and custom experiences with our API, WebSocket, and overlay tools.",
          },
          {
            property: "og:image",
            content:
              "https://storage.lumiastream.com/lumia-stream-banner-website-seo.png",
          },
          { property: "og:url", content: "https://dev.lumiastream.com" },
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
              to: "/docs/variables",
              position: "left",
              label: "Variables",
              activeBaseRegex: "docs/(variables)?$",
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
