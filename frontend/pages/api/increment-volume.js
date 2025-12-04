import { apiClient } from "@/sanity/client";

// NOTE FOR DEVELOPERS:
// This endpoint currently increments article volume without IP-based rate limiting.
// If you want to prevent multiple views from the same IP (e.g. using Redis),
// reintroduce an IP-based check here before incrementing the volume.
// Example (pseudocode):
//   - Resolve client IP from the request.
//   - Build a key like `view:${articleId}:${clientIp}`.
//   - Use Redis (or another store) to skip updates when the key already exists.

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end("Method Not Allowed");

  const { articleId } = req.body;
  if (!articleId) return res.status(400).json({ error: "Missing articleId" });

  try {
    const updated = await apiClient
      .patch(articleId)
      .inc({ volume: 1 })
      .commit();

    res.status(200).json({ volume: updated.volume });
  } catch (err) {
    console.error("Failed to increment volume:", err);
    res.status(500).json({ error: err.message });
  }
}
