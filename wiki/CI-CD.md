# CI/CD

## GitHub Actions

Workflow: `.github/workflows/ci.yml`

**Triggers:** push (main, develop), PR (main), workflow_dispatch, schedule (weekdays 06:00 UTC)

### Pipeline

```
lint → smoke (chrome + firefox) + regression (chrome × 3 parallel) → generate-report → GitHub Pages
```

| Stage | Details |
|-------|---------|
| **lint** | ESLint (0 errors) + Prettier check |
| **smoke** | Matrix: chrome + firefox, `@smoke` tag |
| **regression** | Chrome × 3 parallel (ci:regression:0/1/2), `@regression` tag, continues on error |
| **generate-report** | Consolidates artifacts, generates Allure + Mochawesome, deploys to `gh-pages` |

Key configuration:
- `cypress-io/github-action@v6` with `install: false`
- Cypress binary cached via `actions/cache@v4`
- Artifacts retained for 7-14 days
- `permissions: contents: write` on generate-report job for GitHub Pages deploy

## Jenkins

Pipeline: `Jenkinsfile`

**Parameters:**

| Parameter | Default | Options |
|-----------|---------|---------|
| ENVIRONMENT | `dev` | dev, qa, staging |
| TEST_TAGS | `@regression` | Any tag expression |
| PARALLEL_WORKERS | `1` | 1-4 |
| RUN_LINT | `true` | Toggle lint stage |

**Pipeline:** Setup → Lint (conditional) → Smoke + Regression (parallel) → Generate Reports → Email notification

Jenkins uses:
- NodeJS-20 tool (configured in Global Tools)
- Cypress Dashboard `--record --parallel` when PARALLEL_WORKERS > 1
- Allure CLI plugin for report publishing
- Email notifications with Allure report links
