// pages/PdfUploader.tsx
"use client"

// pages/PdfUploader.tsx

import React, { useState } from 'react';

const PdfUploader: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = event.target.files?.[0];

    if (uploadedFile) {
      const reader = new FileReader();

      reader.onload = () => {
        const typedArray = new Uint8Array(reader.result as ArrayBuffer);
        const script = document.createElement('script');

        script.src = 'https://unpkg.com/pdfjs-dist/build/pdf.js';
        script.onload = () => {
          const pdfjsLib = window['pdfjs-dist/build/pdf'];

          pdfjsLib.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist/build/pdf.worker.min.js`;

          pdfjsLib.getDocument(typedArray).promise.then((pdf: any) => {
            let pdfText = '';

            const maxPages = pdf.numPages;
            const getPageText = (pageNumber: number) => {
              pdf.getPage(pageNumber).then((page: any) => {
                page.getTextContent().then((textContent: any) => {
                  textContent.items.forEach((item: any) => {
                    pdfText += item.str + ' ';
                  });

                  if (pageNumber < maxPages) {
                    getPageText(pageNumber + 1);
                  } else {
                    console.log(pdfText);
                  }
                });
              });
            };

            getPageText(1);
          });
        };

        document.head.appendChild(script);
      };

      reader.readAsArrayBuffer(uploadedFile);
    }

    setFile(uploadedFile);
  };

  return (
    <div>
      <h1>PDF Uploader</h1>
      <input type="file" accept=".pdf" onChange={handleFileUpload} />
      {file && <p>Uploaded: {file.name}</p>}
    </div>
  );
};

export default PdfUploader;




