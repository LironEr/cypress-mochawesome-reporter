/// <reference types="cypress" />
const addContext = require('mochawesome/addContext');

const screenshotsFolder = Cypress.config('screenshotsFolder');

Cypress.Screenshot.defaults({
  onAfterScreenshot(_el, details) {
    saveScreenshotReference(details);
  },
});

Cypress.on('test:after:run', (test) => {
  if (!Cypress.Mochawesome) {
    return;
  }

  Cypress.Mochawesome.attempts.push(Cypress.Mochawesome.currentAttemptScreenshots);
  Cypress.Mochawesome.currentAttemptScreenshots = [];

  if (test.final) {
    addContext(
      { test },
      {
        title: 'cypress-mochawesome-reporter-screenshots',
        value: Cypress.Mochawesome.attempts,
      }
    );

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

  const title = normalizedScreenshotPath.includes('(failed)') ? 'Failed screenshot' : 'Screenshot';

  if (!Cypress.Mochawesome) {
    Cypress.Mochawesome = createMochawesomeObject();
  }

  Cypress.Mochawesome.currentAttemptScreenshots.push({ title, value: normalizedScreenshotPath });
}

function createMochawesomeObject() {
  return {
    currentAttemptScreenshots: [],
    attempts: [],
    context: [],
  };
}
