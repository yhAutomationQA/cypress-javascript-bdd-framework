import "./commands";

Cypress.on("uncaught:exception", (err, runnable) => {
  console.error("Uncaught Exception:", err.message);
  return false;
});

Cypress.on("fail", (error, runnable) => {
  cy.screenshot(`failure-${runnable.title}`);
  throw error;
});

before(() => {
  cy.log("Test suite execution started");
});

after(() => {
  cy.log("Test suite execution completed");
});
