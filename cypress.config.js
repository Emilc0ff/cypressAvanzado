const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
    },
    baseUrl: "https://pushing-it.vercel.app",
    watchForFileChanges: false,
    defaultCommandTimeout: 10000,
    fixturesFolder: 'cypress/e2e/',
    env: {
        username: 'pushingit',
        password: '123456!',
      baseUrlAPI: 'https://pushing-it.onrender.com/api',
      token: ''
    },
  },
});
