const fse = require('fs-extra');
const { setConfig } = require('./config');
const { log, debugLog } = require('./logger');
const generateReport = require('./generateReport');

const IS_DISABLED = process.env['DISABLE_CYPRESS_MOCHAWESOME_REPORTER'] === 'true';

async function beforeRunHook({ config }) {
  if (IS_DISABLED) {
    log('DISABLE_CYPRESS_MOCHAWESOME_REPORTER is true, ignore before run hook');
    return;
  }

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
  if (IS_DISABLED) {
    log('DISABLE_CYPRESS_MOCHAWESOME_REPORTER is true, ignore after run hook');
    return;
  }

  await generateReport();

  debugLog('done');
}

module.exports = {
  afterRunHook,
  beforeRunHook,
};
