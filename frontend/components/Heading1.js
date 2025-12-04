import React from "react";

const Heading1 = ({ children }) => {
  return (
    <h1 className="text-[32px] md:text-[52px] leading-[48px] md:leading-[66px] font-bold text-center">
      {children}
    </h1>
  );
};

export default Heading1;
