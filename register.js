const addContext = require('mochawesome/addContext');

// https://github.com/cypress-io/cypress/blob/master/packages/server/lib/screenshots.coffee#L285
const MAX_TEST_NAME_LENGTH = 220;

Cypress.on('test:after:run', (test, runnable) => {
  if (test.state === 'failed') {
    const fullTestName = getFullTestName(runnable);

    const imagePath = `screenshots/${Cypress.spec.name}/${fullTestName} (failed).png`;

    addContext({ test }, imagePath);
  }
});

function getFullTestName(runnable) {
  let item = runnable;
  const name = [runnable.title];

  while (item.parent) {
    name.unshift(item.parent.title);
    item = item.parent;
  }

  return name
    .filter(Boolean)
    .map((n) => n.trim())
    .join(' -- ')
    .substring(0, MAX_TEST_NAME_LENGTH);
}
