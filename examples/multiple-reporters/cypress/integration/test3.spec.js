describe('Test 3 - fail before hook', () => {
  before(() => {
    cy.visit('/');

    cy.get('#todo-list li').should('have.length', 10);
  });

  it('before hook fail', () => {
    cy.visit('/');
  });
});
