import React from "react";

const HeaderText = ({ children }) => {
  return (
    <h1 class="font-sans text-6xl font-normal leading-7 mt-5 mb-0 text-primarytext sm:text-2xl sm:truncate md:text-4xl">
      {children}
    </h1>
  );
};

export default HeaderText;
