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

function setSimpleConfig(config) {
  _config = config;
}

module.exports = { setConfig, getConfig, setSimpleConfig };

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

  if (reporterOptions.cypressParallel === 'true') {
    // cypress-parallel is passing booleans as strings, covert them to booleans
    for (const key in reporterOptions) {
      const value = reporterOptions[key];

      if (value === 'true') {
        reporterOptions[key] = true;
      } else if (value === 'false') {
        reporterOptions[key] = false;
      }
    }

    // because we run in parallel, we dont want to overwrite the JSONs from other threads
    reporterOptions.overwrite = false;

    reporterOptions.configOutput = reporterOptions.configOutput || true;
    reporterOptions.removeJsonsFolderAfterMerge = false;
  }

  let { configOutput, removeJsonsFolderAfterMerge, ...restReporterOptions } = reporterOptions;

  if (configOutput !== undefined && configOutput !== false) {
    configOutput = typeof configOutput === 'string' ? configOutput : consts.defaultConfigOutput;
  }

  if (removeJsonsFolderAfterMerge === undefined) {
    removeJsonsFolderAfterMerge = true;
  }

  return {
    jsonDir,
    reporterOptions: restReporterOptions,
    screenshotsDir: config.screenshotsFolder,
    videosFolder: config.videosFolder,
    outputDir: reporterOptions.reportDir,
    configOutput,
    removeJsonsFolderAfterMerge,
  };
}
