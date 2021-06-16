const { beforeRunHook, afterRunHook } = require('./lib');

module.exports = function (on) {
  on('before:run', async (details) => {
    await beforeRunHook(details);
  });

  on('after:run', async (results) => {
    await afterRunHook(results);
  });
};
