const { defineConfig } = require("cypress");
const createBundler = require("@bahmutov/cypress-esbuild-preprocessor");
const {
  addCucumberPreprocessorPlugin,
} = require("@badeball/cypress-cucumber-preprocessor");
const {
  createEsbuildPlugin,
} = require("@badeball/cypress-cucumber-preprocessor/esbuild");
const envManager = require("./config/env-manager");

const envConfig = envManager.load();

module.exports = defineConfig({
  e2e: {
    baseUrl: envConfig.baseUrl,
    specPattern: "**/*.feature",
    supportFile: "cypress/support/e2e.js",
    fixturesFolder: "cypress/fixtures",
    screenshotsFolder: "reports/screenshots",
    videosFolder: "reports/videos",
    downloadsFolder: "cypress/downloads",
    viewportWidth: 1280,
    viewportHeight: 720,
    defaultCommandTimeout: envConfig.timeouts.explicit,
    pageLoadTimeout: envConfig.timeouts.pageLoad,
    waitForAnimations: true,
    animationDistanceThreshold: 5,
    chromeWebSecurity: false,
    video: true,
    videoCompression: 32,
    screenshotOnRunFailure: true,
    trashAssetsBeforeRuns: true,
    retries: {
      runMode: 1,
      openMode: 0,
    },
    env: {
      ...envManager.getCypressEnv(),
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
      return config;
    },
  },
});
