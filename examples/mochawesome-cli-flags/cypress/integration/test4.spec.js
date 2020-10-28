describe('Test 4 - fail beforeEach hook', () => {
  beforeEach(() => {
    cy.visit('/');

    cy.get('#todo-list li').should('have.length', 10);
  });

  it('beforeEach hook fail 1', () => {
    cy.visit('/');
  });

  it('beforeEach hook fail 2', () => {
    cy.visit('/');
  });
});
