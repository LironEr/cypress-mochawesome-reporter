# cypress-mochawesome-reporter

[![npm](https://img.shields.io/npm/v/cypress-mochawesome-reporter)](http://www.npmjs.com/package/cypress-mochawesome-reporter)
[![node](https://img.shields.io/node/v/cypress-mochawesome-reporter.svg)](https://github.com/LironEr/cypress-mochawesome-reporter)

Zero config Mochawesome reporter for Cypress with screenshots attached to tests.

[Example report](https://lironer.github.io/cypress-mochawesome-reporter/example-report/mochawesome.html)

<img src="./docs/assets/failed-test-with-screenshot.png" alt="Mochawesome report with fail test screenshot" width="50%" />

## Setup

1. install cypress-mochawesome-reporter

```
npm i --save-dev cypress-mochawesome-reporter
```

or

```
yarn add -D cypress-mochawesome-reporter
```

2. Change cypress reporter

config file

```
  "reporter": "cypress-mochawesome-reporter"
```

or command line

```
--reporter cypress-mochawesome-reporter
```

3. Add to `cypress/support/index.js`

```
import 'cypress-mochawesome-reporter/register';
```

4. add to your package.json scripts

```
"cypress:report": "generate-mochawesome-report"
```

5. run cypress and then `npm run cypress:report`

## CLI (generate-mochawesome-report) flags

| Flag                | Type   | Default                    | Description                                                                         |
| :------------------ | :----- | :------------------------- | :---------------------------------------------------------------------------------- |
| -c, --cypressConfig | string | [cwd]/cypress.json         | cypress.json file path                                                              |
| -o, --output        | string | [cwd]/cypress/reports/html | Path to save report                                                                 |
| --jsonDir           | string | [cwd]/cypress/results/json | Cypress results json folder, should be the same as reportDir in cypress.json        |
| --screenshotsDir    | string | [cwd]/cypress/screenshots  | Cypress screenshots folder, should be the same as screenshotsFolder in cypress.json |

You can also pass [mochawesome-report-generator CLI flags](https://github.com/adamgruber/mochawesome-report-generator#cli-flags)

## Exmaples

1. [Simple use of `cypress-mochawesome-reporter`](examples/simple)
2. [Using `cypress-multi-reporters`](examples/multiple-reporters)
3. [With `mochawesome-report-generator` CLI flags](examples/mochawesome-cli-flags)
4. [Change default screenshots folder in `cypress.json`](examples/screenshots-folder)

```
cd examples/<example-project>

npm i
npm run serve
npm run cypress:run
npm run cypress:report
```
