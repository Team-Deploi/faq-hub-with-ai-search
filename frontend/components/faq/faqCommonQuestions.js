import { buildFaqPath } from "@/utils/buildFaqPath";
import Heading2 from "../Heading2";
import FAQArticle from "./faqArticle";

const FAQCommonQuestions = ({ title, articles }) => {
  return (
    <div className="flex flex-col md:gap-10">
      <Heading2>{title || "Section name"}</Heading2>
      <div className="flex flex-col">
        {Array.isArray(articles) && articles.length ? (
          articles.map((article, index) => {
            return (
              <FAQArticle
                key={index}
                href={buildFaqPath({
                  categorySlug: article?.category?.slug,
                  subCategorySlug: article?.subCategory?.slug,
                  articleSlug: article?.slug,
                })}
                title={article?.title}
                excerpt={article?.excerpt}
              />
            );
          })
        ) : (
          <div className="text-center">No articles found!</div>
        )}
      </div>
    </div>
  );
};

export default FAQCommonQuestions;
