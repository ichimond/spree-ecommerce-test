import { test, expect } from '@playwright/test';

// Page objects
import { Homepage } from '../pages/HomePage';
import { Account } from '../pages/Account';
import { Product } from '../pages/Product';
import { Checkout } from '../pages/Checkout';

// Test data
import accountData from '../fixture/account.json';
import productData from '../fixture/product.json';

test.describe('Spree Commerce Demo', () => {

    test.beforeEach(async ({ page }) => {
        // 1. Navigate to the Spree Commerce demo store.
        const homepage = new Homepage(page);
        await page.goto('');
    });

    test('E2E E-commerce Journey', async ({ page }) => {
        const homepage = new Homepage(page);
        const account = new Account(page);
        const product = new Product(page);
        const checkout = new Checkout(page);

        await test.step('Sign up with new account', async () => {
            // 2. Click on the user icon and Sign Up as a new user from 
            // the registration page from the side menu. (Log out if needed)
            await homepage.clickAccountIcon();
            await account.signUp(accountData.newUser);
       });
       
        await test.step('Login with the created account', async () => {
            // 3. Log in with the newly registered user credentials.
            await account.login(); 
        });

        await test.step('Browse products and add to cart', async () => {
            // 4. Browse products and open a product detail page.
            await homepage.goBackToHomepage();
            await homepage.shopAllProducts();
            await product.viewProduct(productData.dripCoffee.name);

            // 5. Add the product to cart.
            await expect(page).toHaveURL(productData.dripCoffee.url);
            await product.addToCart();

            //6. Go to the cart and verify the product details (name, quantity, price).
            // 7. Proceed to checkout
            await checkout.proceedToCheckout();
            await checkout.fillAddressDetails(accountData.userAddress);

            await page.evaluate(() => window.scrollBy(0, 600));
            await checkout.fillPaymentDetails(accountData.cardDetails, productData.dripCoffee, 
                accountData.userAddress.country, accountData.userAddress.zipCode);
            // 8. Verify order confirmation
            await checkout.verifyOrderConfirmation(accountData.newUser.firstName); 



            
        });
    });

});