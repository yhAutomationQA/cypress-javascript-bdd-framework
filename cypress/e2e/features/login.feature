@regression @smoke
Feature: User Login
  As a registered user
  I want to log in to the application
  So that I can access my account

  Background:
    Given the user is on the login page

  @smoke @positive
  Scenario: Successful login with valid credentials
    When the user enters email "user@example.com"
    And the user enters password "user123"
    And the user clicks the login button
    Then the user should be redirected to the dashboard
    And the user should see a welcome message

  @positive
  Scenario: Login with "remember me" enabled
    When the user enters email "user@example.com"
    And the user enters password "user123"
    And the user enables "Remember Me"
    And the user clicks the login button
    Then the user should stay logged in on subsequent visits

  @negative
  Scenario: Login with invalid credentials
    When the user enters email "invalid@example.com"
    And the user enters password "wrongpass"
    And the user clicks the login button
    Then the user should see an error message "Invalid email or password"
    And the user should remain on the login page

  @negative
  Scenario Outline: Login with empty fields
    When the user enters email "<email>"
    And the user enters password "<password>"
    And the user clicks the login button
    Then the user should see an error message "<error>"

    Examples:
      | email | password | error                    |
      |       | pass123  | Email is required        |
      | user@ |          | Password is required     |
      |       |          | Email is required        |

  @smoke @negative
  Scenario: Login with locked account
    When the user enters email "locked@example.com"
    And the user enters password "user123"
    And the user clicks the login button
    Then the user should see an error message "Your account has been locked"
