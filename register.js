/// <reference types="cypress" />
const addContext = require('mochawesome/addContext');

const screenshotsFolder = Cypress.config('screenshotsFolder');

// Determine reporter option addScreenshotToHTML (default: true)
function resolveAddScreenshotToHTML() {
  const reporterOptions = Cypress.config('reporterOptions') || {};
  const multi = reporterOptions.reporterEnabled && reporterOptions.cypressMochawesomeReporterReporterOptions;
  const opts = multi ? reporterOptions.cypressMochawesomeReporterReporterOptions : reporterOptions;
  const val = opts && Object.prototype.hasOwnProperty.call(opts, 'addScreenshotToHTML')
    ? opts.addScreenshotToHTML
    : undefined;
  return val === undefined ? true : Boolean(val);
}

const ADD_SCREENSHOT_TO_HTML = resolveAddScreenshotToHTML();
// Log the config so it is visible in the test runner console
// eslint-disable-next-line no-console
console.log('[cypress-mochawesome-reporter] addScreenshotToHTML:', ADD_SCREENSHOT_TO_HTML);

Cypress.Screenshot.defaults({
  onAfterScreenshot(_el, details) {
    if (ADD_SCREENSHOT_TO_HTML) {
      saveScreenshotReference(details);
    }
  },
});

Cypress.on('test:after:run', (test) => {
  if (Cypress.config('video')) {
    addContext(
      { test },
      {
        title: 'cypress-mochawesome-reporter-videos-' + test.state,
        value: Cypress.spec.relative,
      }
    );
  }

  if (!Cypress.Mochawesome) {
    return;
  }

  Cypress.Mochawesome.attempts.push(Cypress.Mochawesome.currentAttemptScreenshots);
  Cypress.Mochawesome.currentAttemptScreenshots = [];

  if (test.final) {
    if (ADD_SCREENSHOT_TO_HTML) {
      addContext(
        { test },
        {
          title: 'cypress-mochawesome-reporter-screenshots',
          value: Cypress.Mochawesome.attempts,
        }
      );
    }

    Cypress.Mochawesome.context.forEach((ctx) => {
      addContext({ test }, ctx);
    });

    Cypress.Mochawesome = undefined;
  }
});

Cypress.Commands.add('addTestContext', (context) => {
  if (!Cypress.Mochawesome) {
    Cypress.Mochawesome = createMochawesomeObject();
  }

  Cypress.Mochawesome.context.push(context);
});

function saveScreenshotReference(details) {
  const normalizedScreenshotPath = details.path.replace(screenshotsFolder, '');

  if (!Cypress.Mochawesome) {
    Cypress.Mochawesome = createMochawesomeObject();
  }

  Cypress.Mochawesome.currentAttemptScreenshots.push(normalizedScreenshotPath);
}

function createMochawesomeObject() {
  return {
    currentAttemptScreenshots: [],
    attempts: [],
    context: [],
  };
}
