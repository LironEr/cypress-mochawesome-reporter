const path = require('path');
const fse = require('fs-extra');
const { merge } = require('mochawesome-merge');
const reportGenerator = require('mochawesome-report-generator');
const { getConfig } = require('./config');
const { log, debugLog } = require('./logger');
const { enhanceReport } = require('./enhanceReport');

async function mergeAndCreate(jsonDir, screenshotsDir, mochawesomeOptions) {
  log(`Read and merge jsons from "${jsonDir}"`);

  const report = await merge({
    files: [jsonDir.concat('/*.json')],
  });

  debugLog(`report before enhance: ${JSON.stringify(report)}`);

  log('Enhance report');
  enhanceReport(report, mochawesomeOptions, screenshotsDir);

  debugLog(`report after enhance: ${JSON.stringify(report)}`);

  log('Create HTML report');

  const html = await reportGenerator.create(report, {
    reportFilename: 'index.html',
    ...mochawesomeOptions,
  });

  debugLog(`HTML result: ${JSON.stringify(html)}`);

  return html[0];
}

async function copyscreenshotsDir(screenshotsDir, outputDir) {
  const isExists = fse.existsSync(screenshotsDir);

  if (isExists) {
    const outputscreenshotsDir = path.join(outputDir, 'screenshots');

    if (screenshotsDir !== outputscreenshotsDir) {
      log(`Copy screenshots folder from "${screenshotsDir}" to "${outputscreenshotsDir}"`);

      await fse.copy(screenshotsDir, outputscreenshotsDir, { recursive: true });
    }
  } else {
    log(`Screenshots folder "${screenshotsDir}" not found, nothing to copy`);
  }
}

async function generateReport() {
  log('Start generate report process');

  const { outputDir, reporterOptions, screenshotsDir, jsonDir } = getConfig();

  const actions = [mergeAndCreate(jsonDir, screenshotsDir, reporterOptions)];

  if (!reporterOptions.embeddedScreenshots) {
    actions.push(copyscreenshotsDir(screenshotsDir, outputDir));
  }

  const [htmlPath] = await Promise.all(actions);

  log('HTML report successfully created!');
  log(htmlPath);

  await fse.remove(jsonDir);
}

module.exports = generateReport;
