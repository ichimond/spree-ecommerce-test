import { test, expect } from '@playwright/test';
import { faker } from '@faker-js/faker';
import { HomePage } from '../pages/HomePage';
import { LoginPage } from '../pages/LoginPage';
import { RegisterPage } from '../pages/RegisterPage';
import { ProductsPage } from '../pages/ProductsPage';
import { ProductDetailPage } from '../pages/ProductDetailPage';
import { CartPage } from '../pages/CartPage';
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
});
