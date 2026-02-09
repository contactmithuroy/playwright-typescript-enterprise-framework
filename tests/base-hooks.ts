import { test as base, type Page } from '@playwright/test';
import { LogInLogOutUserPage } from '../pages/Common/LoginLogout.page';
import { MainNavigationPage } from '../pages/Common/MainNavigationPage';
import { MakeATransferPage } from '../pages/MainPages/MakeATransfer.page';

export type TestFixtures = {
  loginPage: LogInLogOutUserPage;
  mainNavigationPage: MainNavigationPage;
  transferPage: MakeATransferPage;
  _autoInit: void;
};

export type TestOptions = {
  basePage?: Page;
};

export const pageObjects = {
  page: null as Page | null,
  loginPage: null as LogInLogOutUserPage | null,
  mainNavigationPage: null as MainNavigationPage | null,
  transferPage: null as MakeATransferPage | null,
  _originalLoginPage: null as LogInLogOutUserPage | null,
  _originalMainNavigationPage: null as MainNavigationPage | null,
  _originalTransferPage: null as MakeATransferPage | null,

};

export const test = base.extend<TestOptions & TestFixtures>({
  loginPage: async ({ page }, use) => {
    const loginPage = new LogInLogOutUserPage(page);
    pageObjects._originalLoginPage = loginPage;
    pageObjects.loginPage = loginPage;
    await use(loginPage);
  },

  mainNavigationPage: async ({ page }, use) => {
    const mainNavigationPage = new MainNavigationPage(page);
    pageObjects._originalMainNavigationPage = mainNavigationPage;
    pageObjects.mainNavigationPage = mainNavigationPage;
    await use(mainNavigationPage);
  },

  transferPage: async ({ page }, use) => {
    const transferPage = new MakeATransferPage(page);
    pageObjects._originalTransferPage = transferPage;
    pageObjects.transferPage = transferPage;
    await use(transferPage);
  },

  _autoInit: [
    async (
      {
        page,
        loginPage,
        mainNavigationPage,
        transferPage,
      },
      use
    ) => {
      pageObjects.page = page;
      await use();
    },
    { auto: true },
  ],
});

export { expect } from '@playwright/test';
