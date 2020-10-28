describe('Report output with mochawesome CLI flags', () => {
  beforeEach(() => {
    cy.visit(`examples/mochawesome-cli-flags/cypress/reports/html/mochawesome.html`);
  });

  it('With charts', () => {
    cy.get('.ct-chart').should('have.length', 4);
  });
});
