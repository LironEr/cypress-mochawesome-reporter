describe('Test 1', () => {
  it('default todos exists', () => {
    cy.visit('site/index.html');

    cy.get('#todo-list li').should('have.length', 4);

    cy.screenshot();
  });

  it('fail test', () => {
    cy.visit('site/index.html');

    cy.screenshot('custom-name');

    cy.get('#todo-list li').should('have.length', 10);
  });
});
