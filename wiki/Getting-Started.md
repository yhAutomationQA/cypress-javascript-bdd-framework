# Getting Started

## Prerequisites

- **Node.js 20+**
- **npm 10+**
- **Java 8+** (for Allure report generation)
- **Docker Desktop 4.x+** (optional, for containerized runs)

## Installation

```bash
git clone <repo-url>
cd cypress-javascript-bdd-framework
npm install
```

## First Run

```bash
# Open Cypress Test Runner (dev environment)
npm run open

# Headless execution
npm run test

# Run with reports
npm run test && npm run report:generate
```

## Environment Setup

Copy the example env file and adjust as needed:

```bash
cp .env.example .env.dev
```

Or set environment variables directly:

```bash
export ENV=qa
export BASE_URL=https://www.saucedemo.com
export API_URL=https://jsonplaceholder.typicode.com
```
