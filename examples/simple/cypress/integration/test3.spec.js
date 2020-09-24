describe('Test 3 - fail hook', () => {
  before(() => {
    cy.visit('/');

    cy.get('#todo-list li').should('have.length', 10);
  });

  it('test', () => {
    cy.visit('/');
  });
});
