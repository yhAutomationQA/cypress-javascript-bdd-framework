const BasePage = require("./BasePage");

class LoginPage extends BasePage {
  constructor() {
    super();
    this.url = "/login";
    this.selectors = {
      emailInput: "#email",
      passwordInput: "#password",
      loginButton: "button[type='submit']",
      rememberMeCheckbox: "#remember-me",
      forgotPasswordLink: "a[href*='forgot']",
      errorMessage: ".error-message",
      successMessage: ".success-message",
      loginForm: "#login-form",
    };
  }

  visit() {
    return super.navigate(this.url);
  }

  enterEmail(email) {
    return this.typeText(this.selectors.emailInput, email);
  }

  enterPassword(password) {
    return this.typeText(this.selectors.passwordInput, password, {
      log: false,
    });
  }

  clickLoginButton() {
    return this.clickElement(this.selectors.loginButton);
  }

  loginWithCredentials(email, password) {
    this.visit();
    this.enterEmail(email);
    this.enterPassword(password);
    return this.clickLoginButton();
  }

  loginAsUser(userType) {
    const credentials = this.getCredentialsForUserType(userType);
    return this.loginWithCredentials(credentials.email, credentials.password);
  }

  toggleRememberMe() {
    return this.checkCheckbox(this.selectors.rememberMeCheckbox);
  }

  clickForgotPassword() {
    return this.clickElement(this.selectors.forgotPasswordLink);
  }

  getErrorMessage() {
    return cy.get(this.selectors.errorMessage);
  }

  getSuccessMessage() {
    return cy.get(this.selectors.successMessage);
  }

  isLoginFormVisible() {
    return this.isElementVisible(this.selectors.loginForm);
  }

  clearForm() {
    cy.get(this.selectors.emailInput).clear();
    cy.get(this.selectors.passwordInput).clear();
    return this;
  }

  getCredentialsForUserType(userType) {
    const credentials = {
      admin: { email: "admin@example.com", password: "admin123" },
      user: { email: "user@example.com", password: "user123" },
      invalid: { email: "invalid@example.com", password: "wrongpass" },
    };
    return credentials[userType] || credentials.user;
  }
}

module.exports = LoginPage;
