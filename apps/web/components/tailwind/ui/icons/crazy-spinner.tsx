import React from "react";

const CrazySpinner = () => {
  return (
    <div className="flex items-center justify-center gap-0.5">
      <div className="h-1.5 w-1.5 animate-bounce rounded-full bg-purple-500 [animation-delay:-0.3s]"></div>
      <div className="h-1.5 w-1.5 animate-bounce rounded-full bg-purple-500 [animation-delay:-0.15s]"></div>
      <div className="h-1.5 w-1.5 animate-bounce rounded-full bg-purple-500"></div>
    </div>
  );
};

export default CrazySpinner;
