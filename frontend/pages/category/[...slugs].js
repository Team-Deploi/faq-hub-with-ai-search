import Heading1 from "@/components/Heading1";
import Pagination from "@/components/pagination/Index";
import { FAQBreadcrumbs } from "@/components/faq/faqBreadcrumbs";
import FAQCategoryList from "@/components/faq/faqCategories";
import FAQCommonQuestions from "@/components/faq/faqCommonQuestions";
import FAQSearch from "@/components/faq/faqSearch";
import Subtitle from "@/components/Subtitle";
import { client } from "@/sanity/client";
import {
  FAQ_CATEGORY_ARTICLES_QUERY,
  FAQ_CATEGORY_PAGE_QUERY,
  FAQ_CATEGORY_QUERY,
  FAQ_SUBCATEGORY_ARTICLES_QUERY,
  FAQ_SUBCATEGORY_PAGE_QUERY,
  FAQ_SUBCATEGORY_QUERY,
} from "@/sanity/queries";
import Head from "next/head";

const CategoryPage = ({
  categoryPage,
  category,
  subcategory,
  articles,
  pagination,
  isSubcategory,
}) => {
  const displayCategory = subcategory?.category || category;
  const displayTitle = subcategory?.title || category?.title || "Shopify Plus";
  const categoryTitle = displayCategory?.title || "Shopify Plus";
  const categorySlug = displayCategory?.slug;
  const subcategorySlug = subcategory?.slug;
  const pageTitle = isSubcategory
    ? displayTitle
    : category?.title
      ? `${category.title}`
      : "Shopify Plus";
  const headingTitle = isSubcategory ? category?.title : displayTitle;
  const heading = `${categoryPage?.heading ?? ""} ${headingTitle}`.trim();
  const description = `Expert Shopify Plus FAQs for ${displayTitle}—find curated answers, guides, and common questions.`;
  const ogImage = `${process.env.BASE_URL}/images/og.png`;
  const canonicalUrl = subcategory
    ? `${process.env.NEXT_PUBLIC_BASE_URL}/category/${categorySlug}/${subcategorySlug}`
    : `${process.env.NEXT_PUBLIC_BASE_URL}/category/${categorySlug}`;

  const renderSection = (section) => {
    switch (section._type) {
      case "faqSearch":
        return (
          <div key={section._key} className="w-full">
            <FAQSearch {...section} />
          </div>
        );
      case "faqSubCategories":
        // For subcategory pages, show siblings instead of subcategories
        if (isSubcategory && subcategory?.siblings?.length) {
          return (
            <div key={section._key} className="md:mt-[73px] mt-[36px]">
              <FAQCategoryList
                title={section?.title}
                items={subcategory?.siblings || []}
                subcategorySlug={subcategorySlug}
                categorySlug={categorySlug}
              />
            </div>
          );
        }
        // For category pages, show subcategories
        if (!isSubcategory && category?.subcategories?.length) {
          return (
            <div key={section._key} className="md:mt-[73px] mt-[36px]">
              <FAQCategoryList
                title={section?.title}
                items={category?.subcategories || []}
                subcategorySlug=""
                categorySlug={categorySlug}
              />
            </div>
          );
        }
        return null;
      case "faqCommonQuestions":
        return (
          <div
            key={section._key}
            className="md:mt-[150px] mt-[50px] scroll-mt-24"
            id="common-questions"
          >
            <FAQCommonQuestions articles={articles} {...section} />
          </div>
        );
      default:
        return <div key={section._key}>Block not found: {section._type}</div>;
    }
  };
  return (
    <div>
      <Head>
        <title>{`${pageTitle} | Deploi`}</title>
        <meta name="title" content={pageTitle} />
        <meta name="description" content={description} />
        <meta property="og:image" content={ogImage} />
        <meta property="og:title" content={displayTitle} />
        <meta property="og:description" content={description} />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={displayTitle} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image" content={ogImage} />
        <link rel="canonical" href={canonicalUrl} />
      </Head>
      <main>
        <FAQBreadcrumbs
          categoryName={categoryTitle}
          categorySlug={categorySlug}
          subCategoryName={subcategory?.title}
          subCategorySlug={subcategorySlug}
        />
        <div className="max-w-[922px] md:px-0 px-6 mx-auto relative pt-10 md:pt-[45px] md:pb-[150px] pb-[50px]">
          <Heading1>{heading || "Shopify Plus"}</Heading1>

          {categoryPage?.subheading && (
            <Subtitle>{categoryPage.subheading}</Subtitle>
          )}

          {categoryPage?.sections?.map(renderSection)}

          {pagination?.pageCount > 1 && (
            <div className="mt-12">
              <Pagination
                pageCount={pagination.pageCount}
                startUrl={
                  subcategory
                    ? `/category/${categorySlug}/${subcategorySlug}`
                    : `/category/${categorySlug}`
                }
                pageIndex={pagination.pageNo || 1}
                hashFragment="common-questions"
              />
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

const getPageSize = (categoryPage) => {
  return (
    categoryPage?.sections?.find(
      (section) => section._type === "faqCommonQuestions"
    )?.limit ?? 6
  );
};

const calculatePagination = (pageNo, pageSize) => {
  const start = (pageNo - 1) * pageSize;
  const limit = start + pageSize;
  return { start, limit };
};

const buildPaginationProps = (totalCount, pageSize, pageNo) => {
  const pageCount = Math.ceil((totalCount || 0) / pageSize) || 1;
  return {
    total: totalCount,
    pageCount,
    pageNo,
  };
};

export async function getServerSideProps(context) {
  // Extract slugs from params (catch-all route)
  const slugs = context.params?.slugs || [];
  if (slugs.length === 0 || slugs.length > 2) {
    return { notFound: true };
  }

  const isSubcategory = slugs.length === 2;
  const categorySlug = slugs[0];
  const subcategorySlug = slugs[1];
  const pageNo = Number(context.query?.p) || 1;

  if (isSubcategory) {
    // Fetch subcategory page config and subcategory document in parallel
    const [categoryPage, subcategory] = await Promise.all([
      client.fetch(FAQ_SUBCATEGORY_PAGE_QUERY),
      client.fetch(FAQ_SUBCATEGORY_QUERY, { subcategorySlug }),
    ]);

    if (!subcategory?._id || !categoryPage) {
      return { notFound: true };
    }

    // Ensure subcategory belongs to the correct category
    if (subcategory?.category?.slug !== categorySlug) {
      return { notFound: true };
    }

    // Calculate pagination
    const pageSize = getPageSize(categoryPage);
    const { start, limit } = calculatePagination(pageNo, pageSize);

    // Fetch paginated articles for subcategory
    const result = await client.fetch(FAQ_SUBCATEGORY_ARTICLES_QUERY, {
      subcategoryId: subcategory._id,
      start,
      limit,
    });

    const category = subcategory.category;

    return {
      props: {
        categoryPage,
        category: category || null,
        subcategory: subcategory || null,
        articles: result.articles,
        pagination: buildPaginationProps(result.totalCount, pageSize, pageNo),
        isSubcategory: true,
      },
    };
  }

  // Fetch category page config and category document in parallel
  const [categoryPage, category] = await Promise.all([
    client.fetch(FAQ_CATEGORY_PAGE_QUERY),
    client.fetch(FAQ_CATEGORY_QUERY, { categorySlug }),
  ]);

  if (!category?._id || !categoryPage) {
    return { notFound: true };
  }

  // Calculate pagination
  const pageSize = getPageSize(categoryPage);
  const { start, limit } = calculatePagination(pageNo, pageSize);

  // Fetch paginated articles for category
  const result = await client.fetch(FAQ_CATEGORY_ARTICLES_QUERY, {
    categoryId: category._id,
    start,
    limit,
  });

  return {
    props: {
      categoryPage,
      category: category || null,
      subcategory: null,
      articles: result.articles,
      pagination: buildPaginationProps(result.totalCount, pageSize, pageNo),
      isSubcategory: false,
    },
  };
}

export default CategoryPage;
