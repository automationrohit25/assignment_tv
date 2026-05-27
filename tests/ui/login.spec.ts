import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage';

const validUsername = 'standard_user';
const validPassword = 'secret_sauce';

test.describe('Login Module', () => {
  test('Positive: Successful login with valid credentials', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(validUsername, validPassword);
    await expect(page).toHaveURL(/inventory.html/);
  });

  test('Negative: Login failure with invalid credentials', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login('bad_user', 'bad_password');
    await expect(loginPage.errorMessage).toBeVisible();
    await expect(loginPage.errorMessage).toContainText('Username and password do not match');
  });
});
