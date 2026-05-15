const { defineConfig } = require("cypress");
const createBundler = require("@bahmutov/cypress-esbuild-preprocessor");
const {
  addCucumberPreprocessorPlugin,
} = require("@badeball/cypress-cucumber-preprocessor");
const {
  createEsbuildPlugin,
} = require("@badeball/cypress-cucumber-preprocessor/esbuild");
const allureWriter = require("@shelex/cypress-allure-plugin/writer");
const envManager = require("./config/env-manager");
const { CYPRESS_CONFIG, ALLURE_CONFIG } = require("./config/report-config");

const envConfig = envManager.load();

module.exports = defineConfig({
  e2e: {
    baseUrl: envConfig.baseUrl,
    specPattern: "**/*.feature",
    supportFile: "cypress/support/e2e.js",
    fixturesFolder: "cypress/fixtures",
    downloadsFolder: "cypress/downloads",
    screenshotsFolder: CYPRESS_CONFIG.screenshotsFolder,
    videosFolder: CYPRESS_CONFIG.videosFolder,
    video: CYPRESS_CONFIG.video,
    videoCompression: CYPRESS_CONFIG.videoCompression,
    screenshotOnRunFailure: CYPRESS_CONFIG.screenshotOnRunFailure,
    reporter: CYPRESS_CONFIG.reporter,
    reporterOptions: CYPRESS_CONFIG.reporterOptions,
    viewportWidth: 1280,
    viewportHeight: 720,
    defaultCommandTimeout: envConfig.timeouts.explicit,
    pageLoadTimeout: envConfig.timeouts.pageLoad,
    waitForAnimations: true,
    animationDistanceThreshold: 5,
    chromeWebSecurity: false,
    trashAssetsBeforeRuns: true,
    retries: {
      runMode: 1,
      openMode: 0,
    },
    env: {
      ...envManager.getCypressEnv(),
      ...ALLURE_CONFIG,
      TAGS: "not @ignore",
    },
    async setupNodeEvents(on, config) {
      await addCucumberPreprocessorPlugin(on, config);
      on(
        "file:preprocessor",
        createBundler({
          plugins: [createEsbuildPlugin(config)],
        })
      );
      allureWriter(on, config);
      return config;
    },
  },
});
