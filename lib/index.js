const fse = require('fs-extra');
const generateReport = require('./generateReport');
const { getSimpleCypressConfig } = require('./utils');

async function beforeRunHook({ config }) {
  const { outputDir } = await getSimpleCypressConfig(config);
  console.log(`Remove output folder ${outputDir}`);

  await fse.remove(outputDir);
}

async function afterRunHook({ config }) {
  await generateReport(config);
}

module.exports = {
  afterRunHook,
  beforeRunHook,
};
