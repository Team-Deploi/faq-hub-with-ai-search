import React from "react";

const Subtitle = ({ children }) => {
  return (
    <p className="relative mt-4 md:mt-5 mb-8 md:mb-[52px] text-lg md:text-[24px] md:leading-[36px] font-normal text-center z-10">
      {children}
    </p>
  );
};

export default Subtitle;
