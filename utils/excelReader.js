import { createRequire } from 'module';
import path from 'path';

const require = createRequire(import.meta.url);
const XLSX = require('xlsx');

export function excelReader(sheetName) {
  const filePath = path.resolve('test-data/loginData.xlsx');
  const workbook = XLSX.readFile(filePath);
  const sheet = workbook.Sheets[sheetName];

  if (!sheet) {
    throw new Error(`Sheet "${sheetName}" not found in loginData.xlsx`);
  }

  return XLSX.utils.sheet_to_json(sheet);
}
