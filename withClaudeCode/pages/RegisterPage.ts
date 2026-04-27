import { Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class RegisterPage extends BasePage {
  private firstNameInput = () => this.page.locator('input#firstName');
  private lastNameInput = () => this.page.locator('input#lastName');
  private emailInput = () => this.page.getByLabel('Email');
  private passwordInput = () => this.page.getByLabel('Password', { exact: true });
  private confirmPasswordInput = () => this.page.getByLabel('Confirm Password');
  private agreeCheckbox = () => this.page.getByRole('checkbox', { name: /I agree/ });
  private createAccountButton = () => this.page.getByRole('button', { name: 'Create Account' });

  constructor(page: Page) {
    super(page);
  }

  async navigate() {
    await this.goto('account/register');
  }

  async register(firstName: string, lastName: string, email: string, password: string) {
    await this.firstNameInput().fill(firstName);
    await this.lastNameInput().fill(lastName);
    await this.emailInput().fill(email);
    await this.passwordInput().fill(password);
    await this.confirmPasswordInput().fill(password);
    await this.agreeCheckbox().check();
    await this.createAccountButton().click();
  }
}
