## Migrating from `v1` to `v2`

1. Upgrade `cypress-mochawesome-reporter` to the latest version

2. Upgrade to cypress >= `6.7.0` or cypress >= `6.2.0` with `experimentalRunEvents: true` in `cypress.json` file

3. Add to `cypress/plugins/index.js`

    ```
    module.exports = (on, config) => {
      require('cypress-mochawesome-reporter/plugin')(on);
    }
    ```

4. Remove `generate-mochawesome-report` from your `package.json`

    Since this version automatically generate the HTML at the end of a test run, the CLI have no use anymore
