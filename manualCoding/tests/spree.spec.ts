import { test, expect } from '@playwright/test';

// Page objects
import { Homepage } from '../pages/HomePage';
import { Account } from '../pages/Account';
import { Product } from '../pages/Product';

// Test data
import accountData from '../fixture/account.json';
import productData from '../fixture/product.json';

test.describe('Spree Commerce Demo', () => {

    test.beforeEach(async ({ page }) => {
        const homepage = new Homepage(page);
        await page.goto('');
    });

    test('E2E E-commerce Journay', async ({ page }) => {
       const homepage = new Homepage(page);
       const account = new Account(page);
       const product = new Product(page);

        await test.step('Navigate to homepage', async () => {
            await homepage.clickAccountIcon();
            await account.signUp(accountData.newUser);
       });
       
        await test.step('Login with the created account', async () => {
            await account.login(); 
        });

        await test.step('Browse products and add to cart', async () => {
            await page.goto('');
            await homepage.shopAllProducts();
            await product.viewProduct(productData.dripCoffee.name);
            await expect(page).toHaveURL(productData.dripCoffee.url);
            await product.addToCart();
            await page.waitForTimeout(5000); 
            
        });
    });

});