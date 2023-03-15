const lightCodeTheme = require("prism-react-renderer/themes/github");
const darkCodeTheme = require("prism-react-renderer/themes/dracula");

// With JSDoc @type annotations, IDEs can provide config autocompletion
/** @type {import('@docusaurus/types').DocusaurusConfig} */
(
  module.exports = {
    title: "Lumia Stream Developer Documentation",
    tagline: "Connect your app to your stream exactly how you want",
    url: "https://dev.lumiastream.com",
    baseUrl: "/",
    onBrokenLinks: "throw",
    onBrokenMarkdownLinks: "warn",
    favicon: "img/favicon.ico",
    organizationName: "lumiastream", // Usually your GitHub org/user name.
    projectName: "lumiastream", // Usually your repo name.

    plugins: [
      [
        "@docusaurus/plugin-client-redirects",
        {
          redirects: [
            {
              to: "/docs/custom-code/what-is-custom-javascript",
              from: ["/custom-code", "/docs/custom-code"],
            },
          ],
        },
      ],
    ],

    presets: [
      [
        "@docusaurus/preset-classic",
        /** @type {import('@docusaurus/preset-classic').Options} */
        ({
          api: {
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
        navbar: {
          title: "Lumia Stream Developers",
          logo: {
            alt: "Lumia Stream Logo",
            src: "img/logo.svg",
          },
          items: [
            {
              type: "doc",
              docId: "intro",
              position: "left",
              label: "API Docs",
            },
            {
              label: "Custom code",
              href: "/docs/custom-code/what-is-custom-javascript",
              position: "left",
            },
            // {
            //   type: "doc",
            //   docId: "intro",
            //   position: "left",
            //   label: "Custom code",
            // },
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
