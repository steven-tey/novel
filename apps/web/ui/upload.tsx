"use client"


import React, { useState, useContext } from 'react';
import { PdfDataContext } from './components/pdfdatacontext';

const PdfUploader: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const { setPdfData } = useContext(PdfDataContext);

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

          // pdfjsLib.getDocument(typedArray).promise.then((pdf: any) => {
          //   let pdfText = '';

          //   const maxPages = pdf.numPages;
          //   const getPageText = (pageNumber: number) => {
          //     pdf.getPage(pageNumber).then((page: any) => {
          //       page.getTextContent().then((textContent: any) => {
          //         textContent.items.forEach((item: any) => {
          //           pdfText += item.str + ' ';
          //         });

          //         if (pageNumber < maxPages) {
          //           getPageText(pageNumber + 1);
          //         } else {
          //           console.log(pdfText);
          //         }
          //       });
          //     });
          //   };

          //   getPageText(1);
          // });

          pdfjsLib.getDocument(typedArray).promise.then(async (pdf: any) => {
            const maxPages = pdf._pdfInfo.numPages;
            const pdfData: any[] = [];

            for (let i = 1; i <= maxPages; i++) {
              const page = await pdf.getPage(i);
              const content = await page.getTextContent();
              const pageData: any = { paragraphs: [] };

              let currentParagraph: any = { text: '' };

              content.items.forEach((textItem: any) => {
                if (textItem.str === '\n') {
                  // If a newline character is found, consider it as a new paragraph
                  pageData.paragraphs.push(currentParagraph);
                  currentParagraph = { text: '' };
                } else {
                  // Append text to the current paragraph
                  currentParagraph.text += textItem.str + ' ';
                }
              });

              // Add the last paragraph
              pageData.paragraphs.push(currentParagraph);

              pdfData.push(pageData);
            }

            console.log(pdfData);
            setPdfData(pdfData); // set the value 

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




