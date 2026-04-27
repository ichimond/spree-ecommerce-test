import { Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class HomePage extends BasePage {
  private accountIcon = () => this.page.locator('a[aria-label="Account"]');
  private shopAllLink = () => this.page.getByRole('link', { name: 'Shop All' });
  private viewAllLink = () => this.page.getByRole('link', { name: 'View all →' });

  constructor(page: Page) {
    super(page);
  }

  async navigate() {
    await this.goto('');
  }

  async clickAccountIcon() {
    await this.accountIcon().click();
  }

  async clickShopAll() {
    await this.shopAllLink().click();
  }

  async clickViewAll() {
    await this.viewAllLink().click();
  }
}
