import { test, expect } from '@playwright/test';
import { faker } from '@faker-js/faker';
import { HomePage } from '../pages/HomePage';
import { LoginPage } from '../pages/LoginPage';
import { RegisterPage } from '../pages/RegisterPage';

const user = {
  firstName: faker.person.firstName(),
  lastName: faker.person.lastName(),
  email: faker.internet.email(),
  password: 'Test@1234',
};

test.describe('Spree Commerce - User Registration and Login', () => {
  test('should register a new user and log in with the new credentials', async ({ page }) => {
    const homePage = new HomePage(page);
    const loginPage = new LoginPage(page);
    const registerPage = new RegisterPage(page);

    // Navigate to homepage and go to account
    await homePage.navigate();
    await homePage.clickAccountIcon();

    // Go to registration page
    await loginPage.goToRegister();
    await expect(page).toHaveURL(/\/account\/register/);

    // Register new user
    await registerPage.register(user.firstName, user.lastName, user.email, user.password);

    // Verify successful registration redirects to account page
    await expect(page).toHaveURL(/\/account/);

    // Log out if needed, then log in with new credentials
    await loginPage.navigate();
    await loginPage.login(user.email, user.password);

    // Verify successful login
    await expect(page).toHaveURL(/\/account/);
    await expect(page.getByText(user.firstName)).toBeVisible();
  });
});
