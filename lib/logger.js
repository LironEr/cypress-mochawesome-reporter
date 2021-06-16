let _quiet = false;

function setLoggerQuietMode(quiet) {
  _quiet = quiet;
}

function log(...args) {
  if (!_quiet) {
    console.log(...args);
  }
}

module.exports = { setLoggerQuietMode, log };
