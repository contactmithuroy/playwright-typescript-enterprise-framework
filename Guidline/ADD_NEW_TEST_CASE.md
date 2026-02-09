# Add New Test Case (Step-by-Step)

This guide explains how to add a new test case to this framework.

## 1) Add or Update Page Object
**Folder:** `pages/`

Create a new page class or update an existing one.  
Follow the locator + method pattern used in `pages/MainPages/MakeATransfer.page.ts`.

Example:
```ts
export class NewFeaturePage extends BasePage {
  readonly submitButton: Locator;

  constructor(page: Page) {
    super(page);
    this.submitButton = page.locator('#submit');
  }

  async clickSubmit(): Promise<void> {
    await this.submitButton.click();
  }
}
```

## 2) Add a Base Hook (Fixture)
**File:** `tests/base-hooks.ts`

If you add a new page object, register it as a fixture and expose it in `pageObjects`:
```ts
export type TestFixtures = {
  // ...
  newFeaturePage: NewFeaturePage;
};

export const pageObjects = {
  // ...
  newFeaturePage: null as NewFeaturePage | null,
};

export const test = base.extend<TestOptions & TestFixtures>({
  // ...
  newFeaturePage: async ({ page }, use) => {
    const newFeaturePage = new NewFeaturePage(page);
    pageObjects.newFeaturePage = newFeaturePage;
    await use(newFeaturePage);
  },
});
```

## 3) Register the Test in Registry
**File:** `tests/registry/TestRegistry_Auto.ts`

Add a new `TestRegistry.register(...)` block:
```ts
TestRegistry.register('Verify_New_Feature', async () => {
  const { mainNavigationPage, newFeaturePage } = pageObjects;
  const testData = DataStore.getRow('NewFeatureData', 0);

  await mainNavigationPage!.selectMenu('New Feature');
  await newFeaturePage!.clickSubmit();
});
```

## 4) Add Data File (CSV)
**Folder:** `test-data/`

Create a new CSV for the test data:
```
NewFeatureData.csv
```

Example content:
```
field1,field2
value1,value2
```

## 5) Map the CSV in DataStore
**File:** `data-models/dataStore.ts`

Add your CSV to the `store` map and types:
```ts
const store = {
  MakeATransferData: csvReader(...),
  NewFeatureData: csvReader(path.resolve(__dirname, '../test-data/NewFeatureData.csv')),
};
```

Update type union for `getAll/getRow/getCell` to include `NewFeatureData`.

## 6) Add Test Control Row
**File:** `test-data/Smoke_TestCases.csv`

Add a row:
```
Y,Verify_New_Feature,@smoke,true,Verify_New_Feature,NewFeatureData.csv
```

## 7) Run the Test
```
npx playwright test tests/smoke/DynamicSmokeTestsAuto.spec.ts --grep "Verify_New_Feature"
```

## Notes
- If a page object is new, add a fixture in `tests/base-hooks.ts`.
- `testFunction` in CSV must match the name in the registry.
- Use `run=Y` to execute, `N` to skip.
