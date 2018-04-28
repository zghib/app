/* eslint-disable */

(function directusConfig() {
  const config = {
    api: {
      'https://demo-api.getdirectus.com': 'Directus Demo API',
      'http://localhost/api/public': 'Rijk\'s Local'
    },
    allowOtherAPI: false
  };

  window.__DirectusConfig__ = config;
}());
