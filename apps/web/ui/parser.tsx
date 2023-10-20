import React from "react";
import parse from "html-react-parser";

export const StyledHtmlParser = ({
  children,
  options,
}: {
  children: string;
  options?: any;
}) => {
  return (
    <div className="mt-10">
      <style>
        {`
          * {
            white-space: normal;
          }
          img {
            margin: 1rem 0;
          }
          h1, h2, h3, h4, h5, h6 {
            font-size: 1.5rem;
            font-weight: 500;
            margin-bottom: 0.5rem;
          }
          p {
            margin-bottom: 1rem;
          }
          ul {
            padding-left: 2rem;
            margin-bottom: 1rem;
          }
          a {
            color: blue;
          }
          ol {
            padding-left: 2rem;
            margin-bottom: 1rem;
          }
          li {
            margin-bottom: 0.5rem;
          }
          .editor-link {
            background: #f0f0f0;
            border-radius: 10px;
            padding: 1.5rem;
          }
        `}
      </style>
      {parse(children ?? "", options)}
    </div>
  );
};

export default StyledHtmlParser;
