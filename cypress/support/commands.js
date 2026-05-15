Cypress.Commands.add("loginByApi", (email, password) => {
  cy.session([email, password], () => {
    cy.request({
      method: "POST",
      url: `${Cypress.config("baseUrl")}/api/v1/auth/login`,
      body: { email, password },
    }).then((response) => {
      expect(response.status).to.eq(200);
      window.localStorage.setItem("auth_token", response.body.token);
    });
  });
});

Cypress.Commands.add("loginByUi", (email, password) => {
  cy.visit("/login");
  cy.get("#email").clear().type(email);
  cy.get("#password").clear().type(password, { log: false });
  cy.get("button[type='submit']").click();
  cy.url().should("include", "/dashboard");
});

Cypress.Commands.add("getBySel", (selector, ...args) => {
  return cy.get(`[data-test=${selector}]`, ...args);
});

Cypress.Commands.add("getBySelLike", (selector, ...args) => {
  return cy.get(`[data-test*=${selector}]`, ...args);
});

Cypress.Commands.add("getByClass", (className, ...args) => {
  return cy.get(`.${className}`, ...args);
});

Cypress.Commands.add("assertLoadingComplete", () => {
  cy.get(".loading-spinner", { timeout: 15000 }).should("not.exist");
});

Cypress.Commands.add("interceptApi", (method, url, alias) => {
  cy.intercept(method, url).as(alias);
});

Cypress.Commands.add("waitForApi", (alias, timeout = 30000) => {
  cy.wait(`@${alias}`, { timeout });
});

Cypress.Commands.add("resetDatabase", () => {
  cy.request("POST", `${Cypress.config("baseUrl")}/api/v1/test/reset`);
});

Cypress.Commands.add("seedDatabase", (fixture) => {
  cy.fixture(fixture).then((data) => {
    cy.request("POST", `${Cypress.config("baseUrl")}/api/v1/test/seed`, data);
  });
});

Cypress.Commands.add("clearLocalStorage", () => {
  cy.window().then((win) => win.localStorage.clear());
});

Cypress.Commands.add("clearSessionStorage", () => {
  cy.window().then((win) => win.sessionStorage.clear());
});

Cypress.Commands.add("getIframeBody", (iframeSelector) => {
  return cy
    .get(iframeSelector)
    .its("0.contentDocument.body")
    .should("not.be.empty")
    .then(cy.wrap);
});

Cypress.Commands.add("checkTableRowCount", (selector, expectedCount) => {
  cy.get(selector).find("tr").should("have.length", expectedCount);
});

Cypress.Commands.add("checkTableContainsText", (selector, text) => {
  cy.get(selector).should("contain", text);
});
