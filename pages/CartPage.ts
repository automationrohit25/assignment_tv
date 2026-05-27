import { Locator, Page, expect } from '@playwright/test';

export class CartPage {
  readonly page: Page;
  readonly checkoutButton: Locator;
  readonly cartItems: Locator;

  constructor(page: Page) {
    this.page = page;
    this.checkoutButton = page.locator('[data-test="checkout"]');
    this.cartItems = page.locator('.cart_item');
  }

  async goto() {
    await this.page.click('.shopping_cart_link');
  }

  async verifyProductInCart(productName: string) {
    await expect(this.cartItems.locator('.inventory_item_name', { hasText: productName })).toBeVisible();
  }

  async checkout() {
    await this.checkoutButton.click();
  }
}
