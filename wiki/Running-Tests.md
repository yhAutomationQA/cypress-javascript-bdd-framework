# Running Tests

## By Environment

```bash
npm run test          # Default (dev)
npm run test:dev      # Dev environment
npm run test:qa       # QA environment
npm run test:staging  # Staging environment
```

## By Browser

```bash
npm run test:chrome   # Chrome (default)
npm run test:firefox  # Firefox
```

## By Tag

```bash
# Smoke tests only
npm run cypress:run -- --env Tags="@smoke"

# API tests only
npm run cypress:run -- --env Tags="@api"

# Negative tests only
npm run cypress:run -- --env Tags="@negative"

# Positive tests only
npm run cypress:run -- --env Tags="@positive"

# Combined (AND)
npm run cypress:run -- --env Tags="@smoke and @positive"

# Exclude tags
npm run cypress:run -- --env Tags="not @negative"
```

## Open Cypress Test Runner

```bash
npm run open          # Dev environment
npm run open:dev
npm run open:qa
npm run open:staging
```

## CI Scripts

```bash
npm run ci:lint             # ESLint + Prettier check
npm run ci:smoke            # @smoke in Chrome
npm run ci:regression       # @regression in Chrome
npm run ci:regression:0     # Login feature only (parallel)
npm run ci:regression:1     # API features only (parallel)
npm run ci:regression:2     # All remaining (parallel)
npm run ci:all              # All features in Chrome
```
