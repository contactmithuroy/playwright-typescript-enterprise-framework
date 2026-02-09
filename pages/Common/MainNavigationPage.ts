import { type Page } from '@playwright/test';
import { BasePage } from './base.page';

export class MainNavigationPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async selectMenu(menuText: string): Promise<void> {
    await this.page.click(`a:has-text("${menuText}")`);
  }
}
