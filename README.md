# Cypress JavaScript BDD Framework

Enterprise-grade Cypress automation framework using Cucumber BDD with JavaScript.

## Tech Stack

- **Cypress** ^13.17 — Test runner
- **Cucumber BDD** (@badeball/cypress-cucumber-preprocessor) ^21.0
- **esbuild** preprocessor (@bahmutov/cypress-esbuild-preprocessor) ^2.2
- **ESLint** ^8.57 — Static analysis
- **Prettier** ^3.4 — Code formatting

## Folder Structure

```
├── cypress/
│   ├── e2e/
│   │   └── features/         # Gherkin .feature files
│   ├── step-definitions/     # Cucumber step definitions
│   ├── pages/                # Page Object Models
│   ├── fixtures/             # Test data (JSON)
│   ├── support/              # Custom commands & setup
│   │   ├── commands.js
│   │   └── e2e.js
│   └── utils/                # Helpers & constants
├── reports/                  # Screenshots, videos, HTML
├── cypress.config.js         # Cypress configuration
└── package.json
```

## Quick Start

```bash
npm install
npm run cypress:open        # Launch Cypress Test Runner
npm run cypress:run          # Headless execution
```

## NPM Scripts

| Script | Description |
|--------|-------------|
| `cypress:open` | Open Cypress Test Runner |
| `cypress:run` | Run all tests headlessly |
| `cypress:run:chrome` | Run in Chrome |
| `cypress:run:firefox` | Run in Firefox |
| `cypress:run:headless` | Run headless mode |
| `cypress:run:tag` | Run by tag: `npm run cypress:run:tag -- Tags="@smoke"` |
| `cypress:run:spec` | Run specific file |
| `lint` | ESLint check |
| `lint:fix` | ESLint auto-fix |
| `format` | Prettier format |
| `format:check` | Prettier check |

## Running with Tags

```bash
npm run cypress:run -- --env Tags="@smoke"
npm run cypress:run -- --env Tags="@regression and not @ignore"
```

## Writing Tests

1. Create a `.feature` file in `cypress/e2e/features/`
2. Implement step definitions in `cypress/step-definitions/`
3. Create Page Objects in `cypress/pages/` for reusable UI interactions

## Architecture Principles

- **Page Object Model** — UI interactions encapsulated in page classes
- **BDD** — Business-readable scenarios with Gherkin syntax
- **DRY** — Shared logic in BasePage, helpers, and custom commands
- **Data-driven** — Scenario Outlines + fixtures for test data variation
- **Tag-based** — Organize and filter tests by tags (@smoke, @regression, @negative)
