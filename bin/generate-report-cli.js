#!/usr/bin/env node

const path = require('path');
const yargs = require('yargs');

const args = yargs
  .options({
    cypressConfig: {
      alias: 'c',
      type: 'string',
      default: 'cypress.json',
      describe: 'cypress.json path',
      coerce: path.resolve,
    },
    output: {
      alias: 'o',
      type: 'string',
      describe: 'Path to save report',
    },
    jsonDir: {
      type: 'string',
      describe: 'Cypress results json folder, should be the same as reportDir in cypress.json',
    },
    screenshotsDir: {
      type: 'string',
      describe: 'Cypress screenshots folder, should be the same as screenshotsFolder in cypress.json',
    },
  })
  .help('help')
  .alias('h', 'help')
  .version().argv;

require('../lib/generateReport')(args);
