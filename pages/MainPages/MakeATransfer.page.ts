import { expect, type Locator, type Page } from '@playwright/test';
import { BasePage } from '../Common/base.page';

export class MakeATransferPage extends BasePage {
  readonly fromAccount: Locator;
  readonly toAccount: Locator;
  readonly amountInput: Locator;
  readonly submitButton: Locator;
  readonly transferCompleteMessage: Locator;

  constructor(page: Page) {
    super(page);
    this.fromAccount = page.locator('#fromAccountId');
    this.toAccount = page.locator('#toAccountId');
    this.amountInput = page.locator('#amount');
    this.submitButton = page.locator('input[type="submit"]');
    this.transferCompleteMessage = page.getByText('Transfer Complete!');
  
  }

  async fillTransferDetails(
    fromAccount: string,
    toAccount: string,
    amount: string,
  ): Promise<void> {
    await this.fromAccount.selectOption({ label: fromAccount });
    await this.toAccount.selectOption({ label: toAccount });
    await this.amountInput.fill(amount);
  }


  async submitTransfer(): Promise<void> {
    await Promise.all([
      this.page.waitForLoadState('networkidle'),
      this.submitButton.click(),
    ]);
  }

  async verifyTransferSuccess(): Promise<void> {
    await expect(this.transferCompleteMessage).toBeVisible();
  }

  //async verifyTransferComplete(): Promise<void> {
  //  const heading = this.page.getByRole('heading', { name: /Transfer Complete/i });
  //  await expect(heading).toBeVisible();
  //}
}
