const fse = require('fs-extra');
const path = require('path');
const { setConfig } = require('./config');
const { log, debugLog } = require('./logger');
const generateReport = require('./generateReport');

const IS_DISABLED = process.env['DISABLE_CYPRESS_MOCHAWESOME_REPORTER'] === 'true';

async function beforeRunHook({ config }) {
  if (IS_DISABLED) {
    log('DISABLE_CYPRESS_MOCHAWESOME_REPORTER is true, ignore before run hook');
    return;
  }

  const simpleConfig = await setConfig(config);
  const { outputDir, jsonDir, reporterOptions, configOutput } = simpleConfig;

  if (configOutput) {
    debugLog(`Write simple config to ${configOutput}`);
    // create folder if not exist
    await fse.mkdirp(path.dirname(configOutput));

    // write simple config to file
    await fse.writeJSON(configOutput, simpleConfig, { spaces: 2 });
  }

  // TODO: simplfy this with cleanOutputBeforeRun flag? https://github.com/LironEr/cypress-mochawesome-reporter/pull/155/files#r1309764420

  // if using cypress parallel, do not delete any output as it can delete JSON files from other threads
  if (!reporterOptions.cypressParallel) {
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
