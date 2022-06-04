describe('Test 4 - fail beforeEach hook', () => {
  beforeEach(() => {
    cy.visit('site/index.html');

    cy.get('#todo-list li').should('have.length', 10);
  });

  it('beforeEach hook fail 1', () => {
    cy.visit('site/index.html');
  });

  it('beforeEach hook fail 2', () => {
    cy.visit('site/index.html');
  });
});
