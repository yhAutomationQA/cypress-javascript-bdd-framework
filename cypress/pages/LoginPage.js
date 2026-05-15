const BasePage = require("./BasePage");

class LoginPage extends BasePage {
  constructor() {
    super();
    this.selectors = {
      usernameInput: "#user-name",
      passwordInput: "#password",
      loginButton: "#login-button",
      errorMessage: '[data-test="error"]',
      errorButton: '[data-test="error-button"]',
      loginLogo: ".login_logo",
      loginCredentials: ".login_credentials",
      loginPassword: ".login_password",
      botColumn: ".bot_column",
    };
  }

  visit() {
    cy.visit("/");
    this.waitForPageReady();
    return this;
  }

  waitForPageReady() {
    cy.get(this.selectors.loginLogo).should("be.visible");
    cy.get(this.selectors.usernameInput).should("be.visible");
    return this;
  }

  enterUsername(username) {
    if (username) {
      this.typeText(this.selectors.usernameInput, username);
    }
    return this;
  }

  enterPassword(password) {
    if (password) {
      this.typeText(this.selectors.passwordInput, password, { log: false });
    }
    return this;
  }

  clickLoginButton() {
    this.clickElement(this.selectors.loginButton);
    return this;
  }

  login(username, password) {
    this.visit();
    this.enterUsername(username);
    this.enterPassword(password);
    this.clickLoginButton();
    return this;
  }

  getErrorMessage() {
    return cy.get(this.selectors.errorMessage);
  }

  errorMessageShouldContain(expectedText) {
    this.getErrorMessage()
      .should("be.visible")
      .and("contain.text", expectedText);
    return this;
  }

  dismissError() {
    cy.get(this.selectors.errorButton).click();
    return this;
  }

  isLoginFormDisplayed() {
    cy.get(this.selectors.usernameInput).should("be.visible");
    cy.get(this.selectors.passwordInput).should("be.visible");
    cy.get(this.selectors.loginButton).should("be.visible");
    return this;
  }

  getLoginButton() {
    return cy.get(this.selectors.loginButton);
  }

  usernameInputShouldBeEmpty() {
    cy.get(this.selectors.usernameInput).should("have.value", "");
    return this;
  }

  passwordInputShouldBeEmpty() {
    cy.get(this.selectors.passwordInput).should("have.value", "");
    return this;
  }

  errorShouldNotExist() {
    cy.get(this.selectors.errorMessage).should("not.exist");
    return this;
  }

  clearForm() {
    cy.get(this.selectors.usernameInput).clear();
    cy.get(this.selectors.passwordInput).clear();
    return this;
  }

  getPageUrl() {
    return cy.url();
  }

  getPageTitle() {
    return cy.title();
  }
}

module.exports = LoginPage;
