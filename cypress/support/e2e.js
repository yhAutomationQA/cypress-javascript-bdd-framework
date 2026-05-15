import "./commands";

Cypress.on("uncaught:exception", (err, runnable) => {
  console.error("Uncaught Exception:", err.message);
  return false;
});

Cypress.on("fail", (error, runnable) => {
  cy.screenshot(`failure-${runnable.title}`);
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
