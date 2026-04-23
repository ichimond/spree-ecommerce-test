import { test, expect } from '@playwright/test';

// Page objects
import { Homepage } from '../pages/HomePage';
import { Account } from '../pages/Account';

// Test data
import accountData from '../.github/workflows/fixture/account.json';

test.describe('Spree Commerce Demo', () => {
    let account: Account;

    test.beforeEach(async ({ page }) => {
        const homepage = new Homepage(page);
        await page.goto('');
    });

    test('Sign up for new account', async ({ page }) => {
       const homepage = new Homepage(page);
       account = new Account(page);


       await homepage.clickAccountIcon();
       await account.signUp(accountData.newUser);


    });

});