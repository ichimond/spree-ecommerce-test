import { Page, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class CartPage extends BasePage {
  private cartIcon = () => this.page.locator('button[aria-label="Open cart"]');
  private viewCartLink = () => this.page.getByRole('link', { name: 'View Cart' });
  private checkoutDialogLink = () => this.page.getByRole('link', { name: 'Checkout', exact: true });
  private proceedToCheckoutLink = () => this.page.getByRole('link', { name: 'Proceed to Checkout' });
  private cartHeading = () => this.page.locator('h1', { hasText: 'Shopping Cart' });
  private itemName = (name: string) => this.page.locator('h3.truncate', { hasText: name });
  private itemPrice = (name: string) => this.page.locator('p.mt-2', { hasText: '$' }).filter({ has: this.page.locator('xpath=preceding-sibling::h3', { hasText: name }) });
  private itemQuantity = (name: string) => this.itemName(name).locator('xpath=following::span[contains(@class,"px-3")][1]');

  constructor(page: Page) {
    super(page);
  }

  async navigate() {
    await this.goto('cart');
  }

  async navigateViaCartIcon() {
    await this.cartIcon().click();
  }

  async navigateViaCartDialog() {
    await this.viewCartLink().click();
  }

  async checkoutViaCartDialog() {
    await this.checkoutDialogLink().click();
  }

  async proceedToCheckout() {
    await this.proceedToCheckoutLink().click();
  }

  async verifyItemInCart(name: string, price: string, quantity: string = '1') {
    await expect(this.cartHeading()).toBeVisible();
    await expect(this.itemName(name)).toBeVisible();
    await expect(this.page.locator('p', { hasText: price })).toBeVisible();
    await expect(this.itemQuantity(name)).toHaveText(quantity);
  }
}
