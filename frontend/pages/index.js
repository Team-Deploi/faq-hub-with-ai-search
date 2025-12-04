import FAQCategoryList from "@/components/faq/faqCategories";
import FAQCommonQuestions from "@/components/faq/faqCommonQuestions";
import FAQFeaturedSection from "@/components/faq/faqFeaturedSection";
import FAQSearch from "@/components/faq/faqSearch";
import Heading1 from "@/components/Heading1";
import Subtitle from "@/components/Subtitle";
import { client } from "@/sanity/client";
import {
  FAQ_HOMEPAGE_COMMON_ARTICLES_QUERY,
  FAQ_HOMEPAGE_QUERY,
} from "@/sanity/queries";
import Head from "next/head";

export default function Home({ homepage, articles }) {
  const sections = Array.isArray(homepage?.sections) ? homepage.sections : [];
  const firstFeaturedIndex = sections.findIndex(
    (section) => section._type === "faqFeaturedSection"
  );

  const pageTitle = homepage?.title || "Shopify Plus FAQ Hub";
  const description =
    homepage?.description ||
    "Expert answers and best practices for Shopify Plus—browse categories, featured guides, and common questions.";
  const ogImage = `${process.env.NEXT_PUBLIC_BASE_URL}/images/og.png`;
  const canonicalUrl = process.env.NEXT_PUBLIC_BASE_URL;

  const renderSection = (section, index) => {
    switch (section._type) {
      case "faqSearch":
        return (
          <div key={section._key} className="w-full">
            <FAQSearch {...section} />
          </div>
        );
      case "faqCategories":
        return (
          <div key={section._key} className="md:mt-[73px] mt-[36px]">
            <FAQCategoryList
              title={section?.title}
              items={section?.categories || []}
              current=""
            />
          </div>
        );
      case "faqFeaturedSection": {
        const isFirstFeatured = index === firstFeaturedIndex;
        return (
          <div
            key={section._key}
            className={
              isFirstFeatured
                ? "md:mt-[134px] mt-[50px]"
                : "md:mt-[150px] mt-[25px]"
            }
          >
            <FAQFeaturedSection {...section} />
          </div>
        );
      }
      case "faqCommonQuestions":
        return (
          <div key={section._key} className="md:mt-[150px] mt-[50px]">
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
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={description} />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={pageTitle} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image" content={ogImage} />
        <link rel="canonical" href={canonicalUrl} />
      </Head>
      <main>
        <div className="relative max-w-[922px] pt-10 md:pt-20 md:pb-[150px] pb-[50px] md:px-0 px-6 mx-auto">
          <Heading1>{homepage?.heading || "Heading"}</Heading1>
          {homepage?.subheading && <Subtitle>{homepage.subheading}</Subtitle>}
          {sections.map(renderSection)}
        </div>
      </main>
    </div>
  );
}

export async function getServerSideProps(context) {
  // Fetch homepage data
  const homepage = await client.fetch(FAQ_HOMEPAGE_QUERY);

  // Early return if homepage doesn't exist
  if (!homepage) {
    return {
      notFound: true,
    };
  }

  // Extract limit with default value
  const articlesLimit =
    homepage?.sections?.find(
      (section) => section._type === "faqCommonQuestions"
    )?.limit ?? 5;

  // Fetch articles
  const articles = await client.fetch(FAQ_HOMEPAGE_COMMON_ARTICLES_QUERY, {
    limit: articlesLimit,
  });

  // Check articles after fetching
  if (!articles) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      homepage,
      articles,
    },
  };
}
