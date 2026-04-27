import { Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class LoginPage extends BasePage {
  private emailInput = () => this.page.locator('input#email');
  private passwordInput = () => this.page.locator('input#password');
  private signInButton = () => this.page.locator('button[type="submit"]');
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
  }
}
