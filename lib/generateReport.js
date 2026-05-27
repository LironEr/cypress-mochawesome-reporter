const path = require('path');
const fse = require('fs-extra');
const reportGenerator = require('mochawesome-report-generator');
const { getConfig } = require('./config');
const { log, debugLog } = require('./logger');
const { enhanceReport } = require('./enhanceReport');

async function mergeReports(jsonDir) {
  const files = (await fse.readdir(jsonDir))
    .filter((file) => file.endsWith('.json'))
    .sort()
    .map((file) => path.join(jsonDir, file));

  if (files.length === 0) {
    throw new Error(`No mochawesome report JSON files found in "${jsonDir}"`);
  }

  const reports = await Promise.all(files.map((file) => fse.readJson(file)));
  const stats = mergeStats(reports.map((report) => report.stats || {}));

  return {
    ...reports[0],
    stats,
    results: reports.flatMap((report) => report.results || []),
  };
}

function mergeStats(statsList) {
  const startTimes = statsList.map((stats) => Date.parse(stats.start)).filter(Number.isFinite);
  const endTimes = statsList.map((stats) => Date.parse(stats.end)).filter(Number.isFinite);
  const sum = (field) => statsList.reduce((total, stats) => total + (Number(stats[field]) || 0), 0);
  const tests = sum('tests');
  const passes = sum('passes');
  const pending = sum('pending');

  return {
    suites: sum('suites'),
    tests,
    passes,
    pending,
    failures: sum('failures'),
    skipped: sum('skipped'),
    testsRegistered: sum('testsRegistered') || tests,
    passPercent: tests > 0 ? (passes / tests) * 100 : 0,
    pendingPercent: tests > 0 ? (pending / tests) * 100 : 0,
    other: sum('other'),
    hasOther: statsList.some((stats) => !!stats.hasOther),
    skippedHooks: sum('skippedHooks'),
    hasSkippedHooks: statsList.some((stats) => !!stats.hasSkippedHooks),
    start: startTimes.length > 0 ? new Date(Math.min(...startTimes)).toISOString() : undefined,
    end: endTimes.length > 0 ? new Date(Math.max(...endTimes)).toISOString() : undefined,
    duration: sum('duration'),
  };
}

async function mergeAndCreate(jsonDir, screenshotsDir, mochawesomeOptions) {
  log(`Read and merge jsons from "${jsonDir}"`);

  const report = await mergeReports(jsonDir);

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

  return { htmlPath: html[0], report };
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

  const { outputDir, reporterOptions, screenshotsDir, videosFolder, jsonDir, removeJsonsFolderAfterMerge } =
    getConfig();

  const actions = [mergeAndCreate(jsonDir, screenshotsDir, reporterOptions)];

  if (!reporterOptions.embeddedScreenshots) {
    actions.push(copyMediaDir(screenshotsDir, path.join(outputDir, 'screenshots')));
  }
  if (fse.pathExistsSync(videosFolder) && !reporterOptions.ignoreVideos) {
    actions.push(copyMediaDir(videosFolder, path.join(outputDir, 'videos')));
  }

  const [{ htmlPath, report }] = await Promise.all(actions);

  log('HTML report successfully created!');
  log(htmlPath);

  if (removeJsonsFolderAfterMerge) {
    await fse.remove(jsonDir);
  }

  return report;
}

module.exports = generateReport;
module.exports.mergeReports = mergeReports;
