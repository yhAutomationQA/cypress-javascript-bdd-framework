const BasePage = require("./BasePage");

class InventoryPage extends BasePage {
  constructor() {
    super();
    this.selectors = {
      pageTitle: ".title",
      inventoryContainer: "#inventory_container",
      inventoryList: ".inventory_list",
      inventoryItems: ".inventory_item",
      inventoryItemName: ".inventory_item_name",
      inventoryItemPrice: ".inventory_item_price",
      shoppingCartBadge: ".shopping_cart_badge",
      shoppingCartLink: ".shopping_cart_link",
      burgerMenuButton: "#react-burger-menu-btn",
      logoutSidebarLink: "#logout_sidebar_link",
      sidebarContainer: ".bm-menu-wrap",
      sidebarOverlay: ".bm-overlay",
      inventorySortContainer: ".product_sort_container",
      footer: ".footer",
      peekLogo: ".peek",
    };
  }

  waitForPageLoad() {
    cy.get(this.selectors.inventoryContainer).should("be.visible");
    cy.get(this.selectors.pageTitle).should("be.visible");
    return this;
  }

  getPageTitleText() {
    return cy.get(this.selectors.pageTitle);
  }

  getPageTitle() {
    return cy.title();
  }

  getInventoryItems() {
    return cy.get(this.selectors.inventoryItems);
  }

  getInventoryCount() {
    return this.getInventoryItems().its("length");
  }

  getItemName(index = 0) {
    return cy.get(this.selectors.inventoryItemName).eq(index);
  }

  getItemPrice(index = 0) {
    return cy.get(this.selectors.inventoryItemPrice).eq(index);
  }

  addItemToCart(itemName) {
    const itemId = itemName.toLowerCase().replace(/\s+/g, "-");
    cy.contains(".inventory_item_name", itemName)
      .parents(".inventory_item")
      .within(() => {
        cy.get("button").contains("Add to cart").click();
      });
    return this;
  }

  removeItemFromCart(itemName) {
    cy.contains(".inventory_item_name", itemName)
      .parents(".inventory_item")
      .within(() => {
        cy.get("button").contains("Remove").click();
      });
    return this;
  }

  getCartBadgeCount() {
    return cy.get(this.selectors.shoppingCartBadge).invoke("text");
  }

  openSidebar() {
    cy.get(this.selectors.burgerMenuButton).click();
    cy.get(this.selectors.sidebarContainer).should("be.visible");
    return this;
  }

  closeSidebar() {
    cy.get(this.selectors.sidebarOverlay).click({ force: true });
    return this;
  }

  clickLogout() {
    this.openSidebar();
    cy.get(this.selectors.logoutSidebarLink).click();
    cy.url().should("eq", `${Cypress.config("baseUrl")}/`);
    return this;
  }
}

module.exports = InventoryPage;
