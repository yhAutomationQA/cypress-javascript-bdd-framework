/*
 * =============================================================================
 * Jenkins Declarative Pipeline: Cypress BDD Framework
 * =============================================================================
 * Triggers:
 *   - GitHub webhook (push, PR)
 *   - Scheduled (daily)
 *   - Manual with parameters
 *
 * Parameters:
 *   ENVIRONMENT - Target test environment (dev|qa|staging)
 *   TEST_TAGS   - Cucumber tags to filter tests
 *   PARALLEL_WORKERS - Number of parallel CI nodes
 *
 * Prerequisites:
 *   - NodeJS 20 tool configured in Jenkins Global Tools
 *   - Cypress Dashboard key stored in Jenkins credentials
 *   - Allure CLI plugin installed
 * =============================================================================
 */

pipeline {
    agent any

    tools {
        nodejs 'NodeJS-20'
    }

    environment {
        CYPRESS_CACHE_FOLDER = "${WORKSPACE}/.cache/Cypress"
        CYPRESS_RECORD_KEY   = credentials('cypress-record-key')
        CYPRESS_PROJECT_ID   = credentials('cypress-project-id')
    }

    parameters {
        choice(
            name: 'ENVIRONMENT',
            choices: ['dev', 'qa', 'staging'],
            description: 'Target test environment'
        )
        string(
            name: 'TEST_TAGS',
            defaultValue: '@regression',
            description: 'Cucumber tags to execute (e.g., @smoke, @regression, @api)'
        )
        choice(
            name: 'PARALLEL_WORKERS',
            choices: ['1', '2', '3', '4'],
            description: 'Number of parallel executors'
        )
        booleanParam(
            name: 'RUN_LINT',
            defaultValue: true,
            description: 'Run ESLint + Prettier checks'
        )
    }

    stages {
        stage('Setup') {
            steps {
                cleanWs()
                checkout scm
                script {
                    env.ENV = params.ENVIRONMENT
                }
                sh 'npm ci'
                sh 'npm run report:clean || true'
                stash name: 'workspace', includes: '**/*', excludes: 'node_modules/**, .cache/**'
            }
        }

        stage('Lint') {
            when {
                expression { params.RUN_LINT }
            }
            steps {
                unstash 'workspace'
                sh 'npm ci'
                sh 'npm run lint'
                sh 'npm run format:check'
            }
            post {
                success {
                    echo 'Lint checks passed'
                }
                failure {
                    echo 'Lint checks failed. Run "npm run lint:fix && npm run format" locally.'
                }
            }
        }

        stage('Test Execution') {
            parallel {
                stage('Smoke Tests') {
                    agent { label 'cypress-executor' }
                    steps {
                        unstash 'workspace'
                        sh 'npm ci'
                        sh 'npm run report:clean || true'
                        sh """
                            ENV=${params.ENVIRONMENT} \
                            npx cypress run \
                            --env Tags="@smoke" \
                            --browser chrome \
                            --record ${params.PARALLEL_WORKERS.toInteger() > 1 ? '--parallel' : ''} \
                            --group "smoke-${params.ENVIRONMENT}" \
                            --ci-build-id "${BUILD_TAG}-smoke"
                        """
                    }
                    post {
                        always {
                            archiveArtifacts artifacts: 'reports/screenshots/**/*.png', allowEmptyArchive: true
                            archiveArtifacts artifacts: 'reports/videos/**/*.mp4', allowEmptyArchive: true
                            archiveArtifacts artifacts: 'reports/allure-results/**/*.json', allowEmptyArchive: true
                            archiveArtifacts artifacts: 'reports/mochawesome/*.json', allowEmptyArchive: true
                            junit allowEmptyResults: true, testResults: 'reports/allure-results/**/*.xml'
                        }
                    }
                }

                stage('Regression Tests') {
                    agent { label 'cypress-executor' }
                    steps {
                        unstash 'workspace'
                        sh 'npm ci'
                        sh 'npm run report:clean || true'
                        sh """
                            ENV=${params.ENVIRONMENT} \
                            npx cypress run \
                            --env Tags="${params.TEST_TAGS}" \
                            --browser chrome \
                            --record ${params.PARALLEL_WORKERS.toInteger() > 1 ? '--parallel' : ''} \
                            --group "regression-${params.ENVIRONMENT}" \
                            --ci-build-id "${BUILD_TAG}-regression"
                        """
                    }
                    post {
                        always {
                            archiveArtifacts artifacts: 'reports/screenshots/**/*.png', allowEmptyArchive: true
                            archiveArtifacts artifacts: 'reports/videos/**/*.mp4', allowEmptyArchive: true
                            archiveArtifacts artifacts: 'reports/allure-results/**/*.json', allowEmptyArchive: true
                            archiveArtifacts artifacts: 'reports/mochawesome/*.json', allowEmptyArchive: true
                            junit allowEmptyResults: true, testResults: 'reports/allure-results/**/*.xml'
                        }
                    }
                }
            }
        }

        stage('Generate Reports') {
            when {
                expression { currentBuild.currentResult != 'ABORTED' }
            }
            steps {
                script {
                    try {
                        sh 'npm run report:generate'
                    } catch (err) {
                        echo "Report generation failed: ${err.message}"
                    }
                }
            }
        }
    }

    post {
        always {
            script {
                if (fileExists('reports/allure-report')) {
                    allure includeProperties: false,
                           reportPath: 'reports/allure-report',
                           results: [[path: 'reports/allure-results']]
                }
            }
            archiveArtifacts artifacts: 'reports/allure-report/**/*', allowEmptyArchive: true
            archiveArtifacts artifacts: 'reports/mochawesome-report/**/*', allowEmptyArchive: true
            cleanWs()
        }

        success {
            echo "Pipeline completed successfully. ENV=${params.ENVIRONMENT}, TAGS=${params.TEST_TAGS}"
            emailext(
                to: "${env.CHANGE_AUTHOR_EMAIL ?: 'team@example.com'}",
                subject: "[SUCCESS] Cypress BDD - ${params.ENVIRONMENT} - ${env.BUILD_NUMBER}",
                body: """
                    <h2>Cypress BDD Test Results</h2>
                    <p><b>Environment:</b> ${params.ENVIRONMENT}</p>
                    <p><b>Tags:</b> ${params.TEST_TAGS}</p>
                    <p><b>Build:</b> <a href='${env.BUILD_URL}'>${env.BUILD_NUMBER}</a></p>
                    <p><b>Allure Report:</b> <a href='${env.BUILD_URL}allure'>View Report</a></p>
                """,
                mimeType: 'text/html'
            )
        }

        failure {
            echo "Pipeline failed. Check artifacts and reports."
            emailext(
                to: "${env.CHANGE_AUTHOR_EMAIL ?: 'team@example.com'}",
                subject: "[FAILED] Cypress BDD - ${params.ENVIRONMENT} - ${env.BUILD_NUMBER}",
                body: """
                    <h2>Cypress BDD Test Failed</h2>
                    <p><b>Environment:</b> ${params.ENVIRONMENT}</p>
                    <p><b>Tags:</b> ${params.TEST_TAGS}</p>
                    <p><b>Build:</b> <a href='${env.BUILD_URL}'>${env.BUILD_NUMBER}</a></p>
                    <p><b>Allure Report:</b> <a href='${env.BUILD_URL}allure'>View Report</a></p>
                """,
                mimeType: 'text/html'
            )
        }
    }
}
