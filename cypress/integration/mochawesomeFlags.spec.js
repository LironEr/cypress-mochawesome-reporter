describe('Report output with mochawesome flags', () => {
  ['multiple-reporters', 'mochawesome-cli-flags'].forEach((folder) => {
    describe(`${folder} folder`, () => {
      beforeEach(() => {
        cy.visit(`examples/${folder}/cypress/reports/html/index.html`);
      });

      it('With charts', () => {
        cy.get('.ct-chart').should('have.length', 4);
      });
    });
  });
});
