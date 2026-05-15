const { Then } = require("@badeball/cypress-cucumber-preprocessor");
const SchemaValidator = require("../../api/schema-validator");
const postsSchema = require("../../fixtures/api/schemas/posts-schema.json");

Then("each item should have the required post fields", () => {
  const response = Cypress.env("apiResponse");
  expect(response).to.not.be.null;
  expect(response.body).to.be.an("array");

  response.body.forEach((item, index) => {
    expect(item).to.have.property("userId");
    expect(item).to.have.property("id");
    expect(item).to.have.property("title");
    expect(item).to.have.property("body");
    expect(item.userId).to.be.a("number");
    expect(item.id).to.be.a("number");
    expect(item.title).to.be.a("string");
    expect(item.body).to.be.a("string");
  });
});

Then("the response body should match the post schema", () => {
  const response = Cypress.env("apiResponse");
  expect(response).to.not.be.null;
  SchemaValidator.assertSchema(response.body, postsSchema.post);
});

Then("all items should match the post list schema", () => {
  const response = Cypress.env("apiResponse");
  expect(response).to.not.be.null;
  expect(response.body).to.be.an("array");
  response.body.forEach((item) => {
    SchemaValidator.assertSchema(item, postsSchema.post);
  });
});

Then("each item should be a valid comment object", () => {
  const response = Cypress.env("apiResponse");
  expect(response).to.not.be.null;
  expect(response.body).to.be.an("array");
  response.body.forEach((item, index) => {
    expect(item).to.have.property("postId");
    expect(item).to.have.property("id");
    expect(item).to.have.property("name");
    expect(item).to.have.property("email");
    expect(item).to.have.property("body");
    expect(item.postId).to.eq(1);
    expect(item.email).to.match(/.+@.+\..+/);
  });
});
