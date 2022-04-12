const path = require('path');
const fse = require('fs-extra');
const consts = require('./consts');
const { setLoggerQuietMode, initDebugLog, debugLog } = require('./logger');

let _config = undefined;

async function setConfig(config) {
  _config = await getSimpleCypressConfig(config);

  if (_config.shouldRun) {
    const {
      reporterOptions: { quiet, debug },
    } = _config;

    setLoggerQuietMode(quiet === true);
    initDebugLog(debug === true);
    debugLog(`cypress.json: ${JSON.stringify(config)}`);
    debugLog(`simple config: ${JSON.stringify(_config)}`);
  }

  return _config;
}

function getConfig() {
  if (!_config) {
    throw Error('missing config, call beforeRunHook');
  }

  return _config;
}

module.exports = { setConfig, getConfig };

async function extractReporterOptions(config) {
  const options = config.reporterOptions || {};

  // If configFile property exist, read options from config file
  const opts = options.configFile ? await fse.readJson(path.resolve(options.configFile)) : options;

  if (config.reporter === 'cypress-mochawesome-reporter') {
    return opts;
  }

  if (
    config.reporter === 'cypress-multi-reporters' &&
    typeof opts.reporterEnabled === 'string' &&
    opts.reporterEnabled
      .split(',')
      .map((s) => s.trim())
      .includes('cypress-mochawesome-reporter')
  ) {
    return opts.cypressMochawesomeReporterReporterOptions;
  }

  return undefined;
}

async function getSimpleCypressConfig(config) {
  const baseDir = config.projectRoot;

  const reporterOptions = await extractReporterOptions(config);

  if (!reporterOptions) {
    return { shouldRun: false };
  }

  reporterOptions['reportDir'] = reporterOptions['reportDir'] || path.join(baseDir, consts.defaultHtmlOutputFolder);
  const jsonDir = path.join(reporterOptions.reportDir, '/.jsons');

  return {
    shouldRun: true,
    jsonDir,
    reporterOptions,
    screenshotsDir: config.screenshotsFolder,
    outputDir: reporterOptions['reportDir'],
  };
}
