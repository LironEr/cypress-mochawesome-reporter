const { Before } = require('@badeball/cypress-cucumber-preprocessor');
const consts = require('./lib/consts');

/**
 * Store the Cucumber source in the context for later usage
 */
Before(({ pickle, gherkinDocument }) => {
  // (poor-man deep copy)
  const gherkinDocumentWithSingleScenario = JSON.parse(
    JSON.stringify({
      ...gherkinDocument,
      feature: {
        ...gherkinDocument.feature,
        // keep only the scenario corresponding to the current pickle
        children: gherkinDocument.feature.children.filter((f) => !f.scenario || f.scenario.id === pickle.astNodeIds[0]),
      },
    })
  );

  // for scenario outlines, only keep the corresponding example
  const scenario = gherkinDocumentWithSingleScenario.feature.children.filter((f) => f.scenario)[0]?.scenario;

  if (scenario?.examples?.length) {
    const example = scenario.examples[0];
    example.tableBody = example.tableBody.filter((row) => row.id === pickle.astNodeIds[1]);
  }

  cy.addTestContext({
    title: consts.cucumberStepsContextKey,
    value: gherkinDocumentWithSingleScenario,
  });
});
