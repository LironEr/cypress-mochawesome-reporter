const path = require('path');
const fse = require('fs-extra');
const { merge } = require('mochawesome-merge');
const reportGenerator = require('mochawesome-report-generator');

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

async function getCypressConfig(configPath) {
  let config = {};

  try {
    config = await fse.readJson(configPath);
  } catch {
    console.warn(`Couldn't find cypress.json file in "${configPath}", continue with default config`);
  }

  const baseDir = path.dirname(configPath);

  return {
    resultsjsonDir: path.join(
      baseDir,
      (config.reporterOptions && config.reporterOptions.reportDir) || 'cypress/results/json'
    ),
    screenshotsDir: path.join(baseDir, config.screenshotsFolder || 'cypress/screenshots'),
    outputFolder: path.join(baseDir, 'cypress/reports/html'),
    reporterOptions: extractReporterOptions(config.reporterOptions),
  };
}

async function mergeAndCreate({ jsonDir, output, mochawesomeOptions }) {
  console.log(`Read and merge jsons from "${jsonDir}"`);

  const report = await merge({
    files: [jsonDir.concat('/*.json')],
  });

  console.log(`Create HTML report in "${output}"`);

  const html = await reportGenerator.create(report, {
    reportDir: output,
    reportFilename: 'index.html',
    ...mochawesomeOptions,
  });

  return html[0];
}

async function copyscreenshotsDir({ screenshotsDir, output }) {
  const isExists = fse.existsSync(screenshotsDir);

  if (isExists) {
    const outputscreenshotsDir = path.join(output, 'screenshots');

    console.log(`Copy screenshots folder from "${screenshotsDir}" to "${outputscreenshotsDir}"`);

    await fse.copy(screenshotsDir, outputscreenshotsDir, { recursive: true });
  } else {
    console.log(`Screenshots folder "${screenshotsDir}" not found, nothing to copy`);
  }
}

async function normalizeOptions({
  cypressConfig: cypressConfigPath,
  jsonDir,
  screenshotsDir,
  output,
  ...mochawesomeOptions
}) {
  console.log(`Read cypress config file from "${cypressConfigPath}"`);
  const cypressConfig = await getCypressConfig(cypressConfigPath);

  return {
    jsonDir: jsonDir ? path.resolve(jsonDir) : cypressConfig.resultsjsonDir,
    screenshotsDir: screenshotsDir ? path.resolve(screenshotsDir) : cypressConfig.screenshotsDir,
    output: output ? path.resolve(output) : cypressConfig.outputFolder,
    mochawesomeOptions: { ...cypressConfig.reporterOptions, ...mochawesomeOptions },
  };
}

async function generateReport(options) {
  const { jsonDir, screenshotsDir, output, mochawesomeOptions } = await normalizeOptions(options);

  const [htmlPath] = await Promise.all([
    mergeAndCreate({
      jsonDir,
      output,
      mochawesomeOptions,
    }),
    copyscreenshotsDir({
      screenshotsDir,
      output,
    }),
  ]);

  console.log('HTML report successfully created!');
  console.log(htmlPath);
}

module.exports = generateReport;
