# Setup with `cypress-parallel`

1. Follow the steps in the [main README](../../README.md) to setup the reporter.

1. Change `cypress.config.js` to **only** use `beforeRunHook`, otherwise the reporter will try to create multiple HTML reporters without all the tests.

   ```js
   const { defineConfig } = require('cypress');
   const { beforeRunHook } = require('cypress-mochawesome-reporter/lib');

   module.exports = defineConfig({
     video: true,
     retries: 0,
     e2e: {
       setupNodeEvents(on, config) {
         on('before:run', async (details) => {
           await beforeRunHook(details);
         });
       },
     },
   });
   ```

1. run tests:

   1. Because cypress parallel runs in threads you will need to manually clear the report output folder before run.

   1. Set `cypress-parallel` reporter to `cypress-mochawesome-reporter` and set `cypressParallel=true` reporter option to make the reporter aware of `cypress-parallel`.

      ```sh
      cypress-parallel -s cy:run -t 2 -d 'cypress/e2e/**/*.cy.js' -r 'cypress-mochawesome-reporter' -o 'cypressParallel=true'"
      ```

   1. Create report after test run:

      ```sh
      npx generate-mochawesome-report --set-exit-code
      ```

      > `--set-exit-code` will set the exit code to the number of failed tests, as Cypress does. If you dont want this behavior, you can remove the flag or set `--set-exit-code false`.

   Example scripts section in `package.json`:

   ```json
   "scripts": {
     "cy:run": "cypress run",
     "cy:run:parallel": "cypress-parallel -s cy:run -t 2 -d 'cypress/e2e/**/*.cy.js' -r 'cypress-mochawesome-reporter' -o 'cypressParallel=true'",
     "clean": "rimraf cypress/reports",
     "generate-report": "generate-mochawesome-report --set-exit-code",
     "test": "npm run clean && npm run cy:run:parallel || true && npm run generate-report"
   },
   ```
