
export interface ExcelSheetData {
  name: string;
  data: ExcelRowData[];
  columns: string[];
}

export interface ExcelRowData {
  searchColumn: string; // Column I or H value
  dataColumns: string[]; // N, O, P or M, N, O values
  rowIndex: number;
}

export interface ExcelFile {
  sheets: ExcelSheetData[];
  fileName: string;
}

export interface SearchResult {
  found: boolean;
  data?: ExcelRowData;
  sheetName?: string;
}
