Cypress.Commands.add("loginByUi", (username, password) => {
  cy.visit("/");
  cy.get("#user-name").clear().type(username);
  cy.get("#password").clear().type(password, { log: false });
  cy.get("#login-button").click();
  cy.url().should("contain", "/inventory.html");
});

Cypress.Commands.add("loginByUiWithEnvCredentials", () => {
  const username = Cypress.env("USERNAME");
  const password = Cypress.env("PASSWORD");
  cy.log(`Logging in as ${username}`);
  cy.loginByUi(username, password);
});

Cypress.Commands.add("loginByApi", (username, password) => {
  cy.session([username, password], () => {
    cy.request({
      method: "POST",
      url: `${Cypress.config("baseUrl")}/api/v1/auth/login`,
      body: { username, password },
    }).then((response) => {
      expect(response.status).to.eq(200);
      window.localStorage.setItem("auth_token", response.body.token);
    });
  });
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
