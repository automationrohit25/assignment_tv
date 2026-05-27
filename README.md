# Playwright E2E Automation Assignment

## Overview
This repository contains a Playwright + TypeScript test automation solution for:
- Login module
- Product catalog module
- Shopping cart / checkout module
- End-to-end checkout flow

The solution uses the Page Object Model (POM) design pattern and GitHub Actions for CI.

---

# Project Structure
- `pages/` – Page object classes for reusable UI flows.
- `tests/ui/` – UI test suites organized by feature and E2E workflow.
- `tests/api/` – API automation suites with reusable API client for the Restful Booker service.
- `playwright.config.ts` – Playwright configuration and test runner settings.
- `.github/workflows/playwright.yml` – CI pipeline for automated UI and API execution.
- `docs/architecture.md` – Design rationale for modularity, scalability, and team enablement.

---

# Setup Instructions

## Prerequisites
1. Install Node.js 20.x or later.
2. Install Git.
3. Ensure npm is available in your environment.

## Installation
Open the repository in your terminal and run:

```bash
npm install
npx playwright install --with-deps
```

---

# Run Tests Locally

## Run Full Test Suite
```bash
npm test
```

## Run Tests with CI-style Output
```bash
npm run test:ci
```

## Run Tests with Headed Browser Sessions
```bash
npm run test:headed
```

## Run UI Automation Only
```bash
npm run test:ui
```

## Run API Automation Only
```bash
npm run test:api
```

## Run API Automation in CI Style
```bash
npm run test:api:ci
```

---

# Framework Architecture

This project is organized for scalability, maintainability, and easy team onboarding.

## UI Automation
- `pages/` contains reusable page objects for UI actions.
- `tests/ui/` contains feature-specific UI tests and end-to-end workflows.
- The Page Object Model (POM) reduces duplication and makes UI changes easy to apply across tests.

## API Automation
- `tests/api/RestfulBookerClient.ts` centralizes API request behavior and payload models.
- `tests/api/` contains endpoint-focused automation and a full Create → Update → Verify → Delete workflow.
- API tests are decoupled from UI flows for faster and more reliable feedback.
- API documentation: https://restful-booker.herokuapp.com/

## Modular Separation
- UI tests and API tests live in separate folders to keep responsibilities isolated.
- Shared configuration is centralized in `playwright.config.ts`.
- Scripts in `package.json` expose clear execution paths for developers and CI.

## Scalability Considerations
The framework is designed to support future growth by:
- Keeping UI and API layers independent
- Supporting reusable page objects and API clients
- Centralizing configuration management
- Enabling easy addition of new test modules
- Supporting CI/CD integration and parallel execution

## Current Test Files

### UI Tests
- `tests/ui/catalog.spec.ts`
- `tests/ui/checkout.spec.ts`
- `tests/ui/e2e.spec.ts`
- `tests/ui/login.spec.ts`

### API Tests
- `tests/api/auth.spec.ts`
- `tests/api/booking.spec.ts`
- `tests/api/e2e.spec.ts`

---

# API Test Strategy

The API automation framework is designed to validate critical booking workflows of the Restful Booker service using reusable request abstractions and isolated endpoint validations.

## Strategy Goals
- Validate critical API functionality independently from UI flows
- Ensure fast feedback for backend regressions
- Maintain reusable and scalable API utilities
- Support easy onboarding for new QA engineers

## API Coverage

### Authentication APIs
- Token generation
- Invalid authentication scenarios
- Response status validation
- Response schema validation

### Booking APIs
- Create booking
- Retrieve booking details
- Update booking
- Partial update booking
- Delete booking
- End-to-end booking lifecycle validation

## API Design Principles
- Reusable API client abstraction
- Centralized request handling
- Test isolation
- Independent test data creation
- Minimal duplication
- Clear separation between UI and API automation

## API Framework Components

| Component | Purpose |
|---|---|
| `RestfulBookerClient.ts` | Centralized API request wrapper |
| `auth.spec.ts` | Authentication API coverage |
| `booking.spec.ts` | CRUD booking validations |
| `e2e.spec.ts` | Full booking workflow validation |

## API Validation Types
The framework validates:
- HTTP status codes
- Response payload structure
- Response data correctness
- Authentication handling
- CRUD operation integrity

---

# Test Coverage

## Login Module
### Positive Scenarios
- Successful login

### Negative Scenarios
- Invalid credential failure

## Product Catalog Module
### Positive Scenarios
- Add product to cart

### Negative Scenarios
- Invalid product interaction

## Checkout Module
### Positive Scenarios
- Complete checkout flow

### Negative Scenarios
- Validation errors on checkout form

## End-to-End Workflow
- Login → Add to Cart → Checkout

---

# CI/CD Pipeline

The GitHub Actions workflow runs on:
- `push`
- `pull_request`

## Pipeline Steps
1. Checkout repository
2. Setup Node.js
3. Install dependencies
4. Install Playwright browsers
5. Execute UI automation suite
6. Execute API automation suite
7. Generate Playwright reports

Workflow file:
```text
.github/workflows/playwright.yml
```

## CI Execution Strategy
The GitHub Actions pipeline ensures:
- Automated regression validation
- Pull request quality checks
- Consistent execution environments
- Early defect detection
- Reliable UI and API execution in CI

---

# Team Onboarding Guide

## Initial Setup
1. Clone the repository.
2. Install dependencies and Playwright browsers.
3. Run the full automation suite locally.

## UI Automation Onboarding
1. Review page objects inside `pages/`.
2. Review feature-based UI specs in `tests/ui/`.
3. Execute UI suites and review reports.

## API Automation Onboarding
1. Review `RestfulBookerClient.ts` for reusable request abstraction patterns.
2. Review reusable payload models and helper methods.
3. Execute API tests independently before running the full suite.
4. Review Playwright HTML reports for API execution results.
5. Follow existing spec patterns while adding new endpoint coverage.

## Reporting
After execution, review reports at:

```text
playwright-report/index.html
```

## Pull Request Process
1. Create feature branch.
2. Execute local validation before PR creation.
3. Ensure GitHub Actions pipeline passes before merging.

---

# Notes
The tests run against the demo site:

- UI Testing: `https://www.saucedemo.com`
- API Testing: `https://restful-booker.herokuapp.com/`