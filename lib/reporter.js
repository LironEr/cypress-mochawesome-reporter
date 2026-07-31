// Mochawesome's `log` utility calls Node's `util.styleText`, which isn't available in
// the Cypress/Electron runtime that loads this reporter. Patch it before `mochawesome`
// is first required so the internal destructured `log` reference uses this safe copy.
const mochawesomeUtils = require('mochawesome/src/utils');

mochawesomeUtils.log = function log(msg, level, config) {
  if (config?.quiet) {
    return;
  }

  const logMethod = console[level] || console.log;

  let out = msg;

  if (typeof msg === 'object') {
    out = JSON.stringify(msg, null, 2);
  }

  logMethod(`[mochawesome] ${out}\n`);
};

const path = require('node:path');
const mochawesome = require('mochawesome');
const consts = require('./consts');

const defaultReporterOptions = {
  overwrite: false,
  html: false,
  json: true,
};

function reporter(runner, options) {
  const reporterOptions = {
    ...options?.reporterOptions,
    ...defaultReporterOptions,
  };

  reporterOptions.reportDir = path.join(reporterOptions.reportDir || consts.defaultHtmlOutputFolder, '/.jsons');

  const opts = {
    ...options,
    reporterOptions,
  };

  mochawesome.call(this, runner, opts);
}

module.exports = reporter;
