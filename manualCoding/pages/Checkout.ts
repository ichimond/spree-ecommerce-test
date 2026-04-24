import {expect, Page } from '@playwright/test';

export class Checkout {
    private page: Page;
    private checkoutButton = () => this.page.getByRole('link', { name: 'Checkout' })
    private shippingCountry = () => this.page.getByRole('combobox', { name: 'Country' });
    private shippingAddress = () => this.page.getByRole('textbox', { name: 'Address', exact: true })
    private shippingCity = () => this.page.getByRole('textbox', { name: 'City' });
    private shippingState = () => this.page.getByRole('combobox', { name: 'State / Province' })
    private shippingZip = () => this.page.getByRole('textbox', { name: 'ZIP / Postal Code' })
    // private cardNumber = () => this.page.frameLocator('ifrane[name= "__privateStripeFrame6617"]')
    //    .getByRole('textbox', { name: 'Card number' });
    private cardNumber = () => this.page.getByRole('textbox', { name: 'Card number' });
    



    constructor(page: Page) {
        this.page = page;
    }

    async proceedToCheckout() {
        await this.checkoutButton().click();
        await await this.page.waitForURL('https://demo.spreecommerce.org/us/en/checkout/cart**');
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

    async fillPaymentDetails(cardData: { cardNumber: string, expiryDate: string, cvv: string }) {
        await this.cardNumber().fill(cardData.cardNumber);
    }
}