import { buildFaqPath } from "@/utils/buildFaqPath";

export const FAQBreadcrumbs = ({
  categoryName,
  categorySlug,
  subCategoryName,
  subCategorySlug,
  articleTitle,
}) => {
  const isArticlePage = !!articleTitle;
  const hasSubCategory = !!subCategoryName;

  return (
    <div className="mt-[35px] max-w-5xl mx-auto lg:px-0 px-6">
      <div className="flex items-center flex-wrap text-sm font-semibold">
        {/* Home */}
        <a
          href={buildFaqPath({})}
          className="hover:text-primary-100 transition-colors"
        >
          Home
        </a>

        {/* Category */}
        {categoryName && (
          <>
            <span className="px-2">{">"}</span>
            {isArticlePage || hasSubCategory ? (
              <a
                href={buildFaqPath({ categorySlug })}
                className="hover:text-primary-100 transition-colors"
              >
                {categoryName}
              </a>
            ) : (
              <span className="text-primary-100">{categoryName}</span>
            )}
          </>
        )}

        {/* Subcategory */}
        {hasSubCategory && (
          <>
            <span className="px-2">{">"}</span>
            {isArticlePage ? (
              <a
                href={buildFaqPath({ categorySlug, subCategorySlug })}
                className="hover:text-primary-100 transition-colors"
              >
                {subCategoryName}
              </a>
            ) : (
              <span className="text-primary-100">{subCategoryName}</span>
            )}
          </>
        )}

        {/* Article */}
        {isArticlePage && (
          <>
            <span className="px-2">{">"}</span>
            <span className="text-primary-100">{articleTitle}</span>
          </>
        )}
      </div>
    </div>
  );
};
