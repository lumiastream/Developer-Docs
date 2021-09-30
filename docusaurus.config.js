const lightCodeTheme = require('prism-react-renderer/themes/github');
const darkCodeTheme = require('prism-react-renderer/themes/dracula');

// With JSDoc @type annotations, IDEs can provide config autocompletion
/** @type {import('@docusaurus/types').DocusaurusConfig} */
(
	module.exports = {
		title: 'Lumia Stream Developer Documentation',
		tagline: 'Connect your app to your smart lights seamlessly',
		url: 'https://dev.lumiastream.com',
		baseUrl: '/',
		onBrokenLinks: 'throw',
		onBrokenMarkdownLinks: 'warn',
		favicon: 'img/favicon.ico',
		organizationName: 'lumiastream', // Usually your GitHub org/user name.
		projectName: 'lumiastream', // Usually your repo name.

		presets: [
			[
				'@docusaurus/preset-classic',
				/** @type {import('@docusaurus/preset-classic').Options} */
				({
					api: {
						sidebarPath: require.resolve('./sidebars.js'),
						// Please change this to your repo.
						editUrl: 'https://github.com/lumiastream/api',
					},
					theme: {
						customCss: require.resolve('./src/css/custom.css'),
					},
				}),
			],
		],

		themeConfig:
			/** @type {import('@docusaurus/preset-classic').ThemeConfig} */
			({
				navbar: {
					title: 'Lumia Stream Developers',
					logo: {
						alt: 'Lumia Stream Logo',
						src: 'img/logo.svg',
					},
					items: [
						{
							type: 'doc',
							docId: 'intro',
							position: 'left',
							label: 'API',
						},
						{
							href: 'https://github.com/lumiastream/api',
							label: 'GitHub',
							position: 'right',
						},
					],
				},
				footer: {
					style: 'dark',
					links: [
						{
							title: 'API',
							items: [
								{
									label: 'Intro',
									to: '/docs/intro',
								},
								{
									label: 'Rest',
									to: '/docs/rest',
								},
								{
									label: 'Websockets',
									to: '/docs/websockets',
								},
							],
						},
						{
							title: 'Community',
							items: [
								{
									label: 'Discord',
									href: 'https://discord.gg/R8rCaKb',
								},
								{
									label: 'Twitter',
									href: 'https://twitter.com/lumiastream',
								},
								{
									label: 'Youtube',
									href: 'https://youtube.com/lumiastream',
								},
								{
									label: 'Instagram',
									href: 'https://instagram.com/lumiastream',
								},
							],
						},
						{
							title: 'More',
							items: [
								{
									label: 'Main Website',
									href: 'https://lumiastream.com',
								},
								{
									label: 'Forum',
									href: 'https://forum.lumiastream.com',
								},
								{
									label: 'GitHub',
									href: 'https://github.com/lumiastream/api',
								},
							],
						},
					],
					copyright: `Copyright © ${new Date().getFullYear()} Lumia Stream, Inc. Built with Lights.`,
				},
				prism: {
					theme: lightCodeTheme,
					darkTheme: darkCodeTheme,
				},
			}),
	}
);
