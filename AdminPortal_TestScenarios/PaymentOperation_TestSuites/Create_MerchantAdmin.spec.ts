import { navigateToLoginUAT, loginsandbox, Login_asPaymentOperationUAT} from '../../playwrightHelpers';
import { test, expect, Page } from '@playwright/test';
import MailSlurp from 'mailslurp-client';
import dotenv from 'dotenv';
import faker from 'faker';

dotenv.config();
const newpassword = dotenv.config().parsed!.newpassword;
const PhoneNumber = dotenv.config().parsed!.PhoneNumber;
const PAYoPS = dotenv.config().parsed!.PAYoPS;
const APIkey = dotenv.config().parsed!.APIkey;
const mailLink_uat = new RegExp(dotenv.config().parsed!.mailLink_uat);
const custom_uat = new RegExp(dotenv.config().parsed!.custom_uat);

test.describe('create a merchant admin & activate the account', () => {
  let page;
  test.beforeEach(async ({ browser }) => {
      page = await browser.newPage();
      await navigateToLoginUAT(page);
  });
  // test.afterEach(async () => {
  //     await page.close();
  // });
  test('Workflow', async ({ page }) => {
  // Step 01: Login actions
  await Login_asPaymentOperationUAT(page);
  // Step 02: Navigate to Merchant management
  await page.click('a[href="/account-management"][appaccordiontoggle]');
  // Step 02: Navigate & click on 
  await page.click(".btn.btn-success.btn-sm.btn-block.waves-effect.text-center.m-b-20.ng-star-inserted");//"+Invite New User"
  // Step 03: Select an account type "Business"
  await page.selectOption('.form-control[formcontrolname="type"]', { value: 'BUSINESS' }); 
  // Step 04: Fill in random word
  await page.waitForTimeout(2000)
  const word = faker.random.word();
  await page.locator('input[formcontrolname="name"]').fill(word);
  // const firstName = faker.name.firstName();
  // await page.locator('input[formcontrolname="name"]').fill(firstName)
  // Step 05: Fill in notification url
  const url = faker.internet.url();
  await page.locator('input[formcontrolname="notificationCallbackUrl"]').fill(url);
  // Step 06: Fill in random mail
  const mailslurp = new MailSlurp({ apiKey: APIkey});
  const { emailAddress, id } = await mailslurp.createInbox();
  await page.waitForTimeout(2000)
  await page.locator('input[formcontrolname="email"][placeholder="Account\'s Email Address"]').fill(emailAddress);
  // Step 07:  Fill in phone number
  //await page.locator('#phone').fill(PhoneNumber);
  // Step 08: Fill in admin user
  await page.locator('input[formcontrolname="email"][placeholder="Admin Email Address"]').fill(PAYoPS)
  await page.waitForTimeout(3000)
  await page.click('button.btn-sm.btn-primary.btn-outline-primary:has-text("Proceed with user")');
  // Step 09: Fill business details
  const businessname = faker.company.companyName();
  await page.locator('input[formcontrolname="registrationName"][placeholder="Business Registration Name"]').fill(businessname);
  // Step 10: Fill in the registration number
  const businessnumber = faker.random.alphaNumeric(10); 
  await page.locator('input[formcontrolname="registrationNumber"][placeholder="Business Registration Number"]').fill(businessnumber);
  // Step 09: Click on "submit"
  await page.click('button.btn.btn-primary.btn-sm.btn-block.waves-effect.text-center.m-b-20[type="submit"]:has-text("Submit")');
  // Step 10: Validate the error message
  await page.locator('#toast-container').filter({ hasText: 'Merchant Created successfully' });
  //await page.waitForTimeout(3000);
  // Step 11: Retrieve the activation link from the email sent
  const email = await mailslurp.waitForLatestEmail(id,60000,true); 
  const activationLink = email?.body?.match(custom_uat)
  const link = !!activationLink ? activationLink[0] : '';
  // Step 12: Click on the activation link to activate the user account
  await page.waitForTimeout(3000);
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
  // // Step 14: The user should be successfully activated
  await page.locator('#toast-container').filter({ hasText: 'Invitation accepted successfully' });
  // Step 15: The custom portal login form should open
  // Step 16: Login with the new email generated from MailSlurp
  await page.locator('input[formcontrolname="username"]').fill(emailAddress);;
  await page.locator('input[formcontrolname="password"]').fill(newpassword);
  // Step 17: Click on the button "Sign In"
  await page.locator('button[type="button"].btn.btn-primary.btn-md.btn-block.waves-effect.text-center.m-b-20').click();
  // Step 18: The user should land in the custom dashboard
  await page.waitForTimeout(3000);  
  const pageTitle = await page.title();
  expect(pageTitle).toBe('Invoices | IremboPay');
});
})