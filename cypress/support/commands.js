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

Cypress.Commands.add('validateTestHasVideo', (testTitle) => {
  cy.get(`[title="${testTitle}"]`)
    .click()
    .parents('li[class*="test--component"]')
    .then(([$el]) => {
      cy.wrap($el)
        .find('video')
        .then(($vids) => {
          cy.wrap($vids)
            .should('have.length', 1)
            .each(([$vid]) => {
              cy.wrap($vid).should('be.visible').find('source').should('have.attr', 'type', 'video/mp4');
            });
        });
    });
});

Cypress.Commands.add('validateTestHasNoVideo', (testTitle) => {
  cy.get(`[title="${testTitle}"]`)
    .click()
    .parents('li[class*="test--component"]')
    .then(([$el]) => {
      cy.wrap($el).find('video').should('not.exist');
    });
});

Cypress.Commands.add('validateTestCode', (testTitle, content) => {
  // cy.get('code').debug();
  cy.get(`[title="${testTitle}"]`)
    .click()
    .parents('li[class*="test--component"]')
    .then(([$el]) => {
      cy.wrap($el)
        .find('code')
        .then(($codes) => {
          cy.wrap($codes)
            .last()
            .wrap(($code) => {
              cy.wrap($code)
                .should('be.visible')
                .wrap(($c) => {
                  expect($c.text().trim(), 'match content').to.be.equal(content.trim());
                });
            });
        });
    });
});
