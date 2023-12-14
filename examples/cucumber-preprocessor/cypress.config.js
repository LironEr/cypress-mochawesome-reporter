const { defineConfig } = require('cypress');
const createBundler = require('@bahmutov/cypress-esbuild-preprocessor');
const { addCucumberPreprocessorPlugin } = require('@badeball/cypress-cucumber-preprocessor');
const { createEsbuildPlugin } = require('@badeball/cypress-cucumber-preprocessor/esbuild');

async function setupNodeEvents(on, config) {
  require('cypress-mochawesome-reporter/plugin')(on);

  await addCucumberPreprocessorPlugin(on, config, { omitBeforeRunHandler: true, omitAfterRunHandler: true });

  on(
    'file:preprocessor',
    createBundler({
      plugins: [createEsbuildPlugin(config)],
    })
  );

  return config;
}

module.exports = defineConfig({
  reporter: 'cypress-mochawesome-reporter',
  reporterOptions: {
    debug: true,
  },
  e2e: {
    specPattern: '**/*.feature',
    setupNodeEvents,
  },
});
