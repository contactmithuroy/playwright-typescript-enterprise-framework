# Enhanced Reporting

Reporting is driven by Playwright steps and attachments.

## Step Tracking
All page object methods are wrapped in `TestHooks` and executed as:
```
test.step("emoji + step name", async () => { ... })
```

## Screenshots
- Screenshots are attached after each step.
- Controlled by `.env`:
```
TAKE_SCREENSHOTS=true
```

## Report Outputs
- HTML report: `AllTestResults/HTMLReports`
- JUnit report: `AllTestResults/junit-results.xml`

## Notes
- If a page closes before a screenshot, it is safely skipped.
