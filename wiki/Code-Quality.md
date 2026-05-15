# Code Quality

## ESLint

Configuration in `.eslintrc.json`.

### Rules

| Rule | Level | Description |
|------|-------|-------------|
| `curly` | error | Braces required after all `if`/`else` |
| `cypress/unsafe-to-chain-command` | error | No chaining `.clear().type()` — use separate `cy.get()` calls |
| `cypress/no-async-tests` | error | No async test functions |
| `no-console` | warn | Allowed for `cy.log()` in hooks |
| `no-debugger` | error | No debugger statements |
| `prefer-const` | error | Use `const` unless reassigning |
| `eqeqeq` | error | Always use `===` |
| `no-unused-vars` | warn | Underscore-prefixed args ignored |

### Run

```bash
npm run lint          # Check
npm run lint:fix      # Auto-fix
```

## Prettier

Configuration in `.prettierrc`.

- Formats `.js`, `.json`, and `.feature` files
- Uses `prettier-plugin-gherkin` with `gherkin` parser for feature files
- `singleQuote: false`, `trailingComma: es5`, `printWidth: 80`

### Run

```bash
npm run format         # Write changes
npm run format:check   # Check only (CI)
```
