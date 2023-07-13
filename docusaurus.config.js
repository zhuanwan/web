// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const lightCodeTheme = require('prism-react-renderer/themes/github')
const darkCodeTheme = require('prism-react-renderer/themes/dracula')

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'My Site',
  staticDirectories: ['public'],
  tagline: 'Dinosaurs are cool',
  favicon: 'img/favicon.ico',

  // Set the production url of your site here
  url: 'https://zhuanwan.github.io',
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: '/web/',

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'facebook', // Usually your GitHub org/user name.
  projectName: 'docusaurus', // Usually your repo name.

  onBrokenLinks: 'log',
  onBrokenMarkdownLinks: 'warn',

  // Even if you don't use internalization, you can use this field to set useful
  // metadata like html lang. For example, if your site is Chinese, you may want
  // to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          id: 'react',
          path: 'docs/react',
          routeBasePath: 'docs/react',
          sidebarPath: require.resolve('./sidebars.js'),
        },
        blog: {
          showReadingTime: true,
          editUrl: 'https://github.com/zhuanwan/web/tree/mater/',
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      }),
    ],
  ],

  plugins: [
    [require.resolve('./plugins/cdn.js'), {}],
    [require.resolve('./plugins/externals.js'), {}],
    [
      '@docusaurus/plugin-content-docs',
      {
        id: 'fabric',
        path: 'docs/fabric',
        routeBasePath: 'docs/fabric',
        sidebarPath: require.resolve('./sidebars.js'),
      },
    ],
    [
      '@docusaurus/plugin-content-docs',
      {
        id: 'functional',
        path: 'docs/functional',
        routeBasePath: 'docs/functional',
        sidebarPath: require.resolve('./sidebars.js'),
      },
    ],
    [
      '@docusaurus/plugin-content-docs',
      {
        id: 'example',
        path: 'docs/example',
        routeBasePath: 'docs/example',
        sidebarPath: require.resolve('./sidebars.js'),
      },
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      image: 'img/docusaurus-social-card.jpg',
      navbar: {
        title: 'My Site',
        logo: {
          alt: 'My Site Logo',
          src: 'img/logo.png',
        },
        items: [
          {
            docsPluginId: 'react',
            docId: 'intro', // 这里是docs/react/intro.md 的标题，代表默认选中这页
            type: 'doc',
            position: 'left',
            label: 'react',
          },
          {
            docsPluginId: 'fabric',
            docId: '说明', // 这里是docs/fabric/说明.md 的标题，代表默认选中这页
            type: 'doc',
            position: 'left',
            label: 'fabric',
          },
          {
            docsPluginId: 'functional',
            docId: '说明', // 这里是docs/functional/说明.md 的标题，代表默认选中这页
            type: 'doc',
            position: 'left',
            label: 'functional',
          },
          {
            docsPluginId: 'example',
            docId: 'intro', // 这里是docs/example/intro.md 的标题，代表默认选中这页
            type: 'doc',
            position: 'left',
            label: 'example',
          },
          { to: '/blog', label: 'Blog', position: 'left' },
          {
            href: 'https://github.com/zhuanwan/web',
            label: 'GitHub',
            position: 'right',
          },
        ],
      },
      prism: {
        theme: lightCodeTheme,
        darkTheme: darkCodeTheme,
      },
    }),
}

module.exports = config
