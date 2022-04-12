const fse = require('fs-extra');
const { setConfig, getConfig } = require('./config');
const { log, debugLog } = require('./logger');
const generateReport = require('./generateReport');

async function beforeRunHook({ config }) {
  const { shouldRun, outputDir, jsonDir, reporterOptions } = await setConfig(config);

  if (!shouldRun) {
    log('cypress-mochawesome-reporter is not the active reporter, ignore before run hook');
    return;
  }

  // Only if overwrite is set to false delete only .jsons folder and keep the html files
  // By default overwrite is set to undefined (which means true by mochawesome-report-generator)
  if (reporterOptions.overwrite === false) {
    log(`Remove .jsons folder ${jsonDir}`);

    await fse.remove(jsonDir);
  } else {
    log(`Remove output folder ${outputDir}`);

    await fse.remove(outputDir);
  }
}

async function afterRunHook() {
  const { shouldRun } = getConfig();

  if (!shouldRun) {
    log('cypress-mochawesome-reporter is not the active reporter, ignore after run hook');
    return;
  }

  await generateReport();

  debugLog('done');
}

module.exports = {
  afterRunHook,
  beforeRunHook,
};
