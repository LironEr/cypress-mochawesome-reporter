#!/usr/bin/env node

const path = require('path');
const yargs = require('yargs');

const args = yargs
  .options({
    jsonDir: {
      type: 'string',
      default: 'cypress/results/json',
      describe: 'Cypress results json folder, should be the same as reportDir in cypress.json',
      coerce: path.resolve,
    },
    screenshotsDir: {
      type: 'string',
      default: 'cypress/screenshots',
      describe: 'Cypress screenshots directory',
      coerce: path.resolve,
    },
    output: {
      alias: 'o',
      type: 'string',
      default: 'cypress/reports/html',
      describe: 'Path to save report',
      coerce: path.resolve,
    },
  })
  .help('help')
  .alias('h', 'help')
  .version().argv;

require('../lib/generateReport')(args);
