class ApiClient {
  constructor() {
    this.baseUrl = Cypress.env("API_URL") || Cypress.config("baseUrl");
    this.defaultHeaders = {
      "Content-Type": "application/json",
      Accept: "application/json",
    };
    this.requestLogs = [];
  }

  getBaseUrl() {
    return this.baseUrl;
  }

  setBaseUrl(url) {
    this.baseUrl = url;
    return this;
  }

  setDefaultHeader(key, value) {
    this.defaultHeaders[key] = value;
    return this;
  }

  _buildUrl(path) {
    const base = this.baseUrl.replace(/\/+$/, "");
    const cleanPath = path.replace(/^\/+/, "");
    return `${base}/${cleanPath}`;
  }

  _mergeHeaders(extraHeaders = {}) {
    return { ...this.defaultHeaders, ...extraHeaders };
  }

  _log(method, url, reqBody, response) {
    const entry = {
      timestamp: new Date().toISOString(),
      request: { method, url, body: reqBody },
      response: {
        status: response.status,
        statusText: response.statusText,
        body: response.body,
        headers: response.headers,
        duration: response.duration,
      },
    };
    this.requestLogs.push(entry);

    const separator = "─".repeat(60);
    cy.log(separator);
    cy.log(`API: ${method} ${url}`);
    cy.log(`Status: ${response.status} (${response.duration}ms)`);
    if (reqBody) {
      const logBody = typeof reqBody === "object" ? JSON.stringify(reqBody) : reqBody;
      cy.log(`Request Body: ${logBody.substring(0, 500)}`);
    }
    if (response.body) {
      const resBody =
        typeof response.body === "object"
          ? JSON.stringify(response.body).substring(0, 500)
          : String(response.body).substring(0, 500);
      cy.log(`Response Body: ${resBody}`);
    }
    cy.log(separator);

    return entry;
  }

  _fail(error, method, url, reqBody) {
    const separator = "!".repeat(60);
    cy.log(separator);
    cy.log(`API FAILED: ${method} ${url}`);
    cy.log(`Error: ${error.message}`);
    if (reqBody) {
      const logBody = typeof reqBody === "object" ? JSON.stringify(reqBody) : reqBody;
      cy.log(`Request Body: ${logBody}`);
    }
    cy.log(separator);
    throw error;
  }

  get(path, options = {}) {
    const { headers = {}, qs = {}, failOnStatusCode = true } = options;
    const url = this._buildUrl(path);
    const mergedHeaders = this._mergeHeaders(headers);

    cy.log(`GET ${url}`);
    if (Object.keys(qs).length > 0) {
      cy.log(`Query Params: ${JSON.stringify(qs)}`);
    }

    return cy
      .request({
        method: "GET",
        url,
        headers: mergedHeaders,
        qs,
        failOnStatusCode,
      })
      .then((response) => {
        this._log("GET", url, null, response);
        return response;
      })
      .catch((error) => {
        this._fail(error, "GET", url, null);
      });
  }

  post(path, body, options = {}) {
    const { headers = {}, failOnStatusCode = true } = options;
    const url = this._buildUrl(path);
    const mergedHeaders = this._mergeHeaders(headers);

    cy.log(`POST ${url}`);
    cy.log(`Body: ${JSON.stringify(body)}`);

    return cy
      .request({
        method: "POST",
        url,
        headers: mergedHeaders,
        body,
        failOnStatusCode,
      })
      .then((response) => {
        this._log("POST", url, body, response);
        return response;
      })
      .catch((error) => {
        this._fail(error, "POST", url, body);
      });
  }

  put(path, body, options = {}) {
    const { headers = {}, failOnStatusCode = true } = options;
    const url = this._buildUrl(path);
    const mergedHeaders = this._mergeHeaders(headers);

    cy.log(`PUT ${url}`);
    cy.log(`Body: ${JSON.stringify(body)}`);

    return cy
      .request({
        method: "PUT",
        url,
        headers: mergedHeaders,
        body,
        failOnStatusCode,
      })
      .then((response) => {
        this._log("PUT", url, body, response);
        return response;
      })
      .catch((error) => {
        this._fail(error, "PUT", url, body);
      });
  }

  patch(path, body, options = {}) {
    const { headers = {}, failOnStatusCode = true } = options;
    const url = this._buildUrl(path);
    const mergedHeaders = this._mergeHeaders(headers);

    cy.log(`PATCH ${url}`);
    cy.log(`Body: ${JSON.stringify(body)}`);

    return cy
      .request({
        method: "PATCH",
        url,
        headers: mergedHeaders,
        body,
        failOnStatusCode,
      })
      .then((response) => {
        this._log("PATCH", url, body, response);
        return response;
      })
      .catch((error) => {
        this._fail(error, "PATCH", url, body);
      });
  }

  delete(path, options = {}) {
    const { headers = {}, failOnStatusCode = true } = options;
    const url = this._buildUrl(path);
    const mergedHeaders = this._mergeHeaders(headers);

    cy.log(`DELETE ${url}`);

    return cy
      .request({
        method: "DELETE",
        url,
        headers: mergedHeaders,
        failOnStatusCode,
      })
      .then((response) => {
        this._log("DELETE", url, null, response);
        return response;
      })
      .catch((error) => {
        this._fail(error, "DELETE", url, null);
      });
  }

  send(method, path, options = {}) {
    const { headers = {}, body, qs = {}, failOnStatusCode = true } = options;
    const url = this._buildUrl(path);
    const mergedHeaders = this._mergeHeaders(headers);

    cy.log(`${method} ${url}`);
    if (body) {
      cy.log(`Body: ${JSON.stringify(body)}`);
    }
    if (Object.keys(qs).length > 0) {
      cy.log(`Query Params: ${JSON.stringify(qs)}`);
    }

    return cy
      .request({
        method,
        url,
        headers: mergedHeaders,
        body,
        qs,
        failOnStatusCode,
      })
      .then((response) => {
        this._log(method, url, body, response);
        return response;
      })
      .catch((error) => {
        this._fail(error, method, url, body);
      });
  }

  getLogs() {
    return [...this.requestLogs];
  }

  clearLogs() {
    this.requestLogs = [];
    return this;
  }
}

module.exports = ApiClient;
