const path = require('path');
const fse = require('fs-extra');
const { debugLog } = require('./logger');
const consts = require('./consts');

let gherkin;
try {
  gherkin = require('@cucumber/gherkin-utils');
} catch {}

function enhanceReport(report, mochawesomeOptions, screenshotsDir) {
  const baseFolder = extrapolateBaseFolder(report.results);

  report.results.forEach((result) => {
    const { file, fullFile, suites, tests } = result;

    if (suites && suites.length > 0) {
      // Add file name for all root suites
      suites.forEach((suite) => {
        suite.file = file;
        suite.fullFile = fullFile;
        suite.tests.forEach((test) => {
          setCucumberCode(test);
        });
      });
      attachMediaToSuiteTestsContext(result.suites, mochawesomeOptions, screenshotsDir, baseFolder);
    }

    if (tests && tests.length > 0) {
      debugLog(`found ${tests.length} tests without suite`);
      tests.forEach((test) => {
        debugLog(`attach screenshots for test "${test.fullTitle}"`);
        test.context = attachMediaToTestContext(test.context, mochawesomeOptions, screenshotsDir, baseFolder);
        setCucumberCode(test);
      });
    }
  });
}

function attachMediaToSuiteTestsContext(suites, mochawesomeOptions, screenshotsDir, baseFolder) {
  if (suites) {
    suites.forEach((suite) => {
      suite.tests.forEach((test) => {
        debugLog(`attach media for test "${test.fullTitle}"`);
        test.context = attachMediaToTestContext(test.context, mochawesomeOptions, screenshotsDir, baseFolder);
      });

      attachMediaToSuiteTestsContext(suite.suites, mochawesomeOptions, screenshotsDir, baseFolder);
    });
  }
}

function attachMediaToTestContext(context, mochawesomeOptions, screenshotsDir, baseFolder) {
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

  const videoContextIndex = parsedContext.findIndex(
    (c) => typeof c === 'object' && c.value && c.title.startsWith('cypress-mochawesome-reporter-videos-')
  );

  debugLog(`video index: ${videoContextIndex}`);

  if (videoContextIndex !== -1) {
    const video = parsedContext[videoContextIndex].value;
    const title = parsedContext[videoContextIndex].title;
    parsedContext.splice(videoContextIndex, 1);

    debugLog(`videos type: ${typeof video}. value: ${JSON.stringify(video)}`);
    if (
      !mochawesomeOptions.ignoreVideos &&
      (title === 'cypress-mochawesome-reporter-videos-failed' || !mochawesomeOptions.videoOnFailOnly)
    ) {
      parsedContext = parsedContext.concat(createVideoContext(video, baseFolder));
    }
  }
  if (parsedContext.length === 0) {
    debugLog('No result');
    return null;
  }
  const result = JSON.stringify(parsedContext, null, 4);

  debugLog(`final context: ${result}`);

  return result;
}

function createScreenshotsContextList(screenshots, titleSuffix, mochawesomeOptions, screenshotsDir) {
  return screenshots.map((screenshotPath) => {
    const screenshotTitle = screenshotPath.includes('(failed)')
      ? 'Failed screenshot'.concat(titleSuffix)
      : `Screenshot (${path.parse(screenshotPath).name})`;

    return {
      title: screenshotTitle,
      value:
        mochawesomeOptions.embeddedScreenshots === true
          ? convertImageToBase64(screenshotsDir, screenshotPath)
          : encodeMediaPath(`screenshots${screenshotPath}`),
    };
  });
}

function createVideoContext(video, baseFolder) {
  video = video.replace(baseFolder, '').concat('.mp4');
  const videoPath = path.normalize(`videos/${video}`);
  return {
    title: 'Spec video recording',
    value: encodeMediaPath(videoPath),
  };
}

function convertImageToBase64(screenshotsDir, imagePath) {
  if (fse.pathExistsSync(imagePath)) {
    return convertImg(imagePath);
  } else {
    const imgPath = path.join(screenshotsDir, imagePath);
    return convertImg(imgPath);
  }

  function convertImg(pathToFile) {
    return 'data:image/png;base64, ' + fse.readFileSync(pathToFile, { encoding: 'base64' });
  }
}

function encodeMediaPath(p) {
  const { dir, name, ext } = path.parse(p);

  return `${dir}/${encodeURIComponent(name)}${ext}`;
}

function extrapolateBaseFolder(results) {
  const allElementsEqual = (arr) => arr.every((e) => e === arr[0]);
  const directoryArrays = results.map((result) =>
      path.dirname(result.fullFile).split(path.sep)
  );
  const minLength = Math.min(...directoryArrays.map((arr) => arr.length));
  let commonPathArray = [];

  for (let i = 0; i < minLength; i++) {
    const elementsAtCurrentIndex = directoryArrays.map((arr) => arr[i]);

    if (allElementsEqual(elementsAtCurrentIndex)) {
      commonPathArray.push(elementsAtCurrentIndex[0]);
    } else {
      break;
    }
  }

  const baseFolder = commonPathArray.join(path.sep);
  debugLog(`baseFolder: ${baseFolder}`);
  return baseFolder;
}

/**
 * if '__cucumber_source__' is found in the context, beautify it an replace the code block
 */
function setCucumberCode(test) {
  if (test.context) {
    let context = JSON.parse(test.context);
    if (!Array.isArray(context)) {
      context = [context];
    }
    // the context can be encountered multiple times if the test is retried
    // only use the first occurence but remove of all them from the context
    const cucumberFound = context.some(({ title, value }) => {
      if (title === consts.cucumberStepsContextKey) {
        test.code = beautifyCucumber(value);
        return true;
      }
    });
    if (cucumberFound) {
      test.context = JSON.stringify(context.filter(({ title }) => title !== consts.cucumberStepsContextKey));
    }
  }
}

function beautifyCucumber(gherkinDocument) {
  if (!gherkin) {
    console.error('@cucumber/gherkin-utils is not available');
    return 'ERROR: @cucumber/gherkin-utils is not available';
  }

  return gherkin.pretty(gherkinDocument, 'gherkin');
}

module.exports = {
  enhanceReport,
};
