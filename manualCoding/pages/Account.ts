import { expect, Page, Locator } from '@playwright/test';
import { faker } from '@faker-js/faker';

export class Account {
    private page: Page;
    private loginEmail: Locator;
    private loginPassword: Locator
    private signInButton: Locator
    private signUpLink: Locator;
    private createAccountText: Locator
    private firstName: Locator;
    private lastName: Locator;
    private signupEmail: Locator;
    private signupPassword: Locator;
    private confirmPassword: Locator;
    private checkbox: Locator; 
    private createAccountButton: Locator;
    private accountOverview: Locator;
    private signOut: Locator;

    private email: string;
    private password: string;



    constructor(page: Page) {
        this.page = page;

        //Textbox
        this.loginEmail = page.getByRole('textbox', { name: 'Email' });
        this.loginPassword = page.getByRole('textbox', { name: 'Password' });
        this.firstName = page.getByRole('textbox', { name: 'First name' });
        this.lastName = page.getByRole('textbox', { name: 'Last name' });
        this.signupEmail = page.getByRole('textbox', { name: 'Email Email' });
        this.signupPassword = page.getByRole('textbox', { name: 'Password Password' });
        this.confirmPassword = page.getByRole('textbox', { name: 'Confirm Password' });
        this.signOut = page.getByRole('button', { name: 'Sign Out' });
        
        // Buttons
        this.signInButton = page.getByRole('button', { name: 'Sign in' });
        this.createAccountButton = page.getByRole('button', { name: 'Create Account' });

        // Links
        this.signUpLink = page.getByRole('link', { name: 'Sign up' });

        //Text
        this.accountOverview = page.getByRole('heading', { name: 'Account Overview' })
        this.createAccountText = page.getByText('Create Account').first();

        // Checkbox
        this.checkbox = page.getByRole('checkbox', { name: 'I agree to the Privacy Policy' });

        this.email = '';
        this.password = '';
    }

    async signUp(userData: { email: string, 
                                password: string, 
                                firstName: string, 
                                lastName: string }) {

        await this.signUpLink.click();
        await expect(this.createAccountText).toBeVisible();

        //Since email needs to be unique every run, some variation is added
        this.email = userData.email + faker.string.alphanumeric(7) + '@mail.com'
        console.log('Generated email: ', this.email);
        this.password = userData.password;

        await this.firstName.fill(userData.firstName)
        await this.lastName.fill(userData.lastName)
        await this.signupEmail.fill(this.email);
        await this.signupPassword.fill(userData.password);
        await this.confirmPassword.fill(userData.password);
        await this.checkbox.click();
        await this.createAccountButton.click();

        await expect(this.accountOverview).toBeVisible();

        // Sign out to reset state
        await this.signOut.click();
        await expect(this.page).toHaveURL('https://demo.spreecommerce.org/us/en/account');

    }

    async login() {
        await this.loginEmail.fill(this.email);
        await this.loginPassword.fill(this.password);
        await this.signInButton.click();

        await this.page.waitForTimeout(3000);
    }





}
