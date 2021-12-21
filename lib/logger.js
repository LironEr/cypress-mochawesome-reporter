const fs = require('fs');
const pkg = require('../package.json');

let _quiet = false;

function setLoggerQuietMode(quiet) {
  _quiet = quiet;
}

function log(message) {
  if (!_quiet) {
    console.log(message);
    debugLog(message);
  }
}

let _isDebug = false;

function initDebugLog(isDebug) {
  _isDebug = isDebug;

  if (_isDebug) {
    fs.writeFileSync('cypress-mochawesome-reporter.log', `start ${pkg.name} ${pkg.version}\n`);
  }
}

function debugLog(message) {
  if (_isDebug) {
    fs.appendFileSync('cypress-mochawesome-reporter.log', `${message}\n`);
  }
}

module.exports = { setLoggerQuietMode, log, initDebugLog, debugLog };
