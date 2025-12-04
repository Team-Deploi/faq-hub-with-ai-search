import { buildFaqPath } from "@/utils/buildFaqPath";
import Heading2 from "../Heading2";
import FAQArticle from "./faqArticle";

const FAQFeaturedSection = ({ title, articles }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-[fit-content(35ch)_minmax(0,1fr)] md:gap-10 gap-0">
      <div className="">
        <Heading2 className="font-medium md:font-semibold">
          {title || "Section name"}
        </Heading2>
      </div>
      <div className="flex flex-col">
        {Array.isArray(articles) && articles.length ? (
          articles.map((article, index) => {
            return (
              <FAQArticle
                key={index}
                href={buildFaqPath({
                  articleSlug: article?.slug,
                })}
                title={article?.title}
                excerpt={article?.excerpt}
              />
            );
          })
        ) : (
          <div className="text-center">No Article Found!</div>
        )}
      </div>
    </div>
  );
};

export default FAQFeaturedSection;
