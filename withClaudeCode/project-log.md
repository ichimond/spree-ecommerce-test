# Project Log

## Entry 2
**Date/Time:** 2026-04-27 13:58 PHT  
**Prompt:** First scenario: Navigate to the Spree Commerce demo store. Click on the user icon and Sign Up as a new user from the registration page. Log in with the newly registered user credentials. Use Playwright MCP to get selectors, use faker for user generation, and use page object model.

**Actions:**
- Used Playwright MCP to explore the site and map selectors across homepage, login page (`/account`), and registration page (`/account/register`)
- Installed `@faker-js/faker` as a dev dependency for dynamic user generation
- Created `pages/HomePage.ts` — with `navigate()` and `clickAccountIcon()` methods
- Created `pages/LoginPage.ts` — with `navigate()`, `goToRegister()`, and `login()` methods
- Created `pages/RegisterPage.ts` — with `navigate()` and `register()` methods using exact Playwright selectors from MCP snapshot
- Wrote test in `tests/spree.spec.ts`: generates a unique user per run via faker, registers via the UI, verifies redirect to account page, then logs in and verifies the user's first name is visible

---

## Entry 1
**Date/Time:** 2026-04-27 13:32 PHT  
**Prompt:** We'll create a playwright test for the spree website demo website (https://demo.spreecommerce.org/us/en). We'll do several test scenarios, but we'll do it one by one. A bit of scaffolding work. We'll use page object model for this. The directories will be: pages (page objects and functions), tests (one script file), fixtures (JSON data to be used in our scripts).

**Actions:**
- Updated `playwright.config.ts` to set `baseURL` to `https://demo.spreecommerce.org/us/en`
- Created `pages/BasePage.ts` — base page class with `Page` constructor and `goto()` method
- Created `tests/spree.spec.ts` — main test file (empty, ready for test scenarios)
- Created `fixtures/testData.json` — empty JSON file for test data

