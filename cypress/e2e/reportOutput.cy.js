describe('Report output', () => {
  [
    'simple',
    'multiple-reporters',
    'multiple-reporters-config-file',
    'mochawesome-flags',
    'screenshots-folder',
    'simple-typescript',
    'cypress-parallel',
  ].forEach((folder) => {
    describe(`${folder} folder`, () => {
      beforeEach(() => {
        if (folder === 'mochawesome-flags') {
          cy.visit(`examples/${folder}/test-report/index.html`);
        } else {
          cy.visit(`examples/${folder}/cypress/reports/html/index.html`);
        }
      });

      it('Validate all tests exists', () => {
        cy.get('li[title="Suites"]').contains(4);
        cy.get('li[title="Tests"]').contains(9);
        cy.get('li[title="Passed"]').contains(2);
        cy.get('li[title="Failed"]').contains(4);
        cy.get('li[title="Skipped"]').contains(1);
        cy.get('li[title="Pending"]').contains(1);
      });

      describe('Validate image exists', () => {
        it('screenshot of passed test', () => {
          cy.validateTestHasScreenshot('default todos exists');
        });

        it('fail during test', () => {
          cy.validateTestHasScreenshot('fail test #tag1', folder === 'simple' ? 4 : 2);
          cy.validateTestHasScreenshot('fail test hierarchy #tag3', folder === 'simple' ? 4 : 2);
        });

        it('before hook', () => {
          cy.validateTestHasScreenshot('before hook fail', 1);
        });

        it('beforeEach', () => {
          cy.validateTestHasScreenshot('beforeEach hook fail 1', folder === 'simple' ? 2 : 1);
        });
      });

      it('extra context exist', () => {
        cy.get(`[title="add context to mochawesome report"]`)
          .click()
          .parents('li[class*="test--component"]')
          .then(([$el]) => {
            cy.wrap($el).contains('There were 4 items found in the todo-list');
          });
      });
    });
  });
});

describe('Video output', () => {
  ['simple', 'screenshots-folder', 'simple-typescript'].forEach((folder) => {
    describe(`Validate video exists in ${folder} folder`, () => {
      beforeEach(() => {
        cy.visit(`examples/${folder}/cypress/reports/html/index.html`);
      });
      
      it('before hook', () => {
        cy.validateTestHasVideo('before hook fail')
      })
      
      it('beforeEach', () => {
        cy.validateTestHasVideo('beforeEach hook fail 1')
      })

      it('fail during test', () => {
        cy.validateTestHasVideo('fail test #tag1')
        cy.validateTestHasVideo('fail test hierarchy #tag3')
      })
      if (folder !== 'screenshots-folder') {
        it('video on passed tests', () => {
          cy.validateTestHasVideo('default todos exists')
          cy.validateTestHasVideo('todo exists')
          cy.validateTestHasVideo('add context to mochawesome report')
        })
        it('video on skipped test', () => {
          cy.validateTestHasVideo('skipped test')
        })
      } else {
        it('no video on passed tests', () => {
          cy.validateTestHasNoVideo('default todos exists')
          cy.validateTestHasNoVideo('todo exists')
          cy.validateTestHasNoVideo('add context to mochawesome report')
        })
        it('no video on skipped tests', () => {
          cy.validateTestHasNoVideo('skipped test')
        })
      }
    })
  })
})
