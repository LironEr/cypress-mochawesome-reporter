/// <reference types="cypress" />

const screenshotsFolder = Cypress.config('screenshotsFolder');

Cypress.Screenshot.defaults({
  onAfterScreenshot(_el, details) {
    saveScreenshotReference(details);
  },
});

Cypress.on('test:after:run', (test) => {
  if (Cypress.config('video')) {
    _addContext(test, {
      title: `cypress-mochawesome-reporter-videos-${test.state}`,
      value: Cypress.spec.relative,
    });
  }

  if (!Cypress.Mochawesome) {
    return;
  }

  Cypress.Mochawesome.attempts.push(Cypress.Mochawesome.currentAttemptScreenshots);
  Cypress.Mochawesome.currentAttemptScreenshots = [];

  if (test.final) {
    _addContext(test, {
      title: 'cypress-mochawesome-reporter-screenshots',
      value: Cypress.Mochawesome.attempts,
    });

    Cypress.Mochawesome.context.forEach((ctx) => {
      _addContext(test, ctx);
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

// `mochawesome/addContext` cannot be imported in the Cypress browser support file
// because mochawesome >= 8 uses `require('node:util')`, which Cypress 15 / webpack 5
// does not bundle for the browser. Inline the minimal logic instead.
// Copied from https://github.com/adamgruber/mochawesome/blob/1efe88d5fdf60fdba26859ba1aa39f80b75427f4/src/addContext.js
function _isValidContext(ctx) {
  /*
   * Context is valid if any of the following are true:
   * 1. Type is string and it is not empty
   * 2. Type is object and it has properties `title` and `value` and `title` is not empty
   */
  if (!ctx) return false;

  return (
    typeof ctx === 'string' ||
    (Object.hasOwn(ctx, 'title') &&
      typeof ctx.title === 'string' &&
      ctx.title.length > 0 &&
      Object.hasOwn(ctx, 'value'))
  );
}

// Copied from https://github.com/adamgruber/mochawesome/blob/1efe88d5fdf60fdba26859ba1aa39f80b75427f4/src/addContext.js#L79
function _addContext(test, context) {
  try {
    if (!test) {
      console.error('[cypress-mochawesome-reporter] addContext: test is undefined');
      return;
    }

    if (!_isValidContext(context)) {
      console.error('[cypress-mochawesome-reporter] addContext: Invalid context:', context);
      return;
    }

    // Test doesn't already have context -> set it
    if (!test.context) {
      test.context = context;
    } else if (Array.isArray(test.context)) {
      // Test has context and context is an array -> push new context
      test.context.push(context);
    } else {
      // Test has context and it is not an array -> make it an array, then push new context
      test.context = [test.context];
      test.context.push(context);
    }
  } catch (error) {
    console.error('[cypress-mochawesome-reporter] addContext: Error adding context:', error, { test, context });
  }
}
