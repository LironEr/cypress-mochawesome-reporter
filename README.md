# cypress-mochawesome-reporter

[![npm](https://img.shields.io/npm/v/cypress-mochawesome-reporter)](http://www.npmjs.com/package/cypress-mochawesome-reporter)
[![node](https://img.shields.io/node/v/cypress-mochawesome-reporter.svg)](https://github.com/LironEr/cypress-mochawesome-reporter)
[![npm](https://img.shields.io/npm/l/cypress-mochawesome-reporter)](http://www.npmjs.com/package/cypress-mochawesome-reporter)
[![npm](https://img.shields.io/npm/dm/cypress-mochawesome-reporter)](http://www.npmjs.com/package/cypress-mochawesome-reporter)

Zero config Mochawesome reporter for Cypress with screenshots attached to tests.

[Example report](https://lironer.github.io/cypress-mochawesome-reporter/example-report/mochawesome.html)

<img src="./docs/assets/failed-test-with-screenshot.png" alt="Mochawesome report with fail test screenshot" width="50%" />

## Cypress compatibility

| reporter version | cypress version                                                               | reporter branch                                                         |
| ---------------- | ----------------------------------------------------------------------------- | ----------------------------------------------------------------------- |
| `v4`             | node >= 22<br/>>= `6.7.0` <br />>= `6.2.0` with `experimentalRunEvents: true` | `main`                                                                  |
| `v3`             | node >= 14<br/>>= `6.7.0` <br />>= `6.2.0` with `experimentalRunEvents: true` | [`v3`](https://github.com/LironEr/cypress-mochawesome-reporter/tree/v3) |
| `v2`             | >= `6.7.0` <br />>= `6.2.0` with `experimentalRunEvents: true`                | [`v2`](https://github.com/LironEr/cypress-mochawesome-reporter/tree/v2) |
| `v1`             | >= `4.0.0`                                                                    | [`v1`](https://github.com/LironEr/cypress-mochawesome-reporter/tree/v1) |

[migration guide from `v1` to `v2`](./migration.md)

## Setup

> This setup tutorial works with Cypress >= v10, looking for older version setup? [here](https://github.com/LironEr/cypress-mochawesome-reporter/blob/9c11e7005351e8750fe48b90d010c9bf29539956/README.md#setup)

1. install cypress-mochawesome-reporter

   ```
   npm i --save-dev cypress-mochawesome-reporter
   ```

   or

   ```
   yarn add -D cypress-mochawesome-reporter
   ```

2. Change cypress reporter & setup hooks

   Edit config file (`cypress.config.js` by default)

   ```js
   const { defineConfig } = require('cypress');

   module.exports = defineConfig({
     reporter: 'cypress-mochawesome-reporter',
     e2e: {
       setupNodeEvents(on, config) {
         require('cypress-mochawesome-reporter/plugin')(on);
       },
     },
   });
   ```

   If you are override `before:run` or `after:run` hooks, use this:

   ```js
   const { defineConfig } = require('cypress');
   const { beforeRunHook, afterRunHook } = require('cypress-mochawesome-reporter/lib');

   module.exports = defineConfig({
     reporter: 'cypress-mochawesome-reporter',
     e2e: {
       setupNodeEvents(on, config) {
         on('before:run', async (details) => {
           console.log('override before:run');
           await beforeRunHook(details);
         });

         on('after:run', async () => {
           console.log('override after:run');
           await afterRunHook();
         });
       },
     },
   });
   ```

3. Add to `cypress/support/e2e.js`

   ```javascript
   import 'cypress-mochawesome-reporter/register';
   ```

4. (optional, if your are using `cypress-cucumber-preprocessor`) Add to `cypress/support/step_definitions/index.js`

   ```javascript
   import 'cypress-mochawesome-reporter/cucumberSupport';
   ```

   > ⚠️ `cypress-cucumber-preprocessor` uses the same hooks as `cypress-mochawesome-reporter`, you also need to install [cypress-on-fix](https://github.com/bahmutov/cypress-on-fix). Full example of using `cypress-mochawesome-reporter` with `cypress-cucumber-preprocessor` can be found [here](examples/cucumber).

5. run cypress

## Custom options

If you want to customize your HTML report with [mochawesome-report-generator flags](https://github.com/adamgruber/mochawesome-report-generator#cli-flags) just add the flags you want to `reporterOptions`

```js
const { defineConfig } = require('cypress');

module.exports = defineConfig({
  reporter: 'cypress-mochawesome-reporter',
  reporterOptions: {
    charts: true,
    reportPageTitle: 'custom-title',
    embeddedScreenshots: true,
    inlineAssets: true,
    saveAllAttempts: false,
  },
  e2e: {
    setupNodeEvents(on, config) {
      require('cypress-mochawesome-reporter/plugin')(on);
    },
  },
});
```

Additional reporter options:

| name                  | type      | default | description                                                                                                                                                                                                                                                                                                                                                                                     |
| --------------------- | --------- | ------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `embeddedScreenshots` | `boolean` | `false` | Embedded external screenshots into HTML using base64, use with `inlineAssets` option to produce a single HTML file                                                                                                                                                                                                                                                                              |
| `ignoreVideos`        | `boolean` | `false` | Will not copy videos recorded by Cypress nor show them in the mochawesome report. Requires that Cypress config option `video` is set to `true` for the option to have any effect<br/>Because mochawesome doesn't support context per spec file, each test will have the whole spec file video. More info can be found [here](https://github.com/LironEr/cypress-mochawesome-reporter/issues/43) |
| `videoOnFailOnly`     | `boolean` | `false` | If Videos are recorded and added to the report, setting this to `true` will add the videos only to tests with failures.<br/>Do note that this will NOT cause video's to only record failed tests, just they not be added to passed tests in the mochawesome report                                                                                                                              |
| `quiet`               | `boolean` | `false` | Silence console messages                                                                                                                                                                                                                                                                                                                                                                        |
| `saveAllAttempts`     | `boolean` | `true`  | Save screenshots of all test attempts, set to `false` to save only the last attempt                                                                                                                                                                                                                                                                                                             |
| `debug`               | `boolean` | `false` | Creates log file with debug data                                                                                                                                                                                                                                                                                                                                                                |
| `saveJson`            | `boolean` | `false` | Keeps the json file used to create html report                                                                                                                                                                                                                                                                                                                                                  |

## Add extra information to report

Add extra information to the report manually by using `cy.addTestContext()` as seen in the [simple-typescript example test 2](/examples/simple-typescript/cypress/e2e/test2.cy.ts)

<img src="./docs/assets/passed-test-with-addContext-screenshot.png" alt="Mochawesome report with fail test screenshot" width="50%" />

## Examples

1. [Simple use of `cypress-mochawesome-reporter`](examples/simple)
2. [Using `cypress-multi-reporters`](examples/multiple-reporters)
3. [With `mochawesome-report-generator` flags](examples/mochawesome-flags)
4. [Change default screenshots folder in `cypress.json`](examples/screenshots-folder)
5. [Using `cypress-mochawesome-reporter` with typescript](examples/simple-typescript)
6. [Using `cypress-mochawesome-reporter` with `cypress-parallel`](examples/cypress-parallel)
7. [Using `cypress-mochawesome-reporter` with `cypress-cucumber-preprocessor`](examples/cucumber)

Run `npm i` in root directory then:

```
cd examples/<example-project>

npm i
npm test
```
