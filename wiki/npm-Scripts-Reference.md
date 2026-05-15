# npm Scripts Reference

## Test Execution

| Script | Description |
|--------|-------------|
| `test` | Run all tests (respects `ENV` var) |
| `test:dev` | Dev environment |
| `test:qa` | QA environment |
| `test:staging` | Staging environment |
| `test:chrome` | Chrome browser |
| `test:firefox` | Firefox browser |
| `test:record` | Run with Cypress Dashboard recording |
| `open` | Launch Cypress Test Runner |
| `open:dev` / `open:qa` / `open:staging` | Open in specific env |

## CI Scripts

| Script | Description |
|--------|-------------|
| `ci:lint` | ESLint + Prettier check |
| `ci:smoke` | `@smoke` tests in Chrome |
| `ci:regression` | `@regression` tests in Chrome |
| `ci:regression:0` | Login feature (parallel split) |
| `ci:regression:1` | API features (parallel split) |
| `ci:regression:2` | All other features (parallel split) |
| `ci:all` | All features in Chrome |

## Reporting

| Script | Description |
|--------|-------------|
| `report:generate` | Allure + Mochawesome |
| `report:open` | Open Allure report |
| `report:allure:generate` | Allure HTML from raw data |
| `report:allure:open` | Open Allure |
| `report:mochawesome:full` | Merge JSON + generate HTML |
| `report:mochawesome:merge` | Merge mochawesome JSON |
| `report:mochawesome:generate` | HTML from merged JSON |
| `report:clean` | Clean all report artifacts |

## Docker

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

## Code Quality

| Script | Description |
|--------|-------------|
| `lint` | ESLint check |
| `lint:fix` | ESLint auto-fix |
| `format` | Prettier write |
| `format:check` | Prettier check |

## Utility

| Script | Description |
|--------|-------------|
| `precommit` | `npm run lint:fix && npm run format` |
| `clean:reports` | Alias for `report:clean` |
