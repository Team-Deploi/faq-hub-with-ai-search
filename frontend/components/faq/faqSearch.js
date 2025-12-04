import { useFaqChatbot } from "@/hooks/useChatbot";
import { useCopilotChat } from "@copilotkit/react-core";
import { Role, TextMessage } from "@copilotkit/runtime-client-gql";
import { useCallback, useRef, useState } from "react";
import { HiSparkles } from "react-icons/hi2";
import { SearchIcon } from "../icons/SearchIcon";
import { FAQChatComponent } from "./faqChatComponent";
import { FAQSearchResults } from "./faqSearchResults";

const FAQSearch = ({ enableAskAI, placeholder }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchCache, setSearchCache] = useState(new Map());
  const inputRef = useRef(null);
  const { response } = useFaqChatbot();

  const isCopilotEnabled = enableAskAI && response?.isEnabled;
  const { appendMessage } = useCopilotChat();
  const [isAIModalOpen, setIsAIModalOpen] = useState(false);

  const handleCopilotState = useCallback((state) => {
    setIsAIModalOpen(false);
  }, []);

  const handleSubmit = useCallback((e) => {
    e.preventDefault();
  }, []);

  const handleAskAI = useCallback(async () => {
    const value = searchQuery.trim();
    if (!value || !isCopilotEnabled || !appendMessage) return;
    setIsAIModalOpen(true);
    setIsDropdownOpen(false);
    const message = new TextMessage({ role: Role.User, content: value });
    await appendMessage(message);
    setSearchQuery("");
  }, [searchQuery, appendMessage, isCopilotEnabled]);

  const handleSearchChange = useCallback((e) => {
    setSearchQuery(e.target.value);
  }, []);

  const handleFocus = useCallback(() => {
    if (searchQuery && (results.length > 0 || loading)) {
      setIsDropdownOpen(true);
    }
  }, [searchQuery, results.length, loading]);

  // Simple cache helpers
  const getCachedResults = useCallback(
    (query) => {
      const key = query.toLowerCase().trim();
      const cached = searchCache.get(key);
      if (cached && Date.now() - cached.timestamp < 300000) {
        // 5 minutes
        return cached;
      }
      return null;
    },
    [searchCache]
  );

  const setCachedResults = useCallback((query, results, total) => {
    const key = query.toLowerCase().trim();
    setSearchCache((prev) =>
      new Map(prev).set(key, {
        results,
        total,
        timestamp: Date.now(),
      })
    );
  }, []);

  return (
    <>
      <div className="max-w-[691px] mx-auto relative">
        <form onSubmit={handleSubmit}>
          <label
            htmlFor="default-search"
            className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white"
          >
            Search
          </label>
          <div className="relative">
            <input
              ref={inputRef}
              id="default-search"
              placeholder={placeholder || "type your questions here"}
              className="block w-full px-3 py-[10px] pr-[100px] sm:pr-[165px] h-[50px] sm:h-[62px] border border-tertiary-100 placeholder:text-tertiary-100 font-medium outline-none rounded-xl text-sm"
              value={searchQuery}
              onChange={handleSearchChange}
              onFocus={handleFocus}
            />

            {isCopilotEnabled && searchQuery.trim() != "" && (
              <button
                type="button"
                onClick={handleAskAI}
                className="absolute right-[50px] sm:right-[58px] top-1/2 -translate-y-1/2 flex items-center justify-center sm:gap-2 h-[38px] w-[38px] sm:w-auto sm:px-4 sm:h-[42px] bg-primary-100 text-white rounded-[6px] font-medium text-sm"
              >
                <HiSparkles className="w-[18px] h-[18px]" />
                <span className="hidden sm:inline whitespace-nowrap">
                  Ask AI
                </span>
              </button>
            )}

            <button
              type="submit"
              className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 bg-primary-100 h-[38px] w-[38px] sm:h-[42px] sm:w-[42px] flex items-center justify-center rounded-[6px]"
            >
              <SearchIcon />
            </button>
          </div>
        </form>

        <FAQSearchResults
          results={results}
          setSearchQuery={setSearchQuery}
          searchQuery={searchQuery}
          setIsDropdownOpen={setIsDropdownOpen}
          setLoading={setLoading}
          setResults={setResults}
          isDropdownOpen={isDropdownOpen}
          loading={loading}
          inputRef={inputRef}
          getCachedResults={getCachedResults}
          setCachedResults={setCachedResults}
        />
      </div>

      {isAIModalOpen && response && isCopilotEnabled && (
        <FAQChatComponent
          handleCopilotState={handleCopilotState}
          response={response}
        />
      )}
    </>
  );
};

export default FAQSearch;
