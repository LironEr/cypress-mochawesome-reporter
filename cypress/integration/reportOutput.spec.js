describe('Report output', () => {
  ['simple', 'multiple-reporters', 'mochawesome-cli-flags'].forEach((folder) => {
    describe(`${folder} folder`, () => {
      beforeEach(() => {
        cy.visit(`examples/${folder}/cypress/reports/html/mochawesome.html`);
      });

      it('Validate all tests exists', () => {
        cy.get('li[title="Suites"]').contains(4);
        cy.get('li[title="Tests"]').contains(6);
        cy.get('li[title="Passed"]').contains(2);
        cy.get('li[title="Failed"]').contains(3);
        cy.get('li[title="Skipped"]').contains(1);
      });

      describe('Validate image exists', () => {
        it('screenshot of passed test', () => {
          cy.validateTestHasScreenshot('default todos exists');
        });

        it('fail during test', () => {
          cy.validateTestHasScreenshot('fail test', 2);
        });

        it('before hook', () => {
          cy.validateTestHasScreenshot('before hook fail');
        });

        it('beforeEach', () => {
          cy.validateTestHasScreenshot('beforeEach hook fail 1');
        });
      });
    });
  });
});
