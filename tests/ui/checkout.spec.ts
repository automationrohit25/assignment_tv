import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage';
import { ProductCatalogPage } from '../../pages/ProductCatalogPage';
import { CartPage } from '../../pages/CartPage';
import { CheckoutPage } from '../../pages/CheckoutPage';

const validUsername = 'standard_user';
const validPassword = 'secret_sauce';

test.describe('Shopping Cart / Checkout', () => {
  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(validUsername, validPassword);
    await expect(page).toHaveURL(/inventory.html/);
    const catalogPage = new ProductCatalogPage(page);
    await catalogPage.addProductToCart('Sauce Labs Backpack');
  });

  test('Positive: Complete checkout flow', async ({ page }) => {
    const cartPage = new CartPage(page);
    await cartPage.goto();
    await cartPage.verifyProductInCart('Sauce Labs Backpack');
    await cartPage.checkout();

    const checkoutPage = new CheckoutPage(page);
    await checkoutPage.submitCheckout('John', 'Doe', '12345');
    await checkoutPage.finishCheckout();
    await checkoutPage.assertOrderComplete();
  });

  test('Negative: Validation errors in checkout form', async ({ page }) => {
    const cartPage = new CartPage(page);
    await cartPage.goto();
    await cartPage.checkout();

    const checkoutPage = new CheckoutPage(page);
    await checkoutPage.submitCheckout('', '', '');
    await checkoutPage.assertValidationError('Error: First Name is required');
  });
});
