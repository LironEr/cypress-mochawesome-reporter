const mochawesome = require('mochawesome');

const defaultReporterOptions = {
  reportDir: 'cypress/results/json',
  overwrite: false,
  html: false,
  json: true,
};

function reporter(runner, options) {
  const opts = {
    ...options,
    reporterOptions: {
      ...defaultReporterOptions,
      ...(options || {}).reporterOptions,
    },
  };

  mochawesome.call(this, runner, opts);
}

module.exports = reporter;
