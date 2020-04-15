describe("Test 2", () => {
  it("todo exists", () => {
    cy.visit("/");

    cy.get("#todo-list").should('be.visible');
  });
});
