import { Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class RegisterPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async navigate() {
    await this.goto('/account/register');
  }

  async register(firstName: string, lastName: string, email: string, password: string) {
    await this.page.getByLabel('First name').fill(firstName);
    await this.page.getByLabel('Last name').fill(lastName);
    await this.page.getByLabel('Email').fill(email);
    await this.page.getByLabel('Password', { exact: true }).fill(password);
    await this.page.getByLabel('Confirm Password').fill(password);
    await this.page.getByRole('checkbox', { name: /I agree/ }).check();
    await this.page.getByRole('button', { name: 'Create Account' }).click();
  }
}
