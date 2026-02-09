# Dynamic Data Loading

CSV data is loaded once per run via `data-models/dataStore.ts`.

## Flow
1. `csvReader.ts` reads CSV files.
2. `dataStore.ts` stores CSV content in memory.
3. Tests fetch rows by key and index.

## Example
```ts
const row = DataStore.getRow('MakeATransferData', 0);
```
