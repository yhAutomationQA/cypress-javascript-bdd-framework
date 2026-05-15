const { Given, When, Then, Before, After } = require("@badeball/cypress-cucumber-preprocessor");
const LoginPage = require("../pages/LoginPage");

const loginPage = new LoginPage();

Before({ tags: "@login" }, () => {
  cy.log("Starting login test scenario");
});

After({ tags: "@login" }, () => {
  cy.log("Completed login test scenario");
});

Given("the user is on the login page", () => {
  loginPage.visit();
  loginPage.isLoginFormVisible();
});

When("the user enters email {string}", (email) => {
  loginPage.enterEmail(email);
});

When("the user enters password {string}", (password) => {
  loginPage.enterPassword(password);
});

When("the user clicks the login button", () => {
  loginPage.clickLoginButton();
});

When("the user enables {string}", (option) => {
  if (option.toLowerCase() === "remember me") {
    loginPage.toggleRememberMe();
  }
});

When("the user logs in with valid credentials", () => {
  loginPage.loginWithEnvCredentials();
});

When("the user logs in as {string}", (userType) => {
  loginPage.loginAsUser(userType);
});

When("the user navigates to the forgot password page", () => {
  loginPage.clickForgotPassword();
});

Then("the user should be redirected to the dashboard", () => {
  cy.url().should("include", "/dashboard");
});

Then("the user should see a welcome message", () => {
  loginPage.getSuccessMessage().should("contain", "Welcome");
});

Then("the user should stay logged in on subsequent visits", () => {
  cy.window().then((win) => {
    const token = win.localStorage.getItem("auth_token");
    expect(token).to.not.be.null;
  });
  cy.visit("/dashboard");
  cy.url().should("include", "/dashboard");
});

Then("the user should see an error message {string}", (errorMessage) => {
  loginPage.getErrorMessage().should("be.visible");
  loginPage.getErrorMessage().should("contain", errorMessage);
});

Then("the user should remain on the login page", () => {
  cy.url().should("include", "/login");
  loginPage.isLoginFormVisible();
});

Then("the login button should be disabled", () => {
  cy.get("button[type='submit']").should("be.disabled");
});
