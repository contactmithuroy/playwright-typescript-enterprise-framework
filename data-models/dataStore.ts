import { csvReader } from '../utils/csvReader';
import path from 'path';

const store: Record<string, Record<string, string>[]> = {
  MakeATransferData: csvReader(path.resolve(__dirname, '../test-data/MakeATransferData.csv')),
};

export const DataStore = {
  getAll(fileKey: "MakeATransferData") {
    return store[fileKey];
  },

  getRow(fileKey: "MakeATransferData", rowIndex: number) {
    return store[fileKey][rowIndex];
  },

  getCell(
    fileKey: "MakeATransferData",rowIndex: number, columnName: string) {
    return store[fileKey][rowIndex]?.[columnName];
  }
};
