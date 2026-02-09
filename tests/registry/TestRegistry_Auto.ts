import { pageObjects } from '../base-hooks';
import { DataStore } from '../../data-models/dataStore';

type TestMethod = (data?: Record<string, string>) => Promise<void>;

class TestRegistryClass {
  private registry: Map<string, TestMethod> = new Map();

  register(name: string, testFn: TestMethod): void {
    this.registry.set(name, testFn);
  }

  async execute(testName: string, data?: Record<string, string>): Promise<void> {
    const testFn = this.registry.get(testName);
    if (!testFn) {
      throw new Error(`Test "${testName}" not found in registry`);
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
