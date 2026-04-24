import { expect, Page, Locator } from '@playwright/test';

export class Product {
    private page: Page;

    //Using different method of declaring objects at this point to show flexibility
    private  productLink = (name: string) => this.page.getByRole('link', { name });
    private addToCartBtn = () => this.page.getByRole('button', { name: 'Add to Cart' })

    constructor(page: Page) {
        this.page = page;
    }

    async viewProduct(name: string) {
        await this.productLink(name).click();
    }

    async addToCart() {
        await this.addToCartBtn().click();
    }
}