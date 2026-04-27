import { Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class ProductsPage extends BasePage {
  private productLink = (name: string) => this.page.locator('a[href*="/products/"]', { hasText: name }).first();

  constructor(page: Page) {
    super(page);
  }

  async navigate() {
    await this.goto('products');
  }

  async clickProduct(name: string) {
    await this.productLink(name).click();
  }
}
