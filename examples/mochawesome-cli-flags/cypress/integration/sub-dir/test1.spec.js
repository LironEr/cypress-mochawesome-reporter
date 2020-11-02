describe('Test 1', () => {
  it('default todos exists', () => {
    cy.visit('/');

    cy.get('#todo-list li').should('have.length', 4);

    cy.screenshot();
  });

  it('fail test', () => {
    cy.visit('/');

    cy.screenshot('custom-name');

    cy.get('#todo-list li').should('have.length', 10);
  });
});
