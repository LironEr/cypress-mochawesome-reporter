const { defineConfig } = require('cypress');
const { beforeRunHook } = require('cypress-mochawesome-reporter/lib');

module.exports = defineConfig({
  video: false,
  retries: 0,
  e2e: {
    setupNodeEvents(on, config) {
      on('before:run', async (details) => {
        await beforeRunHook(details);
      });
    },
  },
});
