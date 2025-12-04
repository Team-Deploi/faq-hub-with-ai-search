import {
  FetchCompanyInformation,
  FetchKnowledgebaseArticles,
} from "@/sanity/copilotActions";
import {
  CopilotRuntime,
  GroqAdapter,
  copilotRuntimeNextJSPagesRouterEndpoint,
} from "@copilotkit/runtime";

const serviceAdapter = new GroqAdapter({ model: "llama-3.3-70b-versatile" });

const checkRoute = (referer) => ({
  exact: (path) => {
    const pathname = referer ? new URL(referer).pathname : "";
    return pathname === path;
  },
  prefix: (path) => {
    const pathname = referer ? new URL(referer).pathname : "";
    return pathname.startsWith(path);
  },
});

const handler = async (req, res) => {
  const referer = req?.headers?.referer || "";

  const runtime = new CopilotRuntime({
    actions: () => {
      if (
        checkRoute(referer).exact("/") ||
        checkRoute(referer).prefix("/category")
      ) {
        return [FetchKnowledgebaseArticles, FetchCompanyInformation];
      }
      if (checkRoute(referer).prefix("/article")) {
        return [FetchCompanyInformation];
      }
      return [];
    },
  });

  const handleRequest = copilotRuntimeNextJSPagesRouterEndpoint({
    endpoint: "/api/copilotkit",
    runtime,
    serviceAdapter,
  });

  return await handleRequest(req, res);
};

export default handler;
