Cypress.Commands.add('validateTestHasScreenshot', (testTitle) => {
  cy.get(`[title="${testTitle}"]`)
    .click()
    .parents('li[class*="test--component"]')
    .then(([$el]) => {
      cy.wrap($el)
        .find('img')
        .should('be.visible')
        .and(($img) => {
          // "naturalWidth" and "naturalHeight" are set when the image loads
          expect($img[0].naturalWidth, 'image has natural width').to.be.greaterThan(0);
        });
    });
});
