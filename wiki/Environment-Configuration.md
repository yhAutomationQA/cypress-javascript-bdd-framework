# Environment Configuration

## How It Works

The framework uses `dotenv` with environment-specific `.env.*` files loaded by `config/env-manager.js`.

The `ENV` environment variable determines which file is loaded:

| File | ENV value | Command |
|------|-----------|---------|
| `.env.dev` | `dev` | `ENV=dev npm run test` (default) |
| `.env.qa` | `qa` | `ENV=qa npm run test` |
| `.env.staging` | `staging` | `ENV=staging npm run test` |

`.env.example` is tracked in git as a template. Actual `.env.*` files are gitignored. When a `.env.*` file is missing, the framework falls back to `.env.example`.

## Environment Variables

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `BASE_URL` | Yes | `https://www.saucedemo.com` | Application base URL |
| `API_URL` | Yes | `https://jsonplaceholder.typicode.com` | API base URL |
| `USERNAME` | Yes | `standard_user` | Default test user |
| `PASSWORD` | Yes | `secret_sauce` | Default test user password |
| `IMPLICIT_TIMEOUT` | No | `10000` | Default wait (ms) |
| `EXPLICIT_TIMEOUT` | No | `15000` | Explicit wait (ms) |
| `PAGE_LOAD_TIMEOUT` | No | `30000` | Page load timeout (ms) |

## CI Environments

In CI (GitHub Actions / Jenkins), environment variables come from secrets or the CI environment — not from `.env.*` files. The `env-manager.js` reads from `process.env` directly, so secrets set in the CI environment take precedence.
