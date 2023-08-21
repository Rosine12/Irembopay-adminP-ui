import { navigateToLoginUAT, loginuat } from '../../playwrightHelpers';
import { test, expect, Page } from '@playwright/test';
import MailSlurp from 'mailslurp-client';
import dotenv from 'dotenv';
import faker from 'faker';

dotenv.config();
const newpassword = dotenv.config().parsed!.newpassword;
const PhoneNumber = dotenv.config().parsed!.PhoneNumber;
const APIkey = dotenv.config().parsed!.APIkey;
const mailLink_uat = new RegExp(dotenv.config().parsed!.mailLink_uat);

test.describe('Automate: create payemnt operations & email Signup ', () => {
  let page;
  test.beforeEach(async ({ browser }) => {
      page = await browser.newPage();
      await navigateToLoginUAT(page);
  });
  test.afterEach(async () => {
      await page.close();

  });
  test(' Workflow', async ({ page }) => {
  // Step 01: Login actions
  await loginuat(page);
  // Step 02: Navigate & click on 
  await page.click(".btn.btn-success.btn-sm.btn-block.waves-effect.text-center.m-b-20.ng-star-inserted");//"+Invite New User"
  // Step 03: Select the role as "Payment Operations"
  await page.selectOption(".form-control.ng-untouched.ng-pristine.ng-invalid.ng-star-inserted", { value: 'PAYMENT_OPERATIONS' }); 
  // Step 04: Fill in random firstName
  const firstName = faker.name.firstName();
  await page.locator('input[formcontrolname="firstName"]').fill(firstName)
  // Step 05: Fill in random lastName
  const lastName = faker.name.lastName();
  await page.locator('input[formcontrolname="lastName"]').fill(lastName);
  // Step 06: Generale mailurp email & Fill it in
  const mailslurp = new MailSlurp({ apiKey: APIkey});//Generate & fill a new email from "MailSlurp" API 
  const { emailAddress, id } = await mailslurp.createInbox();
  await page.waitForTimeout(5000)
  await page.locator('input[formcontrolname="email"]').fill(emailAddress);
  // Step 07:  Fill in phone number
  await page.locator('#phone').fill(PhoneNumber);
  // Step 08: Click on "submit"
  await page.locator('button[type="submit"].btn-primary').click();
  // Step 09: Validate error message 
  await page.locator('#toast-container').filter({ hasText: 'User invited successfully' });
  await page.waitForTimeout(3000);
  // Step 09: Retrieve the activation link from the email sent
  const email = await mailslurp.waitForLatestEmail(id,30000,true); 
  const activationLink = email?.body?.match(mailLink_uat);
  const link = !!activationLink ? activationLink[0] : '';
  // Step 10: Click on the activation link to activate the user account
  await page.goto(link,{ waitUntil: 'domcontentloaded' }); 
  // Step 11: Fill in new password
  await page.locator("input[formcontrolname='password']").fill(newpassword);
  await page.waitForTimeout(1000);
  // Step 12: Confirm and fill in the new password
  await page.locator("input[formcontrolname='confirmPassword']").fill(newpassword); 
  await page.waitForTimeout(1000);
  // Step 13: Click on "Submit"
  await page.click("button[type='button']");
  await page.waitForTimeout(1000);
  // Step 14: The user should be successfully activated
  await page.locator('#toast-container').filter({ hasText: 'User accepted successfully' });
  // Step 15: The admin portal login form should open
  // Step 16: Login with the new email generated from MailSlurp
  await page.locator('input[formcontrolname="username"]').fill(emailAddress);;
  await page.locator('input[formcontrolname="password"]').fill(newpassword);
  // Step 17: Click on the button "Sign In"
  await page.locator('button[type="button"].btn.btn-primary.btn-md.btn-block.waves-effect.text-center.m-b-20').click();
  // Step 18: The user should land in the admin dashboard
  await page.waitForTimeout(3000);  
  const pageTitle = await page.title();
  expect(pageTitle).toBe('Users | IremboPay Admin');
});
})








