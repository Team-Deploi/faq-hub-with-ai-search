import { client, embeddedApiClient } from "./client.js";
import { FAQ_LLM_ARTICLES_QUERY, COMPANY_INFO_QUERY } from "./queries.js";

async function queryEmbeddingsIndex(query, maxResults = 5) {
  const response = await embeddedApiClient.request({
    url: `/embeddings-index/query/development/faq-articles-index`,
    method: "POST",
    body: {
      query: query,
      maxResults: maxResults,
    },
  });
  return response.map((item) => item.value.documentId) || [];
}

export const FetchKnowledgebaseArticles = {
  name: "FetchKnowledgebaseArticles",
  description: "Fetch relevant knowledge base articles based on a user query",
  parameters: [
    {
      name: "query",
      type: "string",
      description:
        "The User query for the knowledge base index search to perform",
      required: true,
    },
    {
      name: "maxResults",
      type: "number",
      description: "Maximum number of articles to return (default: 5)",
      required: false,
    },
  ],
  handler: async ({ query, maxResults = 5 }) => {
    console.log("🔍 FetchKnowledgebaseArticles Query:", query);
    try {
      // Search for relevant articles using embeddings
      const articleIds = await queryEmbeddingsIndex(query, maxResults);

      if (!articleIds?.length) {
        return "No relevant articles found for your query.";
      }
      // Fetch full article content using the FAQ_LLM_ARTICLES_QUERY
      const articles = await client.fetch(FAQ_LLM_ARTICLES_QUERY, {
        ids: articleIds,
      });

      if (!articles?.length) {
        return "Articles not found.";
      }

      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

      const knowledgeBaseArticles = articles.map((article) => {
        const categorySlug = article.category?.slug;

        return {
          ...article,
          url: `${baseUrl}/article/${article.slug}`,
          category: article.category
            ? {
                ...article.category,
                url: `${baseUrl}/category/${article.category.slug}`,
              }
            : null,
          subCategory: article.subCategory
            ? {
                ...article.subCategory,
                url: categorySlug
                  ? `${baseUrl}/category/${categorySlug}/${article.subCategory.slug}`
                  : null,
              }
            : null,
        };
      });

      return {
        query: query,
        total_results: knowledgeBaseArticles.length,
        articles: knowledgeBaseArticles,
      };
    } catch (error) {
      console.error("Error fetching knowledge base articles:", error);
      throw new Error("Unable to retrieve articles at this time.");
    }
  },
};

export const FetchCompanyInformation = {
  name: "FetchCompanyInformation",
  description:
    "Retrieves comprehensive company information including services offered, team details, past projects, and contact information. Use this when users ask about the company's capabilities, what they do, or any business-specific details.",
  parameters: [],
  handler: async () => {
    console.log("🔍 FetchCompanyInformation");
    try {
      const companyInformation = await client.fetch(COMPANY_INFO_QUERY);

      if (!companyInformation) {
        return "Company information is currently unavailable. Please check back later.";
      }

      return { companyInformation };
    } catch (error) {
      console.error("Error fetching company information:", error);
      throw new Error("Unable to retrieve company information at this time.");
    }
  },
};
