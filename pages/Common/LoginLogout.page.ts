import { expect, type Page } from '@playwright/test';
import { BasePage } from './base.page';
import { CommonFunctions } from '../../utils/CommonFunctions';

export class LogInLogOutUserPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async enterUsername(username: string): Promise<void> {
    await this.page.fill('input[name="username"]', username);
  }

  async enterPassword(password: string): Promise<void> {
    await this.page.fill('input[name="password"]', password);
  }

  async clickLoginButton(): Promise<void> {
    await this.page.click('input[value="Log In"]');
  }

  async logInUserPortal(): Promise<void> {
    await this.enterUsername(CommonFunctions.getUserName());
    await this.enterPassword(CommonFunctions.getPassword());
    await this.clickLoginButton();
    await expect(this.page.locator('a[href*="logout.htm"]')).toBeVisible();
  }

  async logOutUserPortal(): Promise<void> {
    const logoutLink = this.page.locator('a[href*="logout.htm"]');
    if (await logoutLink.isVisible()) {
      await logoutLink.click();
    }
    await expect(this.page.locator('input[value="Log In"]')).toBeVisible();
  }
}
