import { expect, Locator, Page } from "@playwright/test";
import { BasePage } from "../Common/base.page";

export class PayBillPage extends BasePage {
    readonly payeeSelect: Locator;
    readonly address: Locator;
    readonly city: Locator;
    readonly state: Locator;
    readonly zipCode: Locator;
    readonly phone: Locator;
    readonly accountSelect: Locator;
    readonly verifyAccount: Locator;
    readonly amount: Locator;
    readonly formAccount: Locator;
    readonly sendPayment: Locator;
    readonly successMessage: Locator;

    constructor(page: Page) {
        super(page);

        this.payeeSelect = page.locator('input[name="payee.name"]');
        this.address = page.locator('input[name="payee.address.street"]');
        this.city = page.locator('input[name="payee.address.city"]');
        this.state = page.locator('input[name="payee.address.state"]');
        this.zipCode = page.locator('input[name="payee.address.zipCode"]');
        this.phone = page.locator('input[name="payee.phoneNumber"]');

        this.accountSelect = page.locator('input[name="payee.accountNumber"]');
        this.verifyAccount = page.locator('input[name="verifyAccount"]');
        this.amount = page.locator('input[name="amount"]');

        // ✅ FIXED: From Account is a <select>
        this.formAccount = page.locator('select[name="fromAccountId"]');

        this.sendPayment = page.locator('input[type="button"]');
        this.successMessage = page.locator('#billpayResult');
    }

    async fillTransferDetails(
        payee: string,
        address: string,
        city: string,
        state: string,
        zipCode: string,
        phone: string,
        accountNumber: string,
        amount: string,
        fromAccount: string,
    ): Promise<void> {

        await this.payeeSelect.fill(payee);
        await this.address.fill(address);
        await this.city.fill(city);
        await this.state.fill(state);
        await this.zipCode.fill(zipCode);
        await this.phone.fill(phone);

        // Account number & verification
        await this.accountSelect.fill(accountNumber);
        await this.verifyAccount.fill(accountNumber);

        // Amount
        await this.amount.fill(amount);

       // await expect(this.formAccount).toBeVisible();
        //await this.formAccount.selectOption(fromAccount);
    }

    async sendPaymentBill(): Promise<void> {
        await this.sendPayment.click();
    }

    async verifyPayBillSuccess(): Promise<void> {
        await expect(this.successMessage).toBeVisible();
    }
}
