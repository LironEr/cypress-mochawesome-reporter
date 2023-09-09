#!/usr/bin/env node

const { Command } = require('commander');
const fse = require('fs-extra');
const { setSimpleConfig } = require('./lib/config');
const { log, initDebugLog, debugLog } = require('./lib/logger');
const generateReport = require('./lib/generateReport');
const consts = require('./lib/consts');
const packageJson = require('./package.json');

(async () => {
  const program = new Command();
  program
    .name('generate-mochawesome-report')
    .description('CLI merge and generate Cypress Mochawesome report')
    .version(packageJson.version)
    .option('-c, --config <path>', 'should be the same as "configOutput" reporter option', consts.defaultConfigOutput)
    .option('-o, --output <path>', 'report output folder')
    .option('--debug', 'print debug logs', false);

  program.parse();
  const options = program.opts();

  initDebugLog(options.debug === true);

  debugLog(`cwd: ${process.cwd()}`);

  log(`read config from ${options.config}`);

  const config = await fse.readJson(options.config);
  debugLog(`config: ${JSON.stringify(config)}`);

  if (options.output) {
    debugLog(`override output with: ${options.output}`);
    config.outputDir = options.output;
    config.reporterOptions.reportDir = options.output;
  }

  setSimpleConfig(config);

  log('generate report');
  await generateReport();
})();
