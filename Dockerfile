# =============================================================================
# Stage 1: Base - shared dependencies
# =============================================================================
FROM cypress/base:20 AS base

LABEL maintainer="QA Automation Team"
LABEL description="Cypress BDD Automation Framework"
LABEL version="1.0.0"

ENV CI=1 \
    NO_COLOR=0 \
    TERM=xterm \
    CYPRESS_CACHE_FOLDER=/opt/cypress-cache

WORKDIR /app

# =============================================================================
# Stage 2: Dependencies - layer caching for npm
# =============================================================================
FROM base AS dependencies

COPY package.json package-lock.json ./

RUN npm ci --no-audit --no-fund --prefer-offline \
    && npx cypress verify \
    && rm -rf /root/.npm /root/.cache /tmp/* /var/tmp/*

# =============================================================================
# Stage 3: Production image
# =============================================================================
FROM dependencies AS production

COPY . .

RUN mkdir -p reports/{screenshots,videos,allure-results,allure-report,mochawesome,mochawesome-report,cucumber-report,logs}

ENTRYPOINT ["npx", "cypress", "run"]
CMD ["--browser", "chrome"]
