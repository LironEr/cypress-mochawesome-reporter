import { Given } from '@badeball/cypress-cucumber-preprocessor';

Given('I click on something to fail', () => {
  cy.visit('site/index.html');
  cy.get('#test').click();
});
