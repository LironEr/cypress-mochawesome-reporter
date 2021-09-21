const path = require('path');
const fse = require('fs-extra');

function enhanceReport(report, mochawesomeOptions, screenshotsDir) {
  report.results.forEach((result) => {
    const { file, fullFile, suites } = result;

    // Add file name for all root suites
    suites.forEach((suite) => {
      suite.file = file;
      suite.fullFile = fullFile;
    });

    attachScreenshotsToSuiteTestsContext(result.suites, mochawesomeOptions, screenshotsDir);
  });
}

function attachScreenshotsToSuiteTestsContext(suites, mochawesomeOptions, screenshotsDir) {
  if (suites) {
    suites.forEach((suite) => {
      suite.tests.forEach((test) => {
        test.context = attachScreenshotsToTestContext(test.context, mochawesomeOptions, screenshotsDir);
      });

      attachScreenshotsToSuiteTestsContext(suite.suites, mochawesomeOptions, screenshotsDir);
    });
  }
}

function attachScreenshotsToTestContext(context, mochawesomeOptions, screenshotsDir) {
  if (!context) return null;

  let parsedContext = JSON.parse(context);

  if (!Array.isArray(parsedContext)) {
    parsedContext = [parsedContext];
  }

  const screenshotsContextIndex = parsedContext.findIndex(
    (c) => typeof c === 'object' && c.value && c.title === 'cypress-mochawesome-reporter-screenshots'
  );

  if (screenshotsContextIndex !== -1) {
    const screenshots = parsedContext[screenshotsContextIndex].value;
    parsedContext.splice(screenshotsContextIndex, 1);

    // saveAllAttempts is true by default
    if (mochawesomeOptions.saveAllAttempts === false || screenshots.length === 1) {
      // attach only screenshots from last attempt
      parsedContext = parsedContext.concat(
        createScreenshotsContextList(screenshots[screenshots.length - 1], '', mochawesomeOptions, screenshotsDir)
      );
    } else {
      screenshots.forEach((attemptScreenshots, index) => {
        parsedContext = parsedContext.concat(
          createScreenshotsContextList(
            attemptScreenshots,
            screenshots.length > 0 ? ` (Attempt ${index + 1})` : '',
            mochawesomeOptions,
            screenshotsDir
          )
        );
      });
    }
  }

  return JSON.stringify(parsedContext);
}

function createScreenshotsContextList(screenshots, titleSuffix, mochawesomeOptions, screenshotsDir) {
  return screenshots.map((screenshot) => ({
    title: screenshot.title.concat(titleSuffix),
    value:
      mochawesomeOptions.embeddedScreenshots === true
        ? convertImageToBase64(screenshotsDir, screenshot.value)
        : `screenshots${screenshot.value}`,
  }));
}

function convertImageToBase64(screenshotsDir, imagePath) {
  const imgPath = path.join(screenshotsDir, imagePath);
  const contents = 'data:image/png;base64, ' + fse.readFileSync(imgPath, { encoding: 'base64' });
  return contents;
}

module.exports = {
  enhanceReport,
};
