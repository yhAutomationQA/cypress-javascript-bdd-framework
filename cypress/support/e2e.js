import "./commands";
require("@shelex/cypress-allure-plugin");

Cypress.on("uncaught:exception", (_err, _runnable) => {
  console.error("Uncaught Exception:", _err.message);
  return false;
});

Cypress.on("fail", (error, runnable) => {
  const screenshotName = `failure-${runnable.title.replace(/[^a-zA-Z0-9]/g, "_")}`;
  cy.screenshot(screenshotName, { capture: "fullPage" });
  throw error;
});

Cypress.on("log:added", (options) => {
  if (options.instrument === "command" && options.message.startsWith("API:")) {
    console.log(`[${options.instrument}] ${options.message}`);
  }
});

before(() => {
  cy.log("Test suite execution started");
});

after(() => {
  cy.log("Test suite execution completed");
});

afterEach(function () {
  if (this.currentTest && this.currentTest.state === "failed") {
    const testName = this.currentTest.title.replace(/[^a-zA-Z0-9]/g, "_");
    cy.screenshot(`afterEach-${testName}`, { capture: "fullPage" });
  }
});
