import React from "react";

const HighlightButton = ({ children, onClick }) => {
  return (
    <button
      type="button"
      class="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-textonhighlight bg-hightlightlight hover:bg-primary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-hightlightlight"
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export default HighlightButton;
