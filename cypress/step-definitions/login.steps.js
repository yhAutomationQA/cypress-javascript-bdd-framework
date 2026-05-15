const {
  Given,
  When,
  Then,
  Before,
  After,
} = require("@badeball/cypress-cucumber-preprocessor");
const LoginPage = require("../pages/LoginPage");
const InventoryPage = require("../pages/InventoryPage");

const loginPage = new LoginPage();
const inventoryPage = new InventoryPage();

Before({ tags: "@login" }, () => {
  cy.log("Starting SauceDemo login scenario");
});

Before({ tags: "@positive" }, () => {
  cy.log("Positive test scenario");
});

Before({ tags: "@negative" }, () => {
  cy.log("Negative test scenario");
});

After({ tags: "@login" }, () => {
  if (Cypress.env("sauceDemoLoggedIn")) {
    cy.window().then((win) => {
      win.sessionStorage.clear();
    });
    Cypress.env("sauceDemoLoggedIn", false);
  }
  cy.log("Completed SauceDemo login scenario");
});

Given("the user is on the SauceDemo login page", () => {
  loginPage.visit();
  loginPage.isLoginFormDisplayed();
  cy.url().should("include", "saucedemo.com");
  cy.url().should("eq", `${Cypress.config("baseUrl")}/`);
  loginPage.errorShouldNotExist();
});

When(
  "the user logs in with username {string} and password {string}",
  (username, password) => {
    loginPage.login(username, password);
  }
);

When("the user enters username {string}", (username) => {
  loginPage.enterUsername(username);
});

When("the user enters password {string}", (password) => {
  loginPage.enterPassword(password);
});

When("the user clicks the login button", () => {
  loginPage.clickLoginButton();
});

When("the user logs out", () => {
  inventoryPage.clickLogout();
  Cypress.env("sauceDemoLoggedIn", false);
});

Then("the user should be redirected to the products page", () => {
  cy.url().should("contain", "/inventory.html");
  cy.url().should("not.contain", "login");
  inventoryPage.waitForPageLoad();
  inventoryPage.getPageTitleText().should("have.text", "Products");
  inventoryPage.getInventoryCount().should("be.gte", 1);
  Cypress.env("sauceDemoLoggedIn", true);
});

Then("the page title should be {string}", (expectedTitle) => {
  loginPage.getPageTitle().should("eq", expectedTitle);
});

Then("products should be displayed", () => {
  inventoryPage.getInventoryItems().should("have.length.at.least", 1);
  inventoryPage.getItemName(0).should("not.be.empty");
  inventoryPage.getItemPrice(0).should("not.be.empty");
});

Then("the user should see the error message {string}", (expectedError) => {
  loginPage.errorMessageShouldContain(expectedError);
});

Then("the user should remain on the login page", () => {
  cy.url().should("eq", `${Cypress.config("baseUrl")}/`);
  cy.url().should("not.contain", "inventory");
  loginPage.isLoginFormDisplayed();
});

Then("the user should be redirected to the login page", () => {
  cy.url().should("eq", `${Cypress.config("baseUrl")}/`);
  cy.url().should("not.contain", "inventory");
});

Then("the login form should be displayed", () => {
  loginPage.isLoginFormDisplayed();
  loginPage.errorShouldNotExist();
});
