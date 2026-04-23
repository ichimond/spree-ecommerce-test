import { expect, Page, Locator } from '@playwright/test';

export class Homepage {
    private page: Page;
    private accountIcon: Locator;


    constructor(page: Page) {
        this.page = page;
        this.accountIcon = page.locator('a[aria-label="Account"]');
    }

    async navigate() {
        await this.page.goto('');
        await expect(this.page).toHaveURL('https://demo.spreecommerce.org/us/en');
    }

    async clickAccountIcon() {
        await this.accountIcon.click();
        await expect(this.page).toHaveURL('https://demo.spreecommerce.org/us/en/account');
    }


}
