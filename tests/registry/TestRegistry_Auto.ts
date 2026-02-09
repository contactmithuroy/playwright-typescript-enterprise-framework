import { pageObjects } from '../base-hooks';
import { DataStore } from '../../data-models/dataStore';

type TestMethod = (data?: Record<string, string>) => Promise<void>;

class TestRegistryClass {
  private registry: Map<string, TestMethod> = new Map();

  register(name: string, testFn: TestMethod): void {
    this.registry.set(name, testFn);
  }

  async execute(testName: string, data?: Record<string, string>): Promise<void> {
    const normalizedName = testName.trim();
    const testFn = this.registry.get(normalizedName);
    if (!testFn) {
      throw new Error(`Test "${normalizedName}" not found in registry`);
    }
    await testFn(data);
  }
}

export const TestRegistry = new TestRegistryClass();

TestRegistry.register('Verify_Transfer_Funds', async () => {
  const { mainNavigationPage, transferPage } = pageObjects;
  const testData = DataStore.getRow('MakeATransferData', 0);

  await mainNavigationPage!.selectMenu('Transfer Funds');
  await transferPage!.fillTransferDetails(
    testData.fromAccount,
    testData.toAccount,
    testData.amount,
  );

  await transferPage!.submitTransfer();
  await transferPage!.verifyTransferSuccess();
});

const verifyPayBillTest = async () => {
  const { mainNavigationPage, payBillPage } = pageObjects;
  const testData = DataStore.getRow('BillPayData', 0);

  await mainNavigationPage!.selectMenu('Bill Pay');
  await payBillPage!.fillTransferDetails(
    testData.payeeName,
    testData.address,
    testData.city,
    testData.state,
    testData.zipCode,
    testData.phoneNumber,
    testData.accountNumber,
    testData.amount,
    testData.fromAccount,
  );

  await payBillPage!.sendPaymentBill();
  await payBillPage!.verifyPayBillSuccess();
};

TestRegistry.register('Verify_PayBill', verifyPayBillTest);
TestRegistry.register('Verify_Pay_Bill', verifyPayBillTest);
