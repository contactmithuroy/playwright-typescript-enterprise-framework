import { type Page, expect } from '@playwright/test';

export class BasePage {
  protected page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async takeScreenShot(fileName: string): Promise<void> {
    await this.page.screenshot({ path: `./screenshots/${fileName}.png`, fullPage: true });
  }

  async clickBrowserDialogOkBtn(): Promise<void> {
    this.page.on('dialog', async (dialog) => {
      await dialog.accept();
    });
  }

  async getCellValueByLabel(label: string): Promise<string> {
    const locator = this.page.locator(`xpath=//td[contains(normalize-space(.), "${label}")]/following-sibling::td[1]`);
    await expect(locator).toBeVisible();
    return await locator.textContent() || '';
  }

  getCurrentDateFormatted(): string {
    const now = new Date();
    const mm = String(now.getMonth() + 1).padStart(2, '0');
    const dd = String(now.getDate()).padStart(2, '0');
    const yyyy = String(now.getFullYear());
    return `${mm}/${dd}/${yyyy}`;
  }

  random4DigitNumber(): string {
    return String(Math.floor(1000 + Math.random() * 9000));
  }
}
