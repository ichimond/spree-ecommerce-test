import { Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class ProductDetailPage extends BasePage {
  private productName = () => this.page.locator('h1.text-3xl').first();
  private productPrice = () => this.page.locator('span.text-3xl');
  private addToCartButton = () => this.page.getByRole('button', { name: 'Add to Cart' });

  constructor(page: Page) {
    super(page);
  }

  async getProductName(): Promise<string> {
    return (await this.productName().textContent()) ?? '';
  }

  async getProductPrice(): Promise<string> {
    return (await this.productPrice().textContent()) ?? '';
  }

  async addToCart() {
    await this.addToCartButton().scrollIntoViewIfNeeded();
    await this.addToCartButton().click();
    await this.page.waitForLoadState('networkidle');
  }
}
