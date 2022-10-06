it('fail test #tag1', () => {
  cy.visit('site/index.html');

  cy.screenshot('custom-name');

  cy.get('#todo-list li').should('have.length', 10);
});

describe('Test 1 #tag2', () => {
  it('default todos exists', () => {
    cy.visit('site/index.html');

    cy.get('#todo-list li').should('have.length', 4);

    cy.screenshot();
  });

  describe('hierarchy', () => {
    it('fail test hierarchy #tag3', () => {
      cy.visit('site/index.html');

      cy.screenshot('custom-name2');

      cy.get('#todo-list li').should('have.length', 10);
    });
  });
});
