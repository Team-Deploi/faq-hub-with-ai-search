import axios from "axios";
import { useEffect } from "react";

export const useIncrementVolume = (articleId) => {
  useEffect(() => {
    if (!articleId) return;

    const abortController = new AbortController();
    const signal = abortController.signal;

    // Wait 5 seconds before incrementing (minimum watch time)
    const timer = setTimeout(() => {
      axios
        .post(
          "/api/increment-volume",
          {
            articleId,
          },
          { signal }
        )
        .catch((error) => {
          if (error.name !== "CanceledError") {
            console.error("Failed to increment volume:", error);
          }
        });
    }, 5000);

    return () => {
      clearTimeout(timer);
      abortController.abort();
    };
  }, [articleId]);
};
