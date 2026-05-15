class Helpers {
  static getEnvVar(name, fallback = "") {
    if (typeof Cypress !== "undefined" && Cypress.env) {
      return Cypress.env(name) || fallback;
    }
    return process.env[name] || fallback;
  }

  static getBaseUrl() {
    return this.getEnvVar("BASE_URL", Cypress.config("baseUrl"));
  }

  static getApiUrl() {
    return this.getEnvVar("API_URL", `${this.getBaseUrl()}/api`);
  }

  static getCredentials() {
    return {
      username: this.getEnvVar("USERNAME", "user@example.com"),
      password: this.getEnvVar("PASSWORD", "user123"),
    };
  }

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
    if (!data) {
      return data;
    }
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
        if (attempt >= retries) {
          throw err;
        }
        return Helpers.wait(delay).then(execute);
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

  static getTimeout(name) {
    const timeouts = {
      implicit: parseInt(this.getEnvVar("IMPLICIT_TIMEOUT", "5000"), 10),
      explicit: parseInt(this.getEnvVar("EXPLICIT_TIMEOUT", "10000"), 10),
      pageLoad: parseInt(this.getEnvVar("PAGE_LOAD_TIMEOUT", "30000"), 10),
    };
    return timeouts[name] || timeouts.explicit;
  }
}

module.exports = Helpers;
