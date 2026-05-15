# Cypress JavaScript BDD Framework

Enterprise-grade Cypress automation framework using Cucumber BDD with JavaScript. Supports UI and API testing with Allure + Mochawesome reporting, Docker execution, GitHub Actions and Jenkins CI/CD.

## Tech Stack

| Tool | Version | Purpose |
|------|---------|---------|
| **Cypress** | ^13.17 | Test runner |
| **Cucumber BDD** | ^21.0 | Gherkin feature files (`@badeball/cypress-cucumber-preprocessor`) |
| **esbuild** | ^0.25 | JavaScript bundler (`@bahmutov/cypress-esbuild-preprocessor`) |
| **Allure** | ^2.32 | Enterprise test reporting with trends, timelines, and steps |
| **Mochawesome** | ^7.1 | Standalone HTML report with embedded screenshots |
| **dotenv** | ^16.4 | Environment variable management |
| **ESLint** | ^8.57 | Static analysis (curly braces, no unsafe chaining, no async tests) |
| **Prettier** | ^3.4 | Code formatting (JS, JSON, and `.feature` files via `prettier-plugin-gherkin`) |
| **Docker** | — | Containerized execution with `cypress/base:20` |

## Project Structure

```
├── config/
│   ├── env-manager.js            # Singleton — loads .env.{ENV}, validates, exposes helpers
│   └── report-config.js          # Centralized Allure + Mochawesome + Cypress report settings
├── cypress/
│   ├── api/                      # API automation framework
│   │   ├── api-client.js         # CRUD client (get/post/put/patch/delete/send) with auto-logging
│   │   ├── response-validator.js # 25+ chained assertions: status, body, headers, duration
│   │   └── schema-validator.js   # Zero-dependency JSON schema validator (12 constraint types)
│   ├── e2e/
│   │   └── features/
│   │       ├── api/
│   │       │   └── posts.feature # 10 scenarios: CRUD + negative + schema for JSONPlaceholder
│   │       └── login.feature     # 7 scenarios: login, logout, locked-out, empty credentials
│   ├── step-definitions/
│   │   ├── api/
│   │   │   ├── common.steps.js   # Generic steps: send request, assert status/body/headers/duration
│   │   │   └── posts.steps.js    # Post-specific business steps: field checks, schema validation
│   │   └── login.steps.js        # Login page steps: visit, login, assert error, assert redirect
│   ├── pages/                    # Page Object Models
│   │   ├── BasePage.js           # Shared selectors: waitForPageReady, typeText, clickElement, etc.
│   │   ├── LoginPage.js          # SauceDemo login form: enterUsername, enterPassword, login, etc.
│   │   └── InventoryPage.js      # SauceDemo inventory: getInventoryCount, clickLogout, etc.
│   ├── fixtures/                 # Test data (JSON)
│   │   ├── api/
│   │   │   ├── posts.json        # Sample post objects for API tests
│   │   │   └── schemas/
│   │   │       └── posts-schema.json  # JSON schema definitions for post validation
│   │   └── example.json          # UI test data examples
│   ├── support/
│   │   ├── commands.js           # Custom Cypress commands (loginByUi, loginByApi, getBySel, etc.)
│   │   └── e2e.js                # Global hooks: error handling, screenshot on failure, Allure steps
│   └── utils/
│       ├── constants.js          # Shared constants and enums
│       └── helpers.js            # Utility functions (date formatting, data generators)
├── reports/                      # Generated test artifacts (gitignored)
│   ├── allure-results/           # Raw Allure data (JSON/XML)
│   ├── allure-report/            # Allure HTML dashboard
│   ├── mochawesome/              # Per-spec Mochawesome JSON
│   ├── mochawesome-report/       # Merged Mochawesome HTML
│   ├── cucumber-report/          # Cucumber JSON report
│   ├── screenshots/              # Failure screenshots (full-page PNG)
│   ├── videos/                   # Test execution recordings (MP4)
│   └── logs/                     # Execution logs
├── .github/workflows/
│   └── ci.yml                    # GitHub Actions: lint → smoke (chrome+firefox) + regression (×3 parallel) → report → Pages
├── Dockerfile                    # Multi-stage: base (cypress/base:20) → dependencies → production
├── docker-compose.yml            # 6 volume mounts, ipc:host, init:true, seccomp:unconfined
├── Jenkinsfile                   # Declarative pipeline: parameters, parallel smoke+regression, Allure publish, email
├── cypress.config.js             # Cypress configuration: Cucumber, esbuild, Allure writer, Mochawesome reporter
├── .eslintrc.json                # ESLint rules: curly, no-unsafe-chain, no-async-tests, no-console warn
├── .prettierrc                   # Prettier config with gherkin plugin for .feature files
├── .env.dev / .env.qa / .env.staging / .env.example
├── .gitignore
├── .dockerignore
└── package.json                  # All scripts, dependencies, cypress-cucumber-preprocessor config
```

## Prerequisites

- **Node.js 20+**
- **npm 10+**
- **Java 8+** (for Allure report generation)
- **Docker Desktop 4.x+** (optional, for containerized runs)

## Quick Start

```bash
# Install dependencies
npm install

# Open Cypress Test Runner (dev environment)
npm run open

# Headless execution (dev environment)
npm run test

# Specific environment
npm run test:qa
npm run test:staging

# Run with tags
npm run cypress:run -- --env Tags="@smoke"
npm run cypress:run -- --env Tags="@api"
```

## Application Under Test

| Application | URL | Type |
|-------------|-----|------|
| **SauceDemo** | https://www.saucedemo.com | UI e-commerce demo app |
| **JSONPlaceholder** | https://jsonplaceholder.typicode.com | Free fake REST API |

## Test Scenarios

### SauceDemo Login (`login.feature`) — 7 scenarios

| Scenario | Tags | Description |
|----------|------|-------------|
| Successful login with standard user | `@smoke @positive` | Valid credentials → redirect to inventory |
| Login with locked out user | `@smoke @negative` | Locked user → error message, stays on login page |
| Login with invalid credentials | `@negative` | Invalid user/pass → error message, stays on login |
| Login with empty credentials (×3) | `@negative` | Data-driven: missing user, missing pass, both missing |
| Successful logout after login | `@positive` | Login → logout → redirect to login page |

### JSONPlaceholder API (`posts.feature`) — 10 scenarios

| Scenario | Tags | What it validates |
|----------|------|-------------------|
| GET all posts | `@api @smoke` | Array response, 200 status, minimum length, field presence |
| GET single post by ID | `@api` | Correct ID, title, body, userId returned |
| GET comments for a post | `@api` | Array of comments, email format, postId match |
| POST creates a new post | `@api` | 201 status, returned ID, echoed body fields |
| PUT updates an existing post | `@api` | 200 status, updated fields match |
| PATCH partially updates a post | `@api` | 200 status, only patched field changed |
| DELETE removes a post | `@api` | 200 status |
| GET non-existent post | `@api @negative` | 404 status |
| POST with empty body | `@api @negative` | 400 or 201, graceful handling |
| Response headers | `@api` | Content-Type header present |

## Environment Configuration

The framework uses `dotenv` with environment-specific `.env.*` files loaded by `config/env-manager.js`.

| File | `ENV` value | Load command |
|------|-------------|--------------|
| `.env.dev` | `dev` | `ENV=dev npm run test` (default) |
| `.env.qa` | `qa` | `ENV=qa npm run test` |
| `.env.staging` | `staging` | `ENV=staging npm run test` |

`.env.example` is tracked in git as a template. Actual `.env.*` files are gitignored. When a `.env.*` file is missing, `env-manager.js` falls back to `.env.example`.

### Environment Variables

| Variable | Required | Default (from `.env.example`) | Description |
|----------|----------|-------------------------------|-------------|
| `BASE_URL` | Yes | `https://www.saucedemo.com` | Application base URL |
| `API_URL` | Yes | `https://jsonplaceholder.typicode.com` | API base URL |
| `USERNAME` | Yes | `standard_user` | Default test user |
| `PASSWORD` | Yes | `secret_sauce` | Default test user password |
| `IMPLICIT_TIMEOUT` | No | `10000` | Default implicit wait (ms) |
| `EXPLICIT_TIMEOUT` | No | `15000` | Explicit wait timeout (ms) |
| `PAGE_LOAD_TIMEOUT` | No | `30000` | Page load timeout (ms) |

In CI, environment variables come from GitHub Actions secrets / Jenkins credentials rather than `.env.*` files.

## API Automation Framework

### ApiClient (`cypress/api/api-client.js`)

Reusable CRUD client that auto-logs every request/response to Allure and Cypress console.

| Method | Description |
|--------|-------------|
| `get(path, options)` | GET with query params support |
| `post(path, body, options)` | POST with JSON body |
| `put(path, body, options)` | Full resource update |
| `patch(path, body, options)` | Partial resource update |
| `delete(path, options)` | Resource deletion |
| `send(method, path, options)` | Generic request (any HTTP method) |

All methods return Cypress chainables (via `cy.wrap()`), supporting `.then()` chaining in step definitions. Negative tests pass `{ failOnStatusCode: false }` to handle 4xx responses without Cypress auto-failure.

### ResponseValidator (`cypress/api/response-validator.js`)

Chained assertion engine — 25+ methods including:

```js
ResponseValidator.from(response)
  .status(200)
  .bodyHasField("id")
  .bodyFieldEquals("title", "expected title")
  .bodyIsArray()
  .bodyArrayMinLength(1)
  .headerExists("Content-Type")
  .durationLessThan(3000);
```

### SchemaValidator (`cypress/api/schema-validator.js`)

Zero-dependency JSON schema validator supporting 12 constraint types: `type`, `required`, `properties`, `items`, `minLength`, `maxLength`, `minimum`, `maximum`, `enum`, `pattern`, `additionalProperties`, `array` item validation.

```js
SchemaValidator.assertSchema(data, {
  type: "object",
  required: ["id", "title", "body"],
  properties: {
    id: { type: "integer", minimum: 1 },
    title: { type: "string", minLength: 1 },
  },
});
```

## Reporting

Three report types. Generate all after a test run:

```bash
npm run report:generate
```

### Allure Report (Primary)

Rich BDD-compatible dashboard with steps, attachments, timelines, trends, and history.

```bash
npm run report:allure:generate    # Generate HTML from raw results
npm run report:allure:open        # Open in browser
```

### Mochawesome Report (Secondary)

Standalone HTML with embedded screenshots and charts — no server needed.

```bash
npm run report:mochawesome:full   # Merge per-spec JSON → generate HTML
```

### What Gets Captured

| Artifact | When | Format |
|----------|------|--------|
| Screenshots | On test failure (with retry) | PNG (full-page) |
| Videos | Entire test run | MP4 |
| API logs | Every `cy.request()` | Allure steps + Cypress console |
| Console logs | Cypress events | Browser console |

### Key Reporting Config (`config/report-config.js`)

- Allure: `resultsDir: "reports/allure-results"`, clean before run via `pretest` script
- Mochawesome: per-spec JSON → merged → HTML via `mochawesome-merge` + `marge`
- `@shelex/cypress-allure-plugin/writer` is imported from the writer-only path (not the main entry) to avoid `Cypress.Commands.add` crash during config load

## CI/CD

### GitHub Actions (`.github/workflows/ci.yml`)

```yaml
Triggers: push (main/develop), PR (main), workflow_dispatch, schedule (weekdays 06:00)
```

**Pipeline stages:**

| Stage | Details |
|-------|---------|
| **lint** | ESLint (0 errors) + Prettier check (JS, JSON, `.feature` files) |
| **smoke** | Matrix: chrome + firefox, `@smoke` tag, 15min timeout |
| **regression** | Chrome × 3 parallel (`ci:regression:0/1/2`), `@regression` tag, 30min timeout |
| **generate-report** | Consolidates artifacts from all parallel runs, generates Allure + Mochawesome, deploys to GitHub Pages (`gh-pages` branch) |

**Key details:**
- `cypress-io/github-action@v6` with `install: false` (uses `npm ci` from separate step)
- Cypress binary cached via `actions/cache@v4`
- Artifacts: screenshots, videos, allure-results, mochawesome JSON (7-day retention)
- `continue-on-error: true` on regression so report stage runs even on test failures
- `permissions: contents: write` on `generate-report` job for `peaceiris/actions-gh-pages@v3`

### Jenkins (Jenkinsfile)

Declarative pipeline with parameters and parallel execution:

| Parameter | Default | Options |
|-----------|---------|---------|
| `ENVIRONMENT` | `dev` | dev, qa, staging |
| `TEST_TAGS` | `@regression` | any Cucumber tag expression |
| `PARALLEL_WORKERS` | `1` | 1-4 |
| `RUN_LINT` | `true` | toggle lint stage |

**Pipeline:** Setup → Lint (conditional) → Smoke + Regression (parallel) → Generate Reports → Email notification (success/failure with Allure link).

### GitHub Actions + Jenkins differences

| Aspect | GitHub Actions | Jenkins |
|--------|---------------|---------|
| Runner | `ubuntu-latest` | Jenkins agent (`cypress-executor`) |
| Parallelism | Matrix strategies (smoke: 2 browsers, regression: 3 splits) | Declarative parallel stages |
| Lint | Separate job (blocking) | Optional stage (parameter toggle) |
| Reports | Generated in `generate-report` job, deployed to Pages | Generated in stage, published via Allure plugin |
| Notifications | — | Email with Allure report link |
| Cypress Dashboard | — | `--record` with `--parallel` when `PARALLEL_WORKERS > 1` |

## Docker Execution

Run tests with zero local setup (no Node, no Cypress binary needed).

### Build

```bash
npm run docker:build
```

### Run

```bash
# All tests (default: dev)
npm run docker:test

# Specific environment
npm run docker:test:qa
npm run docker:test:staging

# By tag
npm run docker:smoke      # @smoke
npm run docker:regression  # @regression
npm run docker:api         # @api

# Interactive shell
npm run docker:bash
```

### Architecture

`Dockerfile`: multi-stage build

| Stage | Base | Content |
|-------|------|---------|
| `base` | `cypress/base:20` | Node 20 + system deps (no Cypress) |
| `dependencies` | `base` | `npm ci` + `cypress verify` (cached layer) |
| `production` | `dependencies` | Source code + report directories |

`docker-compose.yml`: 6 volume mounts for report persistence, `ipc: host`, `init: true`, `seccomp: unconfined`.

## Code Quality

### ESLint Rules (`.eslintrc.json`)

| Rule | Enforcement |
|------|-------------|
| `curly` | **error** — braces required after all `if`/`else` (no single-line) |
| `cypress/unsafe-to-chain-command` | **error** — no `.clear().type()`, split into separate `cy.get()` calls |
| `cypress/no-async-tests` | **error** — no async test functions |
| `no-console` | **warn** — intentional warnings for `cy.log()` in hooks |
| `no-debugger` | **error** — no debugger statements |
| `prefer-const` | **error** — `let` only when reassigning |
| `eqeqeq` | **error** — always use `===` |
| `no-unused-vars` | **warn** — `_` prefix args ignored |

### Prettier (`.prettierrc`)

Formats `.js`, `.json`, and `.feature` files (via `prettier-plugin-gherkin` with `gherkin` parser override).

```bash
npm run lint          # ESLint check
npm run lint:fix      # ESLint auto-fix
npm run format        # Prettier write
npm run format:check  # Prettier check (CI)
```

## NPM Scripts Reference

### Test Execution

| Script | Description |
|--------|-------------|
| `test` | Run all tests (respects `ENV` var) |
| `test:dev` | Dev environment |
| `test:qa` | QA environment |
| `test:staging` | Staging environment |
| `test:chrome` | Chrome browser |
| `test:firefox` | Firefox browser |
| `open` | Launch Cypress Test Runner |
| `open:dev` / `open:qa` / `open:staging` | Open in specific env |

### CI Scripts

| Script | Description |
|--------|-------------|
| `ci:lint` | ESLint + Prettier check |
| `ci:smoke` | `@smoke` tagged tests in Chrome |
| `ci:regression` | `@regression` tagged tests in Chrome |
| `ci:regression:0` | Login feature only (parallel split) |
| `ci:regression:1` | API features only (parallel split) |
| `ci:regression:2` | All remaining features (parallel split) |
| `ci:all` | All features in Chrome |

### Reporting

| Script | Description |
|--------|-------------|
| `report:generate` | Allure + Mochawesome |
| `report:open` | Open Allure report |
| `report:allure:generate` | Allure HTML from raw data |
| `report:allure:open` | Open Allure |
| `report:mochawesome:full` | Merge JSON + generate HTML |
| `report:mochawesome:merge` | Merge mochawesome JSON files |
| `report:mochawesome:generate` | HTML from merged JSON |
| `report:clean` | Clean all report artifacts |

### Docker

| Script | Description |
|--------|-------------|
| `docker:build` | Build with `--pull` |
| `docker:test` | All tests |
| `docker:test:dev` | Dev environment |
| `docker:test:qa` | QA environment |
| `docker:test:staging` | Staging environment |
| `docker:smoke` | `@smoke` tag |
| `docker:regression` | `@regression` tag |
| `docker:api` | `@api` tag |
| `docker:bash` | Interactive shell |

### Code Quality

| Script | Description |
|--------|-------------|
| `lint` | ESLint check |
| `lint:fix` | ESLint auto-fix |
| `format` | Prettier write |
| `format:check` | Prettier check |

## Running with Tags

```bash
# API tests only
npm run cypress:run -- --env Tags="@api"

# Smoke tests (fast feedback)
npm run cypress:run -- --env Tags="@smoke"

# Negative tests
npm run cypress:run -- --env Tags="@negative"

# Positive tests
npm run cypress:run -- --env Tags="@positive"

# Combined tags (AND)
npm run cypress:run -- --env Tags="@smoke and @positive"

# Exclude tags (default: not @ignore)
npm run cypress:run -- --env Tags="not @negative"

# Full regression with reports
npm run cypress:run && npm run report:generate
```

## Architecture Principles

- **Page Object Model** — UI interactions encapsulated in page classes extending `BasePage`
- **API Client Pattern** — Reusable CRUD client with automatic Allure logging
- **BDD** — Business-readable Gherkin scenarios, tags for organization
- **Environment-first** — All config driven by `ENV` var and `.env.*` files, zero hardcoded secrets
- **Reporting-first** — Allure + Mochawesome with screenshots, videos, and API logs for every test
- **DRY** — Shared `ResponseValidator` and `SchemaValidator` across all API step definitions
- **Data-driven** — Scenario Outlines, fixtures, and JSON schemas for test data variation
- **Tag-based** — Organize and filter tests by layer (`@api`, `@ui`), type (`@smoke`, `@regression`), and intent (`@positive`, `@negative`)
- **No hardcoded waits** — Built-in Cypress retry-ability (`.should()`, timeouts) instead of `cy.wait()`
- **Cypress-native chaining** — Async commands use `cy.wrap()` for proper chain continuation, never Promise `.catch()` on Cypress chains
