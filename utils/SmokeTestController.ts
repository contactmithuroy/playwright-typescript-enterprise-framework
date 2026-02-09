import path from 'path';
import { csvReader } from './csvReader';

export type TestCase = {
  run: string;
  testCaseId: string;
  testTag: string;
  requiresLogin: string;
  testFunction: string;
  testData: string;
};

export class SmokeTestController {
  private testCases: TestCase[] = [];
  private readonly csvPath = path.resolve(__dirname, '../test-data/Smoke_TestCases.csv');

  initialize(): void {
    this.testCases = csvReader(this.csvPath) as TestCase[];
  }

  getTestCasesToExecute(): TestCase[] {
    return this.testCases.filter((tc) => tc.run?.toUpperCase() === 'Y');
  }

  printExecutionSummary(): void {
    const total = this.testCases.length;
    const byStatus = (status: string) =>
      this.testCases.filter((tc) => tc.run?.toUpperCase() === status).length;

    console.log('========== Smoke Test Execution Summary ==========');
    console.log(`Total Test Cases: ${total}`);
    console.log(`✓ To Execute (Y): ${byStatus('Y')}`);
    console.log(`✗ Skipped (N): ${byStatus('N')}`);
    console.log(`NA: ${byStatus('NA')}`);
    console.log(`NE: ${byStatus('NE')}`);
  }
}
