import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage';
import { ProductCatalogPage } from '../../pages/ProductCatalogPage';
import { CartPage } from '../../pages/CartPage';
import { CheckoutPage } from '../../pages/CheckoutPage';

const validUsername = 'standard_user';
const validPassword = 'secret_sauce';

test('E2E: Login → Add to Cart → Checkout', async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await loginPage.login(validUsername, validPassword);
  await expect(page).toHaveURL(/inventory.html/);

  const catalogPage = new ProductCatalogPage(page);
  await catalogPage.addProductToCart('Sauce Labs Backpack');
  await expect(page.locator('.shopping_cart_badge')).toHaveText('1');

  const cartPage = new CartPage(page);
  await cartPage.goto();
  await cartPage.verifyProductInCart('Sauce Labs Backpack');
  await cartPage.checkout();

  const checkoutPage = new CheckoutPage(page);
  await checkoutPage.submitCheckout('Jane', 'Smith', '90210');
  await checkoutPage.finishCheckout();
  await checkoutPage.assertOrderComplete();
});
