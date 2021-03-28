const path = require('path');
const consts = require('./consts');

function extractReporterOptions(options) {
  if (!options) {
    return undefined;
  }

  // Only this reporter enabled
  if (!options.reporterEnabled) {
    return options;
  }

  // Multi reporters enabled
  return options.cypressMochawesomeReporterReporterOptions;
}

function getSimpleCypressConfig(config) {
  const baseDir = config.projectRoot;

  const reporterOptions = extractReporterOptions(config.reporterOptions) || {};

  reporterOptions['reportDir'] = reporterOptions['reportDir'] || path.join(baseDir, consts.defaultHtmlOutputFolder);
  const jsonDir = path.join(reporterOptions.reportDir, '/.jsons');

  return {
    jsonDir,
    reporterOptions,
    screenshotsDir: config.screenshotsFolder,
    outputDir: reporterOptions['reportDir'],
  };
}

module.exports = {
  getSimpleCypressConfig
}
