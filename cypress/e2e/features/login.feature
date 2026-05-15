@login
@regression
@smoke
Feature: SauceDemo Login
  As a user of the SauceDemo application
  I want to log into the platform
  So that I can browse and purchase products

  Background:
    Given the user is on the SauceDemo login page

  @smoke
  @positive
  @TCC-LOGIN-001
  Scenario: Successful login with standard user
    When the user logs in with username "standard_user" and password "secret_sauce"
    Then the user should be redirected to the products page
    And the page title should be "Swag Labs"
    And products should be displayed

  @smoke
  @negative
  @TCC-LOGIN-002
  Scenario: Login with locked out user
    When the user logs in with username "locked_out_user" and password "secret_sauce"
    Then the user should see the error message "Sorry, this user has been locked out."
    And the user should remain on the login page

  @negative
  @TCC-LOGIN-003
  Scenario: Login with invalid credentials
    When the user logs in with username "invalid_user" and password "wrong_password"
    Then the user should see the error message "Username and password do not match any user in this service"
    And the user should remain on the login page

  @negative
  @TCC-LOGIN-004
  Scenario Outline: Login with empty credentials
    When the user enters username "<username>"
    And the user enters password "<password>"
    And the user clicks the login button
    Then the user should see the error message "<error>"

    Examples:
      | username      | password     | error                |
      |               | secret_sauce | Username is required |
      | standard_user |              | Password is required |
      |               |              | Username is required |

  @positive
  @TCC-LOGIN-005
  Scenario: Successful logout after login
    When the user logs in with username "standard_user" and password "secret_sauce"
    Then the user should be redirected to the products page
    When the user logs out
    Then the user should be redirected to the login page
    And the login form should be displayed
