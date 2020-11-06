describe('Test 3 - fail before hook', () => {
  before(() => {
    cy.visit('site/index.html');

    cy.get('#todo-list li').should('have.length', 10);
  });

  it('before hook fail', () => {
    cy.visit('site/index.html');
  });
});
