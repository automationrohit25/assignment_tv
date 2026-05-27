# Architecture and Design Principles

This repository is structured to support scalable test automation, maintainable code, modular separation, and quick team onboarding.

## Scalability
- UI and API tests are separated into `tests/ui/` and `tests/api/` so each layer can grow independently.
- `playwright.config.ts` centralizes common settings like timeouts, reporters, browsers, and base URL.
- `package.json` exposes focused commands for UI, API, and CI-style execution.
- GitHub Actions runs UI and API pipelines separately, allowing parallel scaling and faster feedback.

## Maintainability
- UI flows use the Page Object Model (POM) in `pages/`, keeping locators and actions centralized.
- The API client in `tests/api/RestfulBookerClient.ts` encapsulates request logic and payload handling.
- Shared test configuration and helpers reduce duplication and make updates low-risk.
- TypeScript ensures consistent types across page objects, API models, and tests.

## Modularity
- UI concerns are contained in `tests/ui/` and `pages/`.
- API concerns are contained in `tests/api/` and `tests/api/RestfulBookerClient.ts`.
- This separation makes it easy to add new UI features or new API endpoint tests without affecting unrelated suites.

## Team Enablement
- `README.md` includes clear setup commands and test execution paths.
- `package.json` scripts provide simple, reproducible commands for developers and CI.
- Onboarding guidance points new team members to the key directories and workflow.
- The CI workflow is split into UI and API jobs, making it easier for reviewers to understand scope and results.

## Extension Guide
To add a new test:
1. For UI tests, add a new page object in `pages/` if needed.
2. Add a new spec file in `tests/ui/` or `tests/api/`.
3. Reuse existing helpers and the Playwright config.
4. Run the new suite locally with `npm run test:ui` or `npm run test:api`.
