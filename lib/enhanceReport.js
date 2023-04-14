const path = require('path');
const fse = require('fs-extra');
const { debugLog, log} = require('./logger');

function enhanceReport(report, mochawesomeOptions, screenshotsDir) {
  const baseFolder = extrapolateBaseFolder(report.results)
  
  report.results.forEach((result) => {
    const { file, fullFile, suites, tests } = result;

    if (suites && suites.length > 0) {
      // Add file name for all root suites
      suites.forEach((suite) => {
        suite.file = file;
        suite.fullFile = fullFile;
      });
      attachMediaToSuiteTestsContext(result.suites, mochawesomeOptions, screenshotsDir, baseFolder);
    }

    if (tests && tests.length > 0) {
      debugLog(`found ${tests.length} tests without suite`);
      tests.forEach((test) => {
        debugLog(`attach screenshots for test "${test.fullTitle}"`);
        test.context = attachMediaToTestContext(test.context, mochawesomeOptions, screenshotsDir, baseFolder);
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
      (c) => typeof c === 'object' && c.value && c.title === 'cypress-mochawesome-reporter-videos'
  );

  debugLog(`video index: ${videoContextIndex}`);
  
  if (videoContextIndex !== -1) {
    const video = parsedContext[videoContextIndex].value;
    parsedContext.splice(videoContextIndex, 1);
    
    debugLog(`videos type: ${typeof video}. value: ${JSON.stringify(video)}`)
    if (!mochawesomeOptions.ignoreVideos) {
      parsedContext = parsedContext.concat(
        createVideoContext(
            video,
            mochawesomeOptions,
            baseFolder
        )
      )
    }
  }

  const result = JSON.stringify(parsedContext, null, 4);

  debugLog(`final context: ${result}`);

  return result;
}

function createScreenshotsContextList(screenshots, titleSuffix, mochawesomeOptions, screenshotsDir) {
  return screenshots.map((screenshot) => ({
    title: screenshot.title.concat(titleSuffix),
    value:
      mochawesomeOptions.embeddedScreenshots === true
        ? convertImageToBase64(screenshotsDir, screenshot.value)
        : encodeMediaPath(`screenshots${screenshot.value}`),
  }));
}

function createVideoContext(video, mochawesomeOptions, baseFolder) {
  video = video.replace(baseFolder, '').concat('.mp4')
  return {
    title: 'Spec video recording',
    value: encodeMediaPath(`videos/${video}`)
  };
}

function convertImageToBase64(screenshotsDir, imagePath) {
  const imgPath = path.join(screenshotsDir, imagePath);
  const contents = 'data:image/png;base64, ' + fse.readFileSync(imgPath, { encoding: 'base64' });
  return contents;
}

function encodeMediaPath(p) {
  const { dir, name, ext } = path.parse(p);

  return `${dir}/${encodeURIComponent(name)}${ext}`;
}

function extrapolateBaseFolder(results) {
  //Snatched from https://rosettacode.org/wiki/Find_common_directory_path#JavaScript
  const splitStrings = (a, sep = path.sep) => a.map(i => i.split(sep));
  const elAt = i => a => a[i];
  const rotate = a => a[0].map((e, i) => a.map(elAt(i)));
  const allElementsEqual = arr => arr.every(e => e === arr[0]);
  const commonPath = (input, sep = path.sep) => rotate(splitStrings(input, sep))
      .filter(allElementsEqual).map(elAt(0)).join(sep);
  
  let directoryArray = [];
  results.forEach((result) => {
    directoryArray = directoryArray.concat(path.dirname(result.fullFile))
  })
  const baseFolder = commonPath(directoryArray)
  debugLog(`baseFolder: ${baseFolder}`)
  return baseFolder
}

module.exports = {
  enhanceReport,
};
