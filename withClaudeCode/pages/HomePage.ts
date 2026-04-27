import { Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class HomePage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async navigate() {
    await this.goto('/');
  }

  async clickAccountIcon() {
    await this.page.getByRole('link', { name: 'Account', exact: true }).click();
  }
}
