import { client } from "@/sanity/client";
import { FAQ_LLM_ARTICLES_SEARCH_QUERY } from "@/sanity/queries";
import { queryEmbeddingsIndex } from "@/sanity/embeddingsIndex";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const { query, maxResults = 15, page = 0 } = req.body;

  if (!query) {
    return res.status(400).json({ error: "Missing query parameter" });
  }

  try {
    // Query embeddings index to get article IDs with scores
    const articlesWithScores = await queryEmbeddingsIndex(query, maxResults);

    if (!articlesWithScores?.length) {
      return res.status(200).json({
        results: [],
        total: 0,
      });
    }

    // Apply pagination to the articles (already sorted by score from embeddings index)
    const PAGE_SIZE = 15;
    const start = page * PAGE_SIZE;
    const end = start + PAGE_SIZE;
    const paginatedArticles = articlesWithScores.slice(start, end);

    // Extract IDs for the query
    const paginatedIds = paginatedArticles.map((item) => item.id);

    // Create a map of ID to score for quick lookup
    const scoreMap = new Map(
      paginatedArticles.map((item) => [item.id, item.score])
    );

    // Fetch articles using the paginated IDs
    const results = await client.fetch(FAQ_LLM_ARTICLES_SEARCH_QUERY, {
      ids: paginatedIds,
    });

    // Map scores to articles and sort by score (highest first)
    const resultsWithScores = (results || [])
      .map((article) => ({
        ...article,
        _score: scoreMap.get(article._id) || 0,
      }))
      .sort((a, b) => b._score - a._score);

    res.status(200).json({
      results: resultsWithScores,
      total: articlesWithScores.length,
    });
  } catch (error) {
    console.error("Error in embeddings search:", error);
    res
      .status(500)
      .json({ error: error.message || "Failed to search articles" });
  }
}
