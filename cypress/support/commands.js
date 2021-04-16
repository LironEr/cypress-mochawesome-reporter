Cypress.Commands.add('validateTestHasScreenshot', (testTitle, numberOfScreenshots = 1) => {
  cy.get(`[title="${testTitle}"]`)
    .click()
    .parents('li[class*="test--component"]')
    .then(([$el]) => {
      cy.wrap($el)
        .find('img')
        .then(($imgs) => {
          cy.wrap($imgs)
            .should('have.length', numberOfScreenshots)
            .each(([$img]) => {
              cy.wrap($img)
                .should('be.visible')
                .and(($img) => {
                  // "naturalWidth" and "naturalHeight" are set when the image loads
                  expect($img.naturalWidth, 'image has natural width').to.be.greaterThan(0);
                });
            });
        });
    });
});
