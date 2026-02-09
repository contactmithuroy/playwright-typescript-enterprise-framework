# CSV Controlled Testing

Tests are controlled by `test-data/Smoke_TestCases.csv`.

## CSV Format
```
run,testCaseId,testTag,requiresLogin,testFunction,testData
Y,Verify_Transfer_Funds,@smoke,true,Verify_Transfer_Funds,MakeATransferData.csv
```

## Columns
- `run`: `Y`, `N`, `NA`, `NE`
- `testCaseId`: Display name for the test
- `testTag`: Tag used in test title
- `requiresLogin`: `true/false`
- `testFunction`: Registry key in `TestRegistry_Auto.ts`
- `testData`: CSV file name for data (for reference)

## Execution Rule
Only rows with `run=Y` are executed.
