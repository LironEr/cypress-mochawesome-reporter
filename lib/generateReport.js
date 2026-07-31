const path = require('node:path');
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
  const results = reports.flatMap((report) => report.results.filter((result) => result !== false));

  return {
    stats: generateStats(results, reports),
    results,
    meta: reports[0].meta,
  };
}

function getAllTests(suites) {
  return (suites ?? []).flatMap((suite) => [...(suite.tests ?? []), ...getAllTests(suite.suites ?? [])]);
}

function generateStats(suites, reports) {
  const tests = getAllTests(suites);
  const passes = tests.filter((test) => test.state === 'passed');
  const pending = tests.filter((test) => test.state === 'pending');
  const failures = tests.filter((test) => test.state === 'failed');
  const skipped = tests.filter((test) => test.state === 'skipped');
  const start = new Date(Math.min(...reports.map((report) => new Date(report.stats.start).getTime())));
  const end = new Date(Math.max(...reports.map((report) => new Date(report.stats.end).getTime())));

  return {
    suites: suites.length,
    tests: tests.length,
    passes: passes.length,
    pending: pending.length,
    failures: failures.length,
    testsRegistered: tests.length,
    passPercent: (passes.length * 100) / tests.length,
    pendingPercent: (pending.length * 100) / tests.length,
    other: 0,
    hasOther: false,
    skipped: skipped.length,
    hasSkipped: skipped.length > 0,
    start: start.toISOString(),
    end: end.toISOString(),
    duration: end.getTime() - start.getTime(),
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
