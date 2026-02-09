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
    await expect(this.page.getByRole('link', { name: 'Log Out', exact: true })).toBeVisible();
  }

  async logOutUserPortal(): Promise<void> {
    if (this.page.isClosed()) return;
    const logoutLink = this.page.getByRole('link', { name: 'Log Out' });
    try {
      if (await logoutLink.isVisible()) {
        await logoutLink.click();
      }
      await expect(this.page.locator('input[value="Log In"]')).toBeVisible();
    } catch (error) {
      if (this.page.isClosed()) return;
      throw error;
    }
  }
}
