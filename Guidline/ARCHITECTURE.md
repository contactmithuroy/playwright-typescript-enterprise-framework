# Architecture Guide

This framework is a data-driven Playwright test architecture built around:
- Global page objects
- Centralized hooks
- Registry-based test execution
- CSV-driven test selection and data

## Key Components
1. **Fixtures + Global Page Objects**
   - `tests/base-hooks.ts`
   - Creates all page objects and exposes them via `pageObjects`

2. **Hooks and Auto Steps**
   - `tests/hooks/TestHooks.ts`
   - Wraps page object methods and logs them as Playwright steps
   - Adds screenshots after each step

3. **Test Registry**
   - `tests/registry/TestRegistry_Auto.ts`
   - Central registry of test functions (no switch-case)
   - Test execution happens by name

4. **Data Management**
   - `data-models/dataStore.ts`
   - CSVs are loaded once and used across tests

5. **Smoke Runner**
   - `tests/smoke/DynamicSmokeTestsAuto.spec.ts`
   - Reads `test-data/Smoke_TestCases.csv` and executes tests with `run=Y`

## Flow Overview
1. Test runner loads CSV test list.
2. Fixtures initialize page objects.
3. Hooks wrap page objects and start the test.
4. Registry executes test by name.
5. Each page object method becomes a Playwright step with a screenshot.

## Project Structure
```
.
|-- data-models/
|   `-- dataStore.ts                # Central CSV data access
|-- pages/
|   |-- Common/
|   |   |-- base.page.ts            # Base page helpers
|   |   |-- LoginLogout.page.ts     # Login/Logout for Parabank
|   |   `-- MainNavigationPage.ts   # Menu navigation
|   `-- MainPages/
|       `-- MakeATransfer.page.ts   # Transfer Funds page
|-- test-data/
|   |-- Smoke_TestCases.csv         # Test control (Y/N/NA/NE)
|   `-- MakeATransferData.csv       # Transfer Funds data
|-- tests/
|   |-- base-hooks.ts               # Fixtures + global page objects
|   |-- hooks/
|   |   `-- TestHooks.ts            # Lifecycle + auto step tracking
|   |-- registry/
|   |   `-- TestRegistry_Auto.ts    # Test registry map
|   `-- smoke/
|       `-- DynamicSmokeTestsAuto.spec.ts  # Data-driven runner
|-- utils/
|   |-- CommonFunctions.ts          # Env + helpers
|   |-- csvReader.ts                # CSV reader
|   `-- SmokeTestController.ts      # CSV test selection
|-- playwright.config.ts            # Playwright config
|-- .env                            # URL + credentials
`-- README.md
```