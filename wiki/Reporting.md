# Reporting

The framework produces two report types. Generate all reports with:

```bash
npm run report:generate
```

## Allure Report

Rich BDD-compatible dashboard with steps, attachments, timelines, and trends. Requires **Java 8+**.

```bash
npm run report:allure:generate    # Generate HTML from raw results
npm run report:allure:open        # Open in browser
```

## Mochawesome Report

Standalone HTML report with embedded screenshots and charts — no server needed.

```bash
npm run report:mochawesome:full   # Merge JSON → generate HTML
```

## Report Artifacts

| Artifact | When | Format |
|----------|------|--------|
| Screenshots | On test failure (with retry) | PNG (full-page) |
| Videos | Entire test run | MP4 |
| API logs | Every `cy.request()` | Allure steps + Cypress console |
| Console logs | Cypress events | Browser console |

## Directory Layout

```
reports/
├── allure-results/          # Raw data (input for Allure generator)
├── allure-report/           # Generated Allure HTML dashboard
│   └── index.html           # Entry point
├── mochawesome/             # Per-spec JSON files from test run
├── mochawesome-report/      # Merged HTML report
│   ├── merged.json          # Combined mochawesome JSON
│   └── merged.html          # Standalone HTML report
├── screenshots/             # Failure screenshots
├── videos/                  # Test recordings
└── logs/                    # Execution logs
```

## Clean Reports

```bash
npm run report:clean
```
