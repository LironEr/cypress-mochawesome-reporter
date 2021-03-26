/// <reference types="cypress" />
const addContext = require('mochawesome/addContext');

const screenshotsFolder = Cypress.config('screenshotsFolder');

Cypress.Screenshot.defaults({
  onAfterScreenshot(_el, details) {
    if (!details.path) {
      return;
    }

    cy.once('test:after:run', (test) => {
      const normalizedScreenshotPath = 'screenshots' + details.path.replace(screenshotsFolder, '');

      addContext(
        { test },
        {
          title: normalizedScreenshotPath.includes('(failed)') ? 'Failed screenshot' : 'Screenshot',
          value: normalizedScreenshotPath,
        }
      );
    });
  },
});
