import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage';
import { ProductCatalogPage } from '../../pages/ProductCatalogPage';

const validUsername = 'standard_user';
const validPassword = 'secret_sauce';

test.describe('Product Catalog', () => {
  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(validUsername, validPassword);
    await expect(page).toHaveURL(/inventory.html/);
  });

  test('Positive: Successfully add product to cart', async ({ page }) => {
    const catalogPage = new ProductCatalogPage(page);
    await catalogPage.addProductToCart('Sauce Labs Backpack');
    await expect(page.locator('.shopping_cart_badge')).toHaveText('1');
  });

  test('Negative: Verify behavior with invalid product interactions', async ({ page }) => {
    const catalogPage = new ProductCatalogPage(page);
    const invalidProduct = 'Nonexistent Item';
    const isInvalid = await catalogPage.addInvalidProductToCart(invalidProduct);
    expect(isInvalid).toBe(true);
  });
});
