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

async function convertJsonScreenShotsToBase64(jsonsPath) {
  const dirResult = await fs.readdirSync(jsonsPath);
  const jsonParsed = [];

  for (let i = 0; i < dirResult.length; i++) {
    const element = dirResult[i];
    const filePath = path.resolve(jsonsPath,element);
    console.log("reading file", filePath);
    jsonParsed.push({
      file: filePath, data: await fse.readJson(filePath)
    });
    console.log(`reading file successfully`);
  }

  function genereatebase64ContextObj(contextObj) {

    if (contextObj.value) {
      const imgPath = path.resolve("./cypress/",contextObj.value);
      console.log("converting img", imgPath);
      const contents = "data:image/png;base64, " +  fs.readFileSync(imgPath, { encoding: 'base64' });
      contextObj.value = contents;
      console.log("converting img successfully");
    }
    return contextObj;
  }

  for (let w = 0; w < jsonParsed.length; w++) {
    const json = jsonParsed[w].data;
    for (let i = 0; i < json.results.length; i++) {
      const result = json.results[i];
      for (let z = 0; z < result.suites.length; z++) {
        const suite = result.suites[z];
        for (let y = 0; y < suite.tests.length; y++) {
          const test = suite.tests[y];
          test.context = JSON.stringify(genereatebase64ContextObj(JSON.parse(test.context)));
        }
      }
    }
    await fs.writeFile(jsonParsed[w].file, JSON.stringify(json));
  }
}

module.exports = {
  getSimpleCypressConfig,
  convertJsonScreenShotsToBase64
}
