
import * as XLSX from 'xlsx';
import { ExcelFile, ExcelSheetData, ExcelRowData } from '../types/ExcelData';

export const processExcelFile = async (fileUri: string): Promise<ExcelFile> => {
  try {
    console.log('Processing Excel file:', fileUri);
    
    // Read the file
    const response = await fetch(fileUri);
    const arrayBuffer = await response.arrayBuffer();
    const workbook = XLSX.read(arrayBuffer, { type: 'array' });
    
    console.log('Workbook sheets:', workbook.SheetNames);
    
    const sheets: ExcelSheetData[] = [];
    
    // Process first 3 sheets
    for (let i = 0; i < Math.min(3, workbook.SheetNames.length); i++) {
      const sheetName = workbook.SheetNames[i];
      const worksheet = workbook.Sheets[sheetName];
      
      console.log(`Processing sheet ${i + 1}: ${sheetName}`);
      
      // Convert to JSON
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
      
      let searchColumn: string;
      let dataColumns: string[];
      
      // Define columns based on sheet position
      if (i < 2) {
        // First two sheets: I, N, O, P
        searchColumn = 'I';
        dataColumns = ['N', 'O', 'P'];
      } else {
        // Third sheet: H, M, N, O
        searchColumn = 'H';
        dataColumns = ['M', 'N', 'O'];
      }
      
      const processedData: ExcelRowData[] = [];
      
      // Process each row (skip header row)
      for (let rowIndex = 1; rowIndex < jsonData.length; rowIndex++) {
        const row = jsonData[rowIndex] as any[];
        
        if (row && row.length > 0) {
          const searchValue = getCellValue(row, searchColumn);
          const dataValues = dataColumns.map(col => getCellValue(row, col));
          
          if (searchValue) {
            processedData.push({
              searchColumn: searchValue.toString(),
              dataColumns: dataValues.map(val => val ? val.toString() : ''),
              rowIndex
            });
          }
        }
      }
      
      sheets.push({
        name: sheetName,
        data: processedData,
        columns: [searchColumn, ...dataColumns]
      });
    }
    
    console.log('Processed sheets:', sheets.length);
    return {
      sheets,
      fileName: 'Excel File'
    };
    
  } catch (error) {
    console.error('Error processing Excel file:', error);
    throw new Error('Failed to process Excel file');
  }
};

const getCellValue = (row: any[], columnLetter: string): any => {
  const columnIndex = columnLetterToIndex(columnLetter);
  return row[columnIndex];
};

const columnLetterToIndex = (letter: string): number => {
  let result = 0;
  for (let i = 0; i < letter.length; i++) {
    result = result * 26 + (letter.charCodeAt(i) - 'A'.charCodeAt(0) + 1);
  }
  return result - 1;
};

export const searchInSheet = (sheet: ExcelSheetData, searchValue: string): ExcelRowData | null => {
  console.log(`Searching for "${searchValue}" in sheet "${sheet.name}"`);
  
  const result = sheet.data.find(row => 
    row.searchColumn.toLowerCase() === searchValue.toLowerCase()
  );
  
  if (result) {
    console.log('Found result:', result);
  } else {
    console.log('No result found');
  }
  
  return result || null;
};
