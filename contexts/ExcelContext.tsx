
import React, { createContext, useContext, ReactNode } from 'react';
import { useExcelData } from '../hooks/useExcelData';
import { ExcelFile, ExcelSheetData, SearchResult, MultiSearchCriteria, MultiSearchResult } from '../types/ExcelData';

interface ExcelContextType {
  excelFile: ExcelFile | null;
  selectedSheet: ExcelSheetData | null;
  isLoading: boolean;
  error: string | null;
  loadExcelFile: (fileUri: string) => Promise<void>;
  selectSheet: (sheetName: string) => void;
  searchData: (searchValue: string) => SearchResult;
  multiSearchData: (searchCriteria: MultiSearchCriteria[]) => MultiSearchResult;
  reset: () => void;
}

const ExcelContext = createContext<ExcelContextType | undefined>(undefined);

interface ExcelProviderProps {
  children: ReactNode;
}

export const ExcelProvider: React.FC<ExcelProviderProps> = ({ children }) => {
  const excelData = useExcelData();

  return (
    <ExcelContext.Provider value={excelData}>
      {children}
    </ExcelContext.Provider>
  );
};

export const useExcelContext = () => {
  const context = useContext(ExcelContext);
  if (context === undefined) {
    throw new Error('useExcelContext must be used within an ExcelProvider');
  }
  return context;
};
