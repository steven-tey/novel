// components/PdfTextExtractor.tsx
"use client"
import React, { useRef, ChangeEvent } from 'react';
import { getDocument } from 'pdfjs-dist/es5/build/pdf';

const PdfTextExtractor: React.FC = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files && event.target.files[0];
    if (file) {
      extractTextFromPdf(file);
    }
  };

  const extractTextFromPdf = async (file: File) => {
    try {
      const pdf = await getDocument(URL.createObjectURL(file)).promise;

      let textContent = '';

      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const text = await page.getTextContent();
        textContent += text.items.map(item => item.str).join(' ');
      }

      console.log(textContent);  // Log the extracted text content
    } catch (error) {
      console.error('Error extracting text from PDF:', error);
    }
  };

  return (
    <div>
      <div className="upload-section">
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileUpload}
          style={{ display: 'none' }}
          accept=".pdf"  // Accept only PDF files
        />
        <button onClick={() => fileInputRef.current && fileInputRef.current.click()}>
          Upload PDF
        </button>
      </div>
    </div>
  );
};

export default PdfTextExtractor;
