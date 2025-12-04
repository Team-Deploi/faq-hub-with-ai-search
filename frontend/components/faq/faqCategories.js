import { buildFaqPath } from "@/utils/buildFaqPath";
import Heading2 from "../Heading2";

const FAQCategoryButton = ({ title, href, active = false }) => {
  return (
    <a
      href={href}
      className={`h-12 px-[23px] py-3 text-base font-medium whitespace-nowrap rounded-md ${
        active
          ? "bg-primary-100 text-white border border-primary-100"
          : "text-tertiary-100 border border-tertiary-100"
      }`}
    >
      {title || "Category"}
    </a>
  );
};

const FAQCategoryList = ({
  title,
  items,
  subcategorySlug = "",
  categorySlug,
}) => {
  return (
    <div className="flex flex-col gap-5">
      <Heading2>{title || "Select Cate-gory"}</Heading2>
      <div className="flex md:flex-wrap flex-nowrap overflow-auto gap-x-[14px] gap-y-[22px]">
        {Array.isArray(items) && items.length
          ? items.map((item, index) => {
              // If parentCategorySlug is provided, these are subcategories
              // Otherwise, they are top-level categories
              const href = categorySlug
                ? buildFaqPath({
                    categorySlug: categorySlug,
                    subCategorySlug: item?.slug,
                  })
                : buildFaqPath({ categorySlug: item?.slug });

              return (
                <FAQCategoryButton
                  key={index}
                  title={item?.title}
                  href={href}
                  active={item?.slug === subcategorySlug}
                />
              );
            })
          : null}
      </div>
    </div>
  );
};

export default FAQCategoryList;
