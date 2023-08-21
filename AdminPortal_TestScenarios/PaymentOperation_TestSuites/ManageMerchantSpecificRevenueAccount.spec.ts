import { navigateToLoginUAT, loginsandbox, Login_asPaymentOperationUAT} from '../../playwrightHelpers';
import { test, expect, Page } from '@playwright/test';
import dotenv from 'dotenv';
import faker from 'faker';

dotenv.config();
const newpassword = dotenv.config().parsed!.newpassword;
const PhoneNumber = dotenv.config().parsed!.PhoneNumber;
const PAYoPS = dotenv.config().parsed!.PAYoPS;

test.describe('create a merchant admin & activate the account', () => {
    let page;
    const word = faker.random.word();
    const url = faker.internet.url();
    const username = Math.random().toString(36).substring(2, 10);
    const email = `${username}@yopmail.com`;
    test.beforeEach(async ({ browser }) => {
        page = await browser.newPage();
        await navigateToLoginUAT(page);
    });
    test.afterEach(async () => {
        await page.close();
    });
    test('should create merchant specific revenue account', async () => {
    await Login_asPaymentOperationUAT(page);
    await page.click('a[href="/account-management"][appaccordiontoggle]');
    await page.click(".btn.btn-success.btn-sm.btn-block.waves-effect.text-center.m-b-20.ng-star-inserted");//"+Invite New User"
    await page.selectOption('.form-control[formcontrolname="type"]', { value: 'GOVERNMENT' }); 
    const word = faker.random.word();
    await page.locator('input[formcontrolname="name"]').fill(word);
    await page.locator('input[formcontrolname="notificationCallbackUrl"]').fill(url);
    await page.locator('input[formcontrolname="email"][placeholder="Account\'s Email Address"]').fill(email);
    await page.locator('input[formcontrolname="email"][placeholder="Admin Email Address"]').fill(PAYoPS)
    await page.click('button.btn-sm.btn-primary.btn-outline-primary:has-text("Proceed with user")');
    await page.click('button.btn.btn-primary.btn-sm.btn-block.waves-effect.text-center.m-b-20[type="submit"]:has-text("Submit")');
    await page.locator('#toast-container').filter({ hasText: 'Merchant Created successfully' });
    await page.waitForTimeout(3000)
    await page.click('a[href="/payment-accounts"]:has-text("Payment Accounts")'); // payment account
    await page.click('button.btn-success:has-text("Add New Payment Account")');
    const accountName = faker.finance.accountName();
    await page.locator('input[formcontrolname="accountName"][placeholder="Account Name"]').fill(accountName);
    const accountNumber = faker.finance.account(14);  // Assuming account numbers are 14 digits long
    await page.locator('input[formcontrolname="accountNumber"][placeholder="Account Number"]').fill(accountNumber);
    const identifier = faker.random.alphaNumeric(6);
    await page.locator('input[formcontrolname="identifier"][placeholder="Identifier"]').fill(identifier);
    await page.selectOption('select[formcontrolname="type"]', { value: 'IREMBO_REVENUE'});
    const optionsValues = await page.$$eval('select[formcontrolname="currency"] option:not(:first-child)', options => 
        options.map(option => option.value)
    );
    const randomCurrency = optionsValues[Math.floor(Math.random() * optionsValues.length)];
    await page.selectOption('select[formcontrolname="currency"]', randomCurrency);
    await page.waitForTimeout(3000)
    const bankCodes = await page.$$eval('select[formcontrolname="bankCode"] option:not(:first-child)', options => 
        options.map(option => option.value)
    );
    const randomBankCode = bankCodes[Math.floor(Math.random() * bankCodes.length)];
    await page.selectOption('select[formcontrolname="bankCode"]', randomBankCode);
    await page.waitForTimeout(2000)
    await page.locator('input[formcontrolname="merchantId"][placeholder="Account Name"]').fill(word);
    await page.locator('#toast-container').filter({ hasText: 'Payment Account Created successfully' });
    await page.waitForTimeout(3000)
    await page.click('a[href="/account-management"][appaccordiontoggle]');
    await page.selectOption('.form-control[formcontrolname="type"]', { value: 'GOVERNMENT' }); 
    await page.click('button[type="button"].btn.btn-primary.btn-sm.btn-round.btn-block.waves-effect.pull-right.m-b-20.custom');
    const cell = await page.locator(`td:has-text("${word}")`);
    const cellText = await cell.textContent();
    expect(cellText).toBe(word);
});
    test('should retrieve merchant specific revenue account', async () => {
        await Login_asPaymentOperationUAT(page);
        await page.click('a[href="/account-management"][appaccordiontoggle]');
        await page.selectOption('.form-control[formcontrolname="type"]', { value: 'GOVERNMENT' }); 
        await page.click('button[type="button"].btn.btn-primary.btn-sm.btn-round.btn-block.waves-effect.pull-right.m-b-20.custom');
        const cell = await page.locator(`td:has-text("${word}")`);
        const cellText = await cell.textContent();
        expect(cellText).toBe(word);
    });
    test('should update merchant specific revenue account', async () => {
        await Login_asPaymentOperationUAT(page);
        await page.click('a[href="/account-management"][appaccordiontoggle]');
        await page.selectOption('.form-control[formcontrolname="type"]', { value: 'GOVERNMENT' }); 
        await page.click('button[type="button"].btn.btn-primary.btn-sm.btn-round.btn-block.waves-effect.pull-right.m-b-20.custom');
        await page.click('button[tooltip="Edit"].btn.btn-sm.btn-primary.ng-star-inserted');
        await page.locator('input[formcontrolname="email"][type="email"][placeholder="Account\'s Email Address"]').fill(email)
        await page.click('button[type="submit"].btn.btn-primary.btn-sm.waves-effect.text-center:has-text("Submit")');
        await page.locator('#toast-container').filter({ hasText: 'Merchant updated successfully' });
    });
    test('should delete merchant specific revenue account', async () => {
    });
})