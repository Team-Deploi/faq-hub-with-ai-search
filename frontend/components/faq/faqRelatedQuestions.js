import { buildFaqPath } from "@/utils/buildFaqPath";
import FAQArticle from "./faqArticle";

export const FAQRelatedQuestions = ({ articles }) => {
  return (
    <div className="mt-[32px]">
      <div className="md:p-6 p-4 bg-[#F9F9F9] rounded-[20px]">
        <h3 className="font-medium text-[16px]">Related Questions</h3>
        <div className="flex flex-col w-full">
          {(Array.isArray(articles) ? articles : []).map((article, index) => {
            return (
              <FAQArticle
                key={index}
                className="md:py-6! last:border-none"
                title={article?.title}
                excerpt={article?.excerpt}
                showIcon={false}
                href={buildFaqPath({
                  articleSlug: article?.slug,
                })}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};
