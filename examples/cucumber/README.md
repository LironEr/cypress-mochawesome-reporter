# Setup with `cypress-cucumber-preprocessor`

> ⚠️ `@badeball/cypress-cucumber-preprocessor` require node >= 18

1. Follow the steps in the [main README](../../README.md) to setup the reporter.

1. Your `cypress.config.js` file should look like:

   ```js
   const { defineConfig } = require('cypress');
   const cypressOnFix = require('cypress-on-fix');
   const createBundler = require('@bahmutov/cypress-esbuild-preprocessor');
   const { addCucumberPreprocessorPlugin } = require('@badeball/cypress-cucumber-preprocessor');
   const { createEsbuildPlugin } = require('@badeball/cypress-cucumber-preprocessor/esbuild');

   module.exports = defineConfig({
     reporter: 'cypress-mochawesome-reporter',
     video: true,
     retries: 1,
     e2e: {
       specPattern: 'cypress/e2e/**/*.feature',
       async setupNodeEvents(on, config) {
         // "cypress-on-fix" is required because "cypress-mochawesome-reporter" and "cypress-cucumber-preprocessor" use the same hooks
         on = cypressOnFix(on);

         require('cypress-mochawesome-reporter/plugin')(on);

         await addCucumberPreprocessorPlugin(on, config);

         on(
           'file:preprocessor',
           createBundler({
             plugins: [createEsbuildPlugin(config)],
           })
         );

         return config;
       },
     },
   });
   ```

1. Add to `cypress/support/step_definitions/index.js`

   ```js
   import 'cypress-mochawesome-reporter/cucumberSupport';
   ```
