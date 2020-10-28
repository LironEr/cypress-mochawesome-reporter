const path = require('path');
const fse = require('fs-extra');
const { merge } = require('mochawesome-merge');
const reportGenerator = require('mochawesome-report-generator');

async function mergeAndCreate({ jsonDir, output, mochawesomeOptions }) {
  const report = await merge({
    files: [jsonDir.concat('/*.json')],
  });

  const html = await reportGenerator.create(report, { reportDir: output, ...mochawesomeOptions });

  return html[0];
}

async function copyScreenShotsDir({ screenshotsDir, output }) {
  const isExists = fse.existsSync(screenshotsDir);

  if (isExists) {
    await fse.copy(screenshotsDir, path.join(output, 'screenshots'), { recursive: true });
  }
}

async function generateReport({ jsonDir, screenshotsDir, output, ...mochawesomeOptions }) {
  const [htmlPath] = await Promise.all([
    mergeAndCreate({ jsonDir, output, mochawesomeOptions }),
    copyScreenShotsDir({ screenshotsDir, output }),
  ]);

  console.log(htmlPath);
}

module.exports = generateReport;
