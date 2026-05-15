@api @regression @posts
Feature: JSONPlaceholder Posts API
  As an API consumer
  I want to perform CRUD operations on the Posts resource
  So that I can verify the API behaves correctly

  Background:
    Given the API base URL is "https://jsonplaceholder.typicode.com"
    And the request content type is "application/json"

  @api @smoke @positive
  Scenario: GET all posts returns a list
    When I send a GET request to "/posts"
    Then the response status code should be 200
    And the response body should be an array
    And the array should contain at least 1 item
    And each item should have the required post fields

  @api @smoke @positive
  Scenario: GET single post by ID returns the correct post
    When I send a GET request to "/posts/1"
    Then the response status code should be 200
    And the response body should be an object
    And the response should have field "id" with value 1
    And the response should have field "userId" with value 1
    And the response body should match the post schema

  @api @positive
  Scenario: GET comments for a post
    When I send a GET request to "/posts/1/comments"
    Then the response status code should be 200
    And the response body should be an array
    And the array should contain at least 1 item
    And each item should be a valid comment object

  @api @smoke @positive
  Scenario: POST creates a new post
    Given I set the request body:
    """
    {
      "title": "Cypress BDD API Test",
      "body": "This post was created during automated API testing.",
      "userId": 1
    }
    """
    When I send a POST request to "/posts"
    Then the response status code should be 201
    And the response body should be an object
    And the response should have field "title" with value "Cypress BDD API Test"
    And the response should have field "body" with value "This post was created during automated API testing."
    And the response should have field "userId" with value 1
    And the response should have field "id"

  @api @positive
  Scenario: PUT updates an existing post
    Given I set the request body:
    """
    {
      "id": 1,
      "title": "Updated Title via Cypress",
      "body": "Updated body via automated API test.",
      "userId": 1
    }
    """
    When I send a PUT request to "/posts/1"
    Then the response status code should be 200
    And the response should have field "title" with value "Updated Title via Cypress"
    And the response should have field "body" with value "Updated body via automated API test."

  @api @positive
  Scenario: PATCH partially updates a post
    Given I set the request body:
    """
    {
      "title": "Partially Updated Title"
    }
    """
    When I send a PATCH request to "/posts/1"
    Then the response status code should be 200
    And the response should have field "title" with value "Partially Updated Title"
    And the response body should match the post schema

  @api @smoke @positive
  Scenario: DELETE removes a post
    When I send a DELETE request to "/posts/1"
    Then the response status code should be 200

  @api @negative
  Scenario: GET non-existent post returns 404
    When I send a GET request to "/posts/999999"
    Then the response status code should be 404

  @api @negative
  Scenario: POST with empty body returns 400 or 201
    Given I set the request body:
    """
    {}
    """
    When I send a POST request to "/posts"
    Then the response status code should be 201

  @api @positive
  Scenario: Response headers contain Content-Type
    When I send a GET request to "/posts/1"
    Then the response headers should contain "Content-Type"
    And the response should be received within 3000ms
