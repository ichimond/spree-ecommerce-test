import { Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class LoginPage extends BasePage {
  private emailInput = () => this.page.getByRole('textbox', { name: 'Email', exact: true });
  private passwordInput = () => this.page.locator('input#password');
  private signInButton = () => this.page.getByRole('button', { name: 'Sign In' });
  private signUpLink = () => this.page.locator('a[href*="register"]');

  constructor(page: Page) {
    super(page);
  }

  async navigate() {
    await this.goto('account');
  }

  async goToRegister() {
    await this.signUpLink().click();
  }

  async login(email: string, password: string) {
    await this.emailInput().fill(email);
    await this.passwordInput().fill(password);
    await this.signInButton().click();
    await this.page.waitForURL(/\/account/);
  }
}
