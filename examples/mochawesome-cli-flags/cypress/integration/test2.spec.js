describe('Test 2', () => {
  it('todo exists', () => {
    cy.visit('site/index.html');

    cy.get('#todo-list').should('be.visible');
  });
});
