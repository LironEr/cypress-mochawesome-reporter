const fse = require('fs-extra');
const generateReport = require('./lib/generateReport');
const { getSimpleCypressConfig } = require('./lib/utils');

module.exports = function (on) {
  on('before:run', async (details) => {
    const { outputDir } = await getSimpleCypressConfig(details.config);
    console.log(`Remove output folder ${outputDir}`);

    await fse.remove(outputDir);
  }),
  on('after:run', async (results) => {
    await generateReport(results.config);
  })
}