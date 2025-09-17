
import { useState } from 'react';
import { ExcelFile, ExcelSheetData, SearchResult } from '../types/ExcelData';
import { processExcelFile, searchInSheet } from '../utils/excelProcessor';

export const useExcelData = () => {
  const [excelFile, setExcelFile] = useState<ExcelFile | null>(null);
  const [selectedSheet, setSelectedSheet] = useState<ExcelSheetData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadExcelFile = async (fileUri: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      console.log('Loading Excel file...');
      const processedFile = await processExcelFile(fileUri);
      setExcelFile(processedFile);
      console.log('Excel file loaded successfully');
    } catch (err) {
      console.error('Error loading Excel file:', err);
      setError(err instanceof Error ? err.message : 'Failed to load Excel file');
    } finally {
      setIsLoading(false);
    }
  };

  const selectSheet = (sheetName: string) => {
    if (!excelFile) return;
    
    const sheet = excelFile.sheets.find(s => s.name === sheetName);
    if (sheet) {
      setSelectedSheet(sheet);
      console.log('Selected sheet:', sheetName);
    }
  };

  const searchData = (searchValue: string): SearchResult => {
    if (!selectedSheet) {
      return { found: false };
    }

    const result = searchInSheet(selectedSheet, searchValue);
    
    return {
      found: !!result,
      data: result || undefined,
      sheetName: selectedSheet.name
    };
  };

  const reset = () => {
    setExcelFile(null);
    setSelectedSheet(null);
    setError(null);
  };

  return {
    excelFile,
    selectedSheet,
    isLoading,
    error,
    loadExcelFile,
    selectSheet,
    searchData,
    reset
  };
};
