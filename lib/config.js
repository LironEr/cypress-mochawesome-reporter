const path = require('path');
const fse = require('fs-extra');
const consts = require('./consts');
const { setLoggerQuietMode, initDebugLog, debugLog } = require('./logger');

let _config = undefined;

async function setConfig(config) {
  _config = await getSimpleCypressConfig(config);

  const {
    reporterOptions: { quiet, debug },
  } = _config;

  setLoggerQuietMode(quiet === true);
  initDebugLog(debug === true);

  debugLog(`cwd: ${process.cwd()}`);
  debugLog(`cypress.json: ${JSON.stringify(config)}`);
  debugLog(`simple config: ${JSON.stringify(_config)}`);

  return _config;
}

function getConfig() {
  if (!_config) {
    throw Error('missing config, call beforeRunHook');
  }

  return _config;
}

module.exports = { setConfig, getConfig };

async function extractConfigFileOptions(configFile) {
  const configFilePath = path.resolve(configFile);
  const configFileExt = path.extname(configFile);

  if (configFileExt === '.json') {
    return await fse.readJson(configFilePath);
  } else if (configFileExt === '.js') {
    return require(configFilePath);
  } else {
    throw Error(`configFile ${configFile} cannot be resolved in reporterOptions. Supported extensions .json and .js`);
  }
}

async function extractReporterOptions(options) {
  if (!options) {
    return undefined;
  }

  // If configFile property exist, read options from config file
  const opts = options.configFile ? await extractConfigFileOptions(options.configFile) : options;

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

  reporterOptions.reportDir = reporterOptions.reportDir || consts.defaultHtmlOutputFolder;

  if (!path.isAbsolute(reporterOptions.reportDir)) {
    reporterOptions.reportDir = path.join(baseDir, reporterOptions.reportDir);
  }

  const jsonDir = path.join(reporterOptions.reportDir, '/.jsons');

  return {
    jsonDir,
    reporterOptions,
    screenshotsDir: config.screenshotsFolder,
    videosFolder: config.videosFolder,
    outputDir: reporterOptions.reportDir,
  };
}
