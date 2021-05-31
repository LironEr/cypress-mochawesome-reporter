const path = require('path');
const fse = require('fs-extra');
const consts = require('./consts');
const fs = require('fs');

async function extractReporterOptions(options) {
  if (!options) {
    return undefined;
  }

  // If configFile property exist, read options from config file
  const opts = options.configFile ? await fse.readJson(path.resolve(options.configFile)) : options;

  // Only this reporter enabled
  if (!opts.reporterEnabled) {
    return opts;
  }

  // Multi reporters enabled
  return opts.cypressMochawesomeReporterReporterOptions;
}

async function getSimpleCypressConfig(config) {
  const baseDir = config.projectRoot;

  const reporterOptions = await extractReporterOptions(config.reporterOptions) || {};

  reporterOptions['reportDir'] = reporterOptions['reportDir'] || path.join(baseDir, consts.defaultHtmlOutputFolder);
  const jsonDir = path.join(reporterOptions.reportDir, '/.jsons');

  return {
    jsonDir,
    reporterOptions,
    screenshotsDir: config.screenshotsFolder,
    outputDir: reporterOptions['reportDir'],
  };
}

async function convertJsonScreenShotsToBase64(jsonsDir,screenshotsDir) {
  const dirResult = await fs.readdirSync(jsonsDir);
  const jsonParsed = [];

  console.log(`reading files`);
  for (let i = 0; i < dirResult.length; i++) {
    const element = dirResult[i];
    const filePath = path.resolve(jsonsDir,element);
    jsonParsed.push({
      file: filePath, data: await fse.readJson(filePath)
    });
  }
  console.log(`reading files successfully`);

  function genereatebase64ContextObj(contextObj,screenshotsDir) {

    if (contextObj.value) {
      const imgPath = path.resolve(screenshotsDir,contextObj.value.substr("screenshots\\".length));
      const contents = "data:image/png;base64, " +  fs.readFileSync(imgPath, { encoding: 'base64' });
      contextObj.value = contents;
    }
    return contextObj;
  }

  console.log(`converting imgs`);
  for (let w = 0; w < jsonParsed.length; w++) {
    const json = jsonParsed[w].data;
    if(json.results && json.results.length)
    for (let i = 0; i < json.results.length; i++) {
      const result = json.results[i];
      if(result.suites && result.suites.length)
      for (let z = 0; z < result.suites.length; z++) {
        const suite = result.suites[z];
        if(suite.tests && suite.tests.length)
        for (let y = 0; y < suite.tests.length; y++) {
          const test = suite.tests[y];
          test.context = JSON.stringify(genereatebase64ContextObj(JSON.parse(test.context),screenshotsDir));
        }
      }
    }
    await fs.writeFile(jsonParsed[w].file, JSON.stringify(json));
  }
  console.log(`converting imgs successfully`);
}

module.exports = {
  getSimpleCypressConfig,
  convertJsonScreenShotsToBase64
}
