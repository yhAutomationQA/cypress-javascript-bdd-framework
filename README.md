# Cypress JavaScript BDD Framework

Enterprise-grade Cypress automation framework using Cucumber BDD with JavaScript.

## Tech Stack

- **Cypress** ^13.17 — Test runner
- **Cucumber BDD** (@badeball/cypress-cucumber-preprocessor) ^21.0
- **esbuild** preprocessor (@bahmutov/cypress-esbuild-preprocessor) ^2.2
- **dotenv** ^16.4 — Environment variable management
- **ESLint** ^8.57 — Static analysis
- **Prettier** ^3.4 — Code formatting

## Folder Structure

```
├── config/
│   └── env-manager.js         # Environment configuration loader
├── cypress/
│   ├── e2e/
│   │   └── features/          # Gherkin .feature files
│   ├── step-definitions/      # Cucumber step definitions
│   ├── pages/                 # Page Object Models
│   │   ├── BasePage.js
│   │   ├── LoginPage.js
│   │   └── InventoryPage.js
│   ├── fixtures/              # Test data (JSON)
│   ├── support/               # Custom commands & setup
│   │   ├── commands.js
│   │   └── e2e.js
│   └── utils/                 # Helpers & constants
├── reports/                   # Screenshots, videos, HTML
├── .env.dev                   # Development environment config
├── .env.qa                    # QA environment config
├── .env.staging               # Staging environment config
├── .env.example               # Environment template (tracked in git)
├── cypress.config.js          # Cypress configuration
└── package.json
```

## Quick Start

```bash
npm install
npm run open          # Launch Cypress Test Runner (default: dev)
npm run test          # Headless execution (default: dev)
```

## Application Under Test

This framework targets **[SauceDemo](https://www.saucedemo.com)** — a demo e-commerce application.

### Test Users

| User | Password | Behavior |
|------|----------|----------|
| `standard_user` | `secret_sauce` | Standard login, full access |
| `locked_out_user` | `secret_sauce` | Login rejected, account locked |
| `problem_user` | `secret_sauce` | Login succeeds, UI issues |
| `performance_glitch_user` | `secret_sauce` | Login succeeds, slow load |

## Environment Configuration

The framework supports multi-environment execution via `.env.*` files managed by `config/env-manager.js`.

### Available Environments

| File | ENV value | Command |
|------|-----------|---------|
| `.env.dev` | `dev` | `ENV=dev npm run test` |
| `.env.qa` | `qa` | `ENV=qa npm run test` |
| `.env.staging` | `staging` | `ENV=staging npm run test` |

### Usage

```bash
# Specific environment
ENV=qa npm run test
npm run test:staging

# Open Cypress Runner for an environment
ENV=qa npm run open
npm run open:qa
```

### Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `BASE_URL` | Yes | Application base URL |
| `API_URL` | Yes | API base URL |
| `USERNAME` | Yes | Default test user |
| `PASSWORD` | Yes | Default test user password |
| `IMPLICIT_TIMEOUT` | No | Default element wait (ms) |
| `EXPLICIT_TIMEOUT` | No | Explicit wait timeout (ms) |
| `PAGE_LOAD_TIMEOUT` | No | Page load timeout (ms) |

### Env-Manager API

The `config/env-manager.js` provides runtime helpers accessible in tests:

```js
Cypress.env("BASE_URL")         // "https://www.saucedemo.com"
Cypress.env("USERNAME")         // "standard_user"
Cypress.env("PASSWORD")         // "secret_sauce"
Cypress.env("ENV")              // "qa"

Helpers.getBaseUrl()            // Current env baseUrl
Helpers.getCredentials()        // { username, password }
Helpers.getTimeout("explicit")  // Current env explicit timeout
```

## NPM Scripts

| Script | Description |
|--------|-------------|
| `test` | Run all tests headlessly (respects `ENV` var) |
| `test:dev` | Run in dev environment |
| `test:qa` | Run in QA environment |
| `test:staging` | Run in staging environment |
| `test:chrome` | Run in Chrome |
| `test:firefox` | Run in Firefox |
| `open` | Open Cypress Test Runner |
| `open:dev` | Open Cypress in dev env |
| `open:qa` | Open Cypress in QA env |
| `open:staging` | Open Cypress in staging env |
| `cypress:run:tag` | Run by tag: `npm run cypress:run:tag -- Tags="@smoke"` |
| `lint` | ESLint check |
| `lint:fix` | ESLint auto-fix |
| `format` | Prettier format |
| `format:check` | Prettier check |

## Running with Tags

```bash
npm run cypress:run -- --env Tags="@smoke"
ENV=qa npm run cypress:run -- --env Tags="@regression and not @ignore"
npm run cypress:run -- --env Tags="@positive"
npm run cypress:run -- --env Tags="@negative"
```

## Writing Tests

1. Create a `.feature` file in `cypress/e2e/features/`
2. Implement step definitions in `cypress/step-definitions/`
3. Create Page Objects in `cypress/pages/` for reusable UI interactions

## Architecture Principles

- **Page Object Model** — UI interactions encapsulated in page classes
- **BDD** — Business-readable scenarios with Gherkin syntax
- **Environment-first** — All config driven by `.env.*` files, zero hardcoded secrets
- **DRY** — Shared logic in BasePage, helpers, and custom commands
- **Data-driven** — Scenario Outlines + fixtures for test data variation
- **Tag-based** — Organize and filter tests by tags (@smoke, @regression, @negative, @positive)
- **Reusable hooks** — Before/After hooks at feature, tag, and scenario level
