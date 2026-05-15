const path = require("path");

const ROOT = path.resolve(__dirname, "..");

const REPORT_DIRS = Object.freeze({
  ROOT: path.join(ROOT, "reports"),
  SCREENSHOTS: path.join(ROOT, "reports", "screenshots"),
  VIDEOS: path.join(ROOT, "reports", "videos"),
  ALLURE_RESULTS: path.join(ROOT, "reports", "allure-results"),
  ALLURE_REPORT: path.join(ROOT, "reports", "allure-report"),
  MOCHAWESOME: path.join(ROOT, "reports", "mochawesome"),
  MOCHAWESOME_REPORT: path.join(ROOT, "reports", "mochawesome-report"),
  CUCUMBER_REPORT: path.join(ROOT, "reports", "cucumber-report"),
  LOGS: path.join(ROOT, "reports", "logs"),
});

const REPORTER_OPTIONS = Object.freeze({
  mochawesome: {
    reportDir: REPORT_DIRS.MOCHAWESOME,
    overwrite: false,
    html: false,
    json: true,
    timestamp: "yyyy-mm-dd_HHMMss",
    charts: true,
    reportPageTitle: "Cypress BDD Test Report",
    embeddedScreenshots: true,
    inlineAssets: true,
    saveAllAttempts: false,
    code: true,
    autoOpen: false,
  },
});

const ALLURE_CONFIG = Object.freeze({
  enabled: true,
  resultsDir: REPORT_DIRS.ALLURE_RESULTS,
  reportDir: REPORT_DIRS.ALLURE_REPORT,
  cleanResults: true,
  allure: true,
  allureResultsPath: REPORT_DIRS.ALLURE_RESULTS,
  allureAddVideoOnPass: false,
  allureAttachRequests: true,
  allureSkipSteps: ["pass", "fail", "pending", "skipped"],
});

const CUCUMBER_REPORT_CONFIG = Object.freeze({
  format: {
    json: {
      dir: REPORT_DIRS.CUCUMBER_REPORT,
      filename: "cucumber-report.json",
    },
  },
});

const CYPRESS_CONFIG = Object.freeze({
  screenshotsFolder: REPORT_DIRS.SCREENSHOTS,
  videosFolder: REPORT_DIRS.VIDEOS,
  video: true,
  videoCompression: 32,
  screenshotOnRunFailure: true,
  reporter: "mochawesome",
  reporterOptions: REPORTER_OPTIONS.mochawesome,
});

function getTimedReportDir(baseDir) {
  const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
  return path.join(baseDir, `run-${timestamp}`);
}

module.exports = {
  REPORT_DIRS,
  REPORTER_OPTIONS,
  ALLURE_CONFIG,
  CUCUMBER_REPORT_CONFIG,
  CYPRESS_CONFIG,
  getTimedReportDir,
};
