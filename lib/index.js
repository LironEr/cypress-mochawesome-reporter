const fse = require('fs-extra');
const { setConfig } = require('./config');
const { log, debugLog } = require('./logger');
const generateReport = require('./generateReport');

async function beforeRunHook({ config }) {
  const { outputDir, jsonDir, reporterOptions } = await setConfig(config);

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
  await generateReport();

  debugLog('done');
}

module.exports = {
  afterRunHook,
  beforeRunHook,
};
