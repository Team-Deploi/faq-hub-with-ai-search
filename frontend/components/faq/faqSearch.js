import { useFaqChatbot } from "@/hooks/useChatbot";
import { useCopilotChat } from "@copilotkit/react-core";
import { Role, TextMessage } from "@copilotkit/runtime-client-gql";
import { useCallback, useState } from "react";
import { SearchIcon } from "../icons/SearchIcon";
import { FAQChatComponent } from "./faqChatComponent";

const FAQSearch = ({ enableAskAI, placeholder }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [error, setError] = useState("");
  const { response } = useFaqChatbot();

  const isCopilotEnabled = enableAskAI && response?.isEnabled;
  const { appendMessage } = useCopilotChat();
  const [isAIModalOpen, setIsAIModalOpen] = useState(false);

  const handleCopilotState = useCallback((state) => {
    setIsAIModalOpen(false);
  }, []);

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      const value = searchQuery.trim();
      if (!value) {
        setError("");
        return;
      }
      if (!isCopilotEnabled || !appendMessage) {
        setError("AI search is not available right now. Please try again later.");
        return;
      }
      setError("");
      setIsAIModalOpen(true);
      const message = new TextMessage({ role: Role.User, content: value });
      await appendMessage(message);
      setSearchQuery("");
    },
    [searchQuery, isCopilotEnabled, appendMessage]
  );

  const handleSearchChange = useCallback((e) => {
    setSearchQuery(e.target.value);
    if (error) {
      setError("");
    }
  }, [error]);

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
              id="default-search"
              placeholder={placeholder || "type your questions here"}
              className="block w-full px-3 py-[10px] pr-[100px] sm:pr-[165px] h-[50px] sm:h-[62px] border border-tertiary-100 placeholder:text-tertiary-100 font-medium outline-none rounded-xl text-sm"
              value={searchQuery}
              onChange={handleSearchChange}
            />

            <button
              type="submit"
              className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 bg-primary-100 h-[38px] w-[38px] sm:h-[42px] sm:w-[42px] flex items-center justify-center rounded-[6px]"
            >
              <SearchIcon />
            </button>
          </div>
          {error && (
            <p className="mt-1 text-xs text-red-500">
              {error}
            </p>
          )}
        </form>
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
