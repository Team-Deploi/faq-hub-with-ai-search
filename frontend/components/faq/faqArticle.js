import { RightArrowIcon } from "../icons/RightArrowIcon";

const FAQArticle = ({ href, title, excerpt, className, showIcon = true }) => {
  return (
    <a
      href={href}
      className={`${className} flex items-center justify-between md:py-[30px] py-[15px] border-b border-[#BEBCBC] last:border-none cursor-pointer`}
    >
      <div className="flex flex-col gap-[10px] md:pr-20 pr-5">
        <h3 className="md:text-xl font-semibold">{title || "Question?"}</h3>
        {excerpt && (
          <p className="md:text-base text-sm font-normal line-clamp-2">
            {excerpt}
          </p>
        )}
      </div>
      {showIcon && (
        <div className="w-[32px] h-[32px] flex items-center justify-center shrink-0">
          <RightArrowIcon />
        </div>
      )}
    </a>
  );
};

export default FAQArticle;
