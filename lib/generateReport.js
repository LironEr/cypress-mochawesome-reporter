const { promisify } = require('util');
const path = require('path');
const glob = require('glob');
const globAsync = promisify(glob);
const fse = require('fs-extra');
const { merge } = require('mochawesome-merge');
const reportGenerator = require('mochawesome-report-generator');
const { getConfig } = require('./config');
const { log, debugLog } = require('./logger');
const { enhanceReport } = require('./enhanceReport');

async function mergeAndCreate(jsonDir, screenshotsDir, mochawesomeOptions) {
  log(`Read and merge jsons from "${jsonDir}"`);

  const pattern = path.join(jsonDir, '*.json');
  const files = await globAsync(pattern);

  if (files.length === 0) {
    log('No JSON files found. Skipping report generation.');
    return null;
  }

  const report = await merge({ files });

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

  // html can be an array of generated files; use first
  const htmlPath = Array.isArray(html) ? html[0] : html;

  return { htmlPath, report };
}

async function copyMediaDir(inputDir, outputDir) {
  const isExists = fse.existsSync(inputDir);

  if (isExists) {
    if (inputDir !== outputDir) {
      log(`Copy media folder from "${inputDir}" to "${outputDir}"`);

      await fse.copy(inputDir, outputDir, { recursive: true });
    }
  } else {
    log(`Media folder "${inputDir}" not found, nothing to copy`);
  }
}

async function generateReport() {
  log('Start generate report process');

  const {
    outputDir,
    reporterOptions,
    screenshotsDir,
    videosFolder,
    jsonDir,
    removeJsonsFolderAfterMerge,
    addScreenshotsToReport,
  } = getConfig();

  const actions = [mergeAndCreate(jsonDir, screenshotsDir, reporterOptions)];

  log('screenshotsDir:', screenshotsDir);
  log('videosFolder:', videosFolder);
  log('jsonDir:', jsonDir);
  log('removeJsonsFolderAfterMerge:', removeJsonsFolderAfterMerge);
  log('addScreenshotsToReport:', addScreenshotsToReport);

  if (!reporterOptions.embeddedScreenshots && addScreenshotsToReport) {
    actions.push(copyMediaDir(screenshotsDir, path.join(outputDir, 'screenshots')));
  }
  if (fse.pathExistsSync(videosFolder) && !reporterOptions.ignoreVideos) {
    actions.push(copyMediaDir(videosFolder, path.join(outputDir, 'videos')));
  }

  // Don't destructure immediately; handle the null case first
  const [mergeResult] = await Promise.all(actions);

  if (!mergeResult) {
    log('No report generated (no JSON files found).');

    if (removeJsonsFolderAfterMerge) {
      await fse.remove(jsonDir);
    }

    log('No report generated (no JSON files found).');

    return null;
  }

  const { htmlPath, report } = mergeResult;

  if (htmlPath) {
    log('HTML report successfully created!');
    log(htmlPath);
  } else {
    // Be graceful even if the generator returned nothing usable
    log('Report data created, but no HTML path was returned.');
  }

  if (removeJsonsFolderAfterMerge) {
    await fse.remove(jsonDir);
  }

  return report;
}

module.exports = generateReport;
