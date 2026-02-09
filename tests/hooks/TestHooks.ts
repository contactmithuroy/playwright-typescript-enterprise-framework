import { test, type Page, type TestInfo } from '@playwright/test';
import { pageObjects } from '../base-hooks';
import { CommonFunctions } from '../../utils/CommonFunctions';

type ActionType = {
  emoji: string;
  color: string;
};

export class SuiteHooks {
  static async beforeAll(suiteName: string): Promise<void> {
    console.log(`========== SUITE START: ${suiteName} ==========`);  
  }

  static async afterAll(suiteName: string): Promise<void> {
    console.log(`========== SUITE END: ${suiteName} ==========`);  
  }
}

export class TestHooks {
  private readonly page: Page;
  private readonly testInfo: TestInfo;
  private readonly requiresLogin: boolean;
  private initialized = false;

  private readonly actionTypes: Record<string, ActionType> = {
    CLICK: { emoji: '🔘', color: 'blue' },
    INPUT: { emoji: '⌨️', color: 'green' },
    VERIFY: { emoji: '✓', color: 'purple' },
    SELECT: { emoji: '📋', color: 'orange' },
    NAVIGATE: { emoji: '🧭', color: 'teal' },
    WAIT: { emoji: '⏳', color: 'yellow' },
    DEFAULT: { emoji: '▶️', color: 'gray' },
  };

  constructor(page: Page, testInfo: TestInfo, requiresLogin = true) {
    this.page = page;
    this.testInfo = testInfo;
    this.requiresLogin = requiresLogin;
  }

  async initialize(): Promise<void> {
    if (this.initialized) return;
    await this.wrapAllPageObjects();
    await this.beforeTest();
    this.initialized = true;
  }

  private async beforeTest(): Promise<void> {
    await test.step('🚀 Initialize Test', async () => {
      const baseUrl = CommonFunctions.getBaseUrl();
      await this.page.goto(baseUrl, { waitUntil: 'domcontentloaded' });
      await this.attachScreenshot('Initial_Page_Load');

      if (this.requiresLogin && pageObjects.loginPage) {
        await this.executeStep('Login', async () => {
          await pageObjects.loginPage!.logInUserPortal();
        });
      }
    });
  }

  async cleanup(passed: boolean): Promise<void> {
    await test.step('🏁 Cleanup Test', async () => {
      await this.attachScreenshot(passed ? 'Test_Success' : 'Test_Failed');
      if (this.requiresLogin && pageObjects.loginPage) {
        await this.executeStep('Logout', async () => {
          await pageObjects.loginPage!.logOutUserPortal();
        });
      }
    });
  }

  private async wrapAllPageObjects(): Promise<void> {
    if (pageObjects._originalLoginPage) {
      pageObjects.loginPage = this.wrapPageObject(pageObjects._originalLoginPage, 'Login');
    }
    if (pageObjects._originalMainNavigationPage) {
      pageObjects.mainNavigationPage = this.wrapPageObject(
        pageObjects._originalMainNavigationPage,
        'Navigation'
      );
    }
    if (pageObjects._originalTransferPage) {
      pageObjects.transferPage = this.wrapPageObject(pageObjects._originalTransferPage, 'Transfer');
    }
  }

  private wrapPageObject<T extends object>(pageObject: T, objectName: string): T {
    return new Proxy(pageObject, {
      get: (target: any, property: string | symbol) => {
        const originalValue = target[property];
        if (typeof originalValue !== 'function') return originalValue;

        return async (...args: any[]) => {
          const stepName = this.createStepName(objectName, String(property), args);
          return await this.executeStep(stepName, async () => {
            return await originalValue.apply(target, args);
          });
        };
      },
    });
  }

  private createStepName(objectName: string, methodName: string, args: any[]): string {
    const formattedMethod = CommonFunctions.humanizeMethodName(methodName);
    const argSuffix = args.length ? ` - ${args.map(String).join(', ')}` : '';
    return `${objectName}: ${formattedMethod}${argSuffix}`;
  }

  private categorizeAction(methodName: string): ActionType {
    const lower = methodName.toLowerCase();
    if (/(click|tap|press)/.test(lower)) return this.actionTypes.CLICK;
    if (/(enter|type|input|fill|set)/.test(lower)) return this.actionTypes.INPUT;
    if (/(verify|expect|assert|check|validate)/.test(lower)) return this.actionTypes.VERIFY;
    if (/(select|choose|pick)/.test(lower)) return this.actionTypes.SELECT;
    if (/(navigate|goto|open|login|logout)/.test(lower)) return this.actionTypes.NAVIGATE;
    if (/(wait|pause)/.test(lower)) return this.actionTypes.WAIT;
    return this.actionTypes.DEFAULT;
  }

  private async executeStep(stepName: string, action: () => Promise<void>): Promise<void> {
    const actionType = this.categorizeAction(stepName);
    const visualStepName = `${actionType.emoji} ${stepName}`;

    await test.step(visualStepName, async () => {
      await action();
      await this.attachScreenshotToCurrentStep(stepName);
    });
  }

  private async attachScreenshotToCurrentStep(stepName: string): Promise<void> {
    if (!CommonFunctions.takeScreenshots()) return;
    const safeName = CommonFunctions.safeFileName(stepName);
    await this.attachScreenshot(safeName);
  }

  private async attachScreenshot(fileName: string): Promise<void> {
    if (!CommonFunctions.takeScreenshots()) return;
    if (this.page.isClosed()) return;
    try {
      const buffer = await this.page.screenshot({ fullPage: true });
      await this.testInfo.attach(`${fileName}.png`, {
        body: buffer,
        contentType: 'image/png',
      });
    } catch (error) {
      console.warn(`Screenshot skipped: ${String(error)}`);
    }
  }
}
