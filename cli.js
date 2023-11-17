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
    // TODO: change to true in the next major version?
    .option('-e --set-exit-code', 'set the exit code to the number of failed tests', false)
    .option('--debug', 'print debug logs', false);

  program.parse();
  const options = program.opts();

  initDebugLog(options.debug === true);

  debugLog(`cli options: ${JSON.stringify(options)}`)
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
  const report = await generateReport();

  // replicate current cypress behavior
  if (options.setExitCode && report.stats.failures > 0) {
    debugLog(`${report.stats.failures} tests failed, set exit code`);

    process.exit(report.stats.failures);
  }
})();
