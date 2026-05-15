class Helpers {
  static generateRandomEmail() {
    const timestamp = Date.now();
    return `testuser_${timestamp}@example.com`;
  }

  static generateRandomString(length = 10) {
    const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
    let result = "";
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  static generateRandomNumber(min = 0, max = 1000) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  static formatDate(date, format = "YYYY-MM-DD") {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return format.replace("YYYY", year).replace("MM", month).replace("DD", day);
  }

  static parseJsonSafe(str) {
    try {
      return JSON.parse(str);
    } catch {
      return null;
    }
  }

  static getCurrentTimestamp() {
    return Date.now();
  }

  static wait(ms) {
    return new Cypress.Promise((resolve) => setTimeout(resolve, ms));
  }

  static maskSensitiveData(data) {
    if (!data) return data;
    return data.replace(/./g, "*");
  }

  static getTestData(fixturePath, key) {
    return cy.fixture(fixturePath).then((data) => {
      return key ? data[key] : data;
    });
  }

  static retry(fn, retries = 3, delay = 1000) {
    let attempt = 0;
    const execute = () => {
      return fn().catch((err) => {
        attempt++;
        if (attempt >= retries) throw err;
        return cy.wait(delay).then(execute);
      });
    };
    return execute();
  }

  static buildQueryString(params) {
    return Object.entries(params)
      .filter(([_, v]) => v !== undefined && v !== null)
      .map(
        ([key, value]) =>
          `${encodeURIComponent(key)}=${encodeURIComponent(value)}`
      )
      .join("&");
  }
}

module.exports = Helpers;
