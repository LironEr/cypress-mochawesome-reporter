const path = require('path');
const fse = require('fs-extra');
const { debugLog } = require('./logger');

function enhanceReport(report, mochawesomeOptions, screenshotsDir) {
  report.results.forEach((result) => {
    const { file, fullFile, suites, tests } = result;

    if (suites && suites.length > 0) {
      // Add file name for all root suites
      suites.forEach((suite) => {
        suite.file = file;
        suite.fullFile = fullFile;
      });

      attachScreenshotsToSuiteTestsContext(result.suites, mochawesomeOptions, screenshotsDir);
    }

    if (tests && tests.length > 0) {
      debugLog(`found ${tests.length} tests without suite`);
      tests.forEach((test) => {
        debugLog(`attach screenshots for test "${test.fullTitle}"`);
        test.context = attachScreenshotsToTestContext(test.context, mochawesomeOptions, screenshotsDir);
      });
    }
  });
}

function attachScreenshotsToSuiteTestsContext(suites, mochawesomeOptions, screenshotsDir) {
  if (suites) {
    suites.forEach((suite) => {
      suite.tests.forEach((test) => {
        debugLog(`attach screenshots for test "${test.fullTitle}"`);
        test.context = attachScreenshotsToTestContext(test.context, mochawesomeOptions, screenshotsDir);
      });

      attachScreenshotsToSuiteTestsContext(suite.suites, mochawesomeOptions, screenshotsDir);
    });
  }
}

function attachScreenshotsToTestContext(context, mochawesomeOptions, screenshotsDir) {
  if (!context) {
    debugLog('no context');
    return null;
  }

  debugLog(`found context. type: ${typeof context}. value: ${context}`);

  let parsedContext = JSON.parse(context);

  debugLog(`parsed context type: ${typeof parsedContext}. value: ${JSON.stringify(parsedContext)}`);

  if (!Array.isArray(parsedContext)) {
    debugLog(`parsed context is not an array, transform`);
    parsedContext = [parsedContext];
    debugLog(`transformed parsed context type: ${typeof parsedContext}. value: ${JSON.stringify(parsedContext)}`);
  }

  const screenshotsContextIndex = parsedContext.findIndex(
    (c) => typeof c === 'object' && c.value && c.title === 'cypress-mochawesome-reporter-screenshots'
  );

  debugLog(`screenshots index: ${screenshotsContextIndex}`);

  if (screenshotsContextIndex !== -1) {
    const screenshots = parsedContext[screenshotsContextIndex].value;
    parsedContext.splice(screenshotsContextIndex, 1);

    debugLog(`screenshots type: ${typeof screenshots}. value: ${JSON.stringify(screenshots)}`);

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

  const result = JSON.stringify(parsedContext);

  debugLog(`final context: ${result}`);

  return result;
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
