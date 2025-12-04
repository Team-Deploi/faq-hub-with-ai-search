import React, { useState } from "react";

function Pagination(props) {
  const {
    pageCount,
    gotoPage,
    searchString,
    startUrl,
    pageIndex,
    hashFragment,
  } = props;
  const [showLeftPages, setShowLeftPages] = useState(false);
  const [showRightPages, setShowRightPages] = useState(false);

  const generatePageNumbers = () => {
    const numbers = new Set();

    // First page
    numbers.add(1);

    // Add previous, current, and next page
    if (pageIndex > 1) numbers.add(pageIndex - 1);
    numbers.add(pageIndex);
    if (pageIndex < pageCount) numbers.add(pageIndex + 1);

    // Current ten's range (all single digits)
    const currentTens = Math.floor(pageIndex / 10) * 10;
    const startOfTen = currentTens || 1;
    const endOfTen = Math.min(currentTens + 9, pageCount);
    for (let i = startOfTen; i <= endOfTen; i++) {
      numbers.add(i);
    }

    // All tens
    for (let i = 10; i <= pageCount; i += 10) {
      numbers.add(i);
    }

    // Last page
    numbers.add(pageCount);

    return Array.from(numbers).sort((a, b) => a - b);
  };

  const isVisible = (page) => {
    // Always show first and last pages
    if (page === 1 || page === pageCount) return true;

    // Show current page and adjacent pages (previous and next)
    if (page === pageIndex - 1 || page === pageIndex || page === pageIndex + 1)
      return true;

    // Show left pages when left ellipsis is clicked
    if (showLeftPages && page < pageIndex) return true;

    // Show right pages when right ellipsis is clicked
    if (showRightPages && page > pageIndex) return true;

    return false;
  };

  const handlePageChange = (page) => {
    if (page >= 1 && page <= pageCount) {
      setShowLeftPages(false);
      setShowRightPages(false);
      gotoPage && gotoPage(page);
    }
  };

  const handleLeftEllipsisClick = () => {
    setShowLeftPages(true);
    setShowRightPages(false); // Hide right pages when showing left
  };

  const handleRightEllipsisClick = () => {
    setShowRightPages(true);
    setShowLeftPages(false); // Hide left pages when showing right
  };

  const renderPageNumbers = () => {
    const pages = generatePageNumbers();
    let lastRenderedPage = 0;

    return (
      <div className="">
        <ul className="flex items-center justify-center gap-2 flex-wrap">
          {pages.map((page, index) => {
            const shouldShowLeftEllipsis =
              !showLeftPages &&
              ((page > 2 && page <= pageIndex && lastRenderedPage === 1) ||
                (pageIndex >= 3 && pageIndex <= 9 && page === 2));

            const shouldShowRightEllipsis =
              !showRightPages &&
              page < pageCount &&
              page >= pageIndex &&
              pages[index + 1] === pageCount;

            const isPageVisible = isVisible(page);
            lastRenderedPage = page;

            return (
              <React.Fragment key={page}>
                {shouldShowLeftEllipsis && (
                  <li
                    onClick={handleLeftEllipsisClick}
                    className="cursor-pointer text-base font-semibold text-primary-100 w-[40px] h-[40px] flex items-center justify-center hover:bg-primary-50 transition-colors rounded-full border border-primary-100"
                  >
                    ...
                  </li>
                )}
                <li
                  className={`${!isPageVisible ? "hidden" : ""} cursor-pointer border border-primary-100 text-base font-semibold text-primary-100 rounded-full w-[40px] h-[40px] flex items-center justify-center hover:bg-primary-50 transition-colors ${
                    page === pageIndex ? "bg-primary-100 text-white" : ""
                  }`}
                >
                  <a
                    name={`page-${page}`}
                    aria-label={`page-${page}`}
                    href={
                      searchString
                        ? `${startUrl}?p=${page}&q=${searchString}${hashFragment ? `#${hashFragment}` : ""}`
                        : `${startUrl}?p=${page}${hashFragment ? `#${hashFragment}` : ""}`
                    }
                    className="w-full h-full flex items-center justify-center"
                  >
                    {page < 10 ? `0${page}` : page}
                  </a>
                </li>
                {shouldShowRightEllipsis && (
                  <li
                    onClick={handleRightEllipsisClick}
                    className="cursor-pointer text-base font-semibold text-primary-100 w-[40px] h-[40px] flex items-center justify-center hover:bg-primary-50 transition-colors rounded-full border border-primary-100"
                  >
                    ...
                  </li>
                )}
              </React.Fragment>
            );
          })}
        </ul>
      </div>
    );
  };

  return (
    <div className="flex flex-col md:flex-row justify-center items-center">
      {renderPageNumbers()}
    </div>
  );
}

export default Pagination;
