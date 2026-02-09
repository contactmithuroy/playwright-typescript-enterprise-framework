# Data Management

## Data Source
Data is stored in CSV files under `test-data/`.

## DataStore
`data-models/dataStore.ts` loads CSV files and provides:
- `getAll(key)`
- `getRow(key, index)`
- `getCell(key, rowIndex, columnName)`

## Current Data Keys
- `MakeATransferData` -> `test-data/MakeATransferData.csv`

## Example Usage
```ts
const testData = DataStore.getRow('MakeATransferData', 0);
```
