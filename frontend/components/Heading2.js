import React from "react";

const Heading2 = ({ children }) => {
  return (
    <h2 className="text-2xl md:text-[42px] leading-[36px] md:leading-[63px] font-medium md:font-semibold">
      {children}
    </h2>
  );
};

export default Heading2;
