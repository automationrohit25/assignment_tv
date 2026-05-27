import { Locator, Page, expect } from '@playwright/test';

export class ProductCatalogPage {
  readonly page: Page;
  readonly inventoryItems: Locator;
  readonly cartBadge: Locator;

  constructor(page: Page) {
    this.page = page;
    this.inventoryItems = page.locator('.inventory_item');
    this.cartBadge = page.locator('.shopping_cart_badge');
  }

  async addProductToCart(productName: string) {
    const item = this.inventoryItems.locator('.inventory_item_name', { hasText: productName });
    await expect(item).toBeVisible();
    const addButton = item.locator('xpath=../../..').locator('button:has-text("Add to cart")');
    await addButton.click();
  }

  async addInvalidProductToCart(productName: string) {
    const item = this.inventoryItems.locator('.inventory_item_name', { hasText: productName });
    return await item.count() === 0;
  }

  async getCartCount() {
    if (await this.cartBadge.count() === 0) {
      return 0;
    }
    return parseInt(await this.cartBadge.textContent() || '0', 10);
  }
}
