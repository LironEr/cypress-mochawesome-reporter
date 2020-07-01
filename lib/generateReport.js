const path = require('path');
const fse = require('fs-extra');
const { merge } = require('mochawesome-merge');
const reportGenerator = require('mochawesome-report-generator');

async function mergeAndCreate({ jsonDir, output }) {
  const report = await merge({
    files: [jsonDir.concat('/*.json')],
  });

  const html = await reportGenerator.create(report, { reportDir: output });

  return html[0];
}

async function copyScreenShotsDir({ screenshotsDir, output }) {
  const isExists = fse.existsSync(screenshotsDir);

  if (isExists) {
    await fse.copy(screenshotsDir, path.join(output, 'screenshots'), { recursive: true });
  }
}

async function generateReport({ jsonDir, screenshotsDir, output }) {
  const [htmlPath] = await Promise.all([
    mergeAndCreate({ jsonDir, output }),
    copyScreenShotsDir({ screenshotsDir, output }),
  ]);

  console.log(htmlPath);
}

module.exports = generateReport;
