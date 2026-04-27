import { expect, Page, Locator } from '@playwright/test';

export class Homepage {
    private page: Page;
    private accountIcon = () => this.page.locator('a[aria-label="Account"]');
    private shopAll = () => this.page.getByRole('link', { name: 'Shop All' });
    private spreeIcon = () => this.page.getByRole('link', { name: 'Spree', exact: true });


    constructor(page: Page) {
        this.page = page;
    }

    async navigate() {
        await this.page.goto('');
        await expect(this.page).toHaveURL('https://demo.spreecommerce.org/us/en');
    }

    async clickAccountIcon() {
        await this.accountIcon().click();
        await expect(this.page).toHaveURL('https://demo.spreecommerce.org/us/en/account');
    }

    async shopAllProducts() {
        await this.shopAll().click();
        await expect(this.page).toHaveURL('https://demo.spreecommerce.org/us/en/products');
    }   

    async goBackToHomepage() {
        await this.spreeIcon().click();
        await expect(this.page).toHaveURL('https://demo.spreecommerce.org/us/en');
    }


}
