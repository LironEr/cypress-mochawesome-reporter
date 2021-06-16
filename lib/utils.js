const path = require('path');
const fse = require('fs-extra');

async function convertJsonScreenshotsToBase64(report, screenshotsDir) {
  report.results.forEach((result) => {
    result.suites.forEach((suite) => {
      suite.tests.forEach((test) => {
        test.context = generateBase64Context(test.context, screenshotsDir);
      });
    });
  });
}

function convertContextImgToBase64(context, screenshotsDir) {
  if (typeof context === 'object' && context.value && context.title && context.value.startsWith('screenshots')) {
    const imgPath = path.resolve(screenshotsDir, context.value.substr('screenshots\\'.length));
    const contents = 'data:image/png;base64, ' + fse.readFileSync(imgPath, { encoding: 'base64' });
    context.value = contents;
  }
}

function generateBase64Context(context, screenshotsDir) {
  if (!context) return null;

  const parsedContext = JSON.parse(context);

  if (Array.isArray(parsedContext)) {
    parsedContext.forEach((c) => {
      convertContextImgToBase64(c, screenshotsDir);
    });
  } else {
    convertContextImgToBase64(parsedContext, screenshotsDir);
  }

  return JSON.stringify(parsedContext);
}

function addFilenameToSuites(report) {
  report.results.forEach((result) => {
    const { file, fullFile, suites } = result;

    suites.forEach((suite) => {
      suite.file = file;
      suite.fullFile = fullFile;
    });
  });
}

module.exports = {
  convertJsonScreenshotsToBase64,
  addFilenameToSuites,
};
