"use client";

import React, { createContext, useState, ReactNode } from 'react';

interface PdfDataContextProps {
  children: ReactNode;
}

export const PdfDataContext = createContext<any | null>(null);

export const PdfDataProvider: React.FC<PdfDataContextProps> = ({ children }) => {
  const [pdfData, setPdfData] = useState<any | null>(null);

  return (
    <PdfDataContext.Provider value={{ pdfData, setPdfData }}>
      {children}
    </PdfDataContext.Provider>
  );
};