import { createClient } from "next-sanity";

const embeddingsClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: "vX",
  useCdn: false,
  token: process.env.SANITY_VIEWER_TOKEN,
});

export async function queryEmbeddingsIndex(query, maxResults = 15) {
  const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET;
  const response = await embeddingsClient.request({
    url: `/embeddings-index/query/${dataset}/faq-articles-index`,
    method: "POST",
    body: {
      query: query,
      maxResults: maxResults,
    },
  });
  // Return array of objects with id and score, sorted by score (highest first)
  return response.map((item) => ({
    id: item.value.documentId,
    score: item.score,
  })) || [];
}
