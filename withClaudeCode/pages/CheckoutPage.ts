import { Page, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class CheckoutPage extends BasePage {
  private firstNameInput = () => this.page.getByRole('textbox', { name: 'First name' });
  private lastNameInput = () => this.page.getByRole('textbox', { name: 'Last name' });
  private addressInput = () => this.page.getByRole('textbox', { name: 'Address', exact: true });
  private cityInput = () => this.page.getByRole('textbox', { name: 'City' });
  private stateSelect = () => this.page.getByLabel('State / Province');
  private zipInput = () => this.page.getByRole('textbox', { name: 'ZIP / Postal code' });
  private shippingMethodOption = (name: string) => this.page.getByRole('radio', { name: new RegExp(name) });
  private stripeRadio = () => this.page.getByRole('radio', { name: 'Stripe' });
  private cardFrame = () => this.page.locator('iframe[title="Secure payment input frame"]').first().contentFrame();
  private cardNumberInput = () => this.cardFrame().getByPlaceholder('1234 1234 1234 1234');
  private cardExpiryInput = () => this.cardFrame().getByPlaceholder('MM / YY');
  private cardCvcInput = () => this.cardFrame().getByPlaceholder('CVC');
  private cardCountrySelect = () => this.cardFrame().getByLabel('Country', { exact: true });
  private cardZipInput = () => this.cardFrame().getByLabel('ZIP code');
  private guestEmailInput = () => this.page.getByPlaceholder('Email address');
  private termsCheckbox = () => this.page.getByRole('checkbox', { name: /Privacy Policy/ });
  private payNowButton = () => this.page.getByRole('button', { name: 'Pay Now' });

  constructor(page: Page) {
    super(page);
  }

  async fillGuestEmail(email: string) {
    const emailInput = this.guestEmailInput();
    if (await emailInput.isEditable()) {
      await emailInput.fill(email);
      await emailInput.press('Tab');
    }
  }

  async fillShippingAddress(firstName: string, lastName: string, address: string, city: string, state: string, zip: string) {
    await this.firstNameInput().fill(firstName);
    await this.lastNameInput().fill(lastName);
    await this.addressInput().fill(address);
    await this.cityInput().fill(city);
    await this.stateSelect().selectOption(state);
    await this.zipInput().fill(zip);
    await this.zipInput().press('Tab');
  }

  async verifyOrderSummary(products: { name: string }[]) {
    for (const product of products) {
      await expect(this.page.locator('p', { hasText: product.name })).toBeVisible();
    }
  }

  async verifyShippingOptions(options: { name: string; price: string }[]) {
    for (const option of options) {
      await expect(this.shippingMethodOption(option.name)).toBeVisible();
    }
  }

  async selectShippingMethod(name: string) {
    await this.shippingMethodOption(name).check();
  }

  async selectStripePayment() {
    await this.stripeRadio().click();
  }

  async fillCardDetails(number: string, expiry: string, cvc: string, country: string, zip: string) {
    await this.cardNumberInput().fill(number);
    await this.cardExpiryInput().fill(expiry);
    await this.cardCvcInput().fill(cvc);
    await this.cardCountrySelect().selectOption(country);
    await this.cardZipInput().fill(zip);
  }

  async placeOrder() {
    await this.termsCheckbox().check();
    await this.payNowButton().click();
    await this.page.waitForLoadState('networkidle');
  }
}
