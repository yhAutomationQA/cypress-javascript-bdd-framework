# Project Structure

```
├── config/
│   ├── env-manager.js            # Loads .env.{ENV}, validates, exposes helpers
│   └── report-config.js          # Allure + Mochawesome + Cypress report settings
├── cypress/
│   ├── api/                      # API automation framework
│   │   ├── api-client.js         # CRUD client with auto-logging
│   │   ├── response-validator.js # Chained assertions (status, body, headers, duration)
│   │   └── schema-validator.js   # JSON schema validator (12 constraint types)
│   ├── e2e/
│   │   └── features/
│   │       ├── api/
│   │       │   └── posts.feature # 10 API CRUD scenarios
│   │       └── login.feature     # 7 UI login scenarios
│   ├── step-definitions/
│   │   ├── api/
│   │   │   ├── common.steps.js   # Generic API step definitions
│   │   │   └── posts.steps.js    # Post-specific business steps
│   │   └── login.steps.js        # Login page steps
│   ├── pages/
│   │   ├── BasePage.js           # Base class for all page objects
│   │   ├── LoginPage.js          # SauceDemo login form
│   │   └── InventoryPage.js      # SauceDemo inventory page
│   ├── fixtures/                 # Test data (JSON)
│   ├── support/
│   │   ├── commands.js           # Custom Cypress commands
│   │   └── e2e.js                # Global hooks, error handling, Allure
│   └── utils/
│       ├── constants.js          # Shared constants
│       └── helpers.js            # Utility functions
├── .github/workflows/
│   └── ci.yml                    # GitHub Actions CI pipeline
├── Dockerfile                    # Multi-stage Docker image
├── docker-compose.yml            # Container orchestration
├── Jenkinsfile                   # Jenkins declarative pipeline
├── cypress.config.js             # Cypress configuration
├── .eslintrc.json                # ESLint rules
├── .prettierrc                   # Prettier config
└── package.json                  # Scripts + dependencies
```
