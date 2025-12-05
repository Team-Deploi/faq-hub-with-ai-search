import { CopilotCustomChat } from "@/components/copilot/CustomChat";
import { FAQBreadcrumbs } from "@/components/faq/faqBreadcrumbs";
import { FAQPortableText } from "@/components/faq/faqPortableText";
import { FAQRelatedQuestions } from "@/components/faq/faqRelatedQuestions";
import Heading1 from "@/components/Heading1";
import { useFaqChatbot } from "@/hooks/useChatbot";
import { useIncrementVolume } from "@/hooks/useIncrementVolume";
import { client } from "@/sanity/client";
import { FAQ_ARTICLE_PATHS_QUERY, FAQ_ARTICLE_QUERY } from "@/sanity/queries";
import Head from "next/head";

const processData = (data) => {
  if (!data) return {};
  return {
    title: data?.title || "",
    excerpt: data?.excerpt || "",
    content: data?.plaintextBody || "",
    categoryTitle: data?.category?.title || "",
  };
};

const FAQPage = ({ article }) => {
  const { category, subCategory, title, excerpt, body, relatedArticles } =
    article;
  const { response } = useFaqChatbot();
  const pageUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/article/${article.slug}`;
  const ogImage = `${process.env.NEXT_PUBLIC_BASE_URL}/images/og.png`;

  useIncrementVolume(article?._id);

  return (
    <div>
      <Head>
        <title>{title}</title>
        <meta name="title" content={title} />
        <meta name="description" content={excerpt} />
        <meta property="og:image" content={ogImage} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={excerpt} />
        <meta property="og:url" content={pageUrl} />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={excerpt} />
        <meta name="twitter:image" content={ogImage} />
        <link rel="canonical" href={pageUrl} />
      </Head>
      <main>
        <FAQBreadcrumbs
          categoryName={category?.title}
          categorySlug={category?.slug}
          subCategoryName={subCategory?.title}
          subCategorySlug={subCategory?.slug}
          articleTitle={article.breadcrumbTitle || title}
        />
        <div className="max-w-[777px] mx-auto md:px-0 px-6 relative pt-10 md:pt-[45px] md:pb-[150px] pb-[50px]">
          <Heading1>{title}</Heading1>

          {response && response?.isEnabled && (
            <CopilotCustomChat
              data={processData(article)}
              chatbot={{ attributes: response }}
              welcomeComponentClass="px-0 !my-4 md:!my-8"
              chatComponentClass="px-0 !my-4 md:!my-8"
            />
          )}

          {body && (
            <div className="md:my-[32px] my-[25px] max-w-[777px] prose md:prose-md">
              <FAQPortableText body={body} />
            </div>
          )}

          {relatedArticles?.length > 0 && (
            <FAQRelatedQuestions articles={relatedArticles} />
          )}
        </div>
      </main>
    </div>
  );
};

export async function getStaticPaths() {
  const articles = await client.fetch(FAQ_ARTICLE_PATHS_QUERY, {
    start: 0,
    end: 500,
  });

  const paths =
    articles
      ?.filter((article) => article?.slug)
      .map((article) => ({
        params: { slug: article.slug },
      })) || [];

  return {
    paths,
    fallback: "blocking",
  };
}

export async function getStaticProps({ params }) {
  const article = await client.fetch(FAQ_ARTICLE_QUERY, {
    slug: params.slug,
  });

  if (!article) {
    return { notFound: true };
  }

  return {
    props: { article },
    revalidate: 1,
  };
}

export default FAQPage;
