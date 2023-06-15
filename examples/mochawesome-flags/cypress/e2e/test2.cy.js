describe('Test 2', () => {
  it('todo exists', () => {
    cy.visit('site/index.html');

    cy.get('#todo-list').should('be.visible');
  });

  it('add context to mochawesome report', () => {
    cy.visit('site/index.html');

    cy.get('#todo-list > li').then(($liElements) => {
      cy.addTestContext(`There were ${$liElements.length.toString()} items found in the todo-list`);
    });
  });
  
  it.skip('skipped test', () => {
    cy.visit('site/index.html');
  });
});
