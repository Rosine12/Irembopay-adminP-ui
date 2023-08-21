import { test, expect, Page, chromium } from '@playwright/test';
import * as faker from 'faker';
import dotenv from 'dotenv';

dotenv.config();

const LoginUAT = process.env.LoginUAT!;
const LoginSandBox = process.env.LoginSandBox!;
const AdminEmail = process.env.AdminEmail!;
const AdminPassword = process.env.AdminPassword!;
const mailfortest = process.env.mailfortest!;
const PayOpsMail = process.env.PayOpsMail!;
const PayOpsMailUAT = process.env.PayOpsMailUAT!;
const ForTestEmail = process.env.ForTestEmail!;
const newpassword = process.env.newpassword!;
const InvalidEmail = process.env.InvalidEmail!;
const invalidpassword = process.env.invalidpassword!;

// export class InvoiceGenerator { 
// //     readonly page: Page;

// //     constructor(page: Page) {
// //         this.page = page;
// //     }

// //     async generateInvoice(): Promise<void> {
// //         const randomNumber = Math.floor(Math.random() * 9999999999) + 1;
// //         const transactionId = `BK_${randomNumber}`;

// //         // Generate the request payload
// //         const payload = {
// //             transactionId: transactionId,
// //             paymentItems: [
// //                 {
// //                     code: 'RRA-f0394bd305',
// //                     quantity: 5,
// //                     unitAmount: 100.0,
// //                 },
// //             ],
// //             paymentAccountIdentifier: 'GOR-0303',
// //             customer: {
// //                 phoneNumber: '0787680429',
// //                 email: 'payment.operations@irembo.com',
// //             },
// //         };

// //         // Perform the POST request
// //         const response = await this.sendPostRequest(payload);

// //         // Validate the response
// //         expect(response.status).toEqual(201);
// //         expect(response.success).toBe(true);

// //         // Extract the invoiceNumber from the response
// //         console.log(JSON.stringify(response));
// //         console.log(response.data.invoiceNumber);
// //     }

// //     private async sendPostRequest(payload: any): Promise<any> {
// //         const url = 'https://api.uat.irembopay.com/payments/invoices';
// //         const headers = {
// //             'Content-Type': 'application/json',
// //             key: 'irembopay-secretkey',
// //             Authorization: 'sk_live_9540fe6964dc4fc1843907d1674b014d',
// //         };

// //         // const requestOptions: RequestInit = {
// //         //     method: 'POST',
// //         //     body: JSON.stringify(payload),
// //         //     headers: headers,
// //         // };

// //         // // Pass the url and requestOptions as separate arguments using the rest parameter (...args)
// //         // const response = await this.page.evaluate(
// //         //     async (url, requestOptions) => {
// //         //         return await fetch(url, requestOptions).then((res) => res.json());
// //         //     },
// //         //     url, // First argument: url
// //         //     requestOptions // Second argument: requestOptions
// //         // );

// //         //return response;
// //     }
// }// Invoice generation command

export async function launchBrowser(): Promise<any> {
    return await chromium.launch(); // launch browser
}
export async function createNewPage(browser: any): Promise<Page> {
    return await browser.newPage();
}
export async function navigateToLoginUAT(page: Page): Promise<void> {
    await page.goto(LoginUAT); // display login page
}
export async function navigateToLoginSandBox(page: Page): Promise<void> {
  await page.goto(LoginSandBox); // display login page
}
export async function loginuat(page: Page, email: string = AdminEmail, password: string = AdminPassword): Promise<void> {
 page.setDefaultTimeout(120000);
 await page.goto(LoginUAT, { waitUntil: 'domcontentloaded' });
 await page.type('input[formcontrolname="username"]',email );
 await page.type('input[formcontrolname="password"]',password);
 await page.click("button[type='button']");
}
export async function loginsandbox(page: Page, email: string = AdminEmail, password: string = AdminPassword): Promise<void> {
  page.setDefaultTimeout(60000);
  await page.goto(LoginSandBox, { waitUntil: 'domcontentloaded' });
  await page.type('input[formcontrolname="username"]',email );
  await page.type('input[formcontrolname="password"]',password);
  await page.click("button[type='button']");
}
export async function Login_asPaymentOperations(page: Page, email: string = mailfortest, password: string = newpassword): Promise<void> {
  page.setDefaultTimeout(60000);
  await page.goto(LoginSandBox, { waitUntil: 'domcontentloaded' });
  await page.type('input[formcontrolname="username"]',email );
  await page.type('input[formcontrolname="password"]',password);
  await page.click("button[type='button']");
}
export async function Login_asPaymentOperation(page: Page, email: string = mailfortest, password: string = newpassword): Promise<void> {
  page.setDefaultTimeout(60000);
  await page.goto(LoginSandBox, { waitUntil: 'domcontentloaded' });
  await page.type('input[formcontrolname="username"]',email );
  await page.type('input[formcontrolname="password"]',password);
  await page.click("button[type='button']");
}
export async function Login_asPaymentOperationUAT(page: Page, email: string = PayOpsMailUAT, password: string = newpassword): Promise<void> {
  page.setDefaultTimeout(120000);
  await page.goto(LoginUAT, { waitUntil: 'domcontentloaded' });
  await page.type('input[formcontrolname="username"]',email );
  await page.type('input[formcontrolname="password"]',password);
  await page.click("button[type='button']");
}
export async function SuperAdmindetails(page: Page): Promise<void> {
  const nameLabel = await page.locator('body > modal-container:nth-child(10) > div:nth-child(1) > div:nth-child(1) > app-user-details:nth-child(1) > div:nth-child(2) > div:nth-child(1) > div:nth-child(1) > label:nth-child(1)');
  expect(await nameLabel.textContent()).toBe('Name:');
  const nameValue = await page.locator('body > modal-container:nth-child(10) > div:nth-child(1) > div:nth-child(1) > app-user-details:nth-child(1) > div:nth-child(2) > div:nth-child(1) > div:nth-child(1) > span:nth-child(2)');
  const nameValueText = await nameValue.textContent();
  if (nameValueText !== null) {
    expect(nameValueText).toBe('Irembopay Admin');
    expect(nameValueText.trim()).not.toBe('');
  } else {
    throw new Error('nameValueText is null');
  }
  const phoneNumberLabel = await page.locator('body > modal-container:nth-child(10) > div:nth-child(1) > div:nth-child(1) > app-user-details:nth-child(1) > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > label:nth-child(1)');
  expect(await phoneNumberLabel.textContent()).toBe('Phone Number:');
  const emailLabel = await page.locator('body > modal-container:nth-child(10) > div:nth-child(1) > div:nth-child(1) > app-user-details:nth-child(1) > div:nth-child(2) > div:nth-child(1) > div:nth-child(3) > label:nth-child(1)')
  expect(await emailLabel.textContent()).toBe('Email:');
  const emailValue = await page.locator('body > modal-container:nth-child(10) > div:nth-child(1) > div:nth-child(1) > app-user-details:nth-child(1) > div:nth-child(2) > div:nth-child(1) > div:nth-child(3) > span:nth-child(2)')
  expect(await emailValue.textContent()).toBe(AdminEmail);
  const CreatedONLabel = await page.locator('body > modal-container:nth-child(10) > div:nth-child(1) > div:nth-child(1) > app-user-details:nth-child(1) > div:nth-child(2) > div:nth-child(1) > div:nth-child(4) > label:nth-child(1)')
  expect(await CreatedONLabel.textContent()).toBe('Created on:');
  const CreatedONValue = await page.locator('body > modal-container:nth-child(10) > div:nth-child(1) > div:nth-child(1) > app-user-details:nth-child(1) > div:nth-child(2) > div:nth-child(1) > div:nth-child(4) > span:nth-child(2)')
  expect(await CreatedONValue.textContent()).toBe('2 Jun 2023, 4:44 PM');
  const ActivatedONLabel = await page.locator('body > modal-container:nth-child(10) > div:nth-child(1) > div:nth-child(1) > app-user-details:nth-child(1) > div:nth-child(2) > div:nth-child(1) > div:nth-child(5) > label:nth-child(1)')
  expect(await ActivatedONLabel.textContent()).toBe('Activated on:');
  const ActivatedONValue = await page.locator('body > modal-container:nth-child(10) > div:nth-child(1) > div:nth-child(1) > app-user-details:nth-child(1) > div:nth-child(2) > div:nth-child(1) > div:nth-child(5) > span:nth-child(2)')
  expect(await ActivatedONValue.textContent()).toBe('2 Jun 2023, 4:44 PM');
  const StatusLabel = await page.locator('body > modal-container:nth-child(10) > div:nth-child(1) > div:nth-child(1) > app-user-details:nth-child(1) > div:nth-child(2) > div:nth-child(1) > div:nth-child(8) > label:nth-child(1)')
  expect(await StatusLabel.textContent()).toBe('Status:');
  const StatusValue = await page.locator('.badge.badge-success')
  expect(await StatusValue.textContent()).toBe(' ACTIVE ');
  const currentDate = new Date();
  const currentTimestamp = `${currentDate.getDate()} ${currentDate.toLocaleString('en-US', { month: 'short' })} ${currentDate.getFullYear()}`;
  //console.log('Current Date:', currentTimestamp);
  const lastLoginTimeLocator = page.locator('.col-12 > .font-weight-bold:has-text("Last login time:") + span');
  const lastLoginTime = await lastLoginTimeLocator.textContent();
  if (lastLoginTime !== null) {
    const expectedTimestamp = `${new Date(lastLoginTime).getDate()} ${new Date(lastLoginTime).toLocaleString('en-US', { month: 'short' })} ${new Date(lastLoginTime).getFullYear()}`;
    // Check if the last login time matches the current date
    expect(expectedTimestamp.trim()).toBe(currentTimestamp);
  } else {
    throw new Error('lastLoginTime is incorrect');
  }
}
export async function PaymentOpsdetails(page: Page): Promise<void> {
  const nameLabel = await page.locator('body > modal-container:nth-child(10) > div:nth-child(1) > div:nth-child(1) > app-user-details:nth-child(1) > div:nth-child(2) > div:nth-child(1) > div:nth-child(1) > label:nth-child(1)');
  expect(await nameLabel.textContent()).toBe('Name:');
  const nameValue = await page.locator('body > modal-container:nth-child(10) > div:nth-child(1) > div:nth-child(1) > app-user-details:nth-child(1) > div:nth-child(2) > div:nth-child(1) > div:nth-child(1) > span:nth-child(2)');
  const nameValueText = await nameValue.textContent();
  if (nameValueText !== null) {
    expect(nameValueText).toBe('PaymentOps Ops');
    expect(nameValueText.trim()).not.toBe('');
  } else {
    throw new Error('nameValueText is null');
  }
  const phoneNumberLabel = await page.locator('body > modal-container:nth-child(10) > div:nth-child(1) > div:nth-child(1) > app-user-details:nth-child(1) > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > label:nth-child(1)');
  expect(await phoneNumberLabel.textContent()).toBe('Phone Number:');
  const emailLabel = await page.locator('body > modal-container:nth-child(10) > div:nth-child(1) > div:nth-child(1) > app-user-details:nth-child(1) > div:nth-child(2) > div:nth-child(1) > div:nth-child(3) > label:nth-child(1)')
  expect(await emailLabel.textContent()).toBe('Email:');
  const emailValue = await page.locator('body > modal-container:nth-child(10) > div:nth-child(1) > div:nth-child(1) > app-user-details:nth-child(1) > div:nth-child(2) > div:nth-child(1) > div:nth-child(3) > span:nth-child(2)')
  expect(await emailValue.textContent()).toBe(mailfortest);
  const CreatedONLabel = await page.locator('body > modal-container:nth-child(10) > div:nth-child(1) > div:nth-child(1) > app-user-details:nth-child(1) > div:nth-child(2) > div:nth-child(1) > div:nth-child(4) > label:nth-child(1)')
  expect(await CreatedONLabel.textContent()).toBe('Created on:');
  const CreatedONValue = await page.locator('body > modal-container:nth-child(10) > div:nth-child(1) > div:nth-child(1) > app-user-details:nth-child(1) > div:nth-child(2) > div:nth-child(1) > div:nth-child(4) > span:nth-child(2)')
  expect(await CreatedONValue.textContent()).toBe('17 Jul 2023, 5:18 PM');
  const ActivatedONLabel = await page.locator('body > modal-container:nth-child(10) > div:nth-child(1) > div:nth-child(1) > app-user-details:nth-child(1) > div:nth-child(2) > div:nth-child(1) > div:nth-child(5) > label:nth-child(1)')
  expect(await ActivatedONLabel.textContent()).toBe('Activated on:');
  const ActivatedONValue = await page.locator('body > modal-container:nth-child(10) > div:nth-child(1) > div:nth-child(1) > app-user-details:nth-child(1) > div:nth-child(2) > div:nth-child(1) > div:nth-child(5) > span:nth-child(2)')
  expect(await ActivatedONValue.textContent()).toBe('17 Jul 2023, 5:18 PM');
  const StatusLabel = await page.locator('body > modal-container:nth-child(10) > div:nth-child(1) > div:nth-child(1) > app-user-details:nth-child(1) > div:nth-child(2) > div:nth-child(1) > div:nth-child(8) > label:nth-child(1)')
  expect(await StatusLabel.textContent()).toBe('Status:');
  const StatusValue = await page.locator('.badge.badge-success')
  expect(await StatusValue.textContent()).toBe(' ACTIVE ');
  const currentDate = new Date();
  const currentTimestamp = `${currentDate.getDate()} ${currentDate.toLocaleString('en-US', { month: 'short' })} ${currentDate.getFullYear()}`;
  //console.log('Current Date:', currentTimestamp);
  const lastLoginTimeLocator = page.locator('.col-12 > .font-weight-bold:has-text("Last login time:") + span');
  const lastLoginTime = await lastLoginTimeLocator.textContent();
  if (lastLoginTime !== null) {
    const expectedTimestamp = `${new Date(lastLoginTime).getDate()} ${new Date(lastLoginTime).toLocaleString('en-US', { month: 'short' })} ${new Date(lastLoginTime).getFullYear()}`;
    // Check if the last login time matches the current date
    expect(expectedTimestamp.trim()).toBe(currentTimestamp);
  } else {
    throw new Error('lastLoginTime is incorrect');
  }
}
export async function validateNumberOfUsers10(page: Page) {
  const userRows = await page.$$('table tbody tr');
  if (userRows.length !== 10) {
      throw new Error(`Expected 10 users, but found ${userRows.length}`);
  }
} 
export async function validateNumberOfUsers1(page: Page) {
  const userRows = await page.$$('table tbody tr');
  if (userRows.length !== 1) {
      throw new Error(`Expected 1 users, but found ${userRows.length}`);
  }
} 
export async function toggleOnOff(page: Page): Promise<void> {
    const toggleOnCount = await page.locator('button[tooltip="Deactivate"]').count();
    if (toggleOnCount > 0) {
        await page.locator('button[tooltip="Deactivate"]').click({ force: true });
        await page.locator('button:has-text("Proceed")').click({ force: true });
        await page.locator('#toast-container').filter({ hasText: 'Successful' })
        await page.waitForTimeout(3000);
        await page.locator('button:has-text("Close")').click({ force: true });
    }
    await page.locator('a[tooltip="Logout"]').click();
    await page.waitForTimeout(2000);
    await page.locator('input[formcontrolname="username"]').fill(ForTestEmail);;
    await page.locator('input[formcontrolname="password"]').fill(AdminPassword);
    await page.click("button[type='button']");
    await page.locator('#toast-container').filter({ hasText: 'Sorry, the credentials are invalid or the account is not active' });
    await page.reload();
    await loginsandbox(page);
    await page.locator('input[formcontrolname="email"]').fill(ForTestEmail);
    await page.click('button[type="button"].btn.btn-primary.btn-sm.btn-round.btn-block.waves-effect.pull-right.m-b-20.custom');
    await page.locator('span.btn.btn-primary.btn-sm.pointer.ng-star-inserted').click();
    const toggleOffCount = await page.locator('button[tooltip="Activate"]').count();
    if (toggleOffCount > 0) {
        await page.locator('button[tooltip="Activate"]').click({ force: true });
        await page.locator('button:has-text("Proceed")').click({ force: true });
        await page.locator('#toast-container').filter({ hasText: 'Successful' })
        await page.waitForTimeout(4000);
        await page.locator('button:has-text("Close")').click({ force: true });
    }
 
}
export async function generateRandomFirstName(): Promise<string> {
  return faker.name.firstName();
}
export async function generateRandomLastName(): Promise<string> {
  return faker.name.lastName();
}
export async function generateRandomYopmailEmail(): Promise<string> {
  const username = faker.internet.userName().replace(/[^a-z0-9]/gi, '');
  return `${username}@yopmail.com`;
}
export async function generateRandomRwandanPhoneNumber(): Promise<string> {
  const phoneNumber = faker.phone.phoneNumber('078#######');
  return phoneNumber;
}


  