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
│   └── env-manager.js            # Environment configuration loader
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
│   │   │       └── posts-schema.json # Post, comment JSON schemas
│   │   └── example.json          # UI test data
│   ├── support/
│   │   ├── commands.js           # Custom Cypress commands
│   │   └── e2e.js                # Global hooks, error handling
│   └── utils/
│       ├── constants.js          # Shared constants
│       └── helpers.js            # Utility functions
├── reports/                      # Screenshots, videos, HTML
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

This framework targets two applications:

| Application | URL | Test Type |
|-------------|-----|-----------|
| **[SauceDemo](https://www.saucedemo.com)** | UI e-commerce demo app | UI / BDD |
| **[JSONPlaceholder](https://jsonplaceholder.typicode.com)** | Free fake REST API | API / BDD |

## Environment Configuration

The framework supports multi-environment execution via `.env.*` files.

### Available Environments

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

## API Automation Framework

### API Client (`cypress/api/api-client.js`)

Reusable CRUD client wrapping `cy.request()`:

| Method | Description |
|--------|-------------|
| `get(path, options)` | GET request with query params |
| `post(path, body, options)` | POST with JSON body |
| `put(path, body, options)` | Full resource update |
| `patch(path, body, options)` | Partial resource update |
| `delete(path, options)` | Resource deletion |
| `send(method, path, options)` | Generic request (any HTTP method) |

Every request is automatically logged with method, URL, status, duration, and truncated body.

### Response Validator (`cypress/api/response-validator.js`)

Chained assertion builder:

```js
ResponseValidator.from(response)
  .status(200)
  .bodyHasField("id")
  .bodyFieldEquals("title", "foo")
  .headerExists("Content-Type")
  .durationLessThan(3000);
```

### Schema Validator (`cypress/api/schema-validator.js`)

Lightweight schema validation without external dependencies:

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

The `posts.feature` covers 10 scenarios:

| Scenario | Coverage |
|----------|----------|
| GET all posts | 200, array, required fields per item |
| GET post by ID | 200, correct object, schema validated |
| GET comments | 200, array, valid email pattern |
| POST new post | 201, returned ID, field assertions |
| PUT update post | 200, updated fields verified |
| PATCH partial update | 200, only patched fields changed |
| DELETE post | 200, success |
| GET non-existent | 404, negative test |
| POST empty body | 201, graceful handling |
| Response headers | Content-Type present, duration check |

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
# API tests only
npm run cypress:run -- --env Tags="@api"

# Smoke tests only
npm run cypress:run -- --env Tags="@smoke"

# API + login smoke
npm run cypress:run -- --env Tags="@api or @smoke"

# Negative tests
npm run cypress:run -- --env Tags="@negative"
```

## Architecture Principles

- **Page Object Model** — UI interactions encapsulated in page classes
- **API Client Pattern** — Reusable CRUD client with automatic logging
- **BDD** — Business-readable scenarios with Gherkin syntax
- **Environment-first** — All config driven by `.env.*` files, zero hardcoded secrets
- **DRY** — Shared validation utilities across UI and API tests
- **Data-driven** — Scenario Outlines, fixtures, and schemas for test data variation
- **Tag-based** — Organize and filter tests by layer, type, and priority
- **Reusable hooks** — Before/After hooks at feature, tag, and scenario level
