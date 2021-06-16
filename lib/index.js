const fse = require('fs-extra');
const { setConfig } = require('./config');
const { log } = require('./logger');
const generateReport = require('./generateReport');

async function beforeRunHook({ config }) {
  const { outputDir } = await setConfig(config);

  log(`Remove output folder ${outputDir}`);

  await fse.remove(outputDir);
}

async function afterRunHook() {
  await generateReport();
}

module.exports = {
  afterRunHook,
  beforeRunHook,
};
