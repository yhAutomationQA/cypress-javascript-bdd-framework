# Cypress JavaScript BDD Framework

Enterprise-grade Cypress automation framework using Cucumber BDD with JavaScript.

## Tech Stack

- **Cypress** ^13.17 — Test runner
- **Cucumber BDD** (@badeball/cypress-cucumber-preprocessor) ^21.0
- **esbuild** preprocessor (@bahmutov/cypress-esbuild-preprocessor) ^2.2
- **Allure** ^2.32 — Enterprise test reporting
- **Mochawesome** ^7.1 — Standalone HTML reporting
- **dotenv** ^16.4 — Environment variable management
- **ESLint** ^8.57 — Static analysis
- **Prettier** ^3.4 — Code formatting

## Folder Structure

```
├── config/
│   ├── env-manager.js            # Environment configuration loader
│   └── report-config.js          # Centralized reporting configuration
├── cypress/
│   ├── api/                      # API automation framework
│   │   ├── api-client.js         # Reusable CRUD API client with logging
│   │   ├── response-validator.js # Response status, body, header, duration assertions
│   │   └── schema-validator.js   # JSON schema validation engine
│   ├── e2e/
│   │   ├── features/
│   │   │   ├── api/
│   │   │   │   └── posts.feature # Posts CRUD BDD scenarios
│   │   │   └── login.feature     # Login BDD scenarios
│   ├── step-definitions/
│   │   ├── api/
│   │   │   ├── common.steps.js   # Generic reusable API step definitions
│   │   │   └── posts.steps.js    # Post-specific business steps
│   │   └── login.steps.js        # Login step definitions
│   ├── pages/                    # Page Object Models
│   │   ├── BasePage.js
│   │   ├── LoginPage.js
│   │   └── InventoryPage.js
│   ├── fixtures/
│   │   ├── api/
│   │   │   ├── posts.json        # Posts API test data
│   │   │   └── schemas/
│   │   │       └── posts-schema.json
│   │   └── example.json          # UI test data
│   ├── support/
│   │   ├── commands.js           # Custom Cypress commands
│   │   └── e2e.js                # Global hooks, error handling, Allure
│   └── utils/
│       ├── constants.js          # Shared constants
│       └── helpers.js            # Utility functions
├── reports/
│   ├── allure-results/           # Raw Allure data (generated)
│   ├── allure-report/            # Allure HTML report (generated)
│   ├── mochawesome/              # Raw mochawesome JSON (generated)
│   ├── mochawesome-report/       # Merged mochawesome HTML (generated)
│   ├── cucumber-report/          # Cucumber JSON report (generated)
│   ├── screenshots/              # Failure screenshots (generated)
│   ├── videos/                   # Test execution videos (generated)
│   └── logs/                     # Execution logs (generated)
├── .env.dev                      # Development environment config
├── .env.qa                       # QA environment config
├── .env.staging                  # Staging environment config
├── .env.example                  # Environment template (tracked in git)
├── cypress.config.js             # Cypress configuration
└── package.json
```

## Quick Start

```bash
npm install
npm run open          # Launch Cypress Test Runner (default: dev)
npm run test          # Headless execution (default: dev)
```

## Application Under Test

| Application | URL | Test Type |
|-------------|-----|-----------|
| **[SauceDemo](https://www.saucedemo.com)** | UI e-commerce demo app | UI / BDD |
| **[JSONPlaceholder](https://jsonplaceholder.typicode.com)** | Free fake REST API | API / BDD |

## Environment Configuration

| File | ENV value | Command |
|------|-----------|---------|
| `.env.dev` | `dev` | `ENV=dev npm run test` |
| `.env.qa` | `qa` | `ENV=qa npm run test` |
| `.env.staging` | `staging` | `ENV=staging npm run test` |

### Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `BASE_URL` | Yes | Application base URL (SauceDemo) |
| `API_URL` | Yes | API base URL (JSONPlaceholder) |
| `USERNAME` | Yes | Default test user |
| `PASSWORD` | Yes | Default test user password |
| `IMPLICIT_TIMEOUT` | No | Default element wait (ms) |
| `EXPLICIT_TIMEOUT` | No | Explicit wait timeout (ms) |
| `PAGE_LOAD_TIMEOUT` | No | Page load timeout (ms) |

## Reporting

The framework produces three report types. After a test run, generate all reports with:

```bash
npm run report:generate
```

### Allure Report (Primary)

Rich BDD-compatible reporting with test steps, attachments, timings, and trends.

**Prerequisite:** Java 8+ runtime for Allure CLI.

```bash
npm run report:allure:generate    # Generate Allure HTML from raw results
npm run report:allure:open        # Open Allure report in browser
```

### Mochawesome Report (Secondary)

Standalone HTML report with embedded screenshots and charts.

```bash
npm run report:mochawesome:full   # Merge JSON + generate HTML
```

### Consolidated

```bash
npm run report:generate           # Generate Allure + Mochawesome reports
npm run report:open               # Open Allure report
npm run report:clean              # Clean all report artifacts
```

### Report Directory Layout

```
reports/
├── allure-results/          # Raw JSON/XML from test run (input for Allure)
├── allure-report/           # Generated Allure HTML dashboard
│   ├── index.html           # Entry point — open this
│   ├── data/                # Test data, timelines, trends
│   └── widgets/             # Summary widgets
├── mochawesome/             # Per-spec JSON files from test run
├── mochawesome-report/      # Merged HTML report
│   ├── merged.json          # Combined mochawesome JSON
│   └── merged.html          # Standalone HTML report
├── screenshots/             # Failure screenshots (full-page)
├── videos/                  # Test execution videos (WebM/MP4)
└── logs/                    # Test execution logs
```

### What Gets Captured

| Artifact | When | Format |
|----------|------|--------|
| Screenshots | On test failure | PNG (full-page) |
| Videos | Entire test run | WebM/MP4 |
| API logs | Every `cy.request()` | Cypress console + allure steps |
| Console logs | Cypress events | Browser console |

## API Automation Framework

### API Client (`cypress/api/api-client.js`)

| Method | Description |
|--------|-------------|
| `get(path, options)` | GET request with query params |
| `post(path, body, options)` | POST with JSON body |
| `put(path, body, options)` | Full resource update |
| `patch(path, body, options)` | Partial resource update |
| `delete(path, options)` | Resource deletion |
| `send(method, path, options)` | Generic request (any HTTP method) |

All requests are automatically logged to Allure steps and Cypress console.

### Response Validator (`cypress/api/response-validator.js`)

```js
ResponseValidator.from(response)
  .status(200)
  .bodyHasField("id")
  .bodyFieldEquals("title", "foo")
  .headerExists("Content-Type")
  .durationLessThan(3000);
```

### Schema Validator (`cypress/api/schema-validator.js`)

```js
SchemaValidator.assertSchema(data, {
  type: "object",
  required: ["id", "title", "body"],
  properties: {
    id: { type: "integer", minimum: 1 },
    title: { type: "string", minLength: 1 },
    body: { type: "string" },
  },
});
```

### API Scenarios

The `posts.feature` covers 10 scenarios across all CRUD operations, negative tests, and schema validation.

## NPM Scripts

### Test Execution
| Script | Description |
|--------|-------------|
| `test` | Run all tests (respects `ENV` var) |
| `test:dev` | Run in dev environment |
| `test:qa` | Run in QA environment |
| `test:staging` | Run in staging environment |
| `test:chrome` | Run in Chrome |
| `test:firefox` | Run in Firefox |
| `open` | Open Cypress Test Runner |
| `open:dev` / `open:qa` / `open:staging` | Open in specific env |

### Reporting
| Script | Description |
|--------|-------------|
| `report:generate` | Generate Allure + Mochawesome reports |
| `report:open` | Open Allure report in browser |
| `report:allure:generate` | Generate Allure HTML from raw results |
| `report:allure:open` | Open Allure report |
| `report:mochawesome:full` | Merge JSON + generate Mochawesome HTML |
| `report:mochawesome:merge` | Merge mochawesome JSON files |
| `report:mochawesome:generate` | Generate HTML from merged JSON |
| `report:clean` | Clean all report artifacts |

### Code Quality
| Script | Description |
|--------|-------------|
| `lint` | ESLint check |
| `lint:fix` | ESLint auto-fix |
| `format` | Prettier format |
| `format:check` | Prettier check |

## Running with Tags

```bash
# API tests only
npm run cypress:run -- --env Tags="@api"

# Smoke tests only
npm run cypress:run -- --env Tags="@smoke"

# Negative tests
npm run cypress:run -- --env Tags="@negative"

# Full regression with reports
npm run cypress:run && npm run report:generate
```

## Architecture Principles

- **Page Object Model** — UI interactions encapsulated in page classes
- **API Client Pattern** — Reusable CRUD client with automatic logging
- **BDD** — Business-readable scenarios with Gherkin syntax
- **Environment-first** — All config driven by `.env.*` files, zero hardcoded secrets
- **Reporting-first** — Allure + Mochawesome with screenshots, videos, and logs
- **DRY** — Shared validation utilities across UI and API tests
- **Data-driven** — Scenario Outlines, fixtures, and schemas for test data variation
- **Tag-based** — Organize and filter tests by layer, type, and priority
- **Reusable hooks** — Before/After hooks at feature, tag, and scenario level
