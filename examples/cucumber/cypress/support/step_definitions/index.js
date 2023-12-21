import 'cypress-mochawesome-reporter/cucumberSupport';
import { When, Then } from '@badeball/cypress-cucumber-preprocessor';

When(`I visit {string}`, (url) => {
    cy.visit(url);
});

Then(`The list has {int} items`, (nb) => {
    cy.get('#todo-list li').should('have.length', nb);
});

Then(`The list has more than {int} items`, (nb) => {
    cy.get('#todo-list li').should('have.length.greaterThan', nb);
});
