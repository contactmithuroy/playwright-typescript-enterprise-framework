import { test, pageObjects } from '../base-hooks';
import { TestHooks, SuiteHooks } from '../hooks/TestHooks';
import { TestRegistry } from '../registry/TestRegistry_Auto';
import { SmokeTestController } from '../../utils/SmokeTestController';

const testController = new SmokeTestController();
testController.initialize();
testController.printExecutionSummary();
const testCases = testController.getTestCasesToExecute();

test.describe('Parabank Data-Driven Smoke Suite', () => {
  test.beforeAll(async () => {
    await SuiteHooks.beforeAll('Parabank Smoke Suite');
  });

  test.afterAll(async () => {
    await SuiteHooks.afterAll('Parabank Smoke Suite');
  });

  for (const testCase of testCases) {
    test(`${testCase.testCaseId} ${testCase.testTag}`, async ({ page }, testInfo) => {
      const requiresLogin = String(testCase.requiresLogin).toLowerCase() !== 'false';
      const hooks = new TestHooks(page, testInfo, requiresLogin);
      await hooks.initialize();

      try {
        await TestRegistry.execute(testCase.testFunction, testCase as any);
        await hooks.cleanup(true);
      } catch (error) {
        await hooks.cleanup(false);
        throw error;
      } finally {
        pageObjects.page = page;
      }
    });
  }
});
