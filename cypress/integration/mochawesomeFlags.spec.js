describe('Report output with mochawesome flags', () => {
  ['multiple-reporters', 'mochawesome-flags'].forEach((folder) => {
    describe(`${folder} folder`, () => {
      beforeEach(() => {
        if (folder === 'mochawesome-flags') {
          cy.visit(`examples/${folder}/test-report/index.html`);
        } else {
          cy.visit(`examples/${folder}/cypress/reports/html/index.html`);
        }
      });

      it('With charts', () => {
        cy.get('.ct-chart').should('have.length', 4);
      });

      it('Custom page title', () => {
        cy.title().should('eq', 'custom-title')
      });
    });
  });  
});
