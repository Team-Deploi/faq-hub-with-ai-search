import { client } from "@/sanity/client";
import { FAQ_CHATBOT_QUERY } from "@/sanity/queries";
import React from "react";

export const useFaqChatbot = () => {
  const [response, setResponse] = React.useState(null);
  const [error, setError] = React.useState(null);

  React.useEffect(() => {
    const abortController = new AbortController();
    const signal = abortController.signal;

    const fetchData = async () => {
      try {
        const res = await client.fetch(FAQ_CHATBOT_QUERY, {}, { signal });
        setResponse(res);
      } catch (error) {
        setError(error);
      }
    };
    fetchData();
    return () => {
      abortController.abort();
    };
  }, []);

  return { response, error };
};
