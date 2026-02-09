import { csvReader } from '../utils/csvReader';
import path from 'path';

const store: Record<string, Record<string, string>[]> = {
  MakeATransferData: csvReader(path.resolve(__dirname, '../test-data/MakeATransferData.csv')),
  BillPayData: csvReader(path.resolve(__dirname, '../test-data/BillPayData.csv')),
};

export const DataStore = {
  getAll(fileKey: "MakeATransferData" | "BillPayData") {
    return store[fileKey];
  },

  getRow(fileKey: "MakeATransferData" | "BillPayData", rowIndex: number) {
    return store[fileKey][rowIndex];
  },

  getCell(
    fileKey: "MakeATransferData" | "BillPayData",rowIndex: number, columnName: string) {
    return store[fileKey][rowIndex]?.[columnName];
  }
};
