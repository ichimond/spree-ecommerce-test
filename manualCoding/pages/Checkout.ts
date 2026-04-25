import {expect, Page } from '@playwright/test';

export class Checkout {
    private page: Page;
    private checkoutButton = () => this.page.getByRole('link', { name: 'Checkout' })
    private shippingCountry = () => this.page.getByRole('combobox', { name: 'Country' });
    private shippingAddress = () => this.page.getByRole('textbox', { name: 'Address', exact: true })
    private shippingCity = () => this.page.getByRole('textbox', { name: 'City' });
    private shippingState = () => this.page.getByRole('combobox', { name: 'State / Province' })
    private shippingZip = () => this.page.getByRole('textbox', { name: 'ZIP / Postal Code' })
    private cardNumber = () => this.page.locator('iframe[title="Secure payment input frame"]').nth(0).contentFrame()
        .getByRole('textbox', { name: 'Card number' });
    private cardExpiry = () => this.page.locator('iframe[title="Secure payment input frame"]').nth(0).contentFrame()
        .getByRole('textbox', { name: 'Expiration date MM / YY' });
    private cardCvv = () => this.page.locator('iframe[title="Secure payment input frame"]').nth(0).contentFrame()
        .getByRole('textbox', { name: 'Security code'  });
    private cardCountry = () => this.page.locator('iframe[title="Secure payment input frame"]').nth(0).contentFrame()
    .getByLabel('Country', { exact: true });
    private cardZIP = () => this.page.locator('iframe[title="Secure payment input frame"]').nth(0).contentFrame()
    .getByRole('textbox', { name: 'ZIP code' })
    private payNowBtn = () => this.page.getByRole('button', { name: 'Pay Now' });

    private checkoutItem = (item: string) => this.page.getByRole('paragraph').filter({ hasText:  item  })
    private checkoutItemPrice = (price: string) => this.page.locator(`:text("${price}")`).nth(0);
    private checkoutTotal = (price: string) => this.page.locator(`:text("${price}")`);

    private confirmationText = (name: string) => this.page.getByRole('heading', { name: `Thanks for your order, ${name}!` })
    



    constructor(page: Page) {
        this.page = page;
    }

    async proceedToCheckout() {
        await this.checkoutButton().click();
        await this.page.waitForURL('https://demo.spreecommerce.org/us/en/checkout/cart**');
    }

    async fillAddressDetails(addressData: { country: string, 
                address: string, city: string, 
                state: string, zipCode: string }) {
        
        await this.shippingCountry().selectOption(addressData.country);
        await this.shippingAddress().fill(addressData.address);
        await this.shippingCity().fill(addressData.city);
        await this.shippingState().selectOption(addressData.state);
        await this.shippingZip().fill(addressData.zipCode);
        
    }

    async fillPaymentDetails(cardData: { cardNumber: string, expiryDate: string, cvv: string },
        item: {name: string, checkoutName: string, price: string, total: string, url: string},
        country: string, zipCode: string
    ) {

        await this.cardNumber().fill(cardData.cardNumber);
        await this.cardExpiry().fill(cardData.expiryDate);
        await this.cardCvv().fill(cardData.cvv);

       
        // await this.page.waitForTimeout(10000);
        await expect(this.checkoutItem(item.checkoutName)).toBeVisible();
        await expect(this.checkoutItemPrice(item.price)).toBeVisible();
        await expect(this.checkoutTotal(item.total)).toBeVisible();

        // Weird site behavior:
        // The shipment method only loads at this point, then the original credid carf details get cleared
        // Refilling the card details after the shipment method loads
        await this.cardNumber().fill(cardData.cardNumber);
        await this.cardExpiry().fill(cardData.expiryDate);
        await this.cardCvv().fill(cardData.cvv);
        await this.cardCountry().selectOption(country);
        await this.cardZIP().fill(zipCode);


        await this.payNowBtn().click();

        await this.page.waitForTimeout(5000);


    }

    async verifyOrderConfirmation(name: string) {
        await expect(this.confirmationText(name)).toBeVisible();
    }  

}