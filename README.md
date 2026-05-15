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
ENV=staging npm run test:staging

# Open Cypress Runner for an environment
ENV=qa npm run open
npm run open:qa
```

### Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `BASE_URL` | Yes | Application base URL |
| `API_URL` | Yes | API base URL |
| `USERNAME` | Yes | Default test user email |
| `PASSWORD` | Yes | Default test user password |
| `API_KEY` | No | API key for authenticated requests |
| `IMPLICIT_TIMEOUT` | No | Default element wait (ms) |
| `EXPLICIT_TIMEOUT` | No | Explicit wait timeout (ms) |
| `PAGE_LOAD_TIMEOUT` | No | Page load timeout (ms) |

### Env-Manager API

The `config/env-manager.js` provides runtime helpers accessible in tests:

```js
// Access via Cypress.env (available in all tests)
Cypress.env("BASE_URL")         // "https://qa.example.com"
Cypress.env("API_URL")          // "https://api.qa.example.com"
Cypress.env("USERNAME")         // "qa-user@example.com"
Cypress.env("PASSWORD")         // "qa-pass-456"
Cypress.env("ENV")              // "qa"

// Access via helpers.js
Helpers.getBaseUrl()            // Current env baseUrl
Helpers.getApiUrl()             // Current env apiUrl
Helpers.getCredentials()        // { username, password }
Helpers.getTimeout("explicit")  // Current env explicit timeout
```

### Adding a New Environment

1. Create `.env.<name>` with required variables
2. Run with `ENV=<name> npm run test`
3. Optionally add an npm script: `"test:<name>": "ENV=<name> cypress run"`

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
| `cypress:run:spec` | Run specific file |
| `lint` | ESLint check |
| `lint:fix` | ESLint auto-fix |
| `format` | Prettier format |
| `format:check` | Prettier check |

## Running with Tags

```bash
npm run cypress:run -- --env Tags="@smoke"
ENV=qa npm run cypress:run -- --env Tags="@regression and not @ignore"
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
- **Tag-based** — Organize and filter tests by tags (@smoke, @regression, @negative)
