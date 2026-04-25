import { expect, Page, Locator } from '@playwright/test';
import { faker } from '@faker-js/faker';

export class Account {
    private page: Page;

    //Textbox
    private loginEmail = () =>  this.page.getByRole('textbox', { name: 'Email' });
    private loginPassword = () => this.page.getByRole('textbox', { name: 'Password' });
    private signInButton = () => this.page.getByRole('button', { name: 'Sign in' });
    private signUpLink = () => this.page.getByRole('link', { name: 'Sign up' });
    private createAccountText = () => this.page.getByText('Create Account').first();
    private firstName = () => this.page.getByRole('textbox', { name: 'First name' });
    private lastName = () => this.page.getByRole('textbox', { name: 'Last name' });
    private signupEmail = () => this.page.getByRole('textbox', { name: 'Email Email' });
    private signupPassword = () => this.page.getByRole('textbox', { name: 'Password Password' });
    private confirmPassword = () => this.page.getByRole('textbox', { name: 'Confirm Password' });
    private checkbox = () => this.page.getByRole('checkbox', { name: 'I agree to the Privacy Policy' });
    private createAccountButton = () => this.page.getByRole('button', { name: 'Create Account' });
    private accountOverview = () => this.page.getByRole('heading', { name: 'Account Overview' });
    private signOut = () => this.page.getByRole('button', { name: 'Sign Out' });

    private email: string;
    private password: string;



    constructor(page: Page) {
        this.page = page;

        this.email = '';
        this.password = '';
    }

    async signUp(userData: { email: string, 
                                password: string, 
                                firstName: string, 
                                lastName: string }) {

        await this.signUpLink().click();
        await expect(this.createAccountText()).toBeVisible();

        //Since email needs to be unique every run, some variation is added
        this.email = userData.email + faker.string.alphanumeric(7) + '@mail.com'
        console.log('Generated email: ', this.email);
        this.password = userData.password;

        await this.firstName().fill(userData.firstName)
        await this.lastName().fill(userData.lastName)
        await this.signupEmail().fill(this.email);
        await this.signupPassword().fill(userData.password);
        await this.confirmPassword().fill(userData.password);
        await this.checkbox().click();
        await this.createAccountButton().click();

        await expect(this.accountOverview()).toBeVisible();

        // Sign out to reset state
        await this.signOut().click();
        await expect(this.page).toHaveURL('https://demo.spreecommerce.org/us/en/account');

    }

    async login() {
        await this.loginEmail().fill(this.email);
        await this.loginPassword().fill(this.password);
        await this.signInButton().click();
    }





}
