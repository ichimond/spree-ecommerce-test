# Project Log

## Entry 6
**Date/Time:** 2026-04-27 19:30 PHT  
**Prompt:** Debug and fix the checkout test — shipping methods not loading, guest mode detection, card selector issues, and order confirmation assertion.

**Actions:**
- Diagnosed root cause of guest checkout: `login()` did not wait for the session to be established before navigating away — fixed by adding `waitForURL(/\/account/)` to `LoginPage.login()`
- Updated `LoginPage` email and submit button selectors to role-based (`getByRole`) for robustness
- Changed checkout navigation to use `checkoutViaCartDialog()` — clicks "Checkout" link directly from the cart dialog instead of going to the cart page first
- Discovered checkout is still treated as guest (cart token tied to guest session regardless of login state) — implemented `fillGuestEmail(email)` on `CheckoutPage` that fills the Contact Information email field when editable (guest mode), which unblocks the shipping API
- Removed `shippingMethodOption('Standard').waitFor()` from `fillShippingAddress()` — shipping is no longer awaited inside the address method
- Adopted user's manual workaround: fill full card details first (number, expiry, CVC, country, ZIP) to trigger shipping API, verify shipping options appear, then refill card details after Stripe re-mounts
- Fixed Stripe iframe strict mode violation: switched from `frameLocator(...).first()` (deprecated) to `locator(...).first().contentFrame()`
- Fixed card country selector: `getByRole('combobox', { name: 'Country or region', exact: true })` was not matching — switched to `getByLabel('Country', { exact: true })` which targets the billing country `<select>` uniquely
- Fixed card ZIP selector: placeholder changed from `'ZIP'` to `'12345'` in current Stripe version — switched to `getByLabel('ZIP code')`
- Added `verifyOrderSummary(products)` to `CheckoutPage` — asserts product names are visible in the `<p>` elements of the order summary panel
- Added `termsCheckbox` locator and updated `placeOrder()` to check "I agree to the Privacy Policy and Terms of Service" before clicking Pay Now
- Fixed order confirmation assertion: `getByText(user.firstName)` resolved to 3 elements (heading, shipping address, billing address) — changed to `getByRole('heading', { name: /Thanks for your order, firstName/ })`
- Increased test timeout from 60s to 120s to accommodate `networkidle` wait in `addToCart()`
- All 3 test scenarios now pass end-to-end

---

## Entry 5
**Date/Time:** 2026-04-27 16:40 PHT  
**Prompt:** Proceed to checkout and complete the following: add a shipping address (select United States), verify the different delivery and pricing options, select card payment (card number is in the checkout page — put card details in fixture), complete the order. Note: shipment method only loads after inputting card details, then card gets cleared — refill after shipment loads.

**Actions:**
- Used Playwright MCP to explore the full checkout flow: registered a temp account, added both products to cart, and navigated to the checkout page
- Confirmed checkout URL is tokenized: `/us/en/checkout/cart_XXXXX` — must navigate via "Proceed to Checkout" link from cart, not a direct URL
- Mapped all checkout form fields: Country (defaults to United States), First/Last name (pre-filled from account), Address, City, State/Province combobox, ZIP
- Confirmed shipping methods (Standard $5.00, Premium $9.50) appear only after address is entered and focus leaves the form — load triggered on blur + networkidle
- Confirmed Stripe payment section shows test card hint on page: `4242 4242 4242 4242 (any future expiry, any CVC)`
- Confirmed card iframe title: `"Secure payment input frame"` (single Stripe Payment Element iframe, not separate per-field iframes)
- Confirmed card clearing behavior: Stripe re-mounts when shipping methods load — strategy is to select Stripe and fill card AFTER shipping methods are visible
- Added checkout fixture data to `fixtures/testData.json`: shippingAddress, card details, shippingOptions array
- Added `proceedToCheckout()` method to `pages/CartPage.ts`
- Created `pages/CheckoutPage.ts` with `fillShippingAddress()`, `verifyShippingOptions()`, `selectStripePayment()`, `fillCardDetails()`, `placeOrder()` methods
- Added `should complete checkout with card payment` test to `tests/spree.spec.ts`

---

## Entry 4
**Date/Time:** 2026-04-27 14:45 PHT  
**Prompt:** Can we put the tests in 1 describe as well?

**Actions:**
- Consolidated both test scenarios into a single `test.describe('Spree Commerce Demo')` block
- Moved `test.beforeAll` inside the describe — it now scopes correctly to the suite
- All tests share the same registered user via `beforeAll` and the file-scope `user` variable

---

## Entry 3
**Date/Time:** 2026-04-27 14:22 PHT  
**Prompt:** Browse products and open a product detail page. Add the product to cart. Go to the cart and verify the product details (name, quantity, price). From homepage, use the Shop All link. Use Digital Air Fryer 4.2L and Personal Blender 600ml — product data to sit in the fixture.

**Actions:**
- Used Playwright MCP to explore the products listing page, product detail page, and cart page — mapped all relevant selectors via DOM evaluation
- Added product fixture data to `fixtures/testData.json` (Digital Air Fryer 4.2L at $119.99, Personal Blender 600ml at $49.99)
- Created `tsconfig.json` to enable `resolveJsonModule` for JSON fixture imports
- Updated `pages/HomePage.ts` — added `shopAllLink` locator and `clickShopAll()` method
- Created `pages/ProductsPage.ts` — with `clickProduct(name)` method using `a[href*="/products/"]` scoped locator
- Created `pages/ProductDetailPage.ts` — with `getProductName()`, `getProductPrice()`, and `addToCart()` methods
- Created `pages/CartPage.ts` — with `navigate()` and `verifyItemInCart(name, price, quantity)` methods
- Added new test describe block in `tests/spree.spec.ts`: iterates over fixture products, navigates from homepage → Shop All → product detail → adds to cart, then verifies each item in the cart

---

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

