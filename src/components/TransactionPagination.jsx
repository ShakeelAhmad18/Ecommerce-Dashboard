import React from "react";
import {
  FiChevronLeft,
  FiChevronRight,
  FiMoreHorizontal,
} from "react-icons/fi";

const TransactionPagination = ({ currentPage, totalPages, onPageChange }) => {
  const getVisiblePages = () => {
    const visiblePages = [];
    const maxVisible = 5; // Maximum pages to show
    let start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
    let end = Math.min(totalPages, start + maxVisible - 1);

    if (end - start + 1 < maxVisible) {
      start = Math.max(1, end - maxVisible + 1);
    }

    if (start > 1) {
      visiblePages.push(1);
      if (start > 2) {
        visiblePages.push("ellipsis-left");
      }
    }

    for (let i = start; i <= end; i++) {
      if (i > 0 && i <= totalPages) {
        visiblePages.push(i);
      }
    }

    if (end < totalPages) {
      if (end < totalPages - 1) {
        visiblePages.push("ellipsis-right");
      }
      visiblePages.push(totalPages);
    }

    return visiblePages;
  };

  const visiblePages = getVisiblePages();

  return (
    <div className="flex items-center justify-between border-t border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800 px-4 py-6">
      <div className="flex items-center gap-4">
        <p className="text-sm text-gray-600 dark:text-gray-300">
          Showing page{" "}
          <span className="font-medium text-gray-900 dark:text-white">
            {currentPage}
          </span>{" "}
          of{" "}
          <span className="font-medium text-gray-900 dark:text-white">
            {totalPages}
          </span>
        </p>

        <div className="hidden border border-gray-300 dark:border-gray-600 p-1 rounded-lg sm:flex items-center gap-1">
          <span className="text-sm text-gray-600 dark:text-gray-300">
            Go to:
          </span>
          <select
            value={currentPage}
            onChange={(e) => onPageChange(Number(e.target.value))}
            className="rounded-md border-gray-200 dark:border-gray-700 text-sm py-1 pl-2 pr-8 focus:border-blue-500 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          >
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <option key={page} value={page}>
                {page}
              </option>
            ))}
          </select>
        </div>
      </div>
      <nav className="flex items-center gap-2">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={`p-2 rounded-md transition-colors duration-200 ease-in-out ${
            currentPage === 1
              ? "text-gray-300 dark:text-gray-600 cursor-not-allowed" // Dark mode disabled
              : "text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white" // Dark mode active/hover
          }`}
          aria-label="Previous page"
        >
          <FiChevronLeft className="h-5 w-5 border p-1 rounded-sm border-gray-200 dark:border-gray-600" />{" "}
          {/* Dark mode border */}
        </button>

        <div className="flex items-center gap-1">
          {visiblePages.map((page, index) => {
            if (page === "ellipsis-left" || page === "ellipsis-right") {
              return (
                <span
                  key={index}
                  className="px-3 py-1 text-gray-500 dark:text-gray-400"
                >
                  <FiMoreHorizontal className="h-4 w-4" />
                </span>
              );
            }
            return (
              <button
                key={page}
                onClick={() => onPageChange(page)}
                className={`px-3 py-1 text-sm rounded-md transition-colors duration-200 ease-in-out ${
                  currentPage === page
                    ? "bg-blue-600 text-white font-medium dark:bg-blue-700 dark:text-white" // Dark mode active page
                    : "text-gray-600 hover:bg-gray-50 font-normal dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white" // Dark mode inactive/hover
                }`}
                aria-current={currentPage === page ? "page" : undefined}
              >
                {page}
              </button>
            );
          })}
        </div>

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`p-2 rounded-md transition-colors duration-200 ease-in-out ${
            currentPage === totalPages
              ? "text-gray-300 dark:text-gray-600 cursor-not-allowed" // Dark mode disabled
              : "text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white" // Dark mode active/hover
          }`}
          aria-label="Next page"
        >
          <FiChevronRight className="h-5 w-5 border p-1 rounded-sm border-gray-200 dark:border-gray-600" />{" "}
          {/* Dark mode border */}
        </button>
      </nav>
    </div>
  );
};

export default TransactionPagination;
