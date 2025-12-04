export const buildFaqPath = ({
  categorySlug,
  subCategorySlug,
  articleSlug,
}) => {
  // Article pages use /shopify/faq/article/article-slug
  if (articleSlug) {
    return `/article/${articleSlug}`;
  }

  // Home page: /
  if (!categorySlug) {
    return "/";
  }

  // Category pages: /category/category-slug
  // Subcategory pages: /category/category-slug/subcategory-slug
  const segments = ["/category", categorySlug, subCategorySlug]
    .filter(Boolean)
    .join("/");

  return segments;
};
