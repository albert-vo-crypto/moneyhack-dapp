import React from "react";

const SecondaryButton = ({ children, onClick }) => {
  return (
    <button
      type="button"
      class="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-textonhighlight bg-secondarylight hover:bg-primary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondarylight"
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export default SecondaryButton;
