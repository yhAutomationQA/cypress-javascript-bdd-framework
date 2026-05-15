class BasePage {
  constructor() {
    this.timeout = Cypress.config("defaultCommandTimeout");
  }

  navigate(path = "") {
    cy.visit(path);
    return this;
  }

  waitForElement(selector, timeout = this.timeout) {
    cy.get(selector, { timeout }).should("exist");
    return this;
  }

  waitForElementVisible(selector, timeout = this.timeout) {
    cy.get(selector, { timeout }).should("be.visible");
    return this;
  }

  clickElement(selector, options = {}) {
    cy.get(selector)
      .should("be.visible")
      .should("not.be.disabled")
      .click(options);
    return this;
  }

  typeText(selector, text, options = {}) {
    cy.get(selector)
      .should("be.visible")
      .clear()
      .type(text, { delay: 10, ...options });
    return this;
  }

  getElement(selector) {
    return cy.get(selector);
  }

  getElementByText(text, tag = "*") {
    return cy.contains(tag, text);
  }

  isElementVisible(selector) {
    return cy.get(selector).should("be.visible");
  }

  isElementNotVisible(selector) {
    return cy.get(selector).should("not.be.visible");
  }

  elementShouldContainText(selector, text) {
    cy.get(selector).should("contain.text", text);
    return this;
  }

  elementShouldHaveValue(selector, value) {
    cy.get(selector).should("have.value", value);
    return this;
  }

  selectDropdownOption(selector, option) {
    cy.get(selector).select(option);
    return this;
  }

  checkCheckbox(selector) {
    cy.get(selector).check();
    return this;
  }

  uncheckCheckbox(selector) {
    cy.get(selector).uncheck();
    return this;
  }

  scrollToElement(selector) {
    cy.get(selector).scrollIntoView();
    return this;
  }

  hoverOverElement(selector) {
    cy.get(selector).trigger("mouseover");
    return this;
  }

  waitForPageLoad() {
    cy.window().then((win) => {
      expect(win.document.readyState).to.eq("complete");
    });
    return this;
  }

  getPageTitle() {
    return cy.title();
  }

  getCurrentUrl() {
    return cy.url();
  }

  acceptAlert() {
    cy.on("window:alert", () => true);
    return this;
  }

  dismissAlert() {
    cy.on("window:confirm", () => false);
    return this;
  }

  takeScreenshot(name) {
    cy.screenshot(name, { capture: "fullPage" });
    return this;
  }

  scrollToPosition(x = 0, y = 0) {
    cy.scrollTo(x, y);
    return this;
  }

  setViewport(width, height) {
    cy.viewport(width, height);
    return this;
  }

  pressKey(key) {
    cy.get("body").type(`{${key}}`);
    return this;
  }

  pressEnter() {
    return this.pressKey("enter");
  }

  pressTab() {
    return this.pressKey("tab");
  }

  pressEscape() {
    return this.pressKey("esc");
  }
}

module.exports = BasePage;
