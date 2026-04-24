import { expect, Page, Locator } from '@playwright/test';

export class Homepage {
    private page: Page;
    private accountIcon: Locator;
    private shopAll: Locator;
    private spreeIcon = () => this.page.getByRole('link', { name: 'Spree', exact: true });


    constructor(page: Page) {
        this.page = page;
        this.accountIcon = page.locator('a[aria-label="Account"]');
        this.shopAll = page.getByRole('link', { name: 'Shop All' });
    }

    async navigate() {
        await this.page.goto('');
        await expect(this.page).toHaveURL('https://demo.spreecommerce.org/us/en');
    }

    async clickAccountIcon() {
        await this.accountIcon.click();
        await expect(this.page).toHaveURL('https://demo.spreecommerce.org/us/en/account');
    }

    async shopAllProducts() {
        await this.shopAll.click();
        await expect(this.page).toHaveURL('https://demo.spreecommerce.org/us/en/products');
    }   

    async goBackToHomepage() {
        await this.spreeIcon().click();
        await expect(this.page).toHaveURL('https://demo.spreecommerce.org/us/en');
    }


}
