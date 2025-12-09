import { useDebounce } from "@/hooks/useDebounce";
import { buildFaqPath } from "@/utils/buildFaqPath";
import { useCallback, useEffect, useRef, useState } from "react";
import { IoClose } from "react-icons/io5";
import axios from "axios";

// Remote search config
const PAGE_SIZE = 20;
const MIN_SEARCH_LENGTH = 3; // Minimum 3 characters required

export const FAQSearchResults = ({
  results,
  setIsDropdownOpen,
  searchQuery,
  setLoading,
  setResults,
  isDropdownOpen,
  setSearchQuery,
  loading,
  inputRef,
  getCachedResults,
  setCachedResults,
}) => {
  const debouncedSearchQuery = useDebounce(searchQuery, 500);
  const [page, setPage] = useState(0);
  const [total, setTotal] = useState(0);
  const [error, setError] = useState(null);
  const dropdownRef = useRef(null);

  // Reset page and error when search term changes
  useEffect(() => {
    setPage(0);
    setError(null);
  }, [debouncedSearchQuery]);

  const handleClickOutside = useCallback(
    (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        !inputRef.current?.contains(event.target)
      ) {
        setIsDropdownOpen(false);
      }
    },
    [inputRef, setIsDropdownOpen]
  );

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [handleClickOutside]);

  // Remote search based on debounced term and page
  useEffect(() => {
    const abortController = new AbortController();

    const fetchData = async () => {
      try {
        const term = debouncedSearchQuery.trim();

        // Check minimum character requirement
        if (term === "" || term.length < MIN_SEARCH_LENGTH) {
          setResults([]);
          setTotal(0);
          setLoading(false);
          setIsDropdownOpen(false);
          setError(null);
          return;
        }

        // Check cache first
        const cached = getCachedResults(term);
        if (cached) {
          setResults(cached.results);
          setTotal(cached.total);
          setLoading(false);
          setIsDropdownOpen(true);
          setError(null);
          return;
        }

        setLoading(true);
        setIsDropdownOpen(true);
        setError(null);

        // Call the API endpoint for embeddings search
        const response = await axios.post(
          "/api/embeddings-search",
          {
            query: term,
            maxResults: 15,
            page: page,
          },
          {
            signal: abortController.signal,
          }
        );

        if (!abortController.signal.aborted) {
          const results = response.data.results || [];
          const total = response.data.total || 0;
          setResults(results);
          setTotal(total);
          // Cache the results
          setCachedResults(term, results, total);
        }
      } catch (error) {
        if (axios.isCancel(error) || error.name === "AbortError") {
          // Request was cancelled, ignore
          return;
        }
        console.error("Search error:", error);
        if (!abortController.signal.aborted) {
          setError("Failed to search articles. Please try again.");
          setResults([]);
          setTotal(0);
        }
      } finally {
        if (!abortController.signal.aborted) {
          setLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      abortController.abort();
    };
  }, [
    debouncedSearchQuery,
    page,
    setResults,
    setTotal,
    setLoading,
    setIsDropdownOpen,
    getCachedResults,
    setCachedResults,
  ]);

  const handlePrevPage = useCallback(() => {
    setPage((p) => Math.max(0, p - 1));
  }, []);

  const handleNextPage = useCallback(() => {
    const maxPage = Math.ceil(total / PAGE_SIZE) - 1;
    setPage((p) => Math.min(maxPage, p + 1));
  }, [total]);

  const handleResultClick = useCallback(() => {
    setIsDropdownOpen(false);
    setSearchQuery("");
  }, [setIsDropdownOpen, setSearchQuery]);

  const handleClose = useCallback(() => {
    setIsDropdownOpen(false);
  }, [setIsDropdownOpen]);

  const handleRetry = useCallback(() => {
    setError(null);
    // Trigger a new search by updating the page
    setPage(0);
  }, []);

  const totalPages = Math.ceil(total / PAGE_SIZE);
  const hasResults = results.length > 0;

  if (isDropdownOpen && searchQuery) {
    return (
      <div
        ref={dropdownRef}
        className="absolute top-full left-0 right-0 mt-2 sm:mt-3 bg-white border border-gray-200 rounded-xl sm:rounded-2xl shadow-md max-h-[70vh] sm:max-h-[600px] overflow-hidden z-10 flex flex-col"
      >
        {/* Dropdown Header */}
        <div className="px-3 sm:px-4 py-2.5 sm:py-3 bg-white border-b border-gray-100 shrink-0">
          {loading ? (
            <p className="text-xs sm:text-sm text-gray-500">Searching...</p>
          ) : (
            <div className="flex items-center justify-between">
              <p className="text-xs sm:text-sm text-gray-700">
                <span className="font-semibold">{total}</span>{" "}
                {total === 1 ? "result" : "results"} found
              </p>
              <button
                type="button"
                onClick={handleClose}
                className="text-gray-500 hover:text-gray-700 transition-colors"
              >
                <IoClose className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>

        {/* Results List */}
        <div className="overflow-y-auto flex-1">
          {loading ? (
            // Loading skeleton
            <div className="py-2">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="px-3 sm:px-4 py-3 sm:py-4 border-b border-gray-100 last:border-b-0 animate-pulse"
                >
                  <div className="flex items-start justify-between gap-2 sm:gap-3">
                    <div className="flex-1">
                      <div className="h-4 sm:h-5 w-20 sm:w-24 bg-gray-200 rounded-full mb-2"></div>
                      <div className="h-3 sm:h-4 bg-gray-200 rounded w-full sm:w-3/4 mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded w-full"></div>
                      <div className="h-3 bg-gray-200 rounded w-2/3 mt-1"></div>
                    </div>
                    <div className="w-4 h-4 sm:w-5 sm:h-5 bg-gray-200 rounded"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : error ? (
            // Error state
            <div className="p-6 sm:p-8 text-center">
              <div className="w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-2 sm:mb-3 flex items-center justify-center rounded-full bg-red-50">
                <svg
                  className="w-5 h-5 sm:w-6 sm:h-6 text-red-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                  />
                </svg>
              </div>
              <p className="text-xs sm:text-sm font-medium text-gray-900 mb-1">
                {error}
              </p>
              <button
                onClick={handleRetry}
                className="text-xs sm:text-sm text-primary-100 hover:text-primary-200 transition-colors"
              >
                Try again
              </button>
            </div>
          ) : hasResults ? (
            // Results list
            <div className="py-2">
              {results.map((faq) => (
                <a
                  key={faq._id}
                  href={buildFaqPath({
                    articleSlug: faq?.slug,
                  })}
                  onClick={handleResultClick}
                  className="block px-3 sm:px-4 py-3 sm:py-4 border-b border-gray-100 last:border-b-0 hover:bg-gray-50 focus:outline-none focus:bg-purple-50 focus:ring-2 focus:ring-primary-100 focus:ring-inset transition-colors"
                >
                  <div className="flex items-start justify-between gap-2 sm:gap-3">
                    <div className="flex-1 min-w-0">
                      {faq?.category?.title && (
                        <span className="inline-block px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-700 mb-1.5 sm:mb-2">
                          {faq.category.title}
                        </span>
                      )}
                      <h3 className="text-xs sm:text-sm font-semibold text-gray-900 mb-1 line-clamp-2 sm:line-clamp-1">
                        {faq.title}
                      </h3>
                      <p className="text-[11px] sm:text-xs text-gray-600 line-clamp-2">
                        {faq.excerpt}
                      </p>
                    </div>
                    <svg
                      className="w-4 h-4 sm:w-5 sm:h-5 text-gray-900 shrink-0 mt-0.5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </div>
                </a>
              ))}
            </div>
          ) : (
            // No results
            <div className="p-6 sm:p-8 text-center">
              <div className="w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-2 sm:mb-3 flex items-center justify-center rounded-full bg-purple-50">
                <svg
                  className="w-5 h-5 sm:w-6 sm:h-6 text-purple-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
              <p className="text-xs sm:text-sm font-medium text-gray-900 mb-1">
                No results found
              </p>
              <p className="text-[11px] sm:text-xs text-gray-500">
                Try different keywords or browse all articles
              </p>
            </div>
          )}
        </div>

        {/* Pagination */}
        {total > PAGE_SIZE && !loading && (
          <div className="px-3 sm:px-4 py-2.5 sm:py-3 border-t border-gray-100 bg-white shrink-0">
            <div className="flex items-center justify-between gap-2">
              <span className="text-[10px] sm:text-xs text-gray-600 whitespace-nowrap">
                Page {page + 1} of {totalPages}
              </span>
              <div className="flex items-center gap-1.5 sm:gap-2">
                <button
                  type="button"
                  onClick={handlePrevPage}
                  disabled={page === 0}
                  className="px-2 sm:px-3 py-1.5 sm:py-2 text-[10px] sm:text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded-md disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                >
                  Prev
                </button>
                <button
                  type="button"
                  onClick={handleNextPage}
                  disabled={page >= totalPages - 1}
                  className="px-2 sm:px-3 py-1.5 sm:py-2 text-[10px] sm:text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded-md disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  } else {
    return null;
  }
};
