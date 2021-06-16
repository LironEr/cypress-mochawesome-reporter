const path = require('path');
const fse = require('fs-extra');
const consts = require('./consts');
const { setLoggerQuietMode } = require('./logger');

let _config = undefined;

async function setConfig(config) {
  _config = await getSimpleCypressConfig(config);

  const {
    reporterOptions: { quiet },
  } = _config;

  setLoggerQuietMode(quiet === true);

  return _config;
}

function getConfig() {
  if (!_config) {
    throw Error('missing config, call beforeRunHook');
  }

  return _config;
}

module.exports = { setConfig, getConfig };

async function extractReporterOptions(options) {
  if (!options) {
    return undefined;
  }

  // If configFile property exist, read options from config file
  const opts = options.configFile ? await fse.readJson(path.resolve(options.configFile)) : options;

  // Only this reporter enabled
  if (!opts.reporterEnabled) {
    return opts;
  }

  // Multi reporters enabled
  return opts.cypressMochawesomeReporterReporterOptions;
}

async function getSimpleCypressConfig(config) {
  const baseDir = config.projectRoot;

  const reporterOptions = (await extractReporterOptions(config.reporterOptions)) || {};

  reporterOptions['reportDir'] = reporterOptions['reportDir'] || path.join(baseDir, consts.defaultHtmlOutputFolder);
  const jsonDir = path.join(reporterOptions.reportDir, '/.jsons');

  return {
    jsonDir,
    reporterOptions,
    screenshotsDir: config.screenshotsFolder,
    outputDir: reporterOptions['reportDir'],
  };
}
