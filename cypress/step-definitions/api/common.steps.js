const {
  Given,
  When,
  Then,
  Before,
  After,
} = require("@badeball/cypress-cucumber-preprocessor");
const ApiClient = require("../../api/api-client");
const ResponseValidator = require("../../api/response-validator");

let apiClient;
let response;

Before({ tags: "@api" }, () => {
  apiClient = new ApiClient();
  response = null;
  cy.log("Initialized API client");
});

After({ tags: "@api" }, () => {
  if (apiClient) {
    const logs = apiClient.getLogs();
    cy.log(`Total API requests in scenario: ${logs.length}`);
    apiClient.clearLogs();
  }
});

Given("the API base URL is {string}", (baseUrl) => {
  apiClient.setBaseUrl(baseUrl);
  cy.log(`API base URL set to: ${baseUrl}`);
});

Given("the request content type is {string}", (contentType) => {
  apiClient.setDefaultHeader("Content-Type", contentType);
  cy.log(`Content-Type header set to: ${contentType}`);
});

Given("I set the request header {string} to {string}", (name, value) => {
  apiClient.setDefaultHeader(name, value);
  cy.log(`Header set: ${name} = ${value}`);
});

Given("I set the request body:", (bodyString) => {
  let parsed;
  try {
    parsed = JSON.parse(bodyString);
  } catch {
    parsed = bodyString;
  }
  Cypress.env("apiRequestBody", parsed);
  cy.log(`Request body stored: ${JSON.stringify(parsed).substring(0, 200)}`);
});

When("I send a {string} request to {string}", (method, path) => {
  const body = Cypress.env("apiRequestBody");
  cy.log(`Sending ${method} request to: ${path}`);

  apiClient
    .send(method, path, { body, failOnStatusCode: false })
    .then((res) => {
      response = res;
      cy.wrap(null).then(() => {
        Cypress.env("apiResponse", response);
      });
    });
});

When("I send a GET request to {string}", (path) => {
  apiClient.get(path, { failOnStatusCode: false }).then((res) => {
    response = res;
    Cypress.env("apiResponse", response);
  });
});

When("I send a POST request to {string}", (path) => {
  const body = Cypress.env("apiRequestBody") || {};
  apiClient.post(path, body, { failOnStatusCode: false }).then((res) => {
    response = res;
    Cypress.env("apiResponse", response);
  });
});

When("I send a PUT request to {string}", (path) => {
  const body = Cypress.env("apiRequestBody") || {};
  apiClient.put(path, body, { failOnStatusCode: false }).then((res) => {
    response = res;
    Cypress.env("apiResponse", response);
  });
});

When("I send a PATCH request to {string}", (path) => {
  const body = Cypress.env("apiRequestBody") || {};
  apiClient.patch(path, body, { failOnStatusCode: false }).then((res) => {
    response = res;
    Cypress.env("apiResponse", response);
  });
});

When("I send a DELETE request to {string}", (path) => {
  apiClient.delete(path, { failOnStatusCode: false }).then((res) => {
    response = res;
    Cypress.env("apiResponse", response);
  });
});

Then("the response status code should be {int}", (expectedStatus) => {
  expect(response).to.not.be.null;
  ResponseValidator.from(response).status(expectedStatus);
});

Then("the response body should be an array", () => {
  expect(response).to.not.be.null;
  ResponseValidator.from(response).bodyIsArray();
});

Then("the response body should be an object", () => {
  expect(response).to.not.be.null;
  ResponseValidator.from(response).bodyIsObject();
});

Then("the array should contain at least {int} item(s)", (min) => {
  expect(response).to.not.be.null;
  ResponseValidator.from(response).bodyArrayMinLength(min);
});

Then("the response should have field {string}", (fieldPath) => {
  expect(response).to.not.be.null;
  ResponseValidator.from(response).bodyHasField(fieldPath);
});

Then(
  "the response should have field {string} with value {string}",
  (fieldPath, expected) => {
    expect(response).to.not.be.null;
    ResponseValidator.from(response).bodyFieldEquals(fieldPath, expected);
  }
);

Then(
  "the response should have field {string} with value {int}",
  (fieldPath, expected) => {
    expect(response).to.not.be.null;
    ResponseValidator.from(response).bodyFieldEquals(fieldPath, expected);
  }
);

Then("the response body should equal:", (expectedBodyString) => {
  expect(response).to.not.be.null;
  const expected = JSON.parse(expectedBodyString);
  ResponseValidator.from(response).body(expected);
});

Then("the response body should contain:", (expectedBodyString) => {
  expect(response).to.not.be.null;
  const expected = JSON.parse(expectedBodyString);
  ResponseValidator.from(response).bodyContains(expected);
});

Then("the response headers should contain {string}", (headerName) => {
  expect(response).to.not.be.null;
  ResponseValidator.from(response).headerExists(headerName);
});

Then("the response header {string} should equal {string}", (name, expected) => {
  expect(response).to.not.be.null;
  ResponseValidator.from(response).headerEquals(name, expected);
});

Then("the response should be received within {int}ms", (maxDuration) => {
  expect(response).to.not.be.null;
  ResponseValidator.from(response).durationLessThan(maxDuration);
});

Then("the response should take longer than {int}ms", (minDuration) => {
  expect(response).to.not.be.null;
  ResponseValidator.from(response).durationGreaterThan(minDuration);
});
