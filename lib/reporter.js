const path = require('path');
const mochawesome = require('mochawesome');
const consts = require('./consts');

const defaultReporterOptions = {
  overwrite: false,
  html: false,
  json: true,
};

function reporter(runner, options) {
  const reporterOptions = {
    ...(options || {}).reporterOptions,
    ...defaultReporterOptions,
  };

  reporterOptions['reportDir'] = path.join(reporterOptions['reportDir'] || consts.defaultHtmlOutputFolder, '/.jsons');

  const opts = {
    ...options,
    reporterOptions,
  };

  mochawesome.call(this, runner, opts);
}

module.exports = reporter;
