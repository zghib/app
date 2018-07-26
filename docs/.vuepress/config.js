module.exports = {
  base: '/app/',
  // NOTE: Most of this config must be the same as the one in the app repo to make sure
  //   it's consistent when navigating between the two.
  title: 'Directus',
  description: 'A headless CMS that manages your content, not your workflow.',
  themeConfig: {
    nav: [
      { text: 'Home', link: '/' },
      { text: 'User Guide', link: '/user-guide/' },
      { text: 'Admin Guide', link: '/admin-guide/' },
      { text: 'Developer Guide', link: '/developer-guide/' },
    ],
    repo: 'directus/app',
    docsDir: 'docs',
    editLinks: true,
    sidebar: {
      '/user-guide/': [
        '',
      ],

      '/admin-guide/': [
        '',
      ],

      '/developer-guide/': [
        '',
        'edit-form-grid',
        'error-handling',
        'events',
        'github',
        'globals',
        'helpers',
        'i18n',
        'install-dev',
        'modals',
        'notifications',
        'running-rabbit',
        'sdk-api',
        'store',
        'styleguide'
      ],

      // fallback
      '/': [
        ''
      ]
    }
  }
};
