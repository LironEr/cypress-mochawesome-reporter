describe(`cucumber folder`, () => {
  beforeEach(() => {
    cy.visit(`examples/cucumber/cypress/reports/html/index.html`);
  });

  it('Validate all tests exists', () => {
    cy.get('li[title="Suites"]').contains(1);
    cy.get('li[title="Tests"]').contains(5);
    cy.get('li[title="Passed"]').contains(4);
    cy.get('li[title="Failed"]').contains(1);
  });

  it('screenshot exist for failed test', () => {
    // 2 retries
    cy.validateTestHasScreenshot('fail', 2);
  });

  it('video exist for tests', () => {
    cy.validateTestHasVideo('pass');
    cy.validateTestHasVideo('fail');
    cy.validateTestHasVideo('pass with examples (example #1)');
    cy.validateTestHasVideo('pass with examples (example #2)');
    cy.validateTestHasVideo('pass with examples (example #3)');
  });

  describe('Validate test code text', () => {
    it('pass', () => {
      cy.validateTestCode(
        'pass',
        `
Feature: Test 1

  Scenario: pass
    When I visit "site/index.html"
    Then The list has 4 items
`
      );
    });

    it('fail', () => {
      cy.validateTestCode(
        'fail',
        `
Feature: Test 1

  Scenario: fail
    When I visit "site/index.html"
    Then The list has 5 items
`
      );
    });

    it('pass with examples (example #1)', () => {
      cy.validateTestCode(
        'pass with examples (example #1)',
        `
Feature: Test 1

  Scenario Outline: pass with examples
    When I visit "site/index.html"
    Then The list has more than <num> items

    Examples: 
      | num |
      |   1 |
`
      );
    });

    it('pass with examples (example #2)', () => {
      cy.validateTestCode(
        'pass with examples (example #2)',
        `
Feature: Test 1

  Scenario Outline: pass with examples
    When I visit "site/index.html"
    Then The list has more than <num> items

    Examples: 
      | num |
      |   2 |
`
      );
    });

    it('pass with examples (example #3)', () => {
      cy.validateTestCode(
        'pass with examples (example #3)',
        `
Feature: Test 1

  Scenario Outline: pass with examples
    When I visit "site/index.html"
    Then The list has more than <num> items

    Examples: 
      | num |
      |   3 |
`
      );
    });
  });
});

// describe('Video output', () => {
//   ['simple', 'screenshots-folder', 'simple-typescript'].forEach((folder) => {
//     describe(`Validate video exists in ${folder} folder`, () => {
//       beforeEach(() => {
//         cy.visit(`examples/${folder}/cypress/reports/html/index.html`);
//       });

//       it('before hook', () => {
//         cy.validateTestHasVideo('before hook fail');
//       });

//       it('beforeEach', () => {
//         cy.validateTestHasVideo('beforeEach hook fail 1');
//       });

//       it('fail during test', () => {
//         cy.validateTestHasVideo('fail test #tag1');
//         cy.validateTestHasVideo('fail test hierarchy #tag3');
//       });
//       if (folder !== 'screenshots-folder') {
//         it('video on passed tests', () => {
//           cy.validateTestHasVideo('default todos exists');
//           cy.validateTestHasVideo('todo exists');
//           cy.validateTestHasVideo('add context to mochawesome report');
//         });
//         it('video on skipped test', () => {
//           cy.validateTestHasVideo('skipped test');
//         });
//       } else {
//         it('no video on passed tests', () => {
//           cy.validateTestHasNoVideo('default todos exists');
//           cy.validateTestHasNoVideo('todo exists');
//           cy.validateTestHasNoVideo('add context to mochawesome report');
//         });
//         it('no video on skipped tests', () => {
//           cy.validateTestHasNoVideo('skipped test');
//         });
//       }
//     });
//   });
// });
