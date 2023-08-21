import { test, expect } from '@playwright/test';
import { navigateToLoginSandBox,loginsandbox,Login_asPaymentOperations, SuperAdmindetails, PaymentOpsdetails, toggleOnOff, validateNumberOfUsers10, validateNumberOfUsers1 } from '../../playwrightHelpers';
import faker from 'faker';
import dotenv from 'dotenv';
dotenv.config();
const InvalidEmail = dotenv.config().parsed!.InvalidEmail;
const invalidpassword = dotenv.config().parsed!.invalidpassword;
const ForTestEmail = dotenv.config().parsed!.ForTestEmail;
const mailfortest = dotenv.config().parsed!.mailfortest;
const PaymentOperationEmail = dotenv.config().parsed!.PaymentOperationEmail;
const PhoneNumber = dotenv.config().parsed!.PhoneNumber;
const AdminEmail = dotenv.config().parsed!.AdminEmail;
const AdminPassword = dotenv.config().parsed!.AdminPassword;
const OtherPassword = dotenv.config().parsed!.OtherPassword;


test.describe('User authentications behaviors', () => {
    let page;
    test.beforeEach(async ({ browser }) => {
        page = await browser.newPage();
        await navigateToLoginSandBox(page);
    });
    test.afterEach(async ({ page }) => {
        await page.close();
    });
    test('should alert on invalid email login', async () => {
        await loginsandbox(page, InvalidEmail);
        await page.locator('#toast-container').filter({ hasText: 'Sorry, the credentials are invalid or the account is not active' });
    });
    test('should alert on invalid password login', async () => {
        await loginsandbox(page, invalidpassword);
        await page.locator('#toast-container').filter({ hasText: 'Sorry, the credentials are invalid or the account is not active' });
    });
    test('should redirect to HomePage post-login', async () => {
        await loginsandbox(page);
        await page.waitForTimeout(2000);
        await expect(page).toHaveTitle('IremboPay Admin')
        await page.locator('input[formcontrolname="email"]').fill(AdminEmail) 
        await page.click('button[type="button"].btn.btn-primary.btn-sm.btn-round.btn-block.waves-effect.pull-right.m-b-20.custom');// search
        await page.locator('.btn.btn-info.btn-sm.ng-star-inserted').click({force:true}) //eye
        await SuperAdmindetails(page)
    });
    test('should alert on empty credential submission', async () => {
        const logo = page.locator('div.text-center')
        await expect (logo).toBeVisible()
        await page.click("button[type='button']");
        await page.locator('#toast-container').filter({ hasText: 'Please fill out required fields' })
    }); 
    test('should alert on unactivated account login', async () => {
        await loginsandbox(page);
        await page.click(".btn.btn-success.btn-sm.btn-block.waves-effect.text-center.m-b-20.ng-star-inserted"); // +Invite user
        await page.selectOption(".form-control.ng-untouched.ng-pristine.ng-invalid.ng-star-inserted", { value: 'PAYMENT_OPERATIONS' });
        const firstName = faker.name.firstName();
        await page.type("input[placeholder='First name']", firstName);
        const lastName = faker.name.lastName();
        await page.type("input[placeholder='Last name']", lastName);
        const randomEmail = faker.internet.email();
        await page.locator('input[formcontrolname="email"]').fill(randomEmail);
        await page.locator('#phone').fill(PhoneNumber);
        await page.locator('button[type="submit"].btn-primary').click();
        await page.locator('#toast-container').filter({ hasText: 'User invited successfully' })
        await page.waitForTimeout(3000);
        await page.locator('a[tooltip="Logout"]').click();
        await page.locator('input[formcontrolname="username"]').fill(randomEmail);;
        await page.locator('input[formcontrolname="password"]').fill(OtherPassword);
        await page.click("button[type='button']");
        await page.locator('#toast-container').filter({ hasText: 'Sorry, the credentials are invalid or the account is not active' });
        await page.waitForTimeout(1000);

    });
    test('should confirm re-sent invitation', async () => {
        await loginsandbox(page);
        await page.locator('a[appaccordiontoggle].ng-star-inserted[href="/invites"]').click({force:true});
        await page.locator(`tbody tr:nth-child(1) td:nth-child(6) button:nth-child(1) i:nth-child(1)`).click({force:true});
        await page.locator('#toast-container').filter({ hasText: 'Invitation sent!'})
    });
    test('should block login for disabled user', async () => {
        await loginsandbox(page);
        await page.locator('input[formcontrolname="email"]').fill(ForTestEmail);
        await page.click('button[type="button"].btn.btn-primary.btn-sm.btn-round.btn-block.waves-effect.pull-right.m-b-20.custom');
        await page.locator('span.btn.btn-primary.btn-sm.pointer.ng-star-inserted').click();
        await toggleOnOff(page)
    });
    test('should display & validate payment operation details', async () => {
        await Login_asPaymentOperations(page);
        await page.locator('input[formcontrolname="email"]').fill(mailfortest) // email
        await page.click('button[type="button"].btn.btn-primary.btn-sm.btn-round.btn-block.waves-effect.pull-right.m-b-20.custom');// search
        const viewDetailsButton = page.locator('button[tooltip="View Details"]');
        await viewDetailsButton.click()
        await PaymentOpsdetails(page)
    });
    test('should alert on maxed login attempts', async () => {
        const randomEmail = faker.internet.email();
        await page.locator('input[formcontrolname="username"]').fill(randomEmail);
        await page.locator('input[formcontrolname="password"]').fill(OtherPassword);
        const numberOfAttempts = 6;
        for (let i = 0; i < numberOfAttempts; i++) {
            await page.click("button[type='button']");
            await page.waitForTimeout(1000);
        }
        const errorMessage = await page.locator('#toast-container').filter({ hasText: 'Sorry, you have reached the maximum login attempts. Try again in 5 minutes' }).first().innerText();
        console.log(errorMessage);
    });
    test('should confirm updated user details', async () => {
        await loginsandbox(page);
        await page.locator(`input[formcontrolname="email"]`).fill(PaymentOperationEmail);
        await page.click('button[type="button"].btn.btn-primary.btn-sm.btn-round.btn-block.waves-effect.pull-right.m-b-20.custom');
        const editButton = page.locator('button[tooltip="Edit"]');
        await editButton.click();
    
        const firstName = faker.name.firstName();
        const firstNameInput = page.locator("input[formcontrolname='firstName']");
        await firstNameInput.click();
        await page.keyboard.press('Control+A');
        await page.keyboard.press('Backspace'); 
        await firstNameInput.fill(firstName);
    
        const lastName = faker.name.lastName();
        const lastNameInput = page.locator("input[formcontrolname='lastName']");
        await lastNameInput.click();
        await page.keyboard.press('Control+A');
        await page.keyboard.press('Backspace'); 
        await lastNameInput.fill(lastName);
    
        const phoneInput = page.locator('#phone');
        await phoneInput.click();
        await page.keyboard.press('Control+A'); 
        await page.keyboard.press('Backspace'); 
        await phoneInput.fill(PhoneNumber);
    
        await page.locator("button[type='submit']").click();
        await await page.locator('#toast-container').filter({ hasText: 'Successful'}).click()// error message
    })
    test('should reset and validate user search', async () => {
        await loginsandbox (page);
        await page.locator(`input[formcontrolname="email"]`).fill(mailfortest) // email
        await page.click('button[type="button"].btn.btn-primary.btn-sm.btn-round.btn-block.waves-effect.pull-right.m-b-20.custom');// search
        await page.waitForTimeout(2000);
        await validateNumberOfUsers1(page)
        await page.click('button[type="reset"].btn.btn-warning.btn-round.btn-sm.btn-block.waves-effect.pull-right.m-b-20.custom');// clear
        await page.waitForTimeout(2000);
        await validateNumberOfUsers10(page)
    });
});
 









