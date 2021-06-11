const path = require('path');
const fse = require('fs-extra');
const consts = require('./consts');

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

async function convertJsonScreenshotsToBase64(report, screenshotsDir) {
  report.results.forEach((result) => {
    result.suites.forEach((suite) => {
      suite.tests.forEach((test) => {
        test.context = generateBase64Context(test.context, screenshotsDir);
      });
    });
  });
}

function convertContextImgToBase64(context, screenshotsDir) {
  if (typeof context === 'object' && context.value && context.title && context.value.startsWith('screenshots')) {
    const imgPath = path.resolve(screenshotsDir, context.value.substr('screenshots\\'.length));
    const contents = 'data:image/png;base64, ' + fse.readFileSync(imgPath, { encoding: 'base64' });
    context.value = contents;
  }
}

function generateBase64Context(context, screenshotsDir) {
  if (!context) return null;

  const parsedContext = JSON.parse(context);

  if (Array.isArray(parsedContext)) {
    parsedContext.forEach((c) => {
      convertContextImgToBase64(c, screenshotsDir);
    });
  } else {
    convertContextImgToBase64(parsedContext, screenshotsDir);
  }

  return JSON.stringify(parsedContext);
}

function addFilenameToSuites(report) {
  report.results.forEach((result) => {
    const { file, fullFile, suites } = result;

    suites.forEach((suite) => {
      suite.file = file;
      suite.fullFile = fullFile;
    });
  });
}

module.exports = {
  getSimpleCypressConfig,
  convertJsonScreenshotsToBase64,
  addFilenameToSuites,
};
