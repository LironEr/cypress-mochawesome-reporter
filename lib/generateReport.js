const path = require('path');
const fse = require('fs-extra');
const { merge } = require('mochawesome-merge');
const reportGenerator = require('mochawesome-report-generator');
const { getSimpleCypressConfig } = require('./utils');

async function mergeAndCreate(jsonDir, mochawesomeOptions) {
  console.log(`Read and merge jsons from "${jsonDir}"`);

  const report = await merge({
    files: [jsonDir.concat('/*.json')],
  });

  console.log('Create HTML report');

  const html = await reportGenerator.create(report, {
    reportFilename: 'index.html',
    ...mochawesomeOptions,
  });

  return html[0];
}

async function copyscreenshotsDir(screenshotsDir, outputDir) {
  const isExists = fse.existsSync(screenshotsDir);

  if (isExists) {
    const outputscreenshotsDir = path.join(outputDir, 'screenshots');

    console.log(`Copy screenshots folder from "${screenshotsDir}" to "${outputscreenshotsDir}"`);

    await fse.copy(screenshotsDir, outputscreenshotsDir, { recursive: true });
  } else {
    console.log(`Screenshots folder "${screenshotsDir}" not found, nothing to copy`);
  }
}

async function generateReport(config) {
  const { outputDir, reporterOptions, screenshotsDir, jsonDir } = await getSimpleCypressConfig(config);

  const [htmlPath] = await Promise.all([
    mergeAndCreate(jsonDir, reporterOptions),
    copyscreenshotsDir(screenshotsDir, outputDir),
  ]);

  console.log('HTML report successfully created!');
  console.log(htmlPath);

  await fse.remove(jsonDir);
}

module.exports = generateReport;
