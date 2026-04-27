import { test, expect } from '@playwright/test';
import { faker } from '@faker-js/faker';
import { HomePage } from '../pages/HomePage';
import { LoginPage } from '../pages/LoginPage';
import { RegisterPage } from '../pages/RegisterPage';
import { ProductsPage } from '../pages/ProductsPage';
import { ProductDetailPage } from '../pages/ProductDetailPage';
import { CartPage } from '../pages/CartPage';
import { CheckoutPage } from '../pages/CheckoutPage';
import testData from '../fixtures/testData.json';

let user: { firstName: string; lastName: string; email: string; password: string };

test.describe('Spree Commerce Demo', () => {
  test.beforeAll(async ({ browser }) => {
    user = {
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      email: faker.internet.email(),
      password: 'Test@1234',
    };

    const context = await browser.newContext();
    const page = await context.newPage();
    const homePage = new HomePage(page);
    const loginPage = new LoginPage(page);
    const registerPage = new RegisterPage(page);

    await homePage.navigate();
    await homePage.clickAccountIcon();
    await loginPage.goToRegister();
    await registerPage.register(user.firstName, user.lastName, user.email, user.password);

    await context.close();
  });

  test('should log in with the registered user credentials', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.navigate();
    await loginPage.login(user.email, user.password);

    await expect(page).toHaveURL(/\/account/);
    await expect(page.getByText(user.firstName)).toBeVisible();
  });

  test('should add products to cart and verify cart details', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const productsPage = new ProductsPage(page);
    const productDetailPage = new ProductDetailPage(page);
    const cartPage = new CartPage(page);

    await loginPage.navigate();
    await loginPage.login(user.email, user.password);

    for (const product of testData.products) {
      await productsPage.navigate();
      await productsPage.clickProduct(product.name);
      await page.waitForURL(`**/${product.slug}**`);
      await expect(page.getByRole('heading', { name: product.name })).toBeVisible();
      await productDetailPage.addToCart();
    }

    await cartPage.navigateViaCartDialog();
    for (const product of testData.products) {
      await cartPage.verifyItemInCart(product.name, product.price);
    }
  });

  test('should complete checkout with card payment', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const productsPage = new ProductsPage(page);
    const productDetailPage = new ProductDetailPage(page);
    const cartPage = new CartPage(page);
    const checkoutPage = new CheckoutPage(page);

    await loginPage.navigate();
    await loginPage.login(user.email, user.password);

    for (const product of testData.products) {
      await productsPage.navigate();
      await productsPage.clickProduct(product.name);
      await page.waitForURL(`**/${product.slug}**`);
      await productDetailPage.addToCart();
    }

   
    await cartPage.checkoutViaCartDialog();
    await page.waitForURL('**/checkout/**');
    await checkoutPage.fillGuestEmail(user.email);

    const { shippingAddress, card, shippingOptions } = testData.checkout;

    await checkoutPage.fillShippingAddress(
      user.firstName,
      user.lastName,
      shippingAddress.address,
      shippingAddress.city,
      shippingAddress.state,
      shippingAddress.zip
    );

    await checkoutPage.verifyOrderSummary(testData.products);

    // Select Stripe and fill full card details — triggers the shipping API response
    await checkoutPage.selectStripePayment();
    await checkoutPage.fillCardDetails(card.number, card.expiry, card.cvc, card.country, card.zip);

    // Wait for shipping to appear — Stripe re-mounts and clears card after this
    await checkoutPage.verifyShippingOptions(shippingOptions);

    // Refill full card details after Stripe re-mounts
    await checkoutPage.fillCardDetails(card.number, card.expiry, card.cvc, card.country, card.zip);

    await checkoutPage.placeOrder();
    await expect(page).toHaveURL(/\/order/);
    await expect(page.getByRole('heading', { name: new RegExp(`Thanks for your order, ${user.firstName}`) })).toBeVisible();
    await expect(page.getByText(/R\d+/)).toBeVisible();
  });
});
