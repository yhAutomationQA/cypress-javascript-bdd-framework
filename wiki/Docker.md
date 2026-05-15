# Docker

Run tests with zero local setup — no Node.js or Cypress binary needed.

## Build

```bash
npm run docker:build
```

## Run Tests

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

## Architecture

### Dockerfile

Multi-stage build using `cypress/base:20`:

| Stage | Base | Content |
|-------|------|---------|
| `base` | `cypress/base:20` | Node 20 + system deps |
| `dependencies` | `base` | `npm ci` + `cypress verify` (cached) |
| `production` | `dependencies` | Source code + report dirs |

### docker-compose.yml

Six volume mounts for report persistence:

| Host | Container | Purpose |
|------|-----------|---------|
| `reports/screenshots/` | `/app/reports/screenshots/` | Screenshots |
| `reports/videos/` | `/app/reports/videos/` | Videos |
| `reports/allure-results/` | `/app/reports/allure-results/` | Allure data |
| `reports/mochawesome/` | `/app/reports/mochawesome/` | Mochawesome JSON |
| `reports/cucumber-report/` | `/app/reports/cucumber-report/` | Cucumber JSON |
| `reports/logs/` | `/app/reports/logs/` | Logs |

### Performance Optimizations

- `CI=1` disables Cypress GUI overhead
- `ipc: host` and `init: true` for stable process handling
- `--prefer-offline` npm flag for faster installs
- `.dockerignore` excludes 90% of build context
